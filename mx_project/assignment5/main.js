mx.settings.module.set("dom.enviromentport.dimension.width", 30);
mx.settings.module.set("dom.enviromentport.dimension.height", 20);

mx.include.module.dom;
mx.include.module.enviroment.element;


mx.enviroment.element.initialize();
mx.dom.initialize();

mx.debug.logf("main file loaded");



mx.include.module.character;
mx.Character.load("alien", "bullet");

var a = new mx.Character.alien;
a.show();
