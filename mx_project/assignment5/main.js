mx.include.module.dom;
mx.include.module.level;
mx.include.module.character;
mx.include.module.enviroment.element;
mx.include.module.enviroment.earth;

mx.Character.load("alien", "bullet");

var height = mx.dom.settings.enviromentport.dimension.height;
var level = new mx.Level(1);
var alien = new mx.Character.alien(true, true);

level[1] = new mx.enviroment.Earth("level_1");
alien.normalize({ top: 3 });

mh.for_each(mx.enviroment.Earth.section(), function (i, coor) {
	if (mh.between(coor[1], height - 3, height, true))
		level[1].draw(coor, "underground");
	else if (mh.between(coor[1], height - 4, height - 4, true))
		level[1].draw(coor, "rock");
	else if (coor[1] <= height - 5)
		level[1].draw(coor, "sky");
});

mh.times(10, function (i) {
	level[1].draw([50 + i, height - 5], "mountain");

	mh.times(i, function (j) {
		level[1].draw([50 + i - 1, height - 5 - j], "mountain");
	});
});

mx.enviroment.placement.place(alien, [0, height - 8])
