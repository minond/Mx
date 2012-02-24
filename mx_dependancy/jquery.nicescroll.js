/* jquery.nicescroll - v2.8.2 - InuYaksa*2012 - MIT licensed - http://areaaperta.com/nicescroll */
(function(f){var l=false,o=false,r=5E3,s=2E3,t=function(){var e=document.getElementsByTagName("script"),e=e[e.length-1].src.split("?")[0];return e.split("/").length>0?e.split("/").slice(0,-1).join("/")+"/":""}(),m=window.requestAnimationFrame||window.webkitRequestAnimationFrame||window.mozRequestAnimationFrame||window.oRequestAnimationFrame||window.msRequestAnimationFrame||false,n=window.cancelRequestAnimationFrame||window.webkitCancelRequestAnimationFrame||window.mozCancelRequestAnimationFrame||
window.oCancelRequestAnimationFrame||window.msCancelRequestAnimationFrame||false,x=function(e,d){var b=this;this.version="2.8.2";this.name="nicescroll";this.me=d;this.opt={doc:f("body"),win:false,zindex:9E3,cursoropacitymin:0,cursoropacitymax:1,cursorcolor:"#424242",cursorwidth:"5px",cursorborder:"1px solid #fff",cursorborderradius:"5px",scrollspeed:60,mousescrollstep:40,touchbehavior:false,hwacceleration:true,usetransition:true,boxzoom:false,dblclickzoom:true,gesturezoom:true,grabcursorenabled:true,
autohidemode:true,background:"",iframeautoresize:true,cursorminheight:20,preservenativescrolling:true,railoffset:false,bouncescroll:false};if(e)for(var h in b.opt)typeof e[h]!="undefined"&&(b.opt[h]=e[h]);this.id=(this.doc=b.opt.doc)&&this.doc[0]?this.doc[0].id||"":"";this.ispage=/BODY|HTML/.test(b.opt.win?b.opt.win[0].nodeName:this.doc[0].nodeName);this.haswrapper=b.opt.win!==false;this.win=b.opt.win||(this.ispage?f(window):this.doc);this.docscroll=this.ispage&&!this.haswrapper?f(window):this.win;
this.body=f("body");this.iframe=false;this.isiframe=this.doc[0].nodeName=="IFRAME"&&this.win[0].nodeName=="IFRAME";this.istextarea=this.win[0].nodeName=="TEXTAREA";this.page=this.view=this.onclick=this.ongesturezoom=this.onkeypress=this.onmousewheel=this.onmousemove=this.onmouseup=this.onmousedown=false;this.scroll={x:0,y:0};this.scrollratio={x:0,y:0};this.cursorheight=20;this.scrollvaluemax=0;this.scrollmom=false;do this.id="ascrail"+s++;while(document.getElementById(this.id));this.hasmousefocus=
this.hasfocus=this.zoomactive=this.zoom=this.cursorfreezed=this.cursor=this.rail=false;this.visibility=true;this.locked=false;b.nativescrollingarea=false;this.events=[];this.saved={};this.delaylist={};var i=document.createElement("DIV");this.isopera="opera"in window;this.isieold=(this.isie="all"in document&&"attachEvent"in i&&!this.isopera)&&!("msInterpolationMode"in i.style);this.isie7=this.isie&&!this.isieold&&(!("documentMode"in document)||document.documentMode==7);this.isie8=this.isie&&"documentMode"in
document&&document.documentMode==8;this.isie9=this.isie&&"performance"in window&&document.documentMode>=9;this.ismozilla="MozAppearance"in i.style;this.ischrome="chrome"in window;this.isios4=(this.isios=(this.cantouch="ontouchstart"in document.documentElement)&&/iphone|ipad|ipod/i.test(navigator.platform))&&!("seal"in Object);if(b.opt.hwacceleration){if((this.trstyle=window.opera?"OTransform":document.all?"msTransform":i.style.webkitTransform!==void 0?"webkitTransform":i.style.MozTransform!==void 0?
"MozTransform":false)&&typeof i.style[this.trstyle]=="undefined")this.trstyle=false;if(this.hastransform=this.trstyle!=false)i.style[this.trstyle]="translate3d(1px,2px,3px)",this.hastranslate3d=/translate3d/.test(i.style[this.trstyle]);this.transitionstyle=false;this.prefixstyle="";this.transitionend=false;var p="transition,webkitTransition,MozTransition,OTransition,msTransition,KhtmlTransition".split(","),k=",-webkit-,-moz-,-o-,-ms-,-khtml-".split(","),u="transitionEnd,webkitTransitionEnd,transitionend,oTransitionEnd,msTransitionEnd,KhtmlTransitionEnd".split(",");
for(h=0;h<p.length;h++)if(p[h]in i.style){this.transitionstyle=p[h];this.prefixstyle=k[h];this.transitionend=u[h];break}this.hastransition=this.transitionstyle}else this.transitionend=this.hastransition=this.transitionstyle=this.hastranslate3d=this.hastransform=this.trstyle=false;this.cursorgrabvalue="";if(b.opt.grabcursorenabled&&b.opt.touchbehavior)this.cursorgrabvalue=function(){for(var c=b.ischrome||b.isie&&!b.isie9?["url(http://www.google.com/intl/en_ALL/mapfiles/openhand.cur)","n-resize"]:["grab",
"-moz-grab","-webkit-grab","url(http://www.google.com/intl/en_ALL/mapfiles/openhand.cur)","n-resize"],g=0;g<c.length;g++){var d=c[g];i.style.cursor=d;if(i.style.cursor==d)return d}return""}();i=null;this.ishwscroll=b.hastransform&&b.opt.hwacceleration&&b.haswrapper;this.delayed=function(c,g,d){var j=b.delaylist[c],e=(new Date).getTime();if(j&&j.tt)return false;if(j&&j.last+d>e&&!j.tt)b.delaylist[c]={last:e+d,tt:setTimeout(function(){b.delaylist[c].tt=0;g.call()},d)};else if(!j||!j.tt)b.delaylist[c]=
{last:e,tt:0},setTimeout(function(){g.call()},0)};this.css=function(c,g){for(var d in g)b.saved.css.push([c,d,c.css(d)]),c.css(d,g[d])};this.scrollTop=function(c){return typeof c=="undefined"?b.getScrollTop():b.setScrollTop(c)};BezierClass=function(b,g,d,j,e,v,f){this.st=b;this.ed=g;this.spd=d;this.p1=j||0;this.p2=e||1;this.p3=v||0;this.p4=f||1;this.ts=(new Date).getTime();this.df=this.ed-this.st};BezierClass.prototype={B2:function(b){return 3*b*b*(1-b)},B3:function(b){return 3*b*(1-b)*(1-b)},B4:function(b){return(1-
b)*(1-b)*(1-b)},getNow:function(){var b=1-((new Date).getTime()-this.ts)/this.spd,g=this.B2(b)+this.B3(b)+this.B4(b);return b<0?this.ed:this.st+Math.round(this.df*g)},update:function(b,g){this.st=this.getNow();this.ed=b;this.spd=g;this.ts=(new Date).getTime();this.df=this.ed-this.st;return this}};this.ishwscroll?(this.doc.translate={x:0,y:0},this.getScrollTop=function(c){return b.timerscroll&&!c?b.timerscroll.bz.getNow():b.doc.translate.y},this.notifyScrollEvent=document.createEvent?function(b){var g=
document.createEvent("UIEvents");g.initUIEvent("scroll",false,true,window,1);b.dispatchEvent(g)}:document.fireEvent?function(b){var g=document.createEventObject();b.fireEvent("onscroll");g.cancelBubble=true}:function(){},this.setScrollTop=this.hastranslate3d?function(c,g){b.doc.css(b.trstyle,"translate3d(0px,"+c*-1+"px,0px)");b.doc.translate.y=c;g||b.notifyScrollEvent(b.win[0])}:function(c,g){b.doc.css(b.trstyle,"translate(0px,"+c*-1+"px)");b.doc.translate.y=c;g||b.notifyScrollEvent(b.win[0])}):(this.getScrollTop=
function(){return b.docscroll.scrollTop()},this.setScrollTop=function(c){return b.docscroll.scrollTop(c)});this.getTarget=function(b){return!b?false:b.target?b.target:b.srcElement?b.srcElement:false};this.hasParent=function(b,g){if(!b)return false;for(var d=b.target||b.srcElement||b||false;d&&d.id!=g;)d=d.parentNode||false;return d!==false};this.updateScrollBar=function(c){if(b.ishwscroll)b.rail.css({height:b.win.innerHeight()});else{var g=b.win.offset();g.top+=2;var d=(b.win.outerWidth()-b.win.innerWidth())/
2;g.left+=b.win.innerWidth()+d-b.rail.width-1;if(d=b.opt.railoffset)d.top&&(g.top+=d.top),d.left&&(g.left+=d.left);b.rail.css({top:g.top,left:g.left,height:c?c.h:b.win.innerHeight()});b.zoom&&b.zoom.css({top:g.top+1,left:g.left-20})}};b.hasanimationframe=m;b.hascancelanimationframe=n;b.hasanimationframe?b.hascancelanimationframe||(n=function(){b.cancelAnimationFrame=true}):(m=function(b){return setTimeout(b,1E3/60)},n=clearInterval);this.init=function(){b.saved.css=[];if(!b.ispage||!b.cantouch&&!b.isieold){var c=
b.docscroll;b.ispage&&(c=b.haswrapper?b.win:b.doc);b.css(c,{"overflow-y":"hidden"});b.ispage&&b.isie7&&b.win[0].nodeName=="BODY"&&b.css(f("html"),{"overflow-y":"hidden"});var d=f(document.createElement("div"));d.css({position:"relative",top:0,"float":"right",width:b.opt.cursorwidth,height:"0px","background-color":b.opt.cursorcolor,border:b.opt.cursorborder,"background-clip":"padding-box","-webkit-border-radius":b.opt.cursorborderradius,"-moz-border-radius":b.opt.cursorborderradius,"border-radius":b.opt.cursorborderradius});
d.hborder=parseFloat(d.outerHeight()-d.innerHeight());b.cursor=d;c=f(document.createElement("div"));c.attr("id",b.id);c.width=1+Math.max(parseFloat(b.opt.cursorwidth),d.outerWidth());c.css({"padding-left":"0px","padding-right":"1px",width:c.width+"px",zIndex:b.ispage?b.opt.zindex:b.opt.zindex+2,background:b.opt.background});c.append(d);b.rail=c;d=b.rail.drag=false;if(b.opt.boxzoom&&!b.ispage&&!b.isieold&&(d=document.createElement("div"),b.bind(d,"click",b.doZoom),b.zoom=f(d),b.zoom.css({cursor:"pointer",
"z-index":b.opt.zindex,backgroundImage:"url("+t+"zoomico.png)",height:18,width:18,backgroundPosition:"0px 0px"}),b.opt.dblclickzoom&&b.bind(b.win,"dblclick",b.doZoom),b.cantouch&&b.opt.gesturezoom))b.ongesturezoom=function(c){c.scale>1.5&&b.doZoomIn(c);c.scale<0.8&&b.doZoomOut(c);return b.cancelEvent(c)},b.bind(b.win,"gestureend",b.ongesturezoom);b.ispage?(c.css({position:"fixed",top:"0px",right:"0px",height:"100%"}),b.body.append(c)):b.ishwscroll?(b.win.css("position")=="static"&&b.css(b.win,{position:"relative"}),
d=b.win[0].nodeName=="HTML"?b.body:b.win,b.zoom&&(b.zoom.css({position:"absolute",top:1,right:0,"margin-right":c.width+4}),d.append(b.zoom)),c.css({position:"absolute",top:0,right:0}),d.append(c)):(c.css({position:"absolute"}),b.zoom&&b.zoom.css({position:"absolute"}),b.updateScrollBar(),b.body.append(c),b.zoom&&b.body.append(b.zoom));if(b.opt.autohidemode===false)b.autohidedom=false;else if(b.opt.autohidemode===true)b.autohidedom=b.rail;else if(b.opt.autohidemode=="cursor")b.autohidedom=b.cursor;
b.bind(window,"resize",b.onResize);b.bind(window,"orientationchange",b.onResize);!b.ispage&&b.opt.boxzoom&&b.bind(window,"resize",b.resizeZoom);b.istextarea&&b.bind(b.win,"mouseup",b.onResize);b.onResize();b.cantouch||b.opt.touchbehavior?(b.scrollmom={y:new w(b)},b.onmousedown=function(c){if(!b.locked&&(b.cancelScroll(),b.rail.drag={x:c.screenX,y:c.screenY,sx:b.scroll.x,sy:b.scroll.y,st:b.getScrollTop()},b.hasmoving=false,b.scrollmom.y.reset(c.screenY),!b.cantouch))return b.cancelEvent(c)},b.onmouseup=
function(c){if(b.rail.drag&&(b.scrollmom.y.doMomentum(),b.rail.drag=false,b.hasmoving))return b.hideCursor(),b.cancelEvent(c)},b.onclick=function(c){if(b.hasmoving)return b.cancelEvent(c)},b.onmousemove=function(c){if(b.rail.drag){b.hasmoving=true;var d=c.screenY,g=b.rail.drag.st-(c.screenY-b.rail.drag.y);if(b.ishwscroll)g<0?(g=Math.round(g/2),d=0):g>b.page.maxh&&(g=b.page.maxh+Math.round((g-b.page.maxh)/2),d=0);else if(g<0&&(g=0),g>b.page.maxh)g=b.page.maxh;b.showCursor(g);b.prepareTransition&&b.prepareTransition(0);
b.setScrollTop(g);b.scrollmom.y.update(d);return b.cancelEvent(c)}},b.cursorgrabvalue&&(b.css(b.ispage?b.doc:b.win,{cursor:b.cursorgrabvalue}),b.css(b.rail,{cursor:b.cursorgrabvalue}))):(b.onmousedown=function(c){if(b.locked)return b.cancelEvent(c);b.cancelScroll();b.rail.drag={x:c.screenX,y:c.screenY,sx:b.scroll.x,sy:b.scroll.y};return b.cancelEvent(c)},b.onmouseup=function(c){if(b.rail.drag)return b.rail.drag=false,b.cancelEvent(c)},b.onmousemove=function(c){if(b.rail.drag){b.scroll.y=b.rail.drag.sy+
(c.screenY-b.rail.drag.y);if(b.scroll.y<0)b.scroll.y=0;var d=b.scrollvaluemax;if(b.scroll.y>d)b.scroll.y=d;b.showCursor();b.cursorfreezed=true;b.doScroll(Math.round(b.scroll.y*b.scrollratio.y));return b.cancelEvent(c)}else b.checkarea=true});(b.cantouch||b.opt.touchbehavior)&&b.bind(b.win,"mousedown",b.onmousedown);b.bind(b.win,"mouseup",b.onmouseup);b.bind(b.cursor,"mousedown",b.onmousedown);b.bind(b.cursor,"mouseup",function(c){b.rail.drag=false;b.hasmoving=false;b.hideCursor();return b.cancelEvent(c)});
b.bind(document,"mouseup",b.onmouseup);b.bind(document,"mousemove",b.onmousemove);b.onclick&&b.bind(document,"click",b.onclick);b.cantouch||(b.rail.mouseenter(function(){b.showCursor();b.rail.active=true}),b.rail.mouseleave(function(){b.rail.active=false;b.rail.drag||b.hideCursor()}),b.isiframe||b.bind(b.isie&&b.ispage?document:b.docscroll,"mousewheel",b.onmousewheel),b.bind(b.rail,"mousewheel",b.onmousewheel));b.zoom&&(b.zoom.mouseenter(function(){b.showCursor();b.rail.active=true}),b.zoom.mouseleave(function(){b.rail.active=
false;b.rail.drag||b.hideCursor()}));!b.ispage&&!b.cantouch&&!/HTML|BODY/.test(b.win[0].nodeName)&&(b.win.attr("tabindex")||b.win.attr({tabindex:r++}),b.win.focus(function(c){l=b.getTarget(c).id||true;b.hasfocus=true;b.noticeCursor()}),b.win.blur(function(){l=false;b.hasfocus=false}),b.win.mouseenter(function(c){o=b.getTarget(c).id||true;b.hasmousefocus=true;b.noticeCursor()}),b.win.mouseleave(function(){o=false;b.hasmousefocus=false}));b.onkeypress=function(c){if(b.locked&&b.page.maxh==0)return true;
var c=c?c:window.e,d=b.getTarget(c);if(d&&/INPUT|TEXTAREA|SELECT|OPTION/.test(d.nodeName)&&(!d.getAttribute("type")&&!d.type||!/submit|button|cancel/i.tp))return true;if(b.hasfocus||b.hasmousefocus&&!l||b.ispage&&!l&&!o){d=c.keyCode;if(b.locked&&d!=27)return b.cancelEvent(c);var g=false;switch(d){case 38:case 63233:b.doScrollBy(72);g=true;break;case 40:case 63235:b.doScrollBy(-72);g=true;break;case 33:case 63276:b.doScrollBy(b.view.h);g=true;break;case 34:case 63277:b.doScrollBy(-b.view.h);g=true;
break;case 36:case 63273:b.doScrollTo(0);g=true;break;case 35:case 63275:b.doScrollTo(b.page.maxh);g=true;break;case 27:b.zoomactive&&(b.doZoom(),g=true)}if(g)return b.cancelEvent(c)}};b.bind(document,b.isopera?"keypress":"keydown",b.onkeypress)}if(this.doc[0].nodeName=="IFRAME"){var e=function(){b.iframexd=false;try{var c="contentDocument"in this?this.contentDocument:this.contentWindow.document}catch(d){b.iframexd=true,c=false}if(b.iframexd)return true;if(b.isiframe)b.iframe={html:b.doc.contents().find("html")[0],
body:b.doc.contents().find("body")[0]},b.docscroll=f(this.contentWindow);if(b.opt.iframeautoresize&&!b.isiframe){b.win.scrollTop(0);b.doc.height("");var g=Math.max(c.getElementsByTagName("html")[0].scrollHeight,c.body.scrollHeight);b.doc.height(g)}b.onResize();b.isie7&&b.css(f(c).find("html"),{"overflow-y":"hidden"});b.css(f(c.body),{"overflow-y":"hidden"});"contentWindow"in this?b.bind(this.contentWindow,"scroll",b.onscroll):b.bind(c,"scroll",b.onscroll);b.bind(c,"mouseup",b.onmouseup);b.bind(c,
"mousewheel",b.onmousewheel);b.bind(c,b.isopera?"keypress":"keydown",b.onkeypress);if(b.cantouch||b.opt.touchbehavior)b.bind(c,"mousedown",b.onmousedown),b.cursorgrabvalue&&b.css(f(c.body),{cursor:b.cursorgrabvalue});b.bind(c,"mousemove",b.onmousemove);b.zoom&&(b.opt.dblclickzoom&&b.bind(c,"dblclick",b.doZoom),b.ongesturezoom&&b.bind(c,"gestureend",b.ongesturezoom))};this.doc[0].readyState&&this.doc[0].readyState=="complete"&&setTimeout(function(){e.call(b.doc[0],false)},500);b.bind(this.doc,"load",
e)}};this.showCursor=function(c){if(b.cursortimeout)clearTimeout(b.cursortimeout),b.cursortimeout=0;if(b.rail){b.autohidedom&&b.autohidedom.stop().css({opacity:b.opt.cursoropacitymax});if(typeof c!="undefined")b.scroll.y=Math.round(c*1/b.scrollratio.y);b.cursor.css({height:b.cursorheight,top:b.scroll.y});b.zoom&&b.zoom.stop().css({opacity:b.opt.cursoropacitymax})}};this.hideCursor=function(c){if(!b.cursortimeout&&b.rail&&b.autohidedom)b.cursortimeout=setTimeout(function(){b.rail.active||(b.autohidedom.stop().animate({opacity:b.opt.cursoropacitymin}),
b.zoom&&b.zoom.stop().animate({opacity:b.opt.cursoropacitymin}));b.cursortimeout=0},c||400)};this.noticeCursor=function(c,d){b.showCursor(d);b.hideCursor(c)};this.getContentSize=function(){return b.ispage?{w:Math.max(document.body.scrollWidth,document.documentElement.scrollWidth),h:Math.max(document.body.scrollHeight,document.documentElement.scrollHeight)}:b.haswrapper?{w:b.doc.outerWidth()+parseInt(b.win.css("paddingLeft"))+parseInt(b.win.css("paddingRight")),h:b.doc.outerHeight()+parseInt(b.win.css("paddingTop"))+
parseInt(b.win.css("paddingBottom"))}:b.iframe?{w:Math.max(b.iframe.html.scrollWidth,b.iframe.body.scrollWidth),h:Math.max(b.iframe.html.scrollHeight,b.iframe.body.scrollHeight)}:{w:b.docscroll[0].scrollWidth,h:b.docscroll[0].scrollHeight}};this.resize=this.onResize=function(c,d){if(!b.haswrapper&&!b.ispage){var e=b.win.css("display")!="none";e&&!b.visibility&&b.show();!e&&b.visibility&&b.hide();if(!b.visibility)return false}b.view={w:b.ispage?b.win.width():b.win.innerWidth(),h:b.ispage?b.win.height():
b.win.innerHeight()};b.page=d?d:b.getContentSize();b.page.maxh=Math.max(0,b.page.h-b.view.h);if(b.page.maxh==0)return b.hide(),b.scrollvaluemax=0,b.scroll.y=0,b.scrollratio={x:0,y:0},b.cursorheight=0,b.locked=true,b.setScrollTop(0),false;else b.visibility||b.show();b.locked=false;b.istextarea&&b.win.css("resize")&&b.win.css("resize")!="none"&&(b.view.h-=20);b.ispage||b.updateScrollBar(b.view);b.cursorheight=Math.min(b.view.h,Math.round(b.view.h*(b.view.h/b.page.h)));b.cursorheight=Math.max(b.opt.cursorminheight,
b.cursorheight);b.scrollvaluemax=b.view.h-b.cursorheight-b.cursor.hborder;b.scrollratio={x:0,y:b.page.maxh/b.scrollvaluemax};b.getScrollTop()>b.page.maxh?b.doScroll(b.page.maxh):(b.scroll.y=Math.round(b.getScrollTop()*(1/b.scrollratio.y)),b.noticeCursor());return b};this._bind=function(c,d,e,f){b.events.push({e:c,n:d,f:e});c.addEventListener?c.addEventListener(d,e,f||false):c.attachEvent?c.attachEvent("on"+d,e):c["on"+d]=e};this.bind=function(c,d,e,f){var h="jquery"in c?c[0]:c;h.addEventListener?
(b.cantouch&&/mouseup|mousedown|mousemove/.test(d)&&b._bind(h,d=="mousedown"?"touchstart":d=="mouseup"?"touchend":"touchmove",function(b){if(b.touches.length<2){var c=b.touches.length>0?b.touches[0]:b;c.original=b;e.call(this,c)}},f||false),b._bind(h,d,e,f||false),d=="mousewheel"&&b._bind(h,"DOMMouseScroll",e,f||false),b.cantouch&&d=="mouseup"&&b._bind(h,"touchcancel",e,f||false)):b._bind(h,d,function(c){if((c=c||window.event||false)&&c.srcElement)c.target=c.srcElement;return e.call(h,c)===false||
f===false?b.cancelEvent(c):true})};this._unbind=function(b,d,e){b.removeEventListener?b.removeEventListener(d,e,false):b.detachEvent?b.detachEvent("on"+d,e):b["on"+d]=false};this.unbindAll=function(){for(var c=0;c<b.events.length;c++){var d=b.events[c];b._unbind(d.e,d.n,d.f)}};this.cancelEvent=function(c){c=b.cantouch?c.original?c.original:c||false:c?c:window.event||false;if(!c)return false;c.stopPropagation&&c.stopPropagation();c.preventDefault&&c.preventDefault();c.cancelBubble=true;c.cancel=true;
return c.returnValue=false};this.show=function(){b.visibility=true;b.rail.css("display","block");return b};this.hide=function(){b.visibility=false;b.rail.css("display","none");return b};this.remove=function(){b.doZoomOut();b.unbindAll();b.events=[];b.rail.remove();b.zoom&&b.zoom.remove();b.cursor=false;b.rail=false;b.zoom=false;for(var c=0;c<b.saved.css.length;c++){var d=b.saved.css[c];d[0].css(d[1],typeof d[2]=="undefined"?"":d[2])}b.saved=false;b.me.data("__nicescroll","");return b};this.isScrollable=
function(b){for(b=b.target?b.target:b;b&&b.nodeName&&!/BODY|HTML/.test(b.nodeName);){var d=f(b);if(/scroll|auto/.test(d.css("overflowY")||d.css("overflow")||""))return b.clientHeight!=b.scrollHeight;b=b.parentNode?b.parentNode:false}return false};this.onmousewheel=function(c){if(b.locked&&b.page.maxh==0)return true;if(b.opt.preservenativescrolling&&b.checkarea)b.checkarea=false,b.nativescrollingarea=b.isScrollable(c);if(b.nativescrollingarea)return true;if(b.locked)return b.cancelEvent(c);if(b.rail.drag)return b.cancelEvent(c);
var d=0;if(d=c.detail?c.detail*-1:c.wheelDelta/40)b.scrollmom&&b.scrollmom.y.stop(),b.doScrollBy(d*b.opt.mousescrollstep);return b.cancelEvent(c)};this.stop=function(){b.cancelScroll();b.scrollmon&&b.scrollmon.stop();b.cursorfreezed=false;b.scroll.y=Math.round(b.getScrollTop()*(1/b.scrollratio.y));b.noticeCursor();return b};b.ishwscroll&&b.hastransition&&b.opt.usetransition?(this.prepareTransition=function(c){var d=Math.round(b.opt.scrollspeed*10),c=Math.min(d,Math.round(c/20*b.opt.scrollspeed)),
d=c>20?b.prefixstyle+"transform "+c+"ms ease-out 0s":"";if(!b.lasttransitionstyle||b.lasttransitionstyle!=d)b.lasttransitionstyle=d,b.doc.css(b.transitionstyle,d);return c},this.doScroll=function(c,d){var e=b.getScrollTop();if(c<0&&e<=0)return b.noticeCursor();else if(c>b.page.maxh&&e>=b.page.maxh)return b.checkContentSize(),b.noticeCursor();b.newscrolly=c;b.newscrollspeed=d||false;if(b.timer)return false;if(!b.scrollendtrapped)b.scrollendtrapped=true,b.bind(b.doc,b.transitionend,b.onScrollEnd,false);
b.timer=setTimeout(function(){var c=b.getScrollTop(),c=b.newscrollspeed?b.newscrollspeed:Math.abs(c-b.newscrolly),d=b.prepareTransition(c);b.timer=setTimeout(function(){if(b.newscrolly<0&&!b.opt.bouncescroll)b.newscrolly=0;else if(b.newscrolly>b.page.maxh&&!b.opt.bouncescroll)b.newscrolly=b.page.maxh;if(b.newscrolly==b.getScrollTop())b.timer=0,b.onScrollEnd();else{var c=b.getScrollTop();b.timerscroll&&b.timerscroll.tm&&clearInterval(b.timerscroll.tm);if(d>0&&(b.timerscroll={ts:(new Date).getTime(),
s:b.getScrollTop(),e:b.newscrolly,sp:d,bz:new BezierClass(c,b.newscrolly,d,0,1,0,1)},!b.cursorfreezed))b.timerscroll.tm=setInterval(function(){b.showCursor(b.getScrollTop())},60);b.setScrollTop(b.newscrolly);b.timer=0}},15)},b.opt.scrollspeed)},this.cancelScroll=function(){if(!b.scrollendtrapped)return true;var c=b.getScrollTop();b.scrollendtrapped=false;b._unbind(b.doc,b.transitionend,b.onScrollEnd);b.prepareTransition(0);b.setScrollTop(c);b.timerscroll&&b.timerscroll.tm&&clearInterval(b.timerscroll.tm);
b.timerscroll=false;b.cursorfreezed=false;b.noticeCursor(false,c);return b},this.onScrollEnd=function(){b.scrollendtrapped=false;b._unbind(b.doc,b.transitionend,b.onScrollEnd);b.timerscroll&&b.timerscroll.tm&&clearInterval(b.timerscroll.tm);b.timerscroll=false;b.cursorfreezed=false;var c=b.getScrollTop();b.setScrollTop(c);b.noticeCursor(false,c);c<0?b.doScroll(0,60):c>b.page.maxh&&b.doScroll(b.page.maxh,60)}):(this.doScroll=function(c){function d(){if(b.cancelAnimationFrame)return true;if(h=1-h)return b.timer=
m(d)||1;var c=b.getScrollTop(),e=b.bzscroll?b.bzscroll.getNow():b.newscrolly,c=e-c;if(c<0&&e<b.newscrolly||c>0&&e>b.newscrolly)e=b.newscrolly;b.setScrollTop(e);e==b.newscrolly?(b.timer=0,b.cursorfreezed=false,b.bzscroll=false,e<0?b.doScroll(0):e>b.page.maxh&&b.doScroll(b.page.maxh)):b.timer=m(d)||1}var e=b.getScrollTop();b.newscrolly=c;if(!b.bouncescroll)if(b.newscrolly<0){if(b.newspeedy)b.newspeedy.x=0;b.newscrolly=0}else if(b.newscrolly>b.page.maxh){if(b.newspeedy)b.newspeedy.x=b.page.maxh;b.newscrolly=
b.page.maxh}var f=Math.floor(Math.abs(c-e)/40);f>0?(f=Math.min(10,f)*100,b.bzscroll=b.bzscroll?b.bzscroll.update(c,f):new BezierClass(e,c,f,0,1,0,1)):b.bzscroll=false;if(!b.timer){e==b.page.maxh&&c>=b.page.maxh&&b.checkContentSize();var h=1;b.cancelAnimationFrame=false;b.timer=1;d();e==b.page.maxh&&c>=e&&b.checkContentSize();b.noticeCursor()}},this.cancelScroll=function(){b.timer&&n(b.timer);b.timer=0;b.bzscroll=false;return b});this.doScrollBy=function(c,d){var e=0,e=d?Math.floor((b.scroll.y-c)*
b.scrollratio.y):(b.timer?b.newscrolly:b.getScrollTop(true))-c;if(b.bouncescroll){var f=Math.round(b.view.h/2);e<-f?e=-f:e>b.page.maxh+f&&(e=b.page.maxh+f)}b.cursorfreezed=false;b.doScroll(e)};this.doScrollTo=function(c,d){d&&Math.round(c*b.scrollratio.y);b.cursorfreezed=false;b.doScroll(c)};this.checkContentSize=function(){var c=b.getContentSize();c.h!=b.page.h&&b.resize(false,c)};b.onscroll=function(){b.rail.drag||b.cursorfreezed||b.delayed("onscroll",function(){b.scroll.y=Math.round(b.getScrollTop()*
(1/b.scrollratio.y));b.noticeCursor()},30)};b.bind(b.docscroll,"scroll",b.onscroll);this.doZoomIn=function(c){if(!b.zoomactive){b.zoomactive=true;b.zoomrestore={style:{}};var d="position,top,left,zIndex,backgroundColor,marginTop,marginBottom,marginLeft,marginRight".split(","),e=b.win[0].style,h;for(h in d){var i=d[h];b.zoomrestore.style[i]=typeof e[i]!="undefined"?e[i]:""}b.zoomrestore.style.width=b.win.css("width");b.zoomrestore.style.height=b.win.css("height");b.zoomrestore.padding={w:b.win.outerWidth()-
b.win.width(),h:b.win.outerHeight()-b.win.height()};if(b.isios4)b.zoomrestore.scrollTop=f(window).scrollTop(),f(window).scrollTop(0);b.win.css({position:b.isios4?"absolute":"fixed",top:0,left:0,"z-index":b.opt.zindex+100,margin:"0px"});d=b.win.css("backgroundColor");(d==""||/transparent|rgba\(0, 0, 0, 0\)|rgba\(0,0,0,0\)/.test(d))&&b.win.css("backgroundColor","#fff");b.rail.css({"z-index":b.opt.zindex+110});b.zoom.css({"z-index":b.opt.zindex+112});b.zoom.css("backgroundPosition","0px -18px");b.resizeZoom();
return b.cancelEvent(c)}};this.doZoomOut=function(c){if(b.zoomactive)return b.zoomactive=false,b.win.css("margin",""),b.win.css(b.zoomrestore.style),b.isios4&&f(window).scrollTop(b.zoomrestore.scrollTop),b.rail.css({"z-index":b.ispage?b.opt.zindex:b.opt.zindex+2}),b.zoom.css({"z-index":b.opt.zindex}),b.zoomrestore=false,b.zoom.css("backgroundPosition","0px 0px"),b.onResize(),b.cancelEvent(c)};this.doZoom=function(c){return b.zoomactive?b.doZoomOut(c):b.doZoomIn(c)};this.resizeZoom=function(){if(b.zoomactive){var c=
b.getScrollTop();b.win.css({width:f(window).width()-b.zoomrestore.padding.w+"px",height:f(window).height()-b.zoomrestore.padding.h+"px"});b.onResize();b.setScrollTop(Math.min(b.page.maxh,c))}};this.init()},w=function(e){var d=this;this.nc=e;this.lasttime=this.speedy=this.lasty=0;this.snapy=false;this.timer=this.demuly=0;this.time=function(){return(new Date).getTime()};this.reset=function(b){d.stop();d.lasttime=d.time();d.speedy=0;d.lasty=b};this.update=function(b){d.lasttime=d.time();var f=b-d.lasty,
i=e.getScrollTop()+f;d.snapy=i<0||i>d.nc.page.maxh;d.speedy=f;d.lasty=b};this.stop=function(){if(d.timer)clearTimeout(d.timer),d.timer=0};this.doSnapy=function(b){b<0?d.nc.doScroll(0,60):b>d.nc.page.maxh&&d.nc.doScroll(d.nc.page.maxh,60)};this.doMomentum=function(){var b=d.lasttime,e=d.time();d.speedy=Math.min(60,d.speedy);if(d.speedy&&b&&e-b<=50&&d.speedy){var f=e-b,k=d.nc.page.maxh;d.demuly=0;var l=function(){var b=Math.floor(d.nc.getScrollTop()-d.speedy*(1-d.demuly));d.demuly+=b<0||b>k?0.08:0.01;
d.nc.setScrollTop(b);d.nc.showCursor(b);d.demuly<1?d.timer=setTimeout(l,f):(d.timer=0,d.nc.hideCursor(),d.doSnapy(b))};l()}else d.snapy&&d.doSnapy(d.nc.getScrollTop())}},k=jQuery.fn.scrollTop;f.cssHooks.scrollTop={get:function(e){var d=f.data(e,"__nicescroll")||false;return d&&d.ishwscroll?d.getScrollTop():k.call(e)},set:function(e,d){var b=f.data(e,"__nicescroll")||false;b&&b.ishwscroll?b.setScrollTop(parseInt(d)):k.call(e,d);return this}};f.fx.step.scrollTop=function(e){if(e.start=="")e.start=f.cssHooks.scrollTop.get(e.elem);
f.cssHooks.scrollTop.set(e.elem,e.now+e.unit)};jQuery.fn.scrollTop=function(e){if(typeof e=="undefined"){var d=this[0]?f.data(this[0],"__nicescroll")||false:false;return d&&d.ishwscroll?d.getScrollTop():k.call(this)}else return this.each(function(){var b=f.data(this,"__nicescroll")||false;b&&b.ishwscroll?b.setScrollTop(parseInt(e)):k.call(f(this),e)})};var q=function(e){var d=this;this.length=0;this.name="nicescrollarray";this.each=function(b){for(var e=0;e<d.length;e++)b.call(d[e]);return d};this.push=
function(b){d[d.length]=b;d.length++};this.eq=function(b){return d[b]};if(e)for(a=0;a<e.length;a++){var b=f.data(e[a],"__nicescroll")||false;b&&(this[this.length]=b,this.length++)}return this};(function(e,d,b){for(var f=0;f<d.length;f++)b(e,d[f])})(q.prototype,"show,hide,onResize,resize,remove,stop".split(","),function(e,d){e[d]=function(){return this.each(function(){this[d].call()})}});jQuery.fn.getNiceScroll=function(e){return typeof e=="undefined"?new q(this):f.data(this[e],"__nicescroll")||false};
jQuery.extend(jQuery.expr[":"],{nicescroll:function(e){return f.data(e,"__nicescroll")?true:false}});f.fn.niceScroll=function(e,d){typeof d=="undefined"&&typeof e=="object"&&!("jquery"in e)&&(d=e,e=false);var b=new q;typeof d=="undefined"&&(d={});if(e)d.doc=f(e),d.win=f(this);var h=!("doc"in d);if(!h&&!("win"in d))d.win=f(this);this.each(function(){var e=f(this).data("__nicescroll")||false;if(!e)d.doc=h?f(this):d.doc,e=new x(d,f(this)),f(this).data("__nicescroll",e);b.push(e)});return b.length==1?
b[0]:b}})(jQuery);
