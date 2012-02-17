// User input               done
// Image texture            done
// 3D model                 done
// Moving objects           in process
// Collision detection
// Timer                    done
// A way to win


Mx.define("pname", "", String);
Mx.define("win", false, Boolean);
Mx.define("str_max_time", "one minute", String);
Mx.define("int_max_time", 60, Number);
Mx.define("building");


Mx.image.init();
Mx.dom.init();
Mx.comp.panel.init();
Mx.comp.places.init();



function main () {
	Game.start();

	Mx.set.building = Mx.image.factory("blank", "buildings");


	x( Mx.get.building ).append()
		.style({
			"position": "absolute",
			"top": "12px",
			"left": "93px"
		});
}



function setup () {
	Mx.comp.panel.append = Mx.comp.menu.init();
	Mx.comp.panel.append = Mx.comp.timer.init(Mx.get.int_max_time, Game.end);
	d3.btn = Mx.comp.panel.button(d3.btntxton, d3.run);

	Mx.dom.vp.reset();
	Mx.dom.vp.init();
	Mx.dom.vp.create(800, 300);

	// Mx.queue.component("location");
}



Game.end = function end () {
	Mx.dom.vp.reset();

	if (!Mx.get("win")) {
		Alert.alert("Time is up");
	}

	else {
		Alert.alert("You win!");
	}
};



Game.start = function start () {
	var def = "Player 1";

	if (Mx.debug.DEBUG_MODE) {
		Mx.set.pname = def;
		return false;
	}


	Mx.queue.out("What's your name?", function (click, txt) {
		Mx.set.pname = txt || def;

		if (click && Mx.get.pname) {
			Mx.queue.out(Template.build(Alert.settings.ltxt, 
			stringf("{%0}, you have {%1} to....", Mx.get.pname, Mx.get.str_max_time)), function () {
				Mx.comp.timer.start();
			});
		}

		else {
			Alert.confirm("Quit?", function (click) {
				if (click) {
					Mx.dom.vp.reset();
					Mx.comp.panel.reset();
				}

				else {
					main();
				}
			});
		}
	});


	return true;
};
