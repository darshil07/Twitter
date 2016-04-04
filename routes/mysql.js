var ejs= require('ejs');
var mysql = require('mysql');

//connection pooling
function getConnection(){
	var connection = mysql.createPool({
		connecitonLimit : 10,
	    host     : 'localhost',
	    user     : 'root',
	    password : 'root',
	    database : 'test',
	    port	 : 3306
	});
	return connection;
}

//Put your mysql configuration settings - user, password, database and port
/*function getConnection(){
	var connection = mysql.createConnection({
	    host     : 'localhost',
	    user     : 'root',
	    password : 'root',
	    database : 'test',
	    port	 : 3306
	});
	return connection;
}
*/

function fetchData(callback,sqlQuery){
	
	console.log("\nSQL Query::"+sqlQuery);
	
	var connection=getConnection();
	connection.getConnection(function(err, connection){
		connection.query(sqlQuery, function(err, rows, fields) {
			if(err){
				console.log("ERROR: " + err.message);
			}
			else 
			{	// return err or result
				console.log("DB Results:");
				console.log(rows);
				callback(err, rows);
			}
			connection.release();
			console.log("\nConnection closed..");
		});
	});	
}	

function storeData(sqlQuery, callback){
	console.log('---SQL Query ::' + sqlQuery + '---');
	var connection = getConnection();
	connection.getConnection(function(err, connection){
		connection.query(sqlQuery, function(err, results){
			//render on success
			if(!err){
				console.log('Database Results :: ' + results);
				callback(err, results);
			}
			//render or error
			else{
				console.log('Error in getting results');
				callback(err, results);
			}
			connection.release();
			console.log('Store Connection Closed');

		});
	});
}

function deleteData(sqlQuery, callback){
	console.log('---SQL Query ::' + sqlQuery + '---');
	var connection = getConnection();
	connection.getConnection(function(err, connection){
		connection.query(sqlQuery, function(err, results){
			//render on success
			if(!err){
				console.log('Database Results :: ');
				console.log(results);
				callback(err, results);
			}
			//render or error
			else{
				console.log('Error in getting results');
				callback(err, results);
			}
			connection.release();
			console.log('Store Connection Closed');
		});
	});
}





/*function fetchData(callback,sqlQuery){
	
	console.log("\nSQL Query::"+sqlQuery);
	
	var connection=getConnection();
	
		connection.query(sqlQuery, function(err, rows, fields) {
			if(err){
				console.log("ERROR: " + err.message);
			}
			else 
			{	// return err or result
				console.log("DB Results:");
				console.log(rows);
				callback(err, rows);
			}
		});
		console.log("\nConnection closed..");
		connection.end();
}	

function storeData(sqlQuery, callback){
	console.log('---SQL Query ::' + sqlQuery + '---');
	var connection = getConnection();
		connection.query(sqlQuery, function(err, results){
			//render on success
			if(!err){
				console.log('Database Results :: ' + results);
				callback(err, results);
			}
			//render or error
			else{
				console.log('Error in getting results');
				callback(err, results);
			}
		});
		console.log('Store Connection Closed');
		connection.end();
}

function deleteData(sqlQuery, callback){
	console.log('---SQL Query ::' + sqlQuery + '---');
	var connection = getConnection();
	
		connection.query(sqlQuery, function(err, results){
			//render on success
			if(!err){
				console.log('Database Results :: ');
				console.log(results);
				callback(err, results);
			}
			//render or error
			else{
				console.log('Error in getting results');
				callback(err, results);
			}
		});
		console.log('Store Connection Closed');
		connection.end();
}*/
exports.fetchData=fetchData;
exports.storeData=storeData;
exports.deleteData=deleteData;