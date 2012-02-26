mx.include.module.helpers;
mx.include.module.storage;
mx.include.module.element;
mx.include.module.dom;

mx.include.module.component;
mx.include.component("event");
mx.include.component("vp_movement");

mx.include.settings;
mx.include.style("mx_style/reset.css");
mx.include.style("mx_style/default.css");

setup = function () {
	mx.component.vp_movement.initialize();
};

main = function () {
	mx.dom.vp.initialize(1500, 4000);
};
