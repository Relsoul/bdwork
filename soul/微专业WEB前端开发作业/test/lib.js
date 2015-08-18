//定义公共常见样式库
var SoulLib = {}

//elem:[elem] 元素
//cls:[string] 查找的class
SoulLib.getClassName=function(elem,cls){
	var _elem=elem.getElementsByTagName("*")
	var _arr=[];
	for(var i=0;i<_elem.length;i++){
		if(_elem[i].className==cls){
			_arr.push(_elem[i])
		}
	}
	return _arr;
}

//根据文档编写的AJAX,采用GET获取
//option{
//	url:[string],需要传递的url
//	data:[object],需要传递的参数
//	callback:[function],需要调用的函数
//}
SoulLib.sAjax = function(option) {
	//存储option数据
	var _data = option.data,
		_url = option.url,
		_callback = option.callback;
	var _key, _value, _arr = [];
	//遍历_data生成数组
	for (var i in _data) {
		if (_data.hasOwnProperty(i)) {
			_key = encodeURIComponent(i)
			_value = encodeURIComponent(_data[i])
			_arr.push(_key + "=" + _value)
		}
	}
	//根据url进行组合
	_url += "?";
	_url += _arr.join("&");
	//创建ajax IE7以上直接new XML即可
	var xmlHttp = new XMLHttpRequest();
	//监听相应并进行处理
	xmlHttp.onreadystatechange = function() {
			if (xmlHttp.readyState == 4) {
				_callback(xmlHttp)
			}
		}
		//创建请求
	xmlHttp.open("get", _url, true)
		//发送请求
	xmlHttp.send(null)
}

SoulLib.sCookie = {
	//获取cookie值
	get: function(skey) {
		var matchItem = document.cookie.match(new RegExp(skey + '=(\\w+)'))
		if (matchItem) {
			return matchItem[1]
		}
		return null;
	},
	//添加/更改cookie
	add: function(name, value, expire) { // expire的单位为天
		var today = new Date();
		today.setDate(today.getDate() + expire);
		document.cookie = name + "=" + value + "; expires=" + today.toGMTString();
	}
}

//兼容版addEventListener
//el:[elem] 传递的元素
//eve:[event] 需要绑定的事件
//func:[function] 需要处理的函数
SoulLib.addEvent = function(el, eve, func) {
	if (el.addEventListener) {
		el.addEventListener(eve, func, false);
	} else if (el.attachEvent) {
		el.attachEvent('on' + eve, func);
	}
}

//pdHide:隐藏动画
//elem:[elem],传递元素
//time:[number] 时间
//callback:[function] 回调函数
//pd:[bool] true宽度隐藏 flase 高度隐藏
SoulLib.pdHide = function(elem, time, callback, pd, from, to) {
	var _css, step;
	//判断pd无传值的情况
	pd = pd ? true : false
		//设置_css为宽度还是高度
	_css = pd ? "width" : "height";
	var getComCSS = getComputedStyle(elem, false)[_css] || elem.currentStyle[_css];
	//每秒变化
	var distance = Math.abs(to - from);
	var stepLength = Math.ceil((distance * 10) / time);
	var cover = 0
	var symbol = (to - from) / distance;
	//设置行类值根据行类值进行计算
	elem.style[_css] = getComCSS;
	switch (pd) {
		case true:
			step = function() {
				var des = cover + stepLength;
				if (des < distance) {
					cover += stepLength;
					//每10ms 判断移动方向
					elem.style.width = parseInt(elem.style.width) + stepLength * symbol + 'px';
				} else {
					clearInterval(timer);
					elem.style.width = to + "px";
					if (callback) {
						callback()
					}
				}
			}
			break;
		case false:
			step = function() {
				var des = cover + stepLength;
				if (des < distance) {
					cover += stepLength;
					//每10ms 判断移动方向
					elem.style.height = parseInt(elem.style.height) + stepLength * symbol + 'px';
				} else {
					clearInterval(timer);
					elem.style.height = to + "px";
					if (callback) {
						callback()
					}
				}
			}
			break;
	}
	var timer = setInterval(step, 10)
}

