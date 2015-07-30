$(function(){
	var lo=window.localStorage;
	var content=[{
			"title":"设计",
			"list":[{
				"id":0,
				"title":"图片排版与字体风格",
				"main":"**如果两张图片风格**"
			},]
		}]
	var navclick=1;
	var noteContentPoint=0;
	var newnodePointer=0;
	lo["data"]=JSON.stringify(content);
	lo["navclick"]=navclick;
	lo["newnodePointer"]=newnodePointer;
	lo["noteContentPoint"]=noteContentPoint;
	
	function Obj(){}
	//清除本地缓存
	Obj.prototype.clearLo=function(){
		for(var i=0; i<lo.length; i++){
			lo.removeItem(i);
		}
	}
	//初始化
	Obj.prototype.init=function(){
		//清除缓存
		this.clearLo();
		this.noteSave(newnodePointer,this)
		
		$("#node").height($(window).height())
		//限制文本字数
		$("#node_list_main").find("li p").each(function(){
			var maxwidth=100;
			if($(this).text().length>maxwidth){
				$(this).text($(this).text().substring(0,maxwidth));
				$(this).html($(this).html()+"...")
			}
		})
		//初始化充填数据
		for(var i=0;i<content.length;i++){
			console.log(content[i].title)
			var elem="<li data-title="+content[i].title+">"+content[i].title +"(<span>"+content[i].list.length+"</span>) <span class='delete_list'><i class='fa fa-remove'></i></span></li>"
			$(".node_nav_list").append(elem)
		}
		//更新列表绑定事件
		this.navNode()
		this.callDate()
		
	}
	
	//更新本地缓存
	Obj.prototype.callDate=function(){
		//更新data
		if(typeof content=="string"){
			content=JSON.parse(content);
		}
		console.log(content)
		lo["data"]=JSON.stringify(content);
		//更新nav点击次数
		lo["navclick"]=navclick;
		console.log(lo["data"])
		//更新指针
		lo["newnodePointer"]=newnodePointer;
		lo["noteContentPoint"]=noteContentPoint;
	}
	//处理nav添加事件
	Obj.prototype.navAdd=function(){
		//缓存全局变量
		var callDate=this.callDate;
		var navUpdata=this.navUpdata;
		var listLen=this.listLen;
		var _navNode=this.navNode
		var _noteNavDelete=this.noteNavDelete
		var that=this;
		//点击添加事件
		$("#node_nav_add").on("click",function(){
			$("#node_list_add_modle").show(200)
		})
		//点击确定事件
		$("#n_l_a_m_ok").on("click",function(){
			callDate()
			var inputv=$("#n_l_a_m_content").val()
			if(inputv==null||inputv==""){alert("请输入笔记本名字");return false;}
			content.push({"title":inputv,"list":[{"title":"默认数据","main":"默认数据"}]})
			callDate()
			
			var elem="<li data-title="+content[navclick].title+">"+content[navclick].title +"(<span>"+listLen(content[navclick].list)+"</span>)<span class='delete_list'><i class='fa fa-remove'></i></span></li>"
			navclick++

			navUpdata(elem)
			$("#node_list_add_modle").hide(200)
			console.log(lo["navclick"])
			//更新li绑定事件列表
			_navNode(that)
			_noteNavDelete(that)
			
		})
		$("#n_l_a_m_off").on("click",function(){
			$("#node_list_add_modle").hide(200)
		})
		
	}
	//判断是否存在length 不存在返回0
	Obj.prototype.listLen=function(data){
		if(data==undefined&&typeof data=="undefined"){
			return 0;
		}
		return data.length;
	}
	
	//通知导航更新
	Obj.prototype.navUpdata=function(elem){
		$(".node_nav_list").append(elem)
	}
	
	//处理点击笔记本列表
	Obj.prototype.navNode=function(that){
		var elem=$(".node_nav_list").find("li");
		console.log(elem)
		if(!that){that=this}
		//处理li绑定事件
		$(elem).each(function(index,domEle){
			$(domEle).on("click",function(){
				var _newNote=that.updataNote;
				var _updata=that.callDate;
				var _daleteNode=that.deleteNode;
				var _updateList=that.nodeList;
				var _navColor=that.navColor;
				var _noteDelete=that.noteDelete;
				if($("#node_content").attr("display")=="block"||$("#node_content").css("display")=="block"){
				alert("请先点击保存按钮");
				return false;
			}
				noteContentPoint=0;
			
				//清空列表内容
				$("#node_list_main").html("")
				//指针指向的是点击的列表index
				newnodePointer=index;
				//更新下本地缓存
				_updata()
				console.log("list:"+index)
				_navColor()
				//添加列表内容
				if(content[index].list==undefined||typeof content[index].list=="undefined"){
					return false;
				}
				for(var i=0;i<content[index].list.length;i++){
					_newNote(elem,content[index].list[i].title,content[index].list[i].main)
				}
				_updateList(that)
				_noteDelete(that)
			})
		})
	}
	//先清空列表内容
	Obj.prototype.deleteNode=function(){
		$("#node_list_main").html("")
	}
	
	Obj.prototype.navColor=function(){
		$(".node_nav_list").find("li").each(function(index,domEle){
			$(domEle).attr("id","")
		})
		$(".node_nav_list").find("li").eq(newnodePointer).attr("id","nav_color")
		
	}
	
	//更新笔记本列表
	Obj.prototype.updataNote=function(elem,title,main){
		var mainElem=$("#node_list_main")
		var newElem="<li><h3>"+title+"</h3><p>"+main+"</p><span class='note_delete'><i class='fa fa-remove'></i></span></li>"
		$(mainElem).append(newElem);
	}
	
	//新建笔记 笔记列表点击事件处理
	Obj.prototype.nodeList=function(that){
		var _elem=$("#node_list_main").find("li");
		var _noteEdit=that.noteEdit;
		var _noteSave=that.noteSave;
		var _updata=that.callDate;
		$(_elem).each(function(index,domEle){
			$(domEle).on("click",function(){
				if($("#node_content_title input").prop("disabled")==false){
					$("#node_content_title input").attr("disabled",true)
				}
				if($("#node_content_text").attr("display")=="block"||$("#node_content_text").css("display")=="block"||$("#node_content_text").css("display")=="inline-block"){
					alert("请先点击保存按钮");
					return false;
				}
				var ptext=markdown.toHTML( $(this).find("p").text())
				$("#node_content_show").show(200)
				$("#node_content_show").html(ptext)
				$("#node_content").show(200);
				
				console.log(ptext)
				_updata();
				$("#node_content_title input").attr("value",$(this).find("h3").text());
				_updata()
				var maindata=$(this).find("p").text();
				_noteEdit(maindata)
				noteContentPoint=index
				console.log(index)
				_noteSave(noteContentPoint,that)
			})
		})
			
		
	}
	//点击编辑按钮事件
	Obj.prototype.noteEdit=function(maindata){
		
		var _elem=$("#node_list_main").find("li");
		var _updata=this.callDate;
		$("#node_content_edit").on("click",function(){
			//双重判断编辑的状态
			console.log(maindata)
			if($("#node_content_title input").prop("disabled")==true){
					$("#node_content_title input").removeAttr("disabled")
				}
			if($("#node_content_show").attr("display")=="none"||$("#node_content_show").css("display")=="none"){
				console.log("ok")
				return false;
			}
			
			
			console.log($("#node_content_text").css("display"))
		$("#node_content_show").hide(200);
		$("#node_content_text").text(maindata);
		$("#node_content_text").show(200)
		})
		
	}
	
	//点击保存按钮
	Obj.prototype.noteSave=function(index,that){
		var _updata=that.callDate;
		var con=content;
		var _navNode=that.navNode;
		var _deleteNode=that.deleteNode
		var _newNote=that.updataNote;
		var _updateList=that.nodeList;
		var _noteDelete=that.noteDelete
		$("#node_content_save").on("click",function(){
			//只有编辑状态才能保存
			if($("#node_content_text").attr("display")=="block"||$("#node_content_text").css("display")=="block"||$("#node_content_text").css("display")=="inline-block"){
					var maintext=$("#node_content_text").val();
					var maintitle=$("#node_content_title input").val();
					console.log(maintext)
					_updata()
					con[newnodePointer].list[noteContentPoint].title=maintitle;
					con[newnodePointer].list[noteContentPoint].main=maintext;
					_updata()
					//删除列表 重新生成列表
					$("#node_content_title input").attr("disabled",true)
					_deleteNode()
					console.log(index)
					console.log("newnodePointer:"+newnodePointer)
					console.log(content)
					var elem=$("#node_list_main").find("li");
					for(var i=0;i<content[newnodePointer].list.length;i++){
					_newNote(elem,content[newnodePointer].list[i].title,content[newnodePointer].list[i].main)
				}
				_updateList(that)
				_noteDelete(that)
				$("#node_content").hide(200)
				$("#node_content_text").hide(200)
			}
			
		return false;
		})
	}

	Obj.prototype.noteContent=function(){
		$("node_content_title").find("input");
	}
	//新建笔记
	Obj.prototype.createNote=function(){
		var that=this;
		var _updateList=that.nodeList;
		var _updata=that.callDate;
		var _newNote=that.updataNote;
		var elem=$("#node_list_main").find("li");
		var _navColor=that.navColor;
		var _noteDelete=that.noteDelete
		$("#node_list_add").on("click",function(){
			if($("#node_content_text").attr("display")=="block"||$("#node_content_text").css("display")=="block"||$("#node_content_text").css("display")=="inline-block"){
				alert("请点击保存按钮")
				return false;
			}
			console.log("hello")
			//清空列表内容
				$("#node_list_main").html("")
				//指针指向的是点击的列表index

				//更新下本地缓存
				_updata()
				
				//添加列表内容
				if($("#node_content_title input").prop("disabled")==true){
					$("#node_content_title input").removeAttr("disabled")
				}
				if(content[newnodePointer].list==undefined||typeof content[newnodePointer].list=="undefined"){
					return false;
				}
				for(var i=0;i<content[newnodePointer].list.length;i++){
					_newNote(elem,content[newnodePointer].list[i].title,content[newnodePointer].list[i].main)
				}
				_updateList(that)
				_navColor()
				_noteDelete()
				var len=$("#node_list_main").find("li").length;
			if($("#node_content").attr("display")=="none"||$("#node_content").css("display")=="none"){
				noteContentPoint++;
				$("#node_content").show(200)
			}
			noteContentPoint=len
			$("#node_content_title input").attr("value","请输入标题");
			$("#node_content_title input").attr("placeholder","请输入标题");
			$("#node_content_text").val(" ")
			$("#node_content_show").hide(200)
			$("#node_content_text").show(200);
			console.log("len:"+len)
			_updata()
			content[newnodePointer].list[len]={"id":0,"title":" ","main":" "}
			console.log($("#node_content_text").val())
			_updata()
		})
		
	}
	
	//删除笔记本列表
	Obj.prototype.noteNavDelete=function(that){
		var that=that||this;
		var first=true;
		function fuc(){
			if(!first){
				$(".delete_list").hide(200);
				first=true
			}else{
				$(".delete_list").show(200)
				first=false;
				$(".delete_list").each(function(index,domEle){
			$(domEle).on("click",function(e){
				if(confirm("是否删除该笔记列表？")){
				var ls=$(this).parent().index()
				e.stopImmediatePropagation();
				that.callDate
				content.splice(ls,1)
				$(this).parent().remove()
				navclick--
				that.callDate()
				}
				
			})
			})
			}
		
		}
		$("#node_nav_delete").on("click",fuc)
		
	}
	
	//删除笔记列表
	Obj.prototype.noteDelete=function(that){
		var that=that||this;
		$(".note_delete").each(function(index,domEle){
			$(domEle).on("click",function(e){
				that.callDate()
				var ls=$(this).parent().index()
				content[newnodePointer].list.splice(ls,1)
				that.callDate()
				$(this).parent().remove()
				e.stopImmediatePropagation();
				
			})
		})
	}
	

	
	var soul=new Obj();
	soul.init()
	soul.navAdd();
	soul.createNote();
	soul.noteNavDelete();
	soul.noteDelete();
	
	
})
