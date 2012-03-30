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
mx.include.module.dependency.url;

mx.load_time = new mx.debug.Timer(mx.load_time);
mx.include.project(mx.settings.project);
mx.out.project_name(mx.settings.project);
mx.out.time({ name: "project load", time: mx.load_time() });
