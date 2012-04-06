"use strict";

mx.include.register("component", mx.include.MODULE);
mx.include.register("debug", mx.include.MODULE);
mx.include.register("dom", mx.include.MODULE);
mx.include.register("enviroment", mx.include.MODULE_PARENT);
mx.include.register("element", mx.include.MODULE, mx.include.module.enviroment);
mx.include.register("placement", mx.include.MODULE, mx.include.module.enviroment);
mx.include.register("movement", mx.include.MODULE, mx.include.module.enviroment);
mx.include.register("gravity", mx.include.MODULE, mx.include.module.enviroment);
mx.include.register("element", mx.include.MODULE, mx.include.module.enviroment);
mx.include.register("character", mx.include.MODULE, mx.include.module.enviroment);
mx.include.register("sound", mx.include.MODULE);
mx.include.register("events", mx.include.MODULE);
mx.include.register("file", mx.include.MODULE);
mx.include.register("url", mx.include.MODULE);
mx.include.register("http", mx.include.MODULE);
mx.include.register("storage", mx.include.MODULE);
mx.include.register("helpers", mx.include.MODULE);


mx.include.register("sample_module", mx.include.MODULE);


/*
mx.include.module.debug;
mx.include.module.url;

mx.load_time = new mx.debug.Timer(mx.load_time);
mx.include.project(mx.settings.project);
mx.out.project_name(mx.settings.project);
mx.out.time({ name: "project load", time: mx.load_time() });
*/
