"use strict";


// NOTE: url and out are initialized in this script
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
mx.include.register("enviroment", mx.include.MODULE_PARENT, mx);
mx.include.register("element", mx.include.MODULE, mx.include.module.enviroment);
mx.include.register("placement", mx.include.MODULE, mx.include.module.enviroment);
mx.include.register("movement", mx.include.MODULE, mx.include.module.enviroment);
mx.include.register("gravity", mx.include.MODULE, mx.include.module.enviroment);
mx.include.register("element", mx.include.MODULE, mx.include.module.enviroment);

// mx depends on a few modules by default
// so those are loaded right away
mx.include.module.out;
mx.include.module.debug;
mx.include.module.url;

mx.out.initialize();
mx.debug.initialize();
mx.url.initialize();

// start gathering some of the load data
mx.settings.load_time = mx.debug.Timer(mx.settings.load_time);

// get the project settings from the request url
// and set all the settings passed through the request url
mx.settings.project_name = mx.url.mx_parameter.load;
mx.settings.mass_merge(mx.url.mx_parameter);

// if not in debug mode, out messages are
// ignored and not sent anywhere
if (!mx.settings.module.debug.debugging.bool) {
	mx.settings.module.set("out.message.route_to", mx.stack.anonymous);
}

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
	mx.out.project_name(mx.settings.project_name);
	mx.out.project_load(mx.settings.load_time());

	if (!mx.settings.project_load_success) {
		document.body.innerHTML = stringf(
			mx.settings.project_load_error,
			mx.settings.project_name
		);
	}
}
