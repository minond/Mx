"use strict";


mx.include.setmods = [ "component", "debug", "dom", "element", "helpers", "storage", "http", "url", "file" ];



mx.include.module.dependency.helpers;
mx.include.module.dependency.url;
mx.include.module.dependency.debug;

mx.queue.action = function () {
	mx.debug.time("load time");
	mx.message("loading {%0}", mx.__project__);
	mx.include.project = mx.__project__;
	mx.debug.time("load time");
};
