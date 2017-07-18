exports.rot13ED = function(str) {
	// eslint-disable-next-line
	return str.replace(/[a-zA-Z]/g, function(c) {
		// eslint-disable-next-line
		return String.fromCharCode((c <= "Z" ? 90 : 122) >= (c = c.charCodeAt(0) + 13) ? c : c - 26);
	});
}

// Retrieves value of key from the config file
exports.getFromConfig = function(key = "title") {
	let configFile = require("../data/config.json");
	let config = JSON.parse(JSON.stringify(configFile));
	return config[key]
}

// Retrieves value of key from the config file
exports.getTableConfig = function(table = "error", option = "error") {
	let configFile = require("../data/config.json");
	let config = JSON.parse(JSON.stringify(configFile));
	console.log(table, " ", option);
	if (table !== this.getFromConfig("noTableMsg")) {
		if (config["tableRules"][table] && config["tableRules"][table][option]) {
			return config["tableRules"][table][option];
		} else {
			return null;
		}
	} else {
		return this.getFromConfig("noTableMsg");
	}
}

// Opens the specified URL in a different tab
exports.visitPage = function(url = "http://www.google.ca") {
	window.open(url, "_blank");
}

// Returns the initial query (i.e. pre-formatted default query for a table)
// Convert this into a function that loads a default entry for ALL tables
// If no rules are defined, it will return a blank default entry.
exports.getQBRules = function() {
	return {
		condition: 'AND',
		rules: [{
			empty: true
		}]
	};
}

// Returns a list of columns
exports.getQBFilters = function(table, columns) {
	if (columns.length <= 0) {
		return [{ id: 'error', label: 'ERROR: select a view...', type: 'string' }];
	}

	let plain_strings_query_builder = [];
	for (let i = 0; i < columns.length; i++) {
		plain_strings_query_builder.push({ id: columns[i], label: columns[i], type: 'string', operators: ['equal', 'not_equal', 'greater', 'less', 'greater_or_equal', 'less_or_equal', 'is_not_null', 'is_null', 'in', 'contains'] });
	}
	return plain_strings_query_builder;
}

// Accepts jQB operator, and returns PostgREST equivalent of it
exports.translateOperatorToPostgrest = function(operator) {
	let dict = [
		['equal', 'eq'],
		['not_equal', 'neq'],
		['greater', 'gt'],
		['less', 'lt'],
		['greater_or_equal', 'gte'],
		['less_or_equal', 'lte'],
		['is_not_null', 'not.is.null'],
		['in', 'in'],
		['contains', 'ilike'],
		['is_null', 'is.null']
	];

	for (let i = 0; i < dict.length; i++) {
		if (dict[i][0] === operator) {
			return dict[i][1];
		}
	}
	return "eq";
}
