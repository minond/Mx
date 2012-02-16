"use strict";


(function () {
	var main = { name: "threeD", gview: null, ready: false };

	var view = main.view = document.createElement("div");

	var WEBGL_ERROR = 	"Looks like your browser doesn't support WebGL, " +
						"which is required to view 3D models.<br><br>" +
						"Please try a different browser such as Google Chrome";

	var init = main.init = function (w, h) {
		view.id = "threeD_component_holder";
		document.body.appendChild(view);
		main.gview = new OpenJsCad.Viewer(view, w || innerWidth - 100, h || innerHeight - 100, 50);
		x(Mx.dom.viewport).style({ display: "none" });

		if (!main.gview.supported()) {
			Alert.alert(Template.build(Alert.settings.ltxt, WEBGL_ERROR), function () {
				reset(true);
			});
		}

		else
			main.ready = true;
	};

	var reset = main.reset = function (hard) {
		if (view.childNodes && view.childNodes.length) {
			while (view.childNodes.length) {
				view.removeChild( view.childNodes[0] );
			}

			document.body.removeChild( view );
			x(Mx.dom.viewport).style({ display: "" });
		}

		if (hard) {
			document.body.removeChild( view );
			x(Mx.dom.viewport).style({ display: "" });
		}

		main.ready = false;
	};

	var render = main.render = function (model_fn) {
		var update;

		if (main.ready) {
			update = new CSG();

			try {
				update = model_fn();
			}

			catch (e) {
				Mx.debug.log(e);
			}

			main.gview.setCsg( update );
		}
	};


	Mx.component.register(main);
})();

// sample:
// Mx.comp.threeD.init(500, 500);
// Mx.comp.threeD.render(function () { return CSG.sphere({ center: [1, 2, 3], radius: 5, resolution: 16 }); });
// Mx.comp.threeD.reset();
