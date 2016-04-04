var ejs = require("ejs");
var mysql = require('./mysql');


exports.getprofiledetails = function(req,res) {
	console.log("in getprofiledetails node");

	var email = req.param("email");
	console.log(req.session);
	console.log("email :: " + req.session.email);

	var getProfileQuery = "select username, password, firstname, lastname, email, gender, DATE_FORMAT(birthdate,'%d/%m/%Y') as date, location, contact from users where email = '" + req.session.email + "'";

	console.log("getProfileQuery:: "+getProfileQuery);

	mysql.fetchData(function(err,results) {
		if(err) {
				throw err;
		}
		else {
			if(results.length > 0) {
				console.log("Profile Getting Successful");
				console.log("Username :  " + results[0].username);

				var username = results[0].username;
				var firstname = results[0].firstname;
				var lastname = results[0].lastname;
				var email = results[0].email;
				var gender = results[0].gender;
				var birthdate = results[0].birthdate;
				var location = results[0].location;
				var contact = results[0].contact;

				json_responses = {
									"statusCode" : 200,
									"username" : results[0].username,
									"firstname" : results[0].firstname,
									"lastname" : results[0].lastname,
									"email" : results[0].email,
									"gender" : results[0].gender,
									"birthdate" : results[0].date,
									"location" : results[0].location,
									"contact" : results[0].contact
								};
				res.send(json_responses);
			}
			else {
				console.log("Could not get Profile");
				json_responses = {"statusCode" : 401};
				res.send(json_responses);
			}
		}
	},getProfileQuery);
};

exports.getUserTweetsDetails = function(req,res) {
	console.log("in getUserTweetsDetails node");

	var userid = req.session.userid;
	console.log("userid = " + userid);
	//var getUserTweetsQuery = "select tweetid,tweet,DATE_FORMAT(date,'%d/%m/%Y') as date_formatted,time from tweets where userid=" + req.session.userid + " order by date DESC, time DESC";
	var getUserTweetsQuery = "select * from ((select ownerid as userid, tweets.tweet,DATE_FORMAT(retweets.date,'%d/%m/%Y') as date_formatted,retweets.time as time from tweets, retweets where retweets.tweetid = tweets.tweetid and retweeterid=" + userid + ") UNION (select userid, tweet,DATE_FORMAT(date,'%d/%m/%Y') as date_formatted,time as time from tweets where userid=" + userid + ")) as t order by date_formatted DESC, time DESC";

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
						"userTweets" : results
					};
					res.send(json_responses);
				}
				else {
					console.log("No User Tweets");
					json_responses = {
						"statusCode" : 401,
						"iduser" : req.session.userid,
						"tweet" : 0
					};
					console.log(json_responses);
					res.send(json_responses);
				}
			}
		}, getUserTweetsQuery);
}