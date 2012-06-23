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

	proto.__construct = function (info) {
		self.util.fillin(info, settings.defaults.dim);

		this.width = info.width;
		this.height = info.height;
		this.point_width = info.point_width;
		this.point_height = info.point_height;
	};

	proto.draw_on = function (canvas) {
		this.context = canvas.context;
		this.canvas = canvas.el;
		this.canvas.height = this.height;
		this.canvas.width = this.width;

		return this;
	};
});
