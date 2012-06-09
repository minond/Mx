/**
 * @name ajax module
 * @var Object
 */
mx.module.register("ajax", function (module, self) {
	/**
	 * @name get
	 * @param String url
	 * @param Boolean asynchronous request
	 * @return response
	 */
	module.get = function (url, async) {
		var http = new XMLHttpRequest;

		http.open("GET", url, async);
		http.send(null);

		return http.responseText || http;
	};
});
