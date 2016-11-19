var mysql = require('mysql');
var connection = mysql.createConnection({
	host: 'fling.seas.upenn.edu',
	user: 'devjain',
	password: 'devanshujain',
	database: 'devjain'
});

function query_specific_login(res, login){
	querySelectInput = "SELECT DISTINCT login FROM Family";
	queryTableOutput = "SELECT P.*, F.role FROM Person P INNER JOIN Family F ON P.login = F.member WHERE F.login = '" + login + "'";
	connection.query(querySelectInput, function(errSelect, rowsSelect, fieldsSelect){
		if(errSelect){
			console.log(errSelect);
		}
		else{
			connection.query(queryTableOutput, function(errTable, rowsTable, fieldsTable){
				if(errTable){
					console.log(errTable);
				}
				else{
					output_result(res, "Family for " + login, login, rowsSelect, rowsTable);
				}
			});
		}
	});
};

function query_all_family(res){
	querySelectInput = "SELECT DISTINCT login FROM Family";
	connection.query(querySelectInput, function(errSelect, rowsSelect, fieldsSelect){
		if(errSelect){
			console.log(errSelect);
		}
		else{
			output_result(res, "Select a login", null, rowsSelect, []);
		}
	});
};

function output_result(res, title, login, rowsSelect, rowsTable){
	res.render('your-work.jade', {
		title: title, 
		login: login,
		selectResult: rowsSelect,
		tableResult: rowsTable
	});
};

exports.do_work = function(req, res){
	if(!req.query.login){
		query_all_family(res);
	}
	else{
		query_specific_login(res, req.query.login);
	}
};