//根据网易微专业课所编写的动画模块 增加淡入功能
//ele:[elem] 距离移动元素
//from:[num] 移动开始
//to:[num] 移动结束
//fadeElem:[elem] 淡入元素
SoulLib.fadeIn = function(ele, from, to, fadeElem, callback) {
	//淡入功能
	var alpha = 0;
	fadeElem.style.opacity = alpha;
	//设置移动时间和每10ms执行动画
	var STEP = 10;
	var SPEED = 500;
	//计算移动距离
	var distance = Math.abs(to - from);
	//移动距离
	var cover = 0;
	//判断移动方向
	var symbol = (to - from) / distance;
	//500ms内移动距离 例如:1920*10ms/500ms
	var stepLength = Math.floor((distance * STEP) / SPEED);
	//淡入时间
	var fadeLen = 9 / SPEED
		//获取num值
	var getNum = function(str) {
		if (!str) {
			return 0;
		} else {
			return parseInt(str.split('px')[0]);
		}
	}
	var step = function() {
			//des用来储存移动了多少
			var des = cover + stepLength;
			//如果没有移动完成
			if (des < distance) {
				alpha += fadeLen
				cover += stepLength;
				//每10ms 判断移动方向
				ele.style.left = getNum(ele.style.left) + stepLength * symbol + 'px';
				fadeElem.style.opacity = alpha
			} else {
				clearInterval(intervalId);
				ele.style.left = to + 'px';
				fadeElem.style.opacity = 1;
				if (callback) {
					callback()
				}
			}
		}
		//每10ms执行一次动画
	var intervalId = setInterval(step, STEP);
}

SoulLib.getIndex = function(elem, getElem) {
	for (var i = 0; i < elem.length; i++) {
		if (elem[i] == getElem) {
			return i
		}
	}
}




//opt{
//	id: [elem],传入分页div
//	nowNum: [num],当前页数
//	allNum: [num] 总页数
//}
SoulLib.Pages = function(opt) {
	//获取ID
	var obj = document.getElementById(opt.id)
	var nowNum = opt.nowNum || 1;
	var allNum = opt.allNum || 8;
	//清空重新生成元素
	obj.innerHTML = "";
	//出现上一页的情况
	if (nowNum >= 2) { //当前选中的a标签>=2出现上一页标签
		var oA = document.createElement("a");
		oA.href = "#" + (nowNum - 1);
		oA.innerHTML = "&lt;"
		oA.className = "pn"
		obj.appendChild(oA)
	}
	//allNUM大于8 这条可以忽略
	if (allNum <= 8) {
		for (var i = 1; i <= allNum; i++) {
			var oA = document.createElement("a");
			oA.href = "#" + i;
			if (nowNum == i) {
				oA.innerHTML = i
			} else {
				oA.innerHTML = "[" + i + "]";
			}
			obj.appendChild(oA);
		}
	} else {
		//每次生成8条a标签
		for (var i = 1; i <= 8; i++) {
			var oA = document.createElement("a");
			//生成左边 4个a标签
			if (nowNum <= 4) { //如果当前选中的a标签为4
				oA.href = "#" + i;
				//如果当前选中的a标签在左边区域
				if (nowNum == i) {
					//给左边区域相应a标签加上高亮
					oA.innerHTML = i
					oA.className = "curt"
				} else {
					//生成左边其他标签
					oA.innerHTML = i;
				}
				//生成右边区域
			} else if ((allNum - nowNum) == 0 || (allNum - nowNum) == 1 || (allNum - nowNum) == 2 || (allNum - nowNum) == 3) { //判断最后3条元素
				//生成右边区域
				oA.href = "#" + (allNum - 8 + i);
				//如果当前选中的为最后一个
				if ((allNum - nowNum) == 0 && i == 8) {
					//生成右边区域
					oA.innerHTML = (allNum - 8 + i)
						//加上高亮
					oA.className = "curt"
				} else if ((allNum - nowNum) == 1 && i == 7) {
					oA.innerHTML = (allNum - 8 + i)
					oA.className = "curt"
				} else if ((allNum - nowNum) == 2 && i == 6) {
					oA.innerHTML = (allNum - 8 + i)
					oA.className = "curt"
				} else if ((allNum - nowNum) == 3 && i == 5) {
					oA.innerHTML = (allNum - 8 + i)
					oA.className = "curt"
				} else {
					//生成右边区域
					oA.innerHTML = (allNum - 8 + i);
				}
			} else {
				oA.href = "#" + (nowNum - 4 + i)
				if (i == 4) {
					oA.innerHTML = (nowNum - 4 + i)
					oA.className = "curt"
				} else {
					oA.innerHTML = nowNum - 4 + i;
				}
			}
			//添加a标签
			obj.appendChild(oA)
		}
	}
	//生成下一页标签
	if ((allNum - nowNum) >= 1) { //当前选中a标签不等于最后个a标签
		var oA = document.createElement("a");
		oA.href = "#" + (nowNum + 1);
		oA.innerHTML = "&gt;";
		obj.appendChild(oA)
		oA.className = "pn"
	}
}