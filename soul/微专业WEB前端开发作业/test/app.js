//处理顶部条
var changeTop = function() {
	var elem = document.querySelector(".top")
	var clickElem = document.querySelector("#topX")
	var nb;
	//判断first cookie是否设置
	SoulLib.sCookie.get("first") == null ? nb = "block" : nb = "none"
	elem.style.display = nb
		//处理X不再提醒点击事件
	SoulLib.addEvent(clickElem, "click", function() {
		var from = getComputedStyle(elem, false)["height"] || elem.currentStyle["height"];
		var to = 0;
		SoulLib.pdHide(elem, 500, function() {
			elem.style.display = "none"
		}, false, parseInt(from), to)
		SoulLib.sCookie.add("first", true)
	})
}

//图片轮播
var bannerShow = function() {
	//	初始化宽度/高度
	var hoverElem = document.querySelector("#show-img")
	var initImg = document.querySelectorAll("#banner #show-img img");
	var W = document.body.clientWidth;
	var dotList = document.querySelectorAll("#dot i")
	var from, fadeElem, timer;
	//设置图片宽度和添加dotList点击事件,img移入 移出事件
	for (var i = 0; i < initImg.length; i++) {
		initImg[i].width = W
			//用id来存储当前元素索引
		dotList[i].id = i
			//小圆点点击
		SoulLib.addEvent(dotList[i], "click", eventLi)
			//img移入移出事件
		SoulLib.addEvent(initImg[i], "mouseover", mouseoverImg)
		SoulLib.addEvent(initImg[i], "mouseout", mouseoutImg)
	}

	//处理小圆点点击事件
	function eventLi(event) {
		//先清空所有的class
		for (var i = 0; i < dotList.length; i++) {
			dotList[i].className = ""
		}
		//给当前小圆点加上d-curt
		this.className = "d-curt";
		from = getComputedStyle(hoverElem, false)["left"] || hoverElem.currentStyle["left"];
		fadeElem = initImg[parseInt(this.id)]
		SoulLib.fadeIn(hoverElem, parseInt(from), -parseInt(this.id) * W, fadeElem)
	}

	//设置自动循环播放
	//now为当前需要移动的下一张图片
	var now = 1;

	function autoHover() {
		//移动到最后一个图片 循环移动
		if (now >= 3) {
			now = 0
		}
		//清空小圆点导航高亮class
		for (var i = 0; i < dotList.length; i++) {
			dotList[i].className = ""
		}
		//设置当前小圆点导航高亮class
		dotList[now].className = "d-curt";
		//设置淡入移动动画
		from = getComputedStyle(hoverElem, false)["left"] || hoverElem.currentStyle["left"];
		fadeElem = initImg[now]
		SoulLib.fadeIn(hoverElem, parseInt(from), -now * W, fadeElem, function() {
			now++
		})
	}
	timer = setInterval(autoHover, 5000)
		//鼠标移入函数

	function mouseoverImg() {
			clearInterval(timer)
		}
		//鼠标移入函数

	function mouseoutImg() {
		timer = setInterval(autoHover, 5000)
	}
}

//处理登录框事件
var Login = function() {
	//初始化模态框宽高度
	var modelElem = document.getElementById("model")
	modelElem.style.width = document.body.scrollWidth + "px"
	var buttonElem = document.getElementById("loginbtn");
	var login = document.getElementById("login")
	var userElem = document.getElementById("user");
	var pswElem = document.getElementById("psw");
	var loginClose = document.getElementById("loginClose");
	var fllowElem = document.getElementById("curt-click");
	var userClick = function(hxr) {
			if (hxr.responseText == 1) {
				SoulLib.sCookie.add("loginSuc", 1)
				var fllowElem = document.getElementById("curt-click");
				fllowElem.className = "button-ok"
			}
			SoulLib.pdHide(modelElem, 500, function() {
				modelElem.style.display = "none"
				login.style.display = "none";
			}, true)
		}
		//登陆点击事件
	SoulLib.addEvent(buttonElem, "click", function(e) {
			var _event = e || event
			var options = {
				url: "http://study.163.com/webDev/login.htm",
				data: {
					userName: hex_md5(userElem.value),
					password: hex_md5(pswElem.value)
				},
				callback: userClick
			}
			SoulLib.sAjax(options)
			_event.preventDefault()
		})
		//登陆框关闭事件处理
	SoulLib.addEvent(loginClose, "click", function() {
			//关闭登陆狂
			var from = getComputedStyle(modelElem, false)["height"] || modelElem.currentStyle["height"]
			var to = 0
				//处理滚动条带来的不全屏效果
			document.body.style.overflow = "auto"
			SoulLib.pdHide(modelElem, 500, function() {
				modelElem.style.display = "none"
				login.style.display = "none";
			}, false, parseInt(from), to)
		})
		//关注按钮事件处理
	SoulLib.addEvent(fllowElem, "click", function() {
			//判断css 如果已经是关注返回false
			if (this.className == "button-ok") {
				return false
			}
			//判断cookie
			if (SoulLib.sCookie.get("loginSuc") == null) {
				//cookie为空弹出登陆框
				var from = 0;
				var to = window.innerHeight;
				modelElem.style.display = "block";
				//处理滚动条带来的不全屏效果
				document.body.style.overflowY = "hidden";
				modelElem.style.width = document.body.offsetWidth + "px";
				login.style.display = "block";
				SoulLib.pdHide(modelElem, 500, function() {
					modelElem.style.display = "block"
				}, false, from, parseInt(to))
			} else {
				//否则设置为ok
				//这一步非必须.只是为了保险起见...
				this.className = "button-ok";
			}

		})
		//再度判断cookie是否设置
	if (SoulLib.sCookie.get("loginSuc") == 1) {
		fllowElem.className = "button-ok"
	}
}

