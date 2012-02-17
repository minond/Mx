var mSQL = function mSQL_instance () {
	return this;
};

/**
 * @note table names
 */
mSQL.NAMES = {
	"description": "@description",
	"data": "@data"
};


/**
 * @note special queries short-hands
 */
mSQL.QUERY = {
	"all": "*"
};

mSQL.prototype.use = function (db) {
	this.db = db;
	return this;
};


/**
 * @method select
 * @param mixed ( array of fields | * )
 * @param string table name
 * @param function filter
 * @param int return limit
 * @param boolean flatten single column array of array into one level
 */
mSQL.prototype.select = function (fields, table, filters, limit, flat) {
	var fields = fields,
		table = table,
		filters = filters ? filters : function () { return true; },
		results = [],
		a_name = "",
		g_string = "%",
		data = this.db[table][mSQL.NAMES.data],
		map = this.db[table][mSQL.NAMES.description],
		rows = data.length,
		temp = {};
	
	function p_selection (str) {
		if (str.indexOf("|") > -1)
			return [str.split("|")[0], str.split("|")[1]];
		else if (str.indexOf(" as ") > -1)
			return [str.split(" as ")[0], str.split(" as ")[1]];
		else
			return [str, str];
	}
	
	for (var i = 0; i < rows; i++) {
		if (filters.call(data[i]) === false) {
			continue;
		}

		temp = {};
		
		if (fields === mSQL.QUERY.all) {
			temp = data[i];
		}

		else {
			for (var c = 0; c < fields.length; c++) {
				if (typeof fields[c] === "string") {
					a_name = p_selection(fields[c]);
					temp[a_name[1]] = data[i][a_name[0]];
				}
				
				else if (typeof fields[c] === "object") {
					for (var a in fields[c]) {
						a_name[1] = a;

						var sl_list = fields[c][a];
						var ll_list = fields[c][a].split(/\%/);

						for (var ee = 0; ee < ll_list.length; ee++) {
							ll_list[ee] = g_string + ll_list[ee].split(/\W/)[0];
						}

						for (var ii = 0; ii < ll_list.length; ii++) {
							if (!ll_list) {
								continue;
							}

							if (ll_list[ii].charAt(0) === g_string) {
								ll_list[ii] = ll_list[ii].replace(g_string, "");

								if (sl_list.indexOf(ll_list[ii]) > -1 && ll_list[ii] in data[i]) {
									sl_list = sl_list.replace(g_string + ll_list[ii], data[i][ll_list[ii]]);
								}
							}
						}

						a_name[0] = sl_list;
					}

					temp[a_name[1]] = a_name[0];
				}
			}
		}

		results.push(temp);

		// check if we've hit our limit
		if (limit && results.length >= limit)
			break;
	}

	// flatten the results
	if (flat && fields !== mSQL.QUERY.all && fields.length === 1) {
		temp = results;
		results = [];
		for (var i = 0, m = temp.length; i < m; i++) {
			results.push( temp[i][ fields[0] ] );
		}
	}
	
	return results;
};



/**
 * @method update
 * @param string table
 * @param array of columns
 * @param array of values
 * @param function filter
 */
mSQL.prototype.update = function (table, columns, values, filter) {
	var data;


	if (!(columns instanceof Array && values instanceof Array)) {
		return false;
	}

	if (columns.length !== values.length) {
		return false;
	}


	data = this.db[ table ][ mSQL.NAMES.data ];

	for (var i = 0, m = data.length; i < m; i++) {
		// filter check
		if ( filter.call( data[i] ) ) {
			// filter pass, update
			for (var j = 0, r = columns.length; j < r; j++) {
				data[i][ columns[j] ] = values[j];
			}
		}
	}


	return true;
};


