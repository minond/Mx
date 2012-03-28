(function () {
	var main = { name: "graph", ready: true, MAX_IDLE_TIME: 10 };
	var holder = document.getElementById("mx_output_query_graph");

	var last_check = 0;
	var idle_time = 0;
	var idle = false;

	mx.out.register("graph", "graph component", "idle state", "navy");

	main.initialize = function () {
		var offset = mx.element.block();

		if (mx.debugging) {
			setInterval(function () {
				data_item();
			}, 400);

			x(offset).css({
				width: "524px",
				height: "20px",
				display: "inline-block"
			});

			holder.appendChild(offset);
		}
	};

	var data_item = function () {
		var item = mx.element.block();
		var height = mx.storage.avg * 10;

		if (last_check === mx.storage.count) {
			height = 1;
			idle_time++;

			if (idle_time > main.MAX_IDLE_TIME) {
				if (!idle)
					mx.out.graph();

				idle = true;
				return false;
			}
		}
		else {
			idle = false;
			idle_time = 0;
		}

		x(item).css({
			height: x(height).num2px(),
			width: "2px",
			backgroundColor: "blue",
			display: "inline-block"
		});

		holder.appendChild(item);
		last_check = mx.storage.count;
		holder.scrollLeft = 10000;
		holder.scrollTop = 100;
	};

	mx.components.register(main);
})();
