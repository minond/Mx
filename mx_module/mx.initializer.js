"use strict";


mx.include.setmods([
	"component",
	"debug", 
	"dom", 
	"element", 
	"helpers", 
	"storage", 
	"http", 
	"url", 
	"file", 
	"events",
	"character",
	"gravity",
	"movement",
	"placement",
	"sound"
]);

mx.include.module.dependency.debug;
mx.include.module.dependency.helpers;
mx.include.module.dependency.url;
mx.include.module.dependency.out;

var load_time = new mx.debug.Timer;

mx.include.project(mx.settings.project);
mx.out.project_name(mx.settings.project);
mx.out.time({ name: "project load", time: load_time() });
