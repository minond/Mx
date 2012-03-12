"use strict";


mx.include.module.helpers;
mx.include.module.storage;
mx.include.module.element;
mx.include.module.dom;
mx.include.module.events;
mx.include.module.component;

mx.include.component("placement");
mx.include.component("movement");
mx.include.style(mx.__project__ + "/css/players.css");
mx.include.settings;

mx.dom.vp.initialize(1200, 650, null, null, null, mx.dom.type._2D);
mx.component.movement.initialize();
mx.globalize();


/* ------------------------------------------------------------------
 * main project
 * ------------------------------------------------------------------ */

//var truck = new element.factory.car.racecar;
//component.placement.place(truck, 3, 5);
//queue.dom.append(truck);
