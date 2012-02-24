(function () {
    var css = document.createElement("link");
    css.setAttribute("rel", "stylesheet");
    css.type = "text/css";
    css.href = "mx_style/frame1.css";
    setTimeout(function () {
        document.getElementsByTagName("head")[0].appendChild( css );
    }, 1500);
})();


var log = function () { console.log.apply(console, arguments); };

// main Framework scope
var Frame = {};

// framework declaration scope
(function (scope, master, module, undefined) {
	// the main functions
	var create;
	var add_item;
	var add_submenu;
	var add_separator;
	var add_help;
	var add_trigger;
	var build;
	var hide;
	var hide_all;
	var show;

	// module setup
	var init = false;
	var setup = function () {
		if (!init) {
			// outter click auto menu hide
			new_event(document.body, "click", function (e) {
				if (!is_frame(( e || event ).target))
					hide_all();
			});

			init = true;
		}
	};

	// some helpers
	var new_node = function (type, attrs, html, r_string) {
		var holder = document.createElement("div");
		var child  = "<" + type + attr_factory(attrs) + " >" + (html || "") + "<\/" + type + ">";
		
		holder.innerHTML = child;
		return r_string ? child : holder.children[0];
	};

	var new_event = function (node, event_type, event_fn) {
		if (event_fn instanceof Function) {
			if ("addEventListener" in node)
				node.addEventListener(event_type, event_fn, false);
			else if ("attaceEvent" in node)
				node.attachEvent("on" + event_type, function () {
					event_fn.apply(node, [event]);
				});
			else
				node[ "on" + event_type ] = event_fn;
		}

		return node;
	};

	var is_frame = function (node) {
		do {
			if ("className" in node && 
				( node.className.match( attr_map.master["class"] ) || 
				  node.className.match( attr_map.trigger )))
				return true;

			node = node.parentNode;
		} while (node && node !== document.body);

		return false;
	};

	var get_offset_to = function (node, to) {
		var offsets = { left: 0, top: 0 };
		
		while (!!node && node !== to) {
			offsets.left += node.offsetLeft ? node.offsetLeft : 0;
			offsets.top  += node.offsetTop  ? node.offsetTop  : 0;
			node = node.parentNode;
		};
		
		return offsets;
	};

	var get_style = function (node, style) {
		return getComputedStyle(node, "").getPropertyValue(style);
	};

	var add_class = function (node, cname) {
		var classes = node.className.split(" ");
		var match = false;

		for (var i = 0, m = classes.length; i < m; i++)
			if (classes[i].toLowerCase() === cname.toLowerCase()) {
				match = true;
				break;
			}

		if (!match)
			node.className += " " + cname;
	};

	var remove_class = function (node, cname) {
		node.className = node.className.replace(cname, '');
	};

	var get_submenu_location = function (menutrigger) {
		// sub menu trigger offsets
		var menu_item_offsets = get_offset_to(menutrigger, menutrigger.parentNode);
		var menu_item_offsets = get_offset_to(menutrigger, document.body);
		
		// sub mennu paddings
		var menu_item_paddings = { left: 0, right: 0 };
		var menu_item_width = +get_style(menutrigger, "width").replace(/\D/g, '');
		menu_item_paddings.left  = +get_style(menutrigger, "padding-left").replace(/\D/g, '');
		menu_item_paddings.right = +get_style(menutrigger, "padding-right").replace(/\D/g, '');

		var submenu_location = { top: 0, left: 0 };
		submenu_location.top  = menu_item_offsets.top - 6;
		submenu_location.left = 
			menu_item_offsets.left + 
			menu_item_paddings.left +
			menu_item_paddings.right +
			menu_item_width + 1;

		return submenu_location;
	};


	var attr_factory = function (attr_obj) {
		var attr_str = '';

		for (var attr in attr_obj)
			attr_str += ' ' + attr + '="' + attr_obj[ attr ] + '"';

		return attr_str;
	};

	var attr_map = {
		master: {
			id: null,
			"class": 'Frame_menu_master',
			unselectable: 'on'
		},
		item: {
			"class": 'Frame_menu_item',
            unselectable: 'on'
		},
		separator: {
			"class": 'Frame_menu_separator',
            unselectable: 'on'
		},
		separator_item: {
			"class": 'Frame_menu_separator_item',
            unselectable: 'on'
		},
		help_text: {
			"class": 'Frame_menu_help_text',
            unselectable: 'on'
		},
		submenu_arrow: {
			"class": 'Frame_menu_submenu_arrow',
            unselectable: 'on'
		},
		trigger: "Frame_menu_trigger_node"
	}

	var menu_status = {
		start: 'new',
		build: 'build',
		show:  'showing',
		hide:  'hidden'
	};

	var menu_count = 0;
	var menu_stack = [];


	// event default/helpers
	var Events = {};
	Events.sub_menu_hide = function (main, item) {
		new_event(item, "mouseover", function (e) {
			Events.sub_menu_hover_reset(main.build);
			if (main.active_submenu)
				hide(main.active_submenu, true);
		});
	};

	// submenu reset
	Events.sub_menu_hover_reset = function (build) {
		// reset the hovering classes
		var all_nodes = build.getElementsByTagName("div");
		var sel_submenu_class = "hovering";

		for (var i = 0, m = all_nodes.length; i < m; i++)
			remove_class(all_nodes[i], sel_submenu_class);
	};

	
	// create
	// @param: object main
	// @param: string menu_id
	create = function (main, menu_id) {
		if (!main) main = {};
		setup();

		attr_map.master.id = menu_id || 'Frame_menu_' + menu_count++;

		main.master = new_node('div', attr_map.master);
		main.items = [];
		main.trigger = { set: false };
		main.active = false;
		main.status = menu_status.start;

		// add this to out stack
		menu_stack.push(main);

		return main;
	};


	// add_item
	// @param: object main
	// @param: string value
	// @param: function action
	add_item = function (main, value, action) {
		main.items.push( new_event(	new_node('div', attr_map.item, value), "click", action ) );
		Events.sub_menu_hide(main, main.items[ main.items.length - 1 ]);
	};


	// add_submenu
	// @param: object main
	// @param: string label
	// @param: object sub_main
	add_submenu = function (main, label, sub_main) {
		var submenu_arrow = "&gt;";
		var submenu_match = "active_submenu";
		var sel_submenu_class = "hovering";

		main.items.push( new_event( 
			new_node('div', attr_map.item, label + 
				new_node('span', attr_map.submenu_arrow, submenu_arrow, true)), "mouseover", 
				function (e) {
					e = e || event;
					var offsets = get_submenu_location(e.target.innerHTML === submenu_arrow ? e.target.parentNode : e.target);
					sub_main.build.style.position = "absolute";
					sub_main.build.style.left = offsets.left + "px";
					sub_main.build.style.top  = offsets.top + "px";

					// reset the hovering classes
					// var all_nodes = this.parentNode.getElementsByTagName("div");
					// for (var i = 0, m = all_nodes.length; i < m; i++)
						// remove_class(all_nodes[i], sel_submenu_class);
					Events.sub_menu_hover_reset(this.parentNode);

					// and set it on the current selected node
					add_class(this, sel_submenu_class);

					// hide any other sub menus
					if ("active_submenu" in main && main.active_submenu)
						scope[ master ][ module ].hide( main.active_submenu, true );

					// store this sub menu
					main.active_submenu = sub_main;

					// store to sub menu
					show(sub_main, true);
				} ) );
	};


	// add_separator
	// @param: object main
	add_separator = function (main) {
		main.items.push( new_node('div', attr_map.separator, new_node('div', attr_map.separator_item, '', true)) );
		Events.sub_menu_hide(main, main.items[ main.items.length - 1 ]);
	};


	// add_help
	// @param: object main
	// @param: string help_text
	add_help = function (main, help_text) {
		main.items.push( new_node('div', attr_map.help_text, help_text) );
		Events.sub_menu_hide(main, main.items[ main.items.length - 1 ]);
	};


	// add_trigger
	// @param: object main
	// @param: Node trigger_node
	// @param: string trigger_type
	add_trigger = function (main , trigger_node, trigger_type, css_settings) {
		main.trigger = {
			node: trigger_node,
			type: trigger_type,
			set:  true
		};

		if (css_settings) {
			for (var setting in css_settings)
				trigger_node.style[ setting ] = css_settings[ setting ];
		}
		
		// and tag as trigger node
		trigger_node.className = trigger_node.className ? trigger_node.className + " " + attr_map.trigger : attr_map.trigger;
	};


	// build
	// @param: object main
	build = function (main, hide_timer, settings) {
		// save original and remove previous build
		var temp = main.master.cloneNode(false);
		main.build = null;
		main.timer = hide_timer || 2000;

		// some css
		if (settings) {
			if ('l' in settings) {
				temp.style.position = settings.position || 'absolute';
				temp.style.left		= settings.l + 'px';
			}
			if ('t' in settings) {
				temp.style.position = settings.position || 'absolute';
				temp.style.top		= settings.t + 'px';
			}
		}

		// and add each item
		for (var i = 0, max = main.items.length; i < max; i++)
			temp.appendChild( main.items[i] );

		// set auto hide listener
		new_event(temp, "mouseout", function (e) {
			// have we left the menu?
			e = e || event;
			var body = document.body;
			var left = false;
			var target = e.relatedTarget || e.target;
			var menu = temp;

			// are we in the body?
			if (target === body) {
				left = true;
				main.active = false;
			}
			else
				main.active = true;
			
			// if we have left
			if (left)
				setTimeout(function () {
					if (!main.active)
						hide(main);
				}, main.timer);
		});

		new_event(temp, "mouseover", function (e) {
			main.active = true;
		});

		// and set the trigger if asked to
		if (main.trigger.set) {
			new_event(main.trigger.node, main.trigger.type, function () {
				show(main);
			});
		}

		// and set back
		main.build = temp;
		main.status = menu_status.build;
	};


	// show
	// @param: object main
	show = function (main, active) {
		if (main.status !== menu_status.show) {
			document.body.appendChild(main.build);
			main.status = menu_status.show;
			main.active = active || false;
		
			// and start the hide timer
			setTimeout(function () {
				if (!main.active)
					hide(main);
			}, main.timer);
		}
	};


	// hide
	// @param: object main
	hide = function (main, force) {
		if (force) {
			try {
				if (main.status !== menu_status.hide)
					document.body.removeChild(main.build);
			} catch (ignore) {}
		}
		else if (!main.active && main.status !== menu_status.hide)
			document.body.removeChild(main.build);

		// check for sub statuses
		if ("active_submenu" in main)
			hide(main.active_submenu, true);

		main.status = menu_status.hide;
		main.active = false;
	};

	// hide_all
	// @param: void
	hide_all = function () {
		for (var i = 0, max = menu_stack.length; i < max; i++)
			hide(menu_stack[ i ], true);
	};


	scope[ master ][ module ] = {
		// constructor
		create: create,

		// adders
		add_item: add_item,
		add_submenu: add_submenu,
		add_separator: add_separator,
		add_help: add_help,
		add_trigger: add_trigger,
	
		// aliaces
		add_sptr: add_separator,
		add_menu: add_submenu,

		// and makers
		build: build,
		show: show,
		hide: hide,
		hide_all: hide_all
	};
})(this, 'Frame', 'menu');
