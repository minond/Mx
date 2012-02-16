"use strict";


// before moving forward, we'll modify our environment a little.
manage.as_global();
Template.stringf.as_global();

// create a new instance of the script loader
// with a smaller delay time.
Mx.resource = window.script.reset(75);


// used to both initialize modules and to also reset them.
Mx.resource.init = function (modreset, mainreset) {
	var msg = {
		pad: {
			lib: 33,
			test: 32
		},

		elem: {
			type: "div",
			id: "mx_out"
		},

		str: {
			blank: "",
			dot: "."
		},

		tmpl: {
			elem_id: "lib_{%0}",
			mxfile: "mx_lib/Mx.{%0}.js",
			$3dfile: "CSG/{%0}.js",
			jsfile: "mx_dep/{%0}.js",
			jqaddon: "mx_dep/jquery.{%0}.js",
			loading: "<span id='lib_{%0}'>loading {%0} {%1} </span><br />",
			complete: "<span class='mx_load_complete'>done<span>",
			pre: "<span>loading external files:</span><br />",
			testing: "<br /><span>loading complete, checking enviroment:</span><br />",
			components: "<br /><span>tests complete, loading project components:</span><br />",
			failtests: "<br /><span>looks like something is not working right or<br />did not load correctly, reseting game...</span><br />",
			images: "<br /><span>components loaded, loading images:</span><br />",
			start: "<br /><br /><span>images loaded and cached, running main.</span><br />",
			result: "<span>checking {%0} {%1} <span class='mx_test_case_{%2}'>{%2}</span></span><br />",
			rpass: "pass",
			rfail: "fail"
		}
	};


	var reqmods = Mx.internals.active_modules = {
		jQuery: stringf(msg.tmpl.jsfile, "jquery"),
		database: stringf(msg.tmpl.jsfile, "sql"),
		uxframes: stringf(msg.tmpl.jsfile, "frame1"),
		notifications: stringf(msg.tmpl.jsfile, "notify"),
		debuging: stringf(msg.tmpl.mxfile, "debugger"),
		storage: stringf(msg.tmpl.mxfile, "storage"),
		images: stringf(msg.tmpl.mxfile, "images"),
		scroller: stringf(msg.tmpl.jqaddon, "nicescroll.min"),
		dom: stringf(msg.tmpl.mxfile, "dom"),
		events: stringf(msg.tmpl.mxfile, "events"),
		queue: stringf(msg.tmpl.mxfile, "queue"),
		settings: Mx.internals.id.main.SETTINGS,
		tests: stringf(msg.tmpl.mxfile, "tests"),
		components: stringf(msg.tmpl.mxfile, "component"),
		helpers: stringf(msg.tmpl.mxfile, "slave"),
		LightGL: stringf(msg.tmpl.$3dfile, "lightgl"),
		CSG: stringf(msg.tmpl.$3dfile, "csg"),
		OpenJsCad: stringf(msg.tmpl.$3dfile, "openjscad")
	};


	// check if this is an initial load or a module reset/reload.
	// if we're doing a mod reset when reload only those mods, Mx, then main.
	// otherwise, go through the whole process.
	if (modreset) {
		Mx.resource.no_cache = true;
		Mx.resource.out_done = false;
		Mx.resource.out_start = false;

		modreset.forEach && modreset.forEach(function (mod) {
			Mx.resource.require(reqmods[ mod ], mod);
		});

		// we can also reset the main project right after
		// reseting the modules
		if (mainreset)
			Mx.resource.require(function () {
				Mx.resource.init.run(true);
			});

		return true;
	}


	var out = document.createElement(msg.elem.type);
	out.id = msg.elem.id;
	out.write = function (str) {
		out.innerHTML += str;
		out.scrollTop = 1000000;
	};

	out.writeln = function (str) {
		Mx.resource.require(function () {
			out.write(str);
		});
	};

	document.body.appendChild(out);

	var padding = out.padding = function (orig, len) {
		var dots = msg.str.blank,
			dot  = msg.str.dot;

		for (var i = 0; i < len - orig.length; i++)
			dots += dot;

		return dots;
	};



	// loader settings
	Mx.resource.no_cache = true;
	Mx.resource.out_start = function (node, lib) { 
		out.write(
			Template.stringf(msg.tmpl.loading, lib, padding(lib, msg.pad.lib))
		);
	};
	Mx.resource.out_done = function (node, lib) { 
		document.getElementById( Template.stringf(msg.tmpl.elem_id, lib) ).innerHTML += msg.tmpl.complete;
	};

	Mx.resource.require(function () {
		Mx.resource.init.pre(out, msg);
	});

	for (var mod in reqmods)
		Mx.resource.require(reqmods[ mod ], mod);

	Mx.resource.require(function () {
		Mx.resource.init.post(out, msg);
	});
};



