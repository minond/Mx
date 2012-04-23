// NOTE: url and out are initialized in this script
"use strict";

// directory make structure
mx.include.directories[ mx.include.MODULE ] = "mx_module/mx.{%0}.js";
mx.include.directories[ mx.include.PROJECT ] = "mx_project/{%0}/{%1}";
mx.include.directories[ mx.include.COMPONENT ] = "mx_component/mx.{%0}.js";
mx.include.directories[ mx.include.DEPENDENCY ] = "mx_dependency/{%0}.js";

// default modules
mx.include.register("component", mx.include.MODULE);
mx.include.register("debug", mx.include.MODULE);
mx.include.register("dom", mx.include.MODULE);
mx.include.register("character", mx.include.MODULE);
mx.include.register("sound", mx.include.MODULE);
mx.include.register("events", mx.include.MODULE);
mx.include.register("file", mx.include.MODULE);
mx.include.register("url", mx.include.MODULE);
mx.include.register("http", mx.include.MODULE);
mx.include.register("storage", mx.include.MODULE);
mx.include.register("out", mx.include.MODULE);
mx.include.register("level", mx.include.MODULE);
mx.include.register("panel", mx.include.MODULE);
mx.include.register("enviroment", mx.include.MODULE_PARENT, mx);
mx.include.register("element", mx.include.MODULE, mx.include.module.enviroment);
mx.include.register("placement", mx.include.MODULE, mx.include.module.enviroment);
mx.include.register("movement", mx.include.MODULE, mx.include.module.enviroment);
mx.include.register("gravity", mx.include.MODULE, mx.include.module.enviroment);
mx.include.register("element", mx.include.MODULE, mx.include.module.enviroment);
mx.include.register("earth", mx.include.MODULE, mx.include.module.enviroment);

// add all modules to the global scope
mx.module.global = false;
mx.include.project_file = "main.js";

// mx depends on a few modules by default
// so those are loaded right away
// start with url
mx.include.module.url;

// get the project settings from the request url
// and set all the settings passed through the request url
mx.settings.project_name = mx.url.mx_parameter.load;
mx.settings.mass_merge(mx.url.mx_parameter);

// debug mode check
mx.include.module.debug;
mx.debug.settings.debugging = mx.settings.module.debug.debugging ?
	mx.settings.module.debug.debugging.bool : false;

// if not in debug mode, out messages are
// ignored and not sent anywhere
if (!mx.debug.settings.debugging) {
	mx.settings.module.set("out.message.route_to", mx.stack.anonymous);
	mx.settings.module.set("out.generate", false);
}

// then load out
mx.include.module.out;

// some default outputs
// current project's name
mx.out.register("project_name", {
	title: "Project Name"
});

// how log it took from loading mx to'
// loading the main project file
mx.out.register("project_load", {
	title: "Project Load Time",
	content: "{%0}ms"
});

// for the default initialize module method
mx.out.register("initialized_module", {
	title: "Module Initialized"
});

// log initialized modules
mx.out.initialized_module("out");
mx.out.initialized_module("url");
mx.out.initialized_module("debug");

// start gathering some of the load data
mx.settings.load_time = mx.debug.Timer(mx.settings.load_time);
mx.settings.project_load_error = "Could not load {%0:project}.";

// loaded project check
if (!mx.settings.project_name) {
	document.body.innerHTML = stringf(
		mx.settings.project_load_error
	);
}
else {
	// register it and load it
	mx.settings.project_load_success = mx.include.register(
		mx.settings.project_name, 
		mx.include.PROJECT
	);

	// finally output some of the loading information
	if (!mx.settings.project_load_success) {
		document.body.innerHTML = stringf(
			mx.settings.project_load_error,
			mx.settings.project_name
		);
	}
	else {
		mx.out.project_name(mx.settings.project_name);
		mx.out.project_load(mx.settings.load_time());	
	}
}
