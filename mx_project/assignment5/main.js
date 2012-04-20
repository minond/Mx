mx.settings.module.set("dom.enviromentport.dimension.width", 90);
mx.settings.module.set("dom.enviromentport.dimension.height", 20);

mx.include.module.dom;
mx.include.module.character;
mx.include.module.enviroment.element;

mx.Character.load("alien", "bullet");

var alien = new mx.Character.alien(true, true);
