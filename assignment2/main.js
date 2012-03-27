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

// settings, components, and characters
mx.include.settings;
mx.include.components(project.components);
mx.element.character.gets(project.characters);

// build the viewport and initialize
// the enviroment
mx.dom.initialize(project.dom_settings);
mx.movement.initialize(project.movement_settings);
mx.placement.initialize(project.placement_settings);
mx.gravity.initialize(project.gravity_settings);
mx.sound.initialize(project.sound_settings);

// build a new character
alien = new mx.element.character.alien(true, true);
