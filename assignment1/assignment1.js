// User input               done
// Image texture            done
// 3D model                 done
// Moving objects           done
// Collision detection
// Timer                    done
// A way to win


Mx.define("pname", "", String);
Mx.define("win", false, Boolean);
Mx.define("str_max_time", "one minute", String);
Mx.define("int_max_time", 60, Number);

Mx.define("pl1");
Mx.define("pl2");


Mx.image.init();
Mx.dom.init();
Mx.comp.panel.init();
Mx.comp.places.init();

Game.instructions =	"{%0}, help Mew get to Pidgey!<br /><br />" + 
					"You can use the arrow keys to move around." + 
					"<br /><br /><br />You have {%1}!";



function main () {
	Game.start();

	Mx.set.pl1 = Mx.image.factory("oldmew", "buildings");
	Mx.set.pl2 = Mx.image.factory("pidgey", "buildings");

	x( Mx.get.pl2 ).append().style({ "position": "absolute" });
	x( Mx.get.pl1 ).append().style({ "position": "absolute" });

	Mx.comp.places.center( Mx.get.pl1 );
	Mx.comp.places.random( Mx.get.pl2 );


	if (Mx.debug.DEBUG_MODE) {
		x( Mx.get.pl1 ).style( { "border": "1px solid salmon" });
		x( Mx.get.pl2 ).style( { "border": "1px solid salmon" });
	}
}



function setup (reset) {
	Mx.comp.panel.reset();
	Mx.comp.panel.append = Mx.comp.menu.init();
	Mx.comp.panel.append = Mx.comp.timer.init(Mx.get.int_max_time, Game.end);
	d3.btn = Mx.comp.panel.button(d3.btntxton, d3.run);

	Mx.dom.vp.reset();
	Mx.dom.vp.init();
	Mx.dom.vp.create();

	// Mx.queue.component("location");
}



Game.end = function end () {
	Mx.comp.timer.stop();

	if (!Mx.get("win")) {
		Alert.alert("Time is up");
	}

	else {
		Alert.alert("You win!");
	}
};



Game.start = function start () {
	var def = "Player 1";
	Game.running = true;

	if (Mx.debug.DEBUG_MODE) {
		Mx.set.pname = def;
		Mx.comp.places.listen( Mx.const.event.KEYDOWN );
		return false;
	}


	Mx.queue.out("What's your name?", function (click, txt) {
		Mx.set.pname = txt || def;

		if (click && Mx.get.pname) {
			Mx.queue.out(Template.build(Alert.settings.ltxt, 
			stringf(Game.instructions, Mx.get.pname, Mx.get.str_max_time)), function () {
				Mx.comp.timer.start();
				Mx.comp.places.listen( Mx.const.event.KEYDOWN );
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


// collisions
var movecount = 0;
Mx.comp.places.onaftermove = function (start, stop) {
	Mx.debug.log("onaftermove ran");

	if (!Game.running)
		return false;

	if (!Mx.get.pl1 || !Mx.get.pl2)
		return false;

	if (!Mx.get.pl1.father || !Mx.get.pl2.father)
		return false;

	if (!Mx.get.pl1.father.node || !Mx.get.pl2.father.node)
		return false;

	if (movecount++ < 1)
		return false;

	stop.node.className = "enviroment_grass";


	if (Mx.get.pl1.father.node === Mx.get.pl2.father.node) {
		Mx.set.win = true;
		Game.end();

		Mx.debug.log("collision detected");
	}
};
