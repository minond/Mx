mx.include.module.helpers;
mx.include.module.storage;
mx.include.module.element;
mx.include.module.dom;
mx.include.module.events;
mx.include.module.component;

mx.include.component("vp_movement");
mx.include.settings;


setup = function () {
	mx.component.vp_movement.initialize();
};

main = function () {
	mx.dom.vp.initialize(140, 140);
};
