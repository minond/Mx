"use strict";


mx.include.setmods = [
	"component",
	"debug", 
	"dom", 
	"element", 
	"helpers", 
	"storage", 
	"http", 
	"url", 
	"file", 
	"events"
];

mx.include.module.dependency.helpers;
mx.include.module.dependency.url;
mx.include.module.dependency.debug;

mx.debug.time("register to execute");
mx.message("loading {%0}", mx.__project__);
mx.include.project = mx.__project__;
mx.debug.time("register to execute");
