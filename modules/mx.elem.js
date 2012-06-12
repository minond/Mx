/**
 * @name elem module
 * @var Object
 */
mx.module.register("elem", function (module, settings, self) {
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

	/**
	 * @name append
	 * @param Node to append
	 * @param Node parent (defaults to body)
	 */
	module.append = function (node, holder) {
		(holder || document.body).appendChild(node);
	};
});
