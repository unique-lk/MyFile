/*
本插件由www.uniquekang.top博主撰写，使用本插件需要保证HTML中的层级结构关系，另外还需引入
博主撰写的utils.js和tween.js，相关的文件可在网站上自行下载。层级结构如下：
<div>
	<div>
		这里面就是轮播的图片
	</div>
	<ul>
		小圆点 默认选中的样式设置为bg
	</ul>
	<a href=""></a> 左
	<a href=""></a> 右
</div>
最后，感谢您的使用，谢谢！
*/

~function(){
	function LunBo(outer,interval){
		return this.init(outer,interval);
	}
	LunBo.prototype={
		constructor:LunBo,
		//初始化轮播图
		init:function(outer,interval){
			this.outer=outer;//整个轮播图最外层的div
			this.interval=interval||2000;
			this.inner=utils.firstChild(this.outer);//包裹图片的最外层div
			this.ul=utils.children(this.outer,"ul")[0];
			this.imgs=this.inner.getElementsByTagName("img");
			this.oLis=utils.children(this.ul,"li");
			this.leftBtn=utils.children(this.outer,"a")[0];
			this.rightBtn=utils.children(this.outer,"a")[1];
			this.isMove=false;
			this.step=0;
			this.count=this.imgs.length;
			var _this=this;
			this.imgWidth=utils.css(this.imgs[0],"width");
			//轮播图进行自动轮播
			this.timer=setInterval(function(){
				_this.autoMove();
			},this.interval);
			//小圆点绑定事件
			this.tipEvent();
			//鼠标移入
			this.overEvent();
			//鼠标移除
			this.outEvent();
			//点击右键
			this.rightEvent();
			//点击左键
			this.leftEvent();
			return this;
		},
		//自动轮播函数
		autoMove:function(){
			var _this=this;
			if(this.isMove){
				return;
			}
			this.isMove=true;
			if(this.step>=(this.count-1)){
				this.step=0;
				utils.css(this.inner,"left",0);
			}
			this.step++;
			kangMove(this.inner,1000,{"left":-(this.step*this.imgWidth)},function(){
				_this.isMove=false;
			});
			this.changeTip();
		},
		//小圆点切换函数
		changeTip:function(){
			var tempStep=this.step;
			for(var i=0,len=this.oLis.length;i<len;i++){
				if(this.step>=(this.count-1)){
					tempStep=0;
				}
				i===tempStep?utils.addClass(this.oLis[i],"bg"):utils.removeClass(this.oLis[i],"bg");
			}
		},
		//小圆点点击事件
		tipEvent:function(){
			for(var i=0,len=this.oLis.length;i<len;i++){
				this.oLis[i].index=i;
				var _this=this;
				this.oLis[i].onclick=function(){
					if(_this.isMove){
						return;
					}
					_this.isMove=true;
					_this.step=this.index;
					_this.changeTip();
					kangMove(_this.inner,1000,{"left":-(_this.step*_this.imgWidth)},function(){
						_this.isMove=false;
					});
				}
			}
		},
		//点击左方向运动函数
		leftMove:function(){
			var _this=this;
			if(this.isMove){
				return;
			}
			this.isMove=true;
			if(this.step<=0){
				this.step=this.count-1;
				utils.css(this.inner,"left",-this.step*this.imgWidth);
			}
			this.step--;
			kangMove(this.inner,1000,{"left":-this.step*this.imgWidth},function(){
				_this.isMove=false;
			});
			this.changeTip();
		},
		//右键点击事件
		rightEvent:function(){
			var _this=this;
			this.rightBtn.onclick=function(){
				_this.autoMove();
			};
		},
		//左键点击事件
		leftEvent:function(){
			var _this=this;
			this.leftBtn.onclick=function(){
				_this.leftMove();
			};
		},
		//鼠标移入事件
		overEvent:function(){
			var _this=this;
			this.outer.onmouseover=function(){
				window.clearInterval(_this.timer);
				_this.isMove=false;
			};
		},
		//鼠标移出事件
		outEvent:function(){
			var _this=this;
			this.outer.onmouseout=function(){
				_this.timer=window.setInterval(function(){
					_this.autoMove();
				},_this.interval);
			};
		}
	}
	window.LunBo=LunBo;
}();