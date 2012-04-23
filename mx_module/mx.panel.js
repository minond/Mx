"use strict";


(function (self) {
	self.include.module.dom;
	self.include.module.enviroment.element;

	var settings = {
		panel_class: "mx_panel_element",
		point_class: "mx_point",
		timer_class: "mx_timer",
		timer_str: "{%0}:{%1}"
	};

	var main = self.module.register("panel", settings);

	main.num2time = function (num) {
		var ret = {
			hour: 0,
			minute: 0,
			second: 0,
			
			hour_str: "",
			minute_str: "",
			second_str: ""
		};

		var h, m, s;

		h = parseInt(num / 60 / 60);
		m = parseInt(num / 60);
		s = num % 60;

		if (h < 1)
			h = 0;
		if (m < 1)
			m = 0;
		if (s < 1)
			s = 0;

		ret.hour = h;
		ret.minute = m;
		ret.second = s;

		ret.hour_str = h < 10 ? "0" + h : h;
		ret.minute_str = m < 10 ? "0" + m : m;
		ret.second_str = s < 10 ? "0" + s : s;

		return ret;
	};

	main.Timer = function (start_time, timer_complete, css_settings) {
		var current_time = start_time;
		var str_time;

		var clock = self.enviroment.element.factory({
			innerHTML: stringf(settings.timer_str, "00", "00")
		});
			
		mh.add_class(clock, settings.timer_class);
		mh.add_class(clock, settings.panel_class);

		// calculate time and start timer
		var timer = setInterval(function () {
			str_time = main.num2time(--current_time);
			clock.innerHTML = stringf(
				settings.timer_str, 
				str_time.minute_str, 
				str_time.second_str
			);
			
			if (!current_time) {
				clearInterval(timer);
				timer_complete();
			}
		}, 1000);

		// style and append to body
		if (css_settings) {
			mh.css(clock, css_settings);
		}

		self.dom.append(clock);

		return {
			stop: function () {
				clearInterval(timer);
			}
		};
	};

	main.Points = function () {
		var panel = self.enviroment.element.block();

		mh.add_class(panel, settings.panel_class);
		mh.add_class(panel, settings.point_class);
		panel.innerHTML = "00";

		self.dom.append(panel);

		return {
			points: 0,
			panel: panel,
			add_point: function () {
				this.points = +this.panel.innerHTML;
				this.panel.innerHTML = ++this.points < 10 ? "0" + this.points : this.points;
			}
		};
	};
})(mx);
