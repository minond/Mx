(function () {
	var main = { name: "menu" },
		mainmenu = main.mainmenu = Frame.menu.create(),
		scriptmenu = main.scriptmenu = Frame.menu.create(),
		trigger = main.trigger = document.createElement("input");

	trigger.value = "Settings";
	trigger.type = "button";

	const OFFSETS = { l: 174, t: 22 };

	const SETTINGS = {
		// "position": "absolute",
		// "zIndex": "1000",
		// "top": "39px",
		"width": "140px",
		"display": "block",
		"marginBottom": "10px"
	};

	const TIME_OUT = 3500;

	const SCRIPT_HELP = "Reseting a script or component<br />" + 
						"will cause the main project to<br />" + 
						"re-run after script has been loaded.";

	const RESET_HELP = "Reinitializes project";

	const RELOAD_HELP = "Reloaded main and<br />re-run it";

	var init = main.init = main.reset = function (append) {
		reset();
		build_script_menu();
		build_main_menu();

		if (append) {
			document.body.appendChild(trigger);
		}

		return trigger;
	};

	var reset = function () {
		$(trigger).remove();
		$(scriptmenu).remove();
		$(mainmenu).remove();

		mainmenu = Frame.menu.create();
		scriptmenu = Frame.menu.create();
	};

	var build_script_menu = function () {
		for (var module in Mx.internals.active_modules) {
			// run this with in a function with a local variable
			// so that the state is kept and we include all components.
			(function () {
				var local_mod = module;

				Frame.menu.add_item(scriptmenu, stringf("Reload {%0} script", local_mod), function () {
					Mx.resource.init([ local_mod ], true);
				});
			})();
		}

		Frame.menu.add_sptr(scriptmenu);
		Frame.menu.add_help(scriptmenu, SCRIPT_HELP);
		Frame.menu.build(scriptmenu);
	};

	var build_main_menu = function () {
		Frame.menu.add_help(mainmenu, RESET_HELP);
		Frame.menu.add_item(mainmenu, "Project Reset", function () { location.reload(true); });
		Frame.menu.add_sptr(mainmenu);
		Frame.menu.add_help(mainmenu, RELOAD_HELP);
		Frame.menu.add_item(mainmenu, "Project Reload", function () { Mx.resource.init.run(true); });
		Frame.menu.add_sptr(mainmenu);
		Frame.menu.add_menu(mainmenu, "Script Reload", scriptmenu);
		Frame.menu.add_trigger(mainmenu, trigger, Mx.const.event.MOUSEOVER, SETTINGS);
		Frame.menu.build(mainmenu, TIME_OUT, OFFSETS);
	};


	Mx.component.register(main);
})();