//列表切换
var listTab = function() {
	var elem = document.getElementById("clsTitle");
	var oli = elem.getElementsByTagName("li");
	var changeTab = function() {
		var parentUl = document.getElementById("clsList")
			//清空classList列表
		parentUl.innerHTML = ""
		for (var i = 0; i < oli.length; i++) {
			oli[i].className = ""
		}
		//加上高亮
		this.className = "curt";
		//传递type类型和总页数
		var typeNum = (this.typeNum + 1) * 10
		var allNum = 20 + ((this.typeNum + 1) - 1) * 2
		changePage(typeNum, 22)
		classList(1, typeNum)
	}
	for (var i = 0; i < oli.length; i++) {
		oli[i].typeNum = i
		SoulLib.addEvent(oli[i], "click", changeTab)
	}


}


//nowNum:[num] 请求页
var classList = function(nowNum, typeNum) {
	typeNum = typeNum || 10;
	//ajax请求成功回调函数
	var createList = function(xhr) {
			var data = JSON.parse(xhr.responseText)
			var parentUl = document.getElementById("clsList")
			var old = [];
			//清空classList列表
			parentUl.innerHTML = ""
				//重新生成class列表
			for (var i = 0; i < data.list.length; i++) {
				//课程列表
				var newli = document.createElement("li");
				var newdiv = document.createElement("div");
				var newimg = document.createElement("img");
				var newh4 = document.createElement("h4")
				var newclsGroup = document.createElement("p")
				var newclsUser = document.createElement("p")
				var newclsCost = document.createElement("p")
				newli.index = i;
				newdiv.index = i;
				newdiv.className = "liShow"
				newimg.src = data.list[i].middlePhotoUrl;
				newh4.innerHTML = data.list[i].name
				newclsGroup.innerHTML = data.list[i].provider
				newclsGroup.className = "clsGroup";
				newclsUser.innerHTML = data.list[i].learnerCount
				newclsUser.className = "clsUser";
				newclsCost.innerHTML = data.list[i].price == 0 ? "免费" : "￥" + data.list[i].price
				newclsCost.className = "clsCost";
				parentUl.appendChild(newli)
				newli.appendChild(newdiv)
				newdiv.appendChild(newimg);
				newdiv.appendChild(newh4);
				newdiv.appendChild(newclsGroup);
				newdiv.appendChild(newclsUser);
				newdiv.appendChild(newclsCost);

				//添加课程详情页
				var hoverDiv = document.createElement("div");
				var hoverInner = document.createElement("div");
				var innerImg = document.createElement("img");
				var innerH3 = document.createElement("h3");
				var innerStudy = document.createElement("p");
				var innerAuthor = document.createElement("p");
				var innerClass = document.createElement("p");
				var outerP = document.createElement("p");
				//隐藏课程详情列表div
				hoverDiv.style.display = "none"
					//添加div
				hoverDiv.className = "hoverDiv"
				hoverInner.className = "hoverInner"
				innerImg.src = data.list[i].middlePhotoUrl
				innerH3.innerHTML = data.list[i].name
				innerStudy.className = "innerStudy"
				innerStudy.innerHTML = data.list[i].learnerCount + "人在学"
				innerAuthor.innerHTML = "发布者&nbsp;:&nbsp;" + data.list[i].provider
				innerClass.innerHTML = "分类&nbsp;:&nbsp;" + data.list[i].provider
				outerP.className = "outerP"
				outerP.innerHTML = data.list[i].description
				newli.appendChild(hoverDiv)
				hoverDiv.appendChild(hoverInner)
				hoverInner.appendChild(innerImg)
				hoverInner.appendChild(innerH3)
				hoverInner.appendChild(innerStudy)
				hoverInner.appendChild(innerAuthor)
				hoverInner.appendChild(innerClass)
				hoverDiv.appendChild(outerP)
			}
			//查看课程详情
			var showClass = function() {
				var showLi = SoulLib.getClassName(parentUl, "liShow")
				for (var i = 0; i < showLi.length; i++) {
					SoulLib.addEvent(showLi[i], "mouseover", function(e) {
						_index = this.index
						var hoverElem = this;
						var _showLi = SoulLib.getClassName(hoverElem.parentElement, "hoverDiv")
						_showLi[0].style.display = "block";
						if (hoverElem.parentElement.offsetLeft > 900) {
							_showLi[0].style.left = -245 + "px";
						}
					})
				}
			}
			var hideClass = function() {
				var hideElem = SoulLib.getClassName(parentUl, "hoverDiv")
				for (var i = 0; i < hideElem.length; i++) {
					SoulLib.addEvent(hideElem[i], "mouseout", function(e) {
						var _hideLi = SoulLib.getClassName(this.parentElement, "hoverDiv")
						_hideLi[0].style.display = "none";
					})
				}
			}
			showClass()
			hideClass()
		}
		//调用ajax请求
	var options = {
		url: "http://study.163.com/webDev/couresByCategory.htm",
		data: {
			pageNo: nowNum,
			psize: 20,
			type: typeNum
		},
		callback: createList
	}
	SoulLib.sAjax(options)

}

