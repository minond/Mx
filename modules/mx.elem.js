/**
 * @name elem module
 * @var Object
 */
mx.module.register("elem", function (module, self) {
	/**
	 * @name create
	 * @param String node type name
	 * @param Object node properties
	 * @return Node instance
	 */
	module.create = function (type, props) {
		var elem = document.createElement(type);

		for (var prop in props) {
			elem[ prop ] = props[ prop ];
		}

		return elem;
	};
});
