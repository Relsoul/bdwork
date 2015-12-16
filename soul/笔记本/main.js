/*
 * By Okiilemon
 * 2015.6.29 - 2015.7.6
*/



var EDU = (function(){
	

    //----------   Begin Utilty Method (工具函数) -------------

    var addClass = function(ele,toBeAddedClass){ //新添加的类以一个字符串的方式给出 'aa bb cc'
        var toBeAddClassInArr = [];
        toBeAddClassInArr = toBeAddedClass.split(' ');
        var originalClass = ele.className;
        var lenOfNewClass = toBeAddClassInArr.length;
        var classItems = [];
        if(lenOfNewClass < 0) return;
        for(var i=0; i<lenOfNewClass; i++){ //过滤输入，以防class之间多余的空格
            if(toBeAddClassInArr[i].length){
                classItems.push(toBeAddClassInArr[i]);
            }
        }
        if(!originalClass.length){ //判断是否本来就有class属性，如果没有
            newClass = classItems.join(' ');
            ele.setAttribute('class',newClass);
            return;
        }
        else { //如果原本是有class属性的
            var reg = [];
            var newClassInArr = [];
            var realLen = classItems.length;
            for(var j=0; j<lenOfNewClass; j++){
                reg[j] = new RegExp('\\s' + classItems[j] + '\\s'); //前后加空格是为了完全匹配，避免包含的情况
                //判断待添加的类是否本来就存在,如果不存在就放进数组中
                if(!reg[j].test(' ' + originalClass + ' ')) { //这里前后加空格是为了避免这个词出现在两个端点的情况
                    newClassInArr.push(classItems[j]);
                }
            }
            if(newClassInArr) {
                newClass = newClassInArr.join(' ');
                ele.className += ' ' + newClass;
            }
            return;
        }
    }

    var removeClass = function(ele){ //第二个参数是多个需要删除的class items, 例如 'aa','bb','cc'
        var originalClass = ele.className;
        if(!originalClass.length)
            return;
        else {
            var lenOfClassItems = arguments.length - 1;
            if(lenOfClassItems < 0) return;
            var classItems = [];
            var reg = [];
            originalClass = ' ' + originalClass + ' ';
            for(var i=1; i<=lenOfClassItems; i++){
                reg[i] = new RegExp('\\s' + arguments[i] + '\\s');
                originalClass = originalClass.replace(reg[i],'');
            }
            ele.className = originalClass;
            return;
        }
    }

    /* 
      *轮播图高宽自适应，动态获取自适应后的高度，
      *用这个高度渲染轮播图的容器，否则高度不匹配会影响下面的相邻元素 
    */

    var carouselImageAutoFit = function(){
        var carouselImage = document.querySelector('.carousel-item img');
        var carouselImageWrapper = document.querySelector('.carousel-area');
        var rightHeight = window.getComputedStyle(carouselImage,null).getPropertyValue('height');
        carouselImageWrapper.style.height = rightHeight;
    };

    //获取当前处于active状态的item
    var getCurrentIndex = function(items){
        var currentIndex,
            i,
            len = items.length;
        for(i=0; i<len; i++){
            if(/active/.test(items[i].className)){
                currentIndex = i;
                break;
            }
        }
        return currentIndex;
    }; 

    /*
      *方便操作Cookie的三个工具函数
    */

    // 新添加一个Cookie
    var addCookieItem = function(name,value,expire){ // expire的单位为天
        var today = new Date();
        today.setDate(today.getDate() + expire);
        document.cookie = name + "=" + value + "; expires=" + today.toGMTString();
    };
    //通过Cookie的名获取相应的值
    var getCookieItem = function(name){
        var matchItem = document.cookie.match(new RegExp(name + '=(\\w+)'));
        if(matchItem){
            return matchItem[1];
        }
    };
    //更改某个Cookie的值
    var setCookieItem = function(name,newValue,expire){
        addCookieItem(name,newValue,expire);
    };

    /*
      * 封装Ajax方法
      * 参数说明：
      * 第一个参数url即是请求的地址
      * 第二个参数是一个对象，
      * 其中可以包括的参数为：
            type: post或者get，默认值是GET
            data: 发送的数据，一个键值对象或者一个用&连接的赋值字符串
            onsuccess: 成功时的调用函数
            onfail: 失败时的调用函数
    */
    var ajax = function(url,options){
        var xhr = new XMLHttpRequest();
        var method,queryString='',requestURL = url;//requestURL是供GET方法时使用
        var keyValuePairs = [];
        var i,lenOfKeyvaluepairs;

        requestURL += (requestURL.indexOf('?') == -1 ? '?' : '&');
        method = options.type ? options.type : 'get';

        //处理传入的参数，编码并拼接
        if(options.data){
            if(typeof options.data == 'string'){
                queryString = options.data;
                requestURL += queryString;
            }
            else {
                for(var p in options.data){
                    if(options.data.hasOwnProperty(p)){
                        var key = encodeURIComponent(p);
                        var value = encodeURIComponent(options.data[p]);
                        keyValuePairs.push(key + '=' + value);
                    }
                }
                lenOfKeyvaluepairs = keyValuePairs.length;
                queryString = keyValuePairs.join('&');
                requestURL += queryString;       
            }        
        }

        xhr.onreadystatechange = function(){
            if(xhr.readyState == 4){
                if((xhr.status >= 200 && xhr.status <300) || xhr.status == 304){
                    options.onsuccess(xhr);
                }  
                else{
                    if(options.onfail){
                        options.onfail();
                    }
                    else{
                        alert('Sorry,your request is unsuccessful:' + xhr.statusText);
                    }
                }
            }
        };
        if(method == 'get'){
            xhr.open(method,requestURL,true);
            xhr.send(null);
        }
        else{
            xhr.open(method,url,true);
            xhr.setRequestHeader('Content-Type','application/x-www-form-urlencoded');
            xhr.send(queryString);
        }
    };

    /*
      * 分页导航生成器，根据总页数生成相应数量的分页按钮
      * 参数说明：
      * startPageIndex：位于第一个li.item的页数
      * totalPage： 后台数据中课程列表的总页数
      * currentItemIndex：当前页面所在的li.item索引
      * size: 一行显示的分页按钮个数
    */

    var createPageNavigator = function(startPageIndex,totalPage,currentItemIndex,size){

        var page_nav_btn = document.querySelector('.page-nav-btn');
        var last_page_btn_tmpl = '<li class="last-page"><</li>';
        var next_page_btn_tmpl = '<li class="next-page">></li>';
        var lastPageIndex;
        var i,
            len = size,
            page_nav_items = '';

        //如果第一个分页按钮的页数不是第一页，就渲染’上一页‘按钮
        if(startPageIndex !== 1 || currentItemIndex !== 0){
            page_nav_items += last_page_btn_tmpl;
        }
        for(i=0; i<len; i++){
            var pageIndexValue = startPageIndex + i ;
            if(i == len-1){
                lastPageIndex = pageIndexValue;
            }

            page_nav_items += '<li class="item" data-skip-to="' + i +'">' + pageIndexValue + '</li>';
        }
        //如果最后一个分页按钮的页数不是末页，就渲染'下一页'按钮
        if(lastPageIndex != totalPage - 1 || currentItemIndex != size - 1 ){
            page_nav_items += next_page_btn_tmpl;
        }
        page_nav_btn.innerHTML = page_nav_items;
        addClass(page_nav_btn.querySelectorAll('.item')[currentItemIndex],'active');

    }

    /*
      * Ajax动态加载课程卡片方法
      * 参数说明：
      * pageNo:请求页数
      * psize: 每页返回数据总数
      * type: 获取课程类型
      * startPageIndex: 位于第一个li.item的页数
      * currentPageIndex: 可选参数，动态生成分页导航后处于active状态的li.item索引
    */

    var getCourseLists = function(pageNo,psize,type,startPageIndex,currentPageIndex){

        var ajaxOnsuccess = function(xhr){
            var courseLists = [];
            var lenOfCourseItems;
            var size_of_page_items;
            var len_of_coursePages; //课程列表总页数


            var course_display_area = document.querySelector('.course-display-area ul');
            courseLists = JSON.parse(xhr.responseText);
            lenOfCourseItems = 20;
            var i;
            var segment = '';
            for(i=0; i<lenOfCourseItems; i++){
                segment += 
                '<li class="course-item"><img src=' + courseLists.list[i]['bigPhotoUrl'] + ' alt="">'
              + '<div class="components"><p class="course-intro">' + courseLists.list[i]['description'] + '</p>'
              + '<p class="course-tag">' + courseLists.list[i]['categoryName'] + '</p>'
              + '<div class="enroll-people-num-area"><span class="enroll-people-num">' + courseLists.list[i]['learnerCount'] + '</span></div>'
              + '<p class="course-price">¥ ' + courseLists.list[i]['price'] +'</p></li>';

            }
            //插入动态生成的课程卡片节点
            course_display_area.innerHTML = segment;
            //从获取的数据中得到总页数
            len_of_coursePages = courseLists.pagination.totlePageCount;
            //这里是为了避免总页数小于8的情况
            size_of_page_items = len_of_coursePages < 8 ? len_of_coursePages: 8; 

            var currentIndex;
            if(typeof currentPageIndex != 'undefined'){
                currentIndex = currentPageIndex;
            }
            else{
                currentIndex = pageNo - 1;
            }

            //生成分页导航
            createPageNavigator(startPageIndex,
                                len_of_coursePages,
                                currentIndex,
                                size_of_page_items
                                );
        };

        var url = 'http://study.163.com/webDev/couresByCategory.htm';
        var options = {
            data: {
                pageNo: pageNo,
                psize: psize,
                type: type
            },
            onsuccess: ajaxOnsuccess
        };
        ajax(url,options);
    };

    //----------   End Utilty Method  ---------------------

   //----------   Begin Event Handlers  -------------------

    //首先调用轮播图自适应函数
    carouselImageAutoFit();

    //在浏览器窗口大小变化时调用轮播图自适应函数
    window.addEventListener('resize',carouselImageAutoFit,false);

    /* 根据视觉稿，每行最多显示8页，这里是为了防止总页数小于8的情况
     * getCourseLists这个函数会动态加载课程卡片，并且总页数赋值
     * 所以在这里默认加载第1页，数量为20，类型为“产品设计”的课程
     */
    getCourseLists(1,20,10,1);

    /*
      * 顶部“不再提示” 
    */
    var noMorePrompt_module = (function(){
        var prompt_bar = document.querySelector('.prompt-bar');
        var no_more_btn = document.querySelector('.no-more-prompt');
        var reg_cookie_noMore = /no_more_prompt/;
        if(reg_cookie_noMore.test(document.cookie)){
            prompt_bar.style.display = "none";
        }
        no_more_btn.onclick = function(){  
            addCookieItem('no_more_prompt','1',365);     
            prompt_bar.style.marginTop = "-36px";
        };
    })();

    /*
      * 关注与登录模块
    */
    var follow_login_module = (function(){
        var submit_btn = document.querySelector('#submit-btn');
        var follow_btn = document.querySelector('.follow-btn');
        var login_area = document.querySelector('.login-area');
        var close_btn = login_area.querySelector('.close-btn');
        var cancel_follow_btn = document.querySelector('.cancel-follow-btn-area');
        var num_of_fans_area = document.querySelector('.num-of-fans');
        var num_of_fans = parseInt(num_of_fans_area.innerHTML);
        var reg_cookie_loginSuc = /loginSuc/;

        //关注API
        var successFollow = function(){
            var url = 'http://study.163.com/webDev/attention.htm';
            var ajaxOnsuccess = function(xhr){
                if(xhr.responseText == '1'){
                    var reg_cookie_followSuc = /followSuc/;
                    follow_btn.style.display = "none";
                    cancel_follow_btn.style.display = "inline-block";
                    num_of_fans ++;
                    num_of_fans_area.innerHTML = num_of_fans;
                    addCookieItem('followSuc','1',365);
                    alert('关注成功');
                }
                else {
                    alert('关注失败');
                }
            };
            var options = {
                onsuccess: ajaxOnsuccess
            };
            ajax(url,options);

        };
        follow_btn.onclick = function(){
            //判断是否已经登录
            if(reg_cookie_loginSuc.test(document.cookie)){
               successFollow(); 
            }
            else {
                login_area.style.display = "block";
            }
        };
        cancel_follow_btn.onclick = function(){
            this.style.display = "none";
            follow_btn.style.display = "inline-block";
            num_of_fans --;
            num_of_fans_area.innerHTML = num_of_fans;
            setCookieItem('followSuc','0',365);
        };
        //登录验证
        submit_btn.onclick = function(){
            var usernameInput = document.querySelector('#account');
            var pwdInput = document.querySelector('#pwd');
            var username,pwd;
            var url,options,ajaxOnsuccess;
            username = usernameInput.value.trim();
            pwd = pwdInput.value.trim();
            if(!username || !pwd) {
                alert('请完整填写！');
            }
            else {
                ajaxOnsuccess = function(xhr){
                    if(xhr.responseText == '1'){
                        addCookieItem('loginSuc','1',1); // 将有效期设置为1天
                        login_area.style.display = "none";
                        successFollow();
                        alert("登录成功");
                    }
                    else {
                        alert('用户名与密码不匹配，请重新输入');
                    }
                };
                url = 'http://study.163.com/webDev/login.htm';
                options = {
                    data: {
                        userName: md5(username),
                        password: md5(pwd)
                    },
                    onsuccess: ajaxOnsuccess
                };
                ajax(url, options);
            }
        };
        close_btn.onclick = function(){
            login_area.style.display = 'none';
        };
    })();

    /*
      * 轮播图模块
    */
    var carousel_module = (function(){
        var carousel_images = document.querySelectorAll('.carousel-item img');
        var carousel_area = document.querySelector('.carousel-area');
        var carousel_indicator_area = document.querySelector('.carousel-indicators');
        var carousel_indicators = carousel_indicator_area.querySelectorAll('li');
        var len = carousel_indicators.length; 
        var initial_class_of_indicator = carousel_indicators[0].className; 
        var carousel_state = true; //记录轮播图是否处于自动播放的状态

        //初始化当前处于active状态的item与indicator,这里指定为第一个
        carousel_indicators[0].className = initial_class_of_indicator + " active";
        carousel_images[0].style.opacity = '1';
     
        var carousel = function(targetIndex,currentIndex){
            //改变指示圆点的样式
            carousel_indicators[currentIndex].className = initial_class_of_indicator;
            carousel_indicators[targetIndex].className = initial_class_of_indicator + " active";
            //改变对应图片的样式，改变透明度，达到淡入淡出的效果
            carousel_images[currentIndex].style.opacity = '0';
            carousel_images[targetIndex].style.opacity = '1';
        };

        var autoCarousel = function(){
            var currentIndex = getCurrentIndex(carousel_indicators),
                targetIndex;
            if(currentIndex == len-1){
                targetIndex = 0;
            }
            else{
                targetIndex = currentIndex + 1;
            }
            carousel(targetIndex,currentIndex);
        };

        var beginAutoCarousel = setInterval(autoCarousel,5000); //每隔500ms自动切换

        //用户手动切换，点击小圆点切换到对应的图片
        carousel_indicator_area.addEventListener('click',function(e){
            if(e.target.tagName == 'LI'){
                var targetIndex = parseInt(e.target.getAttribute('data-slide-to'));
                var currentIndex = getCurrentIndex(carousel_indicators);
                carousel(targetIndex,currentIndex);
            }
        },false);

        carousel_area.onmouseenter = function(){
            if(carousel_state){
                clearInterval(beginAutoCarousel);
                carousel_state = false;   
            }
        };

        carousel_area.onmouseleave = function(){
            if(!carousel_state){
                beginAutoCarousel = setInterval(autoCarousel,5000);
                carousel_state = true;
            }
        };
       
    })();

    /*
      * 视频播放模块
    */

    var viedoPlay = (function(){
        var video_thumbnail = document.querySelector('.video-thumbnail');
        var video_container = document.querySelector('.video-area');
        var close_btn = document.querySelector('.video-area .close-btn');
        video_thumbnail.onclick = function(){
            video_container.style.display = "block";
        };
        close_btn.onclick = function(){
            video_container.style.display = "none";
        };
    })();

    /*
      * Ajax动态加载最热排行模块
    */

    var getHotRankingLists = (function(){

        var ajaxOnsuccess = function(xhr){
            var hotRankingLists = [];
            var lenOfRankingItems;
            var hot_ranking_area = document.querySelector('.hot-ranking-list');

            hotRankingLists = JSON.parse(xhr.responseText);
            lenOfRankingItems = 10;
            var i;
            var segment = '';
            for(i=lenOfRankingItems-1; i>=0; i--){
                segment += 
                '<li class="hot-ranking-item"><div class="img-wrapper"><img src=' + hotRankingLists[i]['smallPhotoUrl'] + ' alt=""></div>'
              + '<h4>' + hotRankingLists[i]['name'] + '</h4>'
              + '<div class="enroll-people-num-area"><span class="enroll-people-num">' + hotRankingLists[i]['learnerCount'] + '</span></div></li>';
            }
            hot_ranking_area.innerHTML = segment;
        };

        var url = 'http://study.163.com/webDev/hotcouresByCategory.htm';
        var options = {
            onsuccess: ajaxOnsuccess
        };
        ajax(url, options);

    })();

    /*
      * 分页导航切换模块
    */

    var pageNavigatorSwitch = (function(){
        var page_nav_btn = document.querySelector('.page-nav-btn');
        page_nav_btn.addEventListener('click',function(e){
            var targetIndex;
            var startPageIndex,lastPageIndex,currentPageIndex;
            var pageItems = page_nav_btn.querySelectorAll('.item');
            var tab_items = document.querySelectorAll('.tab-btn');
            currentPageIndex = getCurrentIndex(pageItems);
            var current_tab_index = getCurrentIndex(tab_items);
            var current_type = parseInt(tab_items[current_tab_index].getAttribute('data-type'));
            startPageIndex = parseInt(pageItems[0].innerHTML);
            lastPageIndex = parseInt(pageItems[pageItems.length-1].innerHTML);

            if(e.target.className == 'item'){
                targetIndex = parseInt(e.target.getAttribute('data-skip-to'));
                getCourseLists(targetIndex+1,20,current_type,startPageIndex);
            }
            else if(e.target.className == 'last-page'){
                if(currentPageIndex > 0){
                    getCourseLists(currentPageIndex,20,current_type,startPageIndex);
                }
                else if(currentPageIndex == 0){ //如果当前页位于第一个分页按钮
                    if(startPageIndex == 3){
                        getCourseLists(2,20,current_type,1,1);
                    }
                    else{
                        getCourseLists(startPageIndex-1,20,current_type,startPageIndex-pageItems.length,pageItems.length-1);
                    }
                }
                else return;
            }
            else if(e.target.className == 'next-page'){
                if(currentPageIndex < pageItems.length-1){
                    getCourseLists(currentPageIndex+2,20,current_type,startPageIndex);
                }
                else if(currentPageIndex == pageItems.length-1){//如果当前页位于最后一个分页索引
                    var boundryValue = 16; //本来这里应该是等于 totalPage - totalPage%size,然而这里并不能获取到taotalPage的值，只有在回调Ajax那里才能取到，暂时想到的办法是第一次载入时就把这个值存进一个cookie里，但据说不太好，所以我这里先写常量好了
                    //这里是为了防止当末页是16页，点击下一页后会载入17-25页的情况，因为总页数只有18页
                    if(lastPageIndex == boundryValue){
                       getCourseLists(boundryValue+1,20,current_type,11,6); 
                    }
                    else{
                        getCourseLists(lastPageIndex+1,20,current_type,lastPageIndex+1,0);
                    }
                }
                else return;
            }
        },false);
    })();

    /*
     * tab切换
    */
    var tabSwitch = (function(){
        var tab_btn_area = document.querySelector('.tab-btn-area');
        var tab_items = tab_btn_area.querySelectorAll('li');
        var len = tab_items.length,i;

        tab_btn_area.addEventListener('click',function(e){
            var currentTabIndex = getCurrentIndex(tab_items);
            var type,startPageIndex;
            for(i=0; i<len; i++){
                if(tab_items[i].contains(e.target)){
                    if(currentTabIndex == i){
                        break;
                    }
                    else {
                        type = parseInt(tab_items[i].getAttribute('data-type'));
                        getCourseLists(1,20,type,1);
                        removeClass(tab_items[currentTabIndex],'active');
                        addClass(tab_items[i],'active');
                    }
                }
            }

        },false)

    })();

  //----------   End Event Handlers  --------------------


})();











