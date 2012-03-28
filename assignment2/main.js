"use strict";

var alien;

// project modules
mx.include.module.dependency.character;
mx.include.module.dependency.helpers;
mx.include.module.dependency.storage;
mx.include.module.dependency.element;
mx.include.module.dependency.dom;
mx.include.module.dependency.events;
mx.include.module.dependency.component;
mx.include.module.dependency.gravity;
mx.include.module.dependency.placement;
mx.include.module.dependency.movement;

mx.include.settings;
mx.components.initialize();
mx.element.character.initialize();
mx.dom.initialize(project.dom_settings);
mx.movement.initialize();
mx.placement.initialize();
mx.gravity.initialize();
mx.sound.initialize();

// build a new character
alien = new mx.element.character.alien(true, true);
