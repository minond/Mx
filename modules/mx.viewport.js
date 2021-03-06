/**
 * @name Viewport
 * @var Viewport
 */
mx.module.constructor("Viewport", function (module, proto, settings, self) {
	self.file.include.maps;

	proto.__construct = function (argv) {
		if (argv.map) {
			this.geo(argv.map);
		}

		if (argv.show) {
			this.show();
		}
	};

	proto.geo = function (map) {
		this.showing = false;
		this.map = map;

		return this;
	};

	proto.show = function () {
		if (!this.showing && this.map) {
			document.body.appendChild(this.map.canvas.el);
			this.showing = true;
		}

		return this;
	};
});
