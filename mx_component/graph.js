(function () {
	var main = { name: "graph" };

	var data, graph;

	main.initialize = function () {
		mx.include.dependency("jsapi");
		google.load("visualization", "1", { packages:["corechart"] });
		//google.setOnLoadCallback(ready);
	};

	main.ready = function () {
		data = new google.visualization.DataTable();
		graph = new google.visualization.AreaChart(document.getElementById('chart_div'));
		data.addColumn('string', 'Count');
		data.addColumn('number', 'Time');
	};

	main.draw = function () {
		data.addRows([
			['4', 540]
		]);

		graph.draw(data);
	};

	mx.components.register(main);
})();
