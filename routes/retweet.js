var ejs = require("ejs");
var mysql = require('./mysql');

exports.getretweetdetails = function(req, res) {
	console.log("in getretweetdetails node");

	var getRetweetDetailsQuery = "select tweetid from retweets where retweeterid = " + req.session.userid;

	mysql.fetchData(function(err, results) {
		if(err) {
			throw err;
		}
		else {
			if(results.length > 0) {
				console.log("User Tweets Got Successfully");
				console.log(results);
				
				json_responses = {
					"statusCode" : 200,
					"iduser" : req.session.userid,
					"results" : results
				};
				res.send(json_responses);
			}
			else {
				console.log("No User Tweets");
				json_responses = {
					"statusCode" : 401,
					"iduser" : req.session.userid,
					"results" : 0
				};
				console.log(json_responses);
				res.send(json_responses);
			}
		}
	}, getRetweetDetailsQuery);
}

exports.insertretweet = function(req,res) {
	console.log("in insertretweet node");

	var insertretweetid = req.param("insertretweetid");
	console.log(insertretweetid);

	var getOwnerId = "select userid from tweets where tweetid=" + insertretweetid;
	var insertfollowingquery = "insert into retweets (tweetid, ownerid, retweeterid, date, time) values(" + insertretweetid + ", ("+ getOwnerId + "), " + req.session.userid + ",CURDATE(), CURTIME())";

	mysql.storeData(insertfollowingquery, function(err, result){
		//render on success
		if(!err){
			console.log('New Following user successfully added!');
				json_responses = {
					"statusCode" : 200
				}
				res.send(json_responses);
		}
		else{
			console.log('ERROR! Insertion not done');
			throw err;
		}
	});
}

exports.deleteretweet = function(req, res) {
	console.log("in deleteretweet node");

	var deleteretweetid = req.param("deleteretweetid");
	console.log(deleteretweetid);

	var deleteretweetquery = "delete from retweets where tweetid=" + deleteretweetid + " and retweeterid=" + req.session.userid;

	mysql.deleteData(deleteretweetquery, function(err,results) {
		if(err) {
				console.log("Error in deleteData");
				console.log(err);
				throw err;
			}
		else {
			console.log("successfully Un-did retweet");
			console.log(results);
			console.log(results.affectedRows);
			if(results.affectedRows >0) {
				json_responses = {
					"statusCode" : 200,
					"results" : results
				}
				res.send(json_responses);
			}
			else{
				json_responses = {
					"statusCode" : 401
				}
				res.send(json_responses);
			}
		}
	});
}