// this is queued before loading the project
Mx.resource.init.pre = function (out, msg) {
	// update the doc title
	Mx.resource.init.show_status( Mx.resource.init.statuses.LOADING );

	out.writeln(msg.tmpl.pre);
};


// this is queued after loading the project
Mx.resource.init.post = function (out, msg) {
	Mx.internals.ready = true;
	out.writeln(msg.tmpl.testing);
	Mx.resource.init.show_status( Mx.resource.init.statuses.TESTING );

	for (var test in Mx.internals.tests) {
		out.writeln(
			Template.stringf(
				msg.tmpl.result,
				test,
				out.padding(test, msg.pad.test),
				Mx.internals.tests[ test ] ? msg.tmpl.rpass : msg.tmpl.rfail
			)
		);

		Mx.internals.ready = Mx.internals.ready && !!Mx.internals.tests[ test ];
	}


	if (!Mx.internals.ready) {
		out.writeln(msg.tmpl.failtests);
		Mx.resource.require(function () {
			setTimeout(function () {
				window.location.reload(true);
			}, 2000);
		});
		return false;
	}


	setTimeout(function () {
		out.writeln(msg.tmpl.components);

		// get all components
		Mx.internals.components.forEach(function (comp) {
			if (comp) {
				Mx.resource.require( Template.stringf(
					Mx.internals.components.root, comp
				), comp );
			}
		});

		// and get all images
		out.writeln(msg.tmpl.images);
		(function re_image_loading (imgobj, father, mother) {
			if (m(imgobj).is_object) {
				for (var img in imgobj)
					re_image_loading(imgobj[img], father || img, img);
			}

			else if (m(imgobj).is_string) {
				if (Mx.internals.id.images.ignore.indexOf(mother) < 0)
					Mx.resource.require(function () {
						var reset = new Image;
						var cache = new Image;
						var src = Mx.image.map.root + Mx.image.map[ father ].root + imgobj;

						Mx.resource.out_start(src, imgobj);
						reset.src = src + "?" + Date.now();
						cache.src = src;
						Mx.resource.out_done(src, imgobj);
					});
			}
		})(Mx.image.map);

		Mx.resource.require(function () {
			Mx.resource.init.ready(out, msg);
		});
	}, 500);
};


// this runs after the post function checks all the tests
// and everything has passed.
// should initialize the Mx library.
Mx.resource.init.ready = function (out, msg) {
	out.writeln(msg.tmpl.start);
	setTimeout(function () {
		Mx.resource.init.run();
	}, 1000);

	// update the doc title
	Mx.resource.init.show_status( Mx.resource.init.statuses.RUNNING );
};


// helper function for updating the document's title
// with the current project's name and it's status
Mx.resource.init.show_status = function (stat) {
	// update the doc title
	document.title = stringf("Mx Project ({%0:game}:{%1:idle})", Game.project, stat);
};

// consts for show_status function
Mx.resource.init.statuses = manage.const("running", "loading", "testing");


// loads and runs setup and main
// also deletes the output div holding
// the loading and startup messages.
Mx.resource.init.run = function (reset) {
    var msg = "running {%0}...";
    setTimeout(function () {
        $( Mx.internals.id.out.id ).remove();

        setTimeout(function () {
            script.no_cache = true;
            script.out_start = false;
            script.out_done = false;
            script.require(Mx.internals.id.main.PROJECT);
            script.require(function () {
                setTimeout(function () {
                    if (Mx.internals.id.main.SETUP in window) {
                        Mx.debug.logf(msg, Mx.internals.id.main.SETUP);
                        window[ Mx.internals.id.main.SETUP ].call(Mx, reset || false);
                    }

                    if (Mx.internals.id.main.MAIN in window) {
                        Mx.debug.logf(msg, Mx.internals.id.main.MAIN);
                        window[ Mx.internals.id.main.MAIN ].call(Mx, reset || false);
                    }
            }, 300);
            });
        }, 500);
    }, 200);
};



// style
Mx.resource.style = function (cssurl) {
	var css = document.createElement("link");
	css.setAttribute("rel", "stylesheet");
	css.type = "text/css";
	css.href = cssurl;
	document.getElementsByTagName("head")[0].appendChild( css );
};


// go
Mx.resource.style("mx_style/mx_default_styles.css");
Mx.resource.init();
