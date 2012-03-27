(function () {
	var main = { name: "graph", ready: true };

	main.initialize = function () {
		var offset = mx.element.block();

		if (mx.debugging) {
			setInterval(function () {
				data_item();
			}, 500);

			x(offset).css({
				width: "515px",
				height: "20px",
				display: "inline-block"
			});

			holder.appendChild(offset);
		}
	};

	var last_check = 0;
	var holder = document.getElementById("mx_output_query_graph");
	var data_item = function () {
		var item = mx.element.block();
		var height = mx.storage.avg * 10;

		if (last_check === mx.storage.count)
			height = 1;

		x(item).css({
			height: x(height).num2px(),
			width: "2px",
			backgroundColor: "red",
			display: "inline-block"
		});

		holder.appendChild(item);
		last_check = mx.storage.count;
		holder.scrollLeft = 10000;
	};

	mx.components.register(main);
})();
