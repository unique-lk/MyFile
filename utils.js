var utils=(function(){

	//可以写个flag来判断是否是标准浏览器，这样以下的方法就可以通过这个flag来判断是否是标准浏览器
	//该类库中没有添加之前的方法，可以将之前的所有方法都添加进来

	function offset(curEle){
		var parent=curEle.offsetParent;
		var left=curEle.offsetLeft;
		var top=curEle.offsetTop;
		while(parent){
			if(navigator.userAgent.indexOf("MSIE 8.0")===-1){
				left+=parent.clientLeft;
				top+=parent.clientTop;
			}
			left+=parent.offsetLeft;
			top+=parent.offsetTop;
			parent=parent.offsetParent;
		}
		return {
			left:left,
			top:top
		}
	}

	function win(attr,value){
		if(typeof value==="undefined"){
			return document.documentElement[attr]||document.body[attr];
		}
		document.documentElement[attr]=value;
		document.body[attr]=value;
	}

	//获取curEle下所有的元素子节点(兼容所有的浏览器),如果传递了tagName，
	//可以在获取的集合中进行二次筛选，把指定标签名的获取到。
	function children(curEle,tagName){
		var ary=[];
		if(/MSIE (6|7|8)/i.test(navigator.userAgent)){
			var nodeList=curEle.childNodes;
			for(var i=0,len=nodeList.length;i<len;i++){
				var curNode=nodeList[i];
				if(curNode.nodeType===1){
					ary[ary.length]=curNode;
				}
			}
		}else{
			/*
			标准浏览器当中，直接使用children即可，但是这样获取到的是一个类数组(元素集合)集合，为了和IE6~8下保持一致，需要借用数组原型上的slice方法实现把类数组转换为数组。
			*/
			ary=Array.prototype.slice.call(curEle.children);
		}
		//二次筛选
		if(typeof tagName === "string"){
			for(var k=0;k<ary.length;k++){
				var curEleNode=ary[k];
				if(curEleNode.nodeName.toLowerCase()!==tagName.toLowerCase()){
					//在这里因为splice方法是会改变数组长度的，所以我们在for循环的时候是不能够将ary.length提前放入len当中。
					ary.splice(k,1);
					k--;
				}	
			}
		}
		return ary;
	}

	//获取上一个哥哥元素节点
	function prev(curEle){
		if(/MSIE (6|7|8)/i.test(navigator.userAgent)){
			var pre=curEle.previousSibling;//获取到的上一个哥哥节点
			while(pre&&pre.nodeType!==1){
				var pre=pre.previousSibling;
			}
			return pre;
		}else{
			return curEle.previousElementSibling;
		}
	}
	//获取下一个弟弟节点
	function next(curEle){
		if(/MSIE (6|7|8)/i.test(navigator.userAgent)){
			var nex=curEle.nextSibling;//获取到的下一个弟弟节点
			while(nex&&nex.nodeType!==1){
				var nex=nex.nextSibling;
			}
			return nex;
		}else{
			return curEle.nextElementSibling;
		}		
	}

	//获取所有的哥哥元素节点
	function prevAll(curEle){
		var ary=[];
		var pre=this.prev(curEle);
		while(pre){
			ary.unshift(pre);
			pre=this.prev(pre);
		}
		return ary;
	}
	//获取所有的弟弟元素节点
	function nextAll(curEle){
		var ary=[];
		var nex=this.next(curEle);
		while(nex){
			ary.push(nex);
			nex=this.next(nex);
		}
		return ary;
	}
	
	//获取相邻的两个元素节点
	function sibling(curEle){
		var ary=[];
		this.prev(curEle) ? ary.push(this.prev(curEle)) : null;
		this.next(curEle) ? ary.push(this.next(curEle)) : null;
		return ary;
	}
	//获取所有的兄弟节点
	function siblings(curEle){
		return this.prevAll(curEle).concat(this.nextAll(curEle));
	}
	//获取第一个元素子节点
	function firstChild(curEle){
		var chs=this.children(curEle);
		return chs.length>0 ? chs[0] : null;
	}
	//获取最后一个元素子节点
	function lastChild(curEle){
		var chs=this.children(curEle);
		return chs.length>0 ? chs[chs.length-1] : null;
	}
	//获取当前元素的索引
	function index(curEle){
		return this.prevAll(curEle).length;
	}

	//向指定容器的末尾追加元素 append
	function append(newEle,container){
		container.appendChild(newEle);
	}

	//向指定的容器开头追加元素 prepend
	//也就是说向容器的子元素的第一个之前添加元素，如果第一个子元素不存在，那么就可以直接添加,面试经常问
	function prepend(newEle,container){
		var fir=firstChild(container);
		if(fir){
			container.insertBefore(newEle,fir);
			return;
		}
		this.append(newEle,container);
	}

	//向指定元素之前追加元素 insertBefore
	function insertBefore(newEle,oldEle){
		oldEle.parentNode.insertBefore(newEle,oldEle);
	}

	//向容器中指定元素的末尾追加元素 insertAfter，面试经常问
	function insetAfter(newEle,oldEle){
		if(next(oldEle)){
			this.insertBefore(newEle,next(oldEle));
		}else{
			this.append(newEle,oldEle.parentNode);
		}
		
	}

	//通过className获取到元素 strName即className,context代表上下文
	function getElementsByClassName(strName,context){
		context=context || document;
		var ary=[];
		var classNameAry=strName.replace(/((^ +)|( +$))/g,"").split(/ +/g);
		var nodeLists=context.getElementsByTagName("*");
		for(var i=0,len=nodeLists.length;i<len;i++){
			var curNode=nodeLists[i];
			var isOK=true;
			for(var k=0;k<classNameAry.length;k++){
				var reg=new RegExp("(^| +)"+classNameAry[k]+"( +|$)");
				if(!reg.test(curNode.className)){
					isOK=false;
					break;
				}
			}
			if(isOK){
				ary.push(curNode);
			}
		}
		return ary;
	}

	function getCss(attr){
		var val=null,reg=null;
		//获取元素的样式，在标准浏览器下是通过getComputedStyle(curEle,attr,"伪类");
		//非标准浏览器是通过curEle.currentStyle(attr);
		if(/MSIE (6|7|8)/.test(navigator.userAgent)){
			if(attr==="opacity"){
				val=this.currentStyle["filter"];
				//alpha (opacity=100);
				reg=/^alpha *\(opacity===(\d+(?:\.\d+)?)\)$/i;
				val=reg.test(val) ? reg.exec(val)[1]/100 : 1;
			}else{
				val=this.currentStyle[attr];
			}
		}else{
			val=window.getComputedStyle(this,null)[attr];
		}
		reg=/^[+-]?\d+(\.\d+)?(px|em|rem|pp|pt)$/i;
		return reg.test(val) ? parseFloat(val) : val;
	}
	function setCss(attr,value){
		//兼容浮动
		if(attr==="float"){
			this.style["cssFloat"]=value;//标准浏览器
			this.style["styleFloat"]=value;//IE6~8
			return;
		}

		//如果打算设置的是元素的透明度，需要设置两套样式来兼容所有的浏览器
		if(attr==="opacity"){
			this.style["opacity"]=value;
			this.style["filter"]="Alpha (opacity="+value*100+")";
			return;
		}
		//对于某些样式属性，如果传递进来的值没有加单位，需要把单位默认的补充上，这样的话，这个方法就会人性化一些
		//width,height,top,left,bottom,right,padding,margin
		var reg=/^((width)|(height)|(top)|(bottom)|(left)|(right)|(((padding)|(margin))((Left)|(Right)|(Top)|(Bottom))?))$/;
		if(reg.test(attr)){
			//还要判断value是不是带了单位，也就是说它是不是一个有效数字，如果是有效数字证明当前传递进来的值没有加单位，我们默认的给补充单位
			if(!isNaN(value)){
				value+="px";
			}
		}
		this.style[attr]=value;
	}
	function setGroupCss(options){
		options=options||0;//如果传递进来的options是null或者undefined我让它为0
		//判断传进来的options是不是一个对象
		if(options.toString()!=="[object Object]"){
			return;
		}

		for(var key in options){
			if(options.hasOwnProperty(key)){//必须是私有属性
				setCss.call(this,key,options[key]);
			}
		}
	}	
	/*
		$.css("width");获取元素的样式值
		$.css("width",200);设置元素的样式值
		$.css({
			
		});

		getCss(curEle,attr); 两个参数
		setCss(curEle,attr,value); 三个参数
		setGroupCss(curEle,options); 两个参数
		如果传递的参数第二个参数是一个对象的话，就是批量设置css属性，
		如果传递的参数不是对象且参数只有两个的话，说明是获取单个样式值
		如果传递的参数有三个，说明是设置单个的样式值
		www.uniquekang.top 欢迎您的访问
	*/
	function css(curEle){
		var ary=Array.prototype.slice.call(arguments,1);
		var argTwo=arguments[1];//获取传递的第二个参数
		if(typeof argTwo==="string"){//说明传递的第二个参数不是对象
			var argThree=arguments[2];
			if(typeof argThree!=="undefined"){//存在第三个参数的话，说明是单个设置样式值
				//this.setCss(curEle,argTwo,argThree);感觉这样写太low了
				//this.setCss.apply(this,arguments);//是不是逼格涨了那么一丢丢呢
				setCss.apply(curEle,ary);
				return;
			}
			return getCss.apply(curEle,ary);
		}
		argTwo=argTwo||0;
		if(argTwo.toString()==="[object Object]"){
			//说明是个对象数据类型的值
			setGroupCss.apply(curEle,ary);
		}
	}

	function addClass(curEle,className){
		var ary=className.split(/ +/g);
		for(var i=0,len=ary.length;i<len;i++){
			if(!hasClass(curEle,ary[i])){
				curEle.className+=" "+ary[i];
			}
		}
	}
	function hasClass(curEle,className){
		var reg=new RegExp("(^| +)"+className+"( +|$)","g");
		return reg.test(curEle.className);
	}
	function removeClass(curEle,className){
		var ary=className.split(/ +/g);
		for(var i=0,len=ary.length;i<len;i++){
			if(hasClass(curEle,ary[i])){
				//移除
				var reg=new RegExp("(^| +)"+ary[i]+"( +|$)","g");
				curEle.className=curEle.className.replace(reg," ");
			}
		}
	}

	return {
		win:win,
		children:children,
		prev:prev,
		next:next,
		prevAll:prevAll,
		nextAll:nextAll,
		sibling:sibling,
		siblings:siblings,
		firstChild:firstChild,
		lastChild:lastChild,
		index:index,
		prepend:prepend,
		append:append,
		insertBefore:insertBefore,
		insetAfter:insetAfter,
		getElementsByClassName:getElementsByClassName,
		css:css,
		addClass:addClass,
		removeClass:removeClass,
		hasClass:hasClass,
		offset:offset
	}
}());
