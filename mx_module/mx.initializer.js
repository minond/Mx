"use strict";


mx.include.setmods = [ "component", "debug", "dom", "element", "helpers", "storage", "http", "url" ];



mx.include.module.dependency.url;
mx.include.module.dependency.helpers;
mx.include.module.dependency.debug;

mx.queue.action = function () {
	console.log(mx.url.load || mx.url.debug);
};
