"use strict";


/**
 * Example:
 * 
 * // everything is based on objects
 * var elem = { offset: [1, 4], etc... };
 * 
 * // create a new element storage section
 * // and set the offset key as the hash key
 * mx.storage.register("element", "offset");
 * 
 * // saving just requires the element to be 
 * // passed to the save method
 * mx.storage.save.element(elem);
 * 
 * // and getting an element just requires
 * // the raw hash value
 * elem = mx.storage.get.element([1, 4]);
 */

(function (self) {
	var settings = {
		keys: {}
	};

	var main = self.module.register("storage", settings);

	// every type of elements stores are kept 
	// in this object with their own key as a namespace
	var storage = {};

	// save an element namespace
	main.save = {};

	// retreive an element namespace
	main.get = {};

	// create a new storage section
	main.register = function (name, hash_key) {
		if (name in storage)
			return false;

		// save the getter object key
		settings.keys[ name ] = hash_key;

		// and create a new namespace
		storage[ name ] = {};

		// create a new getter and setter set
		// of methods for the new element type
		main.save[ name ] = function (element) {
			// when saving an element to the storage
			// object, use the hash key specified
			storage[ name ][ element[ settings.keys[ name ] ].toString() ] = element;
		};

		main.get[ name ] = function (value_check) {
			value_check = value_check.toString();

			// getters just check hash value
			for (var element in storage[ name ]) {
				if (element === value_check) {
					return storage[ name ][ element ];
				}
			}
		};
	};
})(mx);