//点击分页
var changePage = function(typeNum, allNum) {
	_typeNum = typeNum || 10
	_allNum = allNum || 20
		//默认元素
	var opt = {
		id: "clsPage",
		nowNum: 1,
		allNum: _allNum
	}
	SoulLib.Pages(opt)
	var elem = document.getElementById("clsPage");
	//事件代理处理点击事件
	SoulLib.addEvent(elem, "click", function(e) {
		e = e || event;
		opt = {
				id: "clsPage",
				//获取当前点击的页数
				nowNum: parseInt(e.target.href.match(/[0-9]+$/)[0]),
				allNum: _allNum
			}
			//更新课程列表
		classList(parseInt(e.target.href.match(/[0-9]+$/)[0]), _typeNum)
			//更新当前分页按钮
		SoulLib.Pages(opt)
	})
}

//视频详情
var videoInfo = function() {
	var elem = document.getElementById("clsHot-video")
	var modelElem = document.getElementById("model")
	var videoElem = document.getElementById("videoInfo")
	var videoClose = document.getElementById("videoClose")
	var login = document.getElementById("login")
		//点击加载
	SoulLib.addEvent(elem, "click", function() {
			var from = 0;
			var to = document.body.scrollHeight;
			videoElem.style.display = "block"
			modelElem.style.display = "block"
			login.style.display = "none"
			modelElem.style.width = document.body.offsetWidth + "px";
			SoulLib.pdHide(modelElem, 500, function() {}, false, from, parseInt(to))
		})
		//点击关闭
	SoulLib.addEvent(videoClose, "click", function() {
		var from = document.body.scrollHeight;
		var to = 0;
		SoulLib.pdHide(modelElem, 500, function() {
			videoElem.style.display = "none"
		}, false, from, parseInt(to))
	})
}



//处理最热排序
var hotRank = function() {
	var elem = document.getElementById("clsHot-hotMain")
	var hotList = function(xhr) {
		var data = JSON.parse(xhr.responseText)
		for (var i = 0; i < data.length; i++) {
			var newLi = document.createElement("li");
			var newImg = document.createElement("img");
			var newTitle = document.createElement("p");
			var newUser = document.createElement("p");
			newImg.src = data[i].smallPhotoUrl;
			newImg.width = 50;
			newImg.height = 50;
			newTitle.className = "Hotlist-title"
			newTitle.innerHTML = data[i].name
			newUser.className = "Hotlist-user"
			newUser.innerHTML = data[i].learnerCount
			elem.appendChild(newLi)
			newLi.appendChild(newImg)
			newLi.appendChild(newTitle)
			newLi.appendChild(newUser)
		}
		rollUpdate()
	}
	var options = {
		url: "http://study.163.com/webDev/hotcouresByCategory.htm",

		callback: hotList
	}
	SoulLib.sAjax(options)

	var rollUpdate = function() {
		var step = function() {
			elem.insertBefore(elem.firstChild, elem.lastChild)
		}
		setInterval(step, 5000)
	}
}




//初始化函数
var init = function() {
	//处理顶部导航条
	changeTop()
		//处理轮播图
	bannerShow()
		//处理登陆框
	Login()
		//处理课程列表
	classList(1)
		//处理分页
	changePage()
		//处理课程切换
	listTab()
		//最热排序
	hotRank()
		//视频详情
	videoInfo()
}

init()