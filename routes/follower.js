var ejs = require("ejs");
var mysql = require('./mysql');

exports.getfollowingid = function(req, res) {
	console.log("in getfollowerid node");

	var userid = req.session.userid;
	var getFollowerQuery = "select followingid from follow where followerid=" + userid;

	mysql.fetchData(function(err,results) {
			if(err) {
				console.log("Error in fetchData");
				console.log(err);
				throw err;
			}
			else {
				console.log("success in query firing");
				console.log(results);

				if(results.length >0) {
					console.log("User(s) found");
					json_responses = {
						"statusCode" : 200,
						"iduser" : req.session.userid,
						"results" : results
					}
					console.log(json_responses);
					res.send(json_responses);
				}
				else
				{
					json_responses = {
						"statusCode" : 401
					}
					res.send(json_responses);
				}
			}
	},getFollowerQuery);
}

exports.deletefollowing = function(req, res) {
	console.log("in delete Following node");

	var deletefollowingid = req.param("deletefollowingid");
	console.log(deletefollowingid);

	var deletefollowingquery = "delete from follow where followingid=" + deletefollowingid + " and followerid=" + req.session.userid;

	mysql.deleteData(deletefollowingquery, function(err,results) {
		if(err) {
				console.log("Error in deleteData");
				console.log(err);
				throw err;
			}
		else {
			console.log("successfully Unfollowed");
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

exports.insertfollowing = function(req, res) {
	console.log("in insert Following node");

	var insertfollowingid = req.param("insertfollowingid");
	console.log(insertfollowingid);

	var insertfollowingquery = "insert into follow (followerid, followingid) values(" + req.session.userid + "," + insertfollowingid + ")";

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

exports.viewfollowing = function(req, res) {
	console.log("in viewfollowing node");

	res.render("viewfollowing",{"username" : req.session.username, "userid" : req.session.userid, "email" : req.session.email});
}

exports.viewfollowers = function(req, res) {
	console.log("in viewfollowers node")

	res.render("viewfollowers",{"username" : req.session.username, "userid" : req.session.userid, "email" : req.session.email});
}

exports.getfollowing = function(req, res) {
	console.log("in getfollowing node");
	var userid = req.session.userid;
	var getFollowingIdQuery = "select followingid from follow where followerid=" + userid;
	var getFollowingDetailsQuery = "select userid, username, firstname, lastname from users where userid in (" + getFollowingIdQuery + ") order by firstname";

	mysql.fetchData(function(err,results) {
			if(err) {
				console.log("Error in fetchData");
				console.log(err);
				throw err;
			}
			else {
				console.log("success in query firing");
				console.log(results);

				if(results.length >0) {
					console.log("Following User(s) details found");
					json_responses = {
						"statusCode" : 200,
						"iduser" : req.session.userid,
						"results" : results
					}
					console.log(json_responses);
					res.send(json_responses);
				}
				else
				{
					json_responses = {
						"statusCode" : 401
					}
					res.send(json_responses);
				}
			}
	},getFollowingDetailsQuery);
}

exports.getfollower = function(req, res) {
	console.log("in getfollower node");
	var userid = req.session.userid;
	var getFollowerIdQuery = "select followerid from follow where followingid=" + userid;
	var getFollowerDetailsQuery = "select userid, username, firstname, lastname from users where userid in (" + getFollowerIdQuery + ") order by firstname";

	mysql.fetchData(function(err,results) {
			if(err) {
				console.log("Error in fetchData");
				console.log(err);
				throw err;
			}
			else {
				console.log("success in query firing");
				console.log(results);

				if(results.length >0) {
					console.log("Follower User(s) details found");
					json_responses = {
						"statusCode" : 200,
						"iduser" : req.session.userid,
						"results" : results
					}
					console.log(json_responses);
					res.send(json_responses);
				}
				else
				{
					json_responses = {
						"statusCode" : 401
					}
					res.send(json_responses);
				}
			}
	},getFollowerDetailsQuery);
}

exports.getfollowingtweets = function(req, res) {
	console.log("in getfollowingtweets node");

	var userid = req.session.userid;
	var getFollowingIdQuery = "select followingid from follow where followerid=" + userid;
	//var getFollowingTweetsQuery = "select tweet,DATE_FORMAT(date,'%d/%m/%Y') as date_formatted,time from tweets where userid in ("+ getFollowingIdQuery + ") order by date DESC, time DESC";
	var getFollowingTweetsQuery = "select users.username,tweets.tweetid,tweet,DATE_FORMAT(date,'%d/%m/%Y') as date_formatted,time from tweets,users where tweets.userid in (" + getFollowingIdQuery + ")  and users.userid= tweets.userid order by date DESC, time DESC";

	mysql.fetchData(function(err, results){
		if(err) {
			console.log("Error in fetchData");
			console.log(err);
			throw err;
		}
		else {
			console.log("success in query firing");
			console.log(results);

			if(results.length >0) {
				console.log("Following User(s) tweets found");
				json_responses = {
					"statusCode" : 200,
					"iduser" : req.session.userid,
					"results" : results
				}
				console.log(json_responses);
				res.send(json_responses);
			}
			else
			{
				json_responses = {
					"statusCode" : 401
				}
				res.send(json_responses);
			}
		}
	},getFollowingTweetsQuery);
}