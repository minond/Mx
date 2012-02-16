"use strict";


(function () {
	var mod_list = Mx.internals.id.tests.mod_list;

	var modules = manage.enum.apply(manage, mod_list);
	var tests = Mx.internals.tests = manage.enum.apply(manage, mod_list);

	// module test
	for (var module in modules) {
		switch (modules[ module ]) {
			case modules.main:
				tests[ module ] = Mx instanceof Object;
				break;

			case modules.image:
				tests[ module ] = module in Mx && !!Mx.image.map.root;
				break;

			case modules.storage:
				tests[ module ] = module in Mx && !!Mx.storage.db;
				break;

			case modules.dom:
				tests[ module ] = module in Mx && !!Mx.dom.holder && !!Mx.dom.viewport;
				break;

			case modules.debug:
				tests[ module ] = module in Mx;
				break;

			default:
				tests[ module ] = new Error( Template.stringf(Mx.internals.id.tests.msg, module) );
				break;
		}
	}

	// enviroment test
	tests.manage = 'manage' in window && 'throttle' in manage;
	tests.jQuery = 'jQuery' in window && (new $) instanceof jQuery;
	tests.scroller = tests.jQuery && 'niceScroll' in $();
	tests.uxframes = 'Frame' in window && 'menu' in Frame;
	tests.notifications = 'Alert' in window && 'alert' in Alert;
})();
