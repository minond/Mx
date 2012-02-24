(function () {
	var main = { name: "timer" },

		// for tracking each time unit
		hour = 0,
		minute = 0,
		second = -1,

		// for toggling on/off settings

		running = false,

		// reference to the timer's holder element
		clock = main.clock = document.createElement("div");


	// helper function for padding single digit numbers with
	// a zero.
	var pad = function (num, min) {
		return num < (min || 10) ? "0" + num : num.toString();
	};


	// increases seconds, minutes, and hours respectably.
	var increase_time = function () {
		second++;

		if (second >= 60) {
			minute++;
			second = 0;
		}

		if (minute >= 60) {
			hour++;
			minute = 0;
		}
	};

	// a throttled wrapper for the increase_time method
	// which also updates the component's output.
	var run_time = throttle(function (action) {
		if (action) {
			action();
		}

		else {
			increase_time();
			clock.innerHTML = Template.build(main.name, pad(hour), pad(minute), pad(second));
		}
	}, 1000);


	// the initializer
	main.init = function (until, action, append) {
		var until = typeof until === "number" ? until : 60;

		clock.id = "timer_component";

		while (until--)
			run_time();

		if (action) {
			run_time();
			run_time(action);
		}

		if (append) {
			document.body.appendChild(clock);
		}

		run_time.pause();
		running = false;

		return clock;
	};


	main.start = function () {
		running = true;
		run_time.resume();
		clock.className = "running_" + running;
	};

	main.stop = function () {
		running = false;
		run_time.pause();
		clock.className = "running_" + running;
	};


	// start and stop the timer with a click
	Mx.bind("click", clock, function () {
		running ? main.stop() : main.start();
	});


	// the timer's template
	Template.register(main.name,
		"<div>" + 
			"<span>{%0:00}</span>" +
			"<span>:</span>" +
			"<span>{%1:00}</span>" +
			"<span>:</span>" +
			"<span>{%2:00}</span>" +
		"</div>"
	);


	// register this as a component for Mx
	Mx.component.register(main);
})();
