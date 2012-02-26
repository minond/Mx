mx.include.module.storage;
mx.include.module.file;
mx.include.module.helpers;
mx.include.module.element;
mx.include.module.dom;


mx.include.settings;


setup = function () {
	mx.message("running setup");
};

main = function () {
	mx.message("running main");
	mx.message(mx.file.read("README"));
};
