/**
 * @name canvas module
 * @var Object
 */
mx.module.register("canvas", function (module, settings, self) {
	self.file.include.elem;
	self.file.include.events;

	/**
	 * @name type
	 * @var String
	 * 
	 * type of context canvas should work under
	 */
	settings.type = "2d";

	/**
	 * @name Create
	 * @param Boolean append to body
	 * @param Integer height
	 * @param Integer width
	 * @return Object canvas element and 2d context
	 */
	module.Create = function (height, width) {
		var elem = self.elem.create("canvas");
		var conx = elem.getContext(settings.type);

		if (height && width) {
			elem.height = height;
			elem.width = width;
		}

		return {
			el: elem,
			context: conx
		};
	};

	/**
	 * @name draw
	 * @var Object
	 * @see register
	 */
	module.draw = {};

	/**
	 * @name register
	 * @param String method name
	 * @param Function method
	 * @see draw
	 */
	module.register = function (name, action) {
		module.draw[ name ] = function (argv) {
			return action.apply(
				arguments[ 0 ].context,
				self.util.rest(arguments)
			);
		};
	};
});
