var ejs = require("ejs");
var mysql = require('./mysql');

exports.userSearchResults = function(req, res) {

	//if(req.session.searchUsername == '') {

		console.log(req.param("searchUsername"));
		console.log("in userSearchResults node");

		var searchUsername = req.param("searchUsername");
		//var abc = req.param("tweet");

		//console.log(abc);
		console.log("searchUsername :: " + searchUsername);

		req.session.searchUsername = searchUsername;

		res.send({statusCode:200});
}

exports.usrSearchResults = function(req, res) {

	console.log("in usrSearchResults");

	console.log(req.session.searchUsername);
	console.log(req.session.userid);
	res.render("userSearchResults", {"searchUsername" : req.session.searchUsername, "username" : req.session.username, "userid" : req.session.userid, "email" : req.session.email});
}

exports.searchUser = function(req, res) {
	console.log("in userSearch node");

	var searchUsername = req.session.searchUsername;
	//var searchUsername = req.param("searchUsername");
	var searchUserQuery = "select userid, username, firstname, lastname from users where username like '%" + searchUsername + "%'";

	mysql.fetchData(function(err,results) {

		if(err) {
			console.log("Error in fetchData");
			console.log(err);
			throw err;
		}
		else {
			console.log("User(s) Found!");
			console.log(results);
			if(results.length > 0) {
				json_responses = {
					"statusCode" : 200,
					"iduser" : req.session.userid,
					"results" : results
				};
				console.log(json_responses);
				res.send(json_responses);
				//res.render("searchresults", {data : json_response});
			}
			else {

			}
		}
	},searchUserQuery);
}

exports.searchHashTag = function(req, res) {
	console.log("in searchHashTag node");

	req.session.hashtag = req.param("hashtag");
	console.log("session hashtag :: " + req.session.hashtag);

	res.send({statusCode:200})
	//res.render("searchHash",  {"hashtag" : req.session.hashtag, "username" : req.session.username, "userid" : req.session.userid, "email" : req.session.email});
}

exports.srcHashTag = function(req, res) {
	
	console.log("in srcHashTag");

	console.log(req.session.hashtag);
	console.log(req.session.userid);

	res.render("searchHash",  {"hashtag" : req.session.hashtag, "username" : req.session.username, "userid" : req.session.userid, "email" : req.session.email});	
}

exports.searchHash = function(req, res) {
	console.log("in searchHash node");

	var tag = req.session.hashtag;
	console.log(tag);
	var searchHashQuery = "select tweetid from hashtag where hashtagstring='" + tag + "'";
 	var getSearchTweets = "select users.username, tweet, DATE_FORMAT(date,'%d/%m/%Y') as date_formatted, time from tweets, users where tweetid in (" + searchHashQuery + ") and tweets.userid= users.userid order by date DESC, time DESC";
	
	mysql.fetchData(function(err,results) {

		if(err) {
			console.log("Error in fetchData");
			console.log(err);
			throw err;
		}
		else {
			console.log("User(s) Found!");
			console.log(results);
			if(results.length > 0) {
				json_responses = {
					"statusCode" : 200,
					"iduser" : req.session.userid,
					"results" : results
				};
				console.log(json_responses);
				res.send(json_responses);
				//res.render("searchresults", {data : json_response});
			}
			else {

			}
		}
	},getSearchTweets);
}