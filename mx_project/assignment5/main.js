var height, width, level, alien, points, timer, flag, lines = "lines.ini", coins = [], num_coins = 10, done = false;

// load needed modules for this game
mx.include.module.dom;
mx.include.module.level;
mx.include.module.enviroment.element;
mx.include.module.enviroment.earth;
mx.include.module.character;
mx.include.module.panel;


// load used character elements
mx.Character.load("alien", "bullet", "coin");
height = mx.dom.settings.enviromentport.dimension.height;
width = mx.dom.settings.enviromentport.dimension.width;

// create a world and a sample level
level = new mx.Level(1);
level[1] = new mx.enviroment.Earth("level_1");

// initialize an alien character and
// make it the main character
alien = new mx.Character.alien(true, true);
alien.normalize({ top: 3 });
mx.enviroment.placement.place(alien, [0, height - 8])


// sky and ground
mh.for_each(mx.enviroment.Earth.section(), function (i, coor) {
	if (mh.between(coor[1], height - 3, height, true))
		level[1].draw(coor, "underground");
	else if (mh.between(coor[1], height - 4, height - 4, true))
		level[1].draw(coor, "rock");
	else if (coor[1] <= height - 5)
		level[1].draw(coor, "sky");
});

// mountains
level[1].piramid(16, 41, -5, "mountain");
level[1].piramid(24, 50, -5, "mountain");
level[1].piramid(12, 67, -5, "mountain");


// flag
flag = level[1].flag(width - 3, height - 5, "flag_footer", "flag_pole", "flag");

// create a timer element that goes on
// for five minutes
timer = mx.panel.Timer(300, function () {
	Alert.message(lines.lose);
	setTimeout(function () {
		level[1].clear();
	}, 1000);
});

// and a point tracker
points = mx.panel.Points();

// load sayings
lines = mx.file.ini_parse(mx.file.read(stringf(
	mx.include.directories.project,
	mx.settings.project_name, lines
)));

// display instructions
Alert.message(lines.instructions, 5000);

// add coins
for (var i = 0; i < num_coins; i++) {
	coins[i] = new mx.Character.coin(true);

	mx.enviroment.placement.place(
		coins[i], 
		[ Math.floor( Math.random() * width ), 0 ], 
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
				break;
			}
		}
		// the end flag?
		else if (mh.in_array_hard(offset, flag)) {
			if (!done) {
				done = true;
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
