mx.include.module.storage;
mx.include.module.file;
mx.include.module.helpers;
mx.include.module.element;
mx.include.module.dom;

mx.include.settings;


setup = function () {
	mx.message("running setup");
	mx.include.dependency = "jquery";
	mx.include.dependency = "notify";
	mx.include.dependency = "frame1";
	mx.queue.delay = function () {
		var menu = {};
		var menu2 = {};
		
		Frame.menu.create(menu);
		Frame.menu.create(menu2);
		Frame.menu.add_help(menu, "welcome strangeraaaaaaaaaaaaaa");
		Frame.menu.add_item(menu, "Hello, world");
		Frame.menu.add_item(menu2, "Hello, world");
		Frame.menu.add_item(menu2, "Hello, world");
		Frame.menu.add_item(menu, "Hello, world");
		Frame.menu.add_item(menu2, "Hello, world");
		Frame.menu.build(menu2);
		Frame.menu.add_menu(menu, "more...", menu2);
		Frame.menu.add_item(menu, "Hello, world");
		Frame.menu.add_trigger(menu, document.getElementById("t"), "click");
		Frame.menu.build(menu, 50000);
	};
};

main = function () {
	mx.message("running main");
	mx.message(mx.file.read("README"));
};
