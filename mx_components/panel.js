"use strict";

(function () {
	var main = { name: "panel" },
		classes = {
			father: "panel_component_father",
			child: "panel_component_child",
			button: "panel_component_child_button"
		},
		items = main.items = [],
		panel = main.panel = document.createElement("div");

	var item = main.item = function (content) {
		items.push( document.createElement("div") );
		items[ items.length - 1 ].className = classes.child;

		if (typeof content === "string")
			items[ items.length - 1 ].innerHTML = content;
		else
			items[ items.length - 1 ].appendChild(content);
			
		panel.children[0].appendChild(items[ items.length - 1 ]);
		$(window).trigger("resize");

		return items[ items.length - 1 ];
	};

	var button = main.button = function (label, action) {
		var item = main.item(label);
		item.className += " " + classes.button;
		Mx.bind(Mx.const.event.CLICK, item, action);

		return item;
	};

	var as_is = main.as_is = function (item) {
		items.push(item);
		panel.children[0].appendChild(items[ items.length - 1 ]);
		$(window).trigger("resize");
	};

	var reset = main.reset = function () {
		items = main.items = [];
		panel.children[0].innerHTML =  "";
	};

	main.__defineSetter__("append", function (item) {
		this.as_is(item);
	});


	main.init = limit(function () {
		panel.appendChild(document.createElement("center"));
		panel.className = classes.father;
		$(panel).niceScroll();
		document.body.appendChild(panel);
	}, 1);


	Mx.component.register(main);
})();


(function () {
	var main = Mx.comp.panel.standard_item = {},
		id = "panel_component_child_enviroment_selector";


	main.enviroment_selector = function () {
		var holder = document.createElement("div"), img;
		holder.id =	id;

		for (var i = 0; i < 3; i++)
		for (var section in Mx.image.map) {
			if (Mx.image.map[ section ] instanceof Object) {
				for (var image in Mx.image.map[ section ]) {
					// we don't care if the item we're working with is not an image
					Mx.debug.log(image, section);
					img = Mx.image.factory(image, section);
					if (!!img) {
						holder.appendChild(img);
					}
				}
			}
		}

		return holder;
	};
})();
