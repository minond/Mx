"use strict";


mx.include.module.helpers;
mx.include.module.storage;
mx.include.module.element;
mx.include.module.dom;
mx.include.module.events;
mx.include.module.component;
mx.include.module.player;

mx.include.component("placement");
mx.include.component("movement");
mx.element.Player.player_import("alien");
mx.include.style(mx.__project__ + "/css/players.css");
mx.include.settings;

mx.dom.vp.initialize({
	width: 100,
	height: 70,
	type: mx.dom.type._2D
});
mx.component.movement.initialize();
mx.globalize();


/* ------------------------------------------------------------------
 * main project
 * ------------------------------------------------------------------ */

var alien = new mx.element.Player.alien;

alien.show();

//var truck = new mx.element.factory.car.racecar;
//component.placement.place(truck, 3, 5);
//queue.dom.append(truck);
