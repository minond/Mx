(function (scope, $, undefined) {

	var Stack = [];
	var Build = {};
	var Alert = {};
	
	// main functions
	Alert.alert;
	Alert.confirm;
	Alert.prompt;
	Alert.settings = {};
	
	// html manager
	Build.body = { main: null, message: null };
	Build.button = { OK: null, Cancel: null };
	Build.action;
	Build.css = Alert.settings.css = {};
	Build.html = {};
	
	// html string
	Build.html.h_div = '<div></div>';
	Build.html.m_div = '<div id="_M_message_"></div> <div id="_M_action_"></div>';
	Build.html.ok_button = '<input type="button" value="OK" \/>';
	Build.html.ca_button = '<input type="button" value="Cancel" \/>';
	Build.html.a_div = [ '<div valign="middle">', '</div>' ];
	Build.html.action_id = '_M_action_';
	Build.html.timeout_id = '_M_timeout_';
	Build.html.input = '<input type="text" value \/>';
	
	// css objects
	Build.css.main = {
		'height': '150px',
		'width': '400px',
		'font': '15px Arial',
		'cursor': 'default',
		'position': 'fixed',
		'top': '0px',
		'left': '0px',
		'text-align': 'center'
	};

	Build.css.background = {
		'background-color': 'black',
		'opacity': '0.6',
		'height': '100%',
		'width': '100%',
		'position': 'absolute'
	};

	Build.css.message = {
		'font': '25px Arial',
		'height': '110px',
		'display': 'table-cell',
		'vertical-align': 'middle',
		'width': '400px',
		'color': 'white',
		'position': 'relative'
	};

	Build.css.button = {
		'background-color': '#777',
		'border': '1px solid #777',
		'outline': '0px',
		'padding': '3px 15px',
		'margin': 'auto 3px',
		'cursor': 'pointer',
		'color': 'white',
		'font': '11px Arial',
		'position': 'relative'
	};
	
	Build.css.input = {
		'border': '1px solid black',
		'outline': '0px',
		'font': '14px Arial',
		'padding': '1px 7px',
		'width': '200px',
		'text-align': 'center'
	};
	
	
	// html implementation
	Build.body.main = function (main) {
		return $( Build.html.h_div ).css( Build.css.main )
			.append( $( Build.html.h_div )
			.css( Build.css.background ) )
			.append( $( Build.html.m_div ) );
	};
	
	Build.body.message = function (main, message) {
		$(main.children()[1])
			.append( $(Build.html.a_div[0] + message + Build.html.a_div[1])
				.css( Build.css.message ) );
	};
	
	Build.body.input = function (main, text) {
		return $(main.children()[1].childNodes[0])
			.append( document.createElement('br') )
			.append( $(Build.html.input).css( Build.css.input )
				.val(text || '') );
	};
	
	Build.button.OK = function (main) {
		return $(main.children()[2])
			.append( $( Build.html.ok_button )
				.css( Build.css.button )
				.bind('click', function () {
					var input = main[0].childNodes[1].childNodes[0].getElementsByTagName('input');
					var text;
	
					if (input.length) text = input[0].value;
				
					Build.action(main, true, text);
				})
			);
	};
	
	Build.button.Cancel = function (main) {
		return $(main.children()[2])
		.append( $( Build.html.ca_button )
			.css( Build.css.button )
			.bind('click', function () {
				Build.action(main, false);
			}) );
	};
	
	Build.show = function (main) {
		main.css( {
			'top': window.innerHeight / 2 - ( main.height() / 2 ) + 'px',
			'left': window.innerWidth / 2 - ( main.width() / 2 ) + 'px'
		} );
		
		// if there is anything in the stack, don't show this alert
		if (!Stack.length) {
			document.body.appendChild( main[0] );
			Build.focus( main );
		}

		// and save it
		Stack.push( main );
	};
	
	Build.action = function (main, click, text) {
		document.body.removeChild( main[0] );
		main.data( Build.html.action_id )(click, text);
		
		// remove alert from stack
		Stack.shift();
		
		// and check if something else should be ran
		if (Stack.length) {
			document.body.appendChild( Stack[0][0] );
			Build.focus( Stack[0] );
		}
	};

	Build.timeout = function (main, timeout) {
		main.bind(Build.html.timeout_id, function () {
			setTimeout(function () {
				Build.action(main, false, "");
			}, timeout);
		});
	};
	
	Build.listen = function (main, fn) {
		main.data(Build.html.action_id, fn);
	};

	Build.focus = function (on) {
		var evs = on.data("events");
		evs && Build.html.timeout_id in evs && evs[ Build.html.timeout_id ][0].handler();

		setTimeout(function () {
			on.find("input").first().focus();
		}, 500);
	};
	
	
	
	// user-functions:
	// alert()
	Alert.alert = function (msg, fn) {
		var _alert = Build.body.main();
		Build.body.message(_alert, msg);
		Build.button.OK(_alert);
		Build.listen(_alert, fn || function () {});
		Build.show(_alert);
	};

	// confirm()
	Alert.confirm = function (msg, fn) {
		var _confirm = Build.body.main();
		Build.body.message(_confirm, msg);
		Build.button.OK(_confirm);
		Build.button.Cancel(_confirm);
		Build.listen(_confirm, fn || function () {});
		Build.show(_confirm);
	};

	// prompt()
	Alert.prompt = function (msg, text, fn) {
		var _prompt = Build.body.main();
		Build.body.message(_prompt, msg);
		Build.body.input(_prompt, text);
		Build.button.OK(_prompt);
		Build.button.Cancel(_prompt);
		Build.listen(_prompt, fn || function () {});
		Build.show(_prompt);
	};

	Alert.message = function (msg, timeout) {
		var _message = Build.body.main();
		Build.body.message(_message, msg);
		Build.listen(_message, function () {});
		Build.timeout(_message, timeout || 4000);
		Build.show(_message);
	};
	
	scope[ 'Alert' ] = Alert;
})(this, jQuery);
