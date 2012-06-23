/**
 * @name Map
 * @var Map
 */
mx.module.constructor("Map", function (module, proto, settings, self) {
	self.file.include.canvas;
	self.file.include.drawings;

	settings.defaults.dim = {
		height: 500,
		width: 1000,
		point_height: 10,
		point_width: 10
	};

	proto.__construct = function (argv) {
		argv = self.util.fillin(argv, settings.defaults.dim);

		this.width = argv.width;
		this.height = argv.height;
		this.point_width = argv.point_width;
		this.point_height = argv.point_height;

		if (argv.canvas) {
			this.draw_on(argv.canvas);
		}
	};

	proto.draw_on = function (canvas) {
		this.canvas = canvas;
		this.canvas.el.height = this.height;
		this.canvas.el.width = this.width;

		return this;
	};

	proto.point = function (x, y) {
		self.canvas.draw.tsquare(this.canvas, x, y);
	};
});
