// TODO: add checks for invalid projects or for no projects being loaded


"use strict";

// purely got clean namespace/scope reasons
// Mx library will only require Mx, Game, main, setup, m, and x
var Game = {};

// which game to load
Game.project = window.location.search.match(/load:([A-x0-9]+)/) || [];

if (!Game.project.length) {
	Game.project = window.location.search.match(/debug:([A-x0-9]+)/) || [];
}

if (Game.project.length) {
	Game.project = Game.project[1];
}



// main Mx library
// holds all Mx modules and custom components as well
var Mx = {
	internals: {
		// unique identifiers used within modules
		// used more as a settings type of storate,
		// where as Mx.const is used more as the library's
		// settings storage.
		id: {
			main: {
	    		PROJECT: Template.stringf("{%0}/{%0}.js", Game.project),
	    		SETTINGS: Template.stringf("{%0}/{%0}.settings.js", Game.project),
		    	MAIN: "main",
			    SETUP: "setup"
			}
		},

		// list of all test and their outcomes
		tests: {},

		// all test have passes and components are loaded
		ready: false,

		// list of components current projects depends on
		components: []
	},

	// constants that could be used throught out the whole project
	// Mx's main settings storage
	const: {
		// Mx dom element types
		dom: {
			type: manage.enum("ENV", "BODY", "UX")
		},

		// dom event types
		event: manage.const(
		    "click", "dblclick", "change", "focus", "keydown", 
		    "keypress", "keyup", "mouseleave", "mouseout", 
		    "mouseover", "mouseup", "mousewheel", "resize", 
		    "scroll", "submit", "select"
		)
	}
};



