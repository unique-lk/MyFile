//来源：www.uniquekang.com/top 
~function(){
	function createXHR(){
		var xhr=null,
			flag=false,
			ary=[
				function(){
					return new XMLHttpRequest;
				},
				function(){
					return new ActiveObject("Microsoft.XMLHTTP");
				},
				function(){
					return new ActiveObject("Msxml2.XMLHTTP");
				},
				function(){
					return new ActiveObject("Msxml3.XMLHTTP");
				}
			];
		for(var i=0;i<ary.length;i++){
			try{
				xhr=ary[i]();
				createXHR=ary[i];
				flag=true;
				break;
			}catch(e){

			}
		}
		if(!flag){
			throw new Error("您当前的浏览器版本过低！");
		}
		return xhr;
	}
	function ajax(options){
		var _default={
			url:null,
			type:"get",
			dataType:"json",
			async:true,
			data:null,
			getHead:null,
			success:null
		};
		for(var key in options){
			if(options.hasOwnProperty(key)){
				_default[key]=options[key];
			}
		}

		//解决get请求方式带来的缓存问题
		if(_default.type==="get"){
			_default.url.indexOf("?")===-1 ? _default.url+="?" : _default.url+="&";
			_default.url+="_="+Math.random();
		}
		var xhr=createXHR();
		xhr.open(_default.type,_default.url,_default.async);
		xhr.onreadystatechange=function(){
			if(/^2\d{2}$/.test(xhr.status)){
				if(xhr.readyState===2){
					if(typeof _default.getHead==="function"){
						_default.getHead.call(xhr);
					}
				}
				if(xhr.readyState===4){
					var val=xhr.responseText;
					//如果传递的参数值是json，说明获取的应该是JSON格式的对象
					if(_default.dataType==="json"){
						val="JSON" in window ? JSON.parse(val) : eval("("+val+")");
					}
					//这里就不判断是否是个函数了，虽然没有上面的那么严谨
					_default.success && _default.success.call(xhr,val);
				}
			}
		}
		xhr.send(_default.data);

	}
	window.ajax=ajax;
}();

function fn(img){      
    //->打开摄像头拍照后执行的后续操作 img是拍下来的照片
}    
window.location.href="uniquekang://phone?callback=fn"; 
//->zhufeng:// 就是我们事先制定的一个假协议，所有这种协议的都代表需要调取App的某个功能     
//->phone 这个标识就是事先制定的需要调取拍照功能     
//->callback=fn 把自己JS中的某一个方法传递给App，App可以在拍照完成后执行这个方法
	//，并且把保存的照片传递给这个方法(类似于JSONP) 