mSQL.encode = mSQL.prototype.encode = function (data, columns) {
	var a_temp 	 = [],
		l_data 	 = [],
		r_value  = {},
		c_row 	 = {},
		c_column = 0;
	
	if (typeof data === "object") {
		for (var d in data)
			a_temp.push(data);
	}
	
	else if (typeof data === "array")
		a_temp = data;
	
	else return false;
	
	for (var i = 0; i < data.length; i++) {
		for (var j = 0; j < data[i].length; j++) {
			for (var c in columns) {
				c_row[c] = columns[c](data[i][c_column++]);
			}
			
			c_column = 0;
		}
		l_data.push(c_row);
		c_row = {};
	}

	r_value[mSQL.NAMES.description] = columns;
	r_value[mSQL.NAMES.data] = l_data;
	
	return r_value;
};

mSQL.prototype.insert = function (data, table) {
	var t_map = this.db[table][mSQL.NAMES.description],
		index = 0
		formated = {};
	
	if (data instanceof Array) {
		for (item in t_map) {
			formated[item] = data[index];
			index++;
		}
	}
	
	else if (typeof data === "object")
		formated = data;
	
	this.db[table][mSQL.NAMES.data][this.db[table][mSQL.NAMES.data].length] = formated;
	
	return formated;
};

mSQL.prototype.create_table = function (name, description) {
	
};

mSQL.prototype.query = function (qstr) {
	var _self = this;
	var action_map = {
		select: function (q) {
			var columns = q.match(/select (.+?) from/)[1].split(/,|\s,/g);
			var table = q.match(/from (.+?\s|.+)/)[1].replace(/^\s+|\s$/g, "");
			var filter, filters = [], raw_filters = q.match(/where (.+)/)[1];

			if (raw_filters)
				raw_filters = raw_filters
					.replace(/and/g, "&&")
					.replace(/or/g, "||")
					.replace(/=/g, "==")
					.split(" ");
			else {
				filters = [1];
				raw_filters = [];
			}
			
			raw_filters.forEach(function (value, index) {
				var update = index === 0 || index % 4 === 0 ? "this." + value : value;
				filters.push(update);
			});

			filter = new Function("return " + filters.join(" "));
			filter = new Function("return true");

			// return [columns, table, filter];
			return _self.select(columns, table, filter);
		}
	};

	// what type of query is this
	var type = qstr.match(/(.+?) /)[1];

	// and do we know how to parse this?
	if (type in action_map) 
		return action_map[ type ](qstr);
	else
		throw new Error("invalid query");
};



/*

var db1 = {
    table1: {
        "@description": {
            name: String,
            age: Number,
            id: Number
        },
        "@data": [
            {
                name: "Marcos Minond",
                age: 21,
                id: 1
            },
            {
                name: "Marcos Minond",
                age: 21,
                id: 2
            },
            {
                name: "Marcos Minond",
                age: 21,
                id: 3
            },
            {
                name: "Marcos Minond",
                age: 22,
                id: 4
            }
        ]
    }
};

var db = new mSQL;




db1.table2 = mSQL.encode(
	[["marcos", "minond", 21], ["marcos", "minond", 33], ["marcos", "minond", 11], ["marcos1", "minond1", 53]],
	{first_name: String, last_name: String, age: Number});






db.use(db1);

db.insert(["andres", "minond", 77], "table2");

db.insert([23, 5, "Marcos Minond"], "table1");

var marcos21plus = db.select([
		"first_name|name",
		"age|a",
		{"greeting": "%first_name is %age years old."}, 
		{"message": "%first_name %last_name is so sexy."},
		{"all at once!": "'%first_name ---&%%%last_name', is a %AA (%age-%age-%age) year old sexy mofo"}],
		
		"table2",
		
		function () { return this.age > 20 });




// marcos21plus;


// var r1 = mSQL.use(db1).select("*", "table1");
// var r1 = mSQL.use(db1).select(["name", "id"], "table1", function () { return this.age === 22 && this.name != "Jackson 5"; });

// r1;


*/





