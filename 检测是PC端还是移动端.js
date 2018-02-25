//注:以下JS代码应该在JS一加载就开始检测，所以放在头部的HEAD区域。

~function(){
	var reg1=/AppleWebkit.*Mobile/i,
		reg2=/MIDP|SymbianOS|NOKIA|SAMSUNG|LG|NEC|TCL|Alcate|BIRD|DBTEL|Dopod|PHILIPS|HAIER|LENOVO|MOT-|Nokia|SonyEricsson|SIE-|Amoi|ZTE/;

	//条件成立说明当前页面是运行在移动设备中的
	if(reg1.test(navigator.userAgent)||reg2.test(navigator.userAgent)){
		//如果当前页面的URL是PC端项目的地址，我们需要跳转到移动端项目
		if(window.location.href.indexOf("www.uniquekang.top")>=0){
			window.location.href="http://phone.uniquekang.top";
		}
		return;
	}

	//反之则说明当前的页面是运行在PC端设备中的，如果访问的URL地址是移动端的，我们需要跳转到PC端地址上
	if(window.location.href.indexOf("phone.uniquekang.top")>=0){
		window.location.href="http://www.uniquekang.top";
	}

}();

 ~function () {
    var reg1 = /AppleWebKit.*Mobile/i, 
        reg2 = /MIDP|SymbianOS|NOKIA|SAMSUNG|LG|NEC|TCL|Alcatel|BIRD|DBTEL|Dopod|PHILIPS|HAIER|LENOVO|MOT-|Nokia|SonyEricsson|SIE-|Amoi|ZTE/; 
    if (reg1.test(navigator.userAgent) || reg2.test(navigator.userAgent)) {
        if (/iPad/i.test(navigator.userAgent)) {
            //->说明是PAD
        } else {
       	    //->说明是手机
    	}         
	}
}(); 