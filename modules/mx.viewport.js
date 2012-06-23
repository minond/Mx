/**
 * @name Viewport
 * @var Viewport
 */
mx.module.constructor("Viewport", function (module, proto, settings, self) {
	self.file.include.maps;

	proto.__construct = function (info) {
		if (info.canvas) {
			this.draw_on(info.canvas);
		}
	};

	proto.geo = function (map) {
		this.showing = false;
		this.map = map;

		return this;
	};

	proto.show = function () {
		if (!this.showing && this.map) {
			document.body.appendChild(this.map.canvas);
			this.showing = true;
		}

		return this;
	};
});
