Alert.settings.css.background = {
	'background-color': 'white',
	'opacity': '0.7',
	'height': '100%',
	'width': '100%',
	'position': 'absolute'

};

Alert.settings.css.message = {
	'font': '25px Arial',
	'height': '110px',
	'display': 'table-cell',
	'vertical-align': 'middle',
	'width': '400px',
	'color': 'black',
	'position': 'relative'
};

Alert.settings.css.main = {
	'height': '150px',
	'width': '400px',
	'font': '15px Arial',
	'cursor': 'default',
	'position': 'fixed',
	'top': '0px',
	'left': '0px',
	'text-align': 'center',
	'box-shadow': "2px 2px 4px rgba(0,0,0,0.2)",
	'border': "1px solid #c8c8c8"
};

Alert.settings.ltxt = "ltxt";

Template.register(Alert.settings.ltxt, "<div style='font-size: 14px; text-align: left; padding: 10px'>{%0}</div>");
