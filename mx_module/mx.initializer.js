"use strict";


mx.include.setmods = [ "component", "debug", "dom", "element", "helpers", "storage", "http", "url" ];



mx.include.module.dependency.helpers;
mx.include.module.dependency.url;
mx.include.module.dependency.debug;

mx.queue.action = function () {
	mx.debug.time("load time");
	console.log(Template.stringf("loading {%0}", mx.__project__));
	mx.debug.time("load time");
};
