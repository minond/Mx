// load needed modules for this game
mx.include.module.dom;
mx.include.module.level;
mx.include.module.enviroment.element;
mx.include.module.enviroment.earth;
mx.include.module.character;
mx.include.module.panel;

var GAME_ID = mh.random();
var DONE = false;

var HEIGHT = mx.dom.settings.enviromentport.dimension.height;
var WIDTH = mx.dom.settings.enviromentport.dimension.width;
var P_OFFSET = HEIGHT - 9;
var G_OFFSET = HEIGHT - 2;


// resources
// ========================================================================

// load used character elements
mx.Character.load("alien", "bullet", "coin", "picard");

// load sayings
var lines = mx.file.ini_parse(mx.file.read(stringf(
	mx.include.directories.project,
	mx.settings.project_name, "lines.ini"
)));

// load some sound files
mx.sound.register("chaching.mp3");
mx.sound.chaching.volume = .2;


// main character
// ========================================================================

// initialize Captain Jean-Luc Picard character and
// make him the main character
var player = new mx.Character.picard(true, true, [0, P_OFFSET]);

if (mx.http.async_get("mx_server/ping.php") === "1") {
	mx.Character.register(GAME_ID);
}

// goals
// ========================================================================

// create a timer element that goes on
// for five minutes
var timer = mx.panel.Timer(45, function () {
	Alert.message(lines.lose);

	// hide all coins
	mh.for_each(coins, function (i, coin) {
		coin.hide();
	});

	// clear the ports
	setTimeout(function () {
		level[1].clear();
	}, 1000);
});

// and a point tracker
var points = mx.panel.Points();


// world
// ========================================================================

// create a world and a sample level
var level = new mx.Level(1);
level[1] = new mx.enviroment.Earth("level_1");

// sky and ground
mh.for_each(mx.enviroment.Earth.section(), function (i, coor) {
	if (coor[1] === HEIGHT - 1)
		level[1].draw(coor, "rock");
	else
		level[1].draw(coor, "sky");
});

// mountains
level[1].piramid(16, 41, G_OFFSET, "mountain");
level[1].piramid(24, 50, G_OFFSET, "mountain");
level[1].piramid(12, 67, G_OFFSET, "mountain");

// flag
var flag = level[1].flag(WIDTH - 3, G_OFFSET, "flag_footer", "flag_pole", "flag");


// points
// ========================================================================

// add coins
var coins = [];
for (var i = 0; i < 10; i++) {
	coins[i] = new mx.Character.coin(true);

	mx.enviroment.placement.place(
		coins[i], 
		[ Math.floor( Math.random() * WIDTH ), 0 ], 
		true
	);
}

mx.enviroment.movement.used_callback = function (offset) {
	// check what we're touching
	for (var i = 0, max = coins.length; i < max; i++) {
		// a coin?
		if (coins[i].offset[0] === offset[0] && coins[i].offset[1] === offset[1]) {
			if (coins[i].state !== mx.Character.states.dead) {
				coins[i].hide();
				points.add_point();
				mx.sound.chaching.play();
				break;
			}
		}
		// the end flag?
		else if (mh.in_array_hard(offset, flag)) {
			if (!DONE) {
				DONE = true;
				timer.stop();
				Alert.message(stringf(lines.win, points.points), 5000);
			}
		}
		else {
			if (coins[i].state !== mx.Character.states.dead) {
				mx.enviroment.placement.place(coins[i], coins[i].offset);
				mx.enviroment.element.as_used(coins[i].offset, true);
			}
		}
	}
};


// display instructions
// ========================================================================
Alert.message(lines.instructions, 5000);
