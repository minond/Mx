/**
 * @name events module
 * @var Object
 */
mx.module.register("events", function (module, settings, self) {
	/**
	 * @name registration_list
	 * @var Array
	 */
	var registration_list = [];

	/**
	 * @name events
	 * @var util.Trigger
	 */
	settings.events = new self.util.Trigger;

	/**
	 * @name bindto
	 * @var Node
	 * 
	 * default element event listeners are bound to
	 */
	settings.bindto = document.body;

	/**
	 * @name listen
	 * @param String event type
	 * @param Function action
	 */
	module.listen = function (type, action) {
		if (!self.util.in_array(type, registration_list)) {
			settings.bindto.addEventListener(type, function (ev) {
				settings.events.trigger(type, ev);
			});

			registration_list.push(type);
		}

		settings.events.listen(type, action);
	};
});
