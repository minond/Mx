"use strict";

// project modules
mx.include.module.dependency.player;
mx.include.module.dependency.helpers;
mx.include.module.dependency.storage;
mx.include.module.dependency.element;
mx.include.module.dependency.dom;
mx.include.module.dependency.events;
mx.include.module.dependency.component;
mx.include.module.dependency.gravity;
mx.include.module.dependency.placement;

// settings, components, and players
mx.include.settings;
mx.include.components(project.components);
mx.element.player.gets(project.players);

// build the viewport and initialize
// the enviroments
mx.dom.vp.initialize(project.dom_settings);
mx.gravity.build_wall();

// build a new character
var alien = new mx.element.player.alien(true);
