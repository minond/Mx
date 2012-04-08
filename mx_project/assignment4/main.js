"use strict";

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


mx.dom.initialize();
mx.components.initialize();
mx.element.character.initialize();
mx.movement.initialize();
mx.placement.initialize();
mx.gravity.initialize();
mx.sound.initialize();

var maze_string = mx.component.maze.generate(mx.url.mw || 5, mx.url.mh || 5);
var maze_points = mx.component.maze.display(maze_string);

// build a new character
var alien = new mx.element.character.alien(true, true);
