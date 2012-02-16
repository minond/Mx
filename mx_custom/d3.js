/* 3D models display/hide/init functions */
var d3 = {
	ran: false,

	run: function () {
		if (Mx.comp.threeD.ready) {
			d3.stop();
		}

		else {
			d3.start();
		}

		d3.ran = true;
	},

	start: function () {
		Mx.comp.threeD.init();

		if (Mx.comp.threeD.ready) {
			d3.btn.innerHTML = d3.btntxtoff;

			if (!d3.ran) {
				for (var model in d3.models) {
					(function () {
						var _model = model;
						var _id = d3.models[ model ];

						Mx.comp.panel.button(stringf("View {%0}", _model), function () {
							d3.view(_id);
						}).className += " " + d3.btncname;
					})();
				}
			}

			else {
				$("." + d3.btncname).show();
			}


			// instructions
			d3.view(d3.models['Big Cube']);
			Alert.alert(
				"<div style='font-size: 14px; text-align: left; padding-left: 90px'>" +
				"Click and drag to rotate the model.<br /><br />" + 
				"Shift+Drag moves the model around.</div>");
		}
	},

	stop: function () {
		Mx.comp.threeD.reset();
		d3.btn.innerHTML = d3.btntxton;
		$("." + d3.btncname).hide();
	},

	view: function (model) {
		var _3D;

		switch (model) {
			case d3.models['Nice Sphere']:
				_3D = CSG.sphere({
					center: [3, 4, 5],
					resolution: 40,
					radius: 5
				});

				break;


			case d3.models.Sphere:
				_3D = CSG.sphere({
					center: [1, 2, 3],
					resolution: 10,
					radius: 9
				});

				break;


			case d3.models['Big Cube']:
				_3D = CSG.cube({
					center: [0, 0, 0],
					radius: [15, 15, 15]
				});

				break;


			case d3.models.Cube:
				_3D = CSG.cube({
					center: [3, 2, 1],
					radius: [5, 5, 5]
				});

				break;
		}


		if (_3D) {
			Mx.comp.threeD.render(function () {
				return _3D;
			});
		}
	},

	models: manage.enum("Sphere", "Nice Sphere", "Cube", "Big Cube"),

	btntxton: "View 3D Models",

	btntxtoff: "Hide 3D Models",

	btncname: "d3_model_btn",

	btncsel: ".d3_model_btn",

	btn: null
}
