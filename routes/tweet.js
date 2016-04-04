var ejs = require("ejs");
var mysql = require('./mysql');

exports.doTweet = function(req,res) {
	console.log("in doTweet");

	var tweet = req.param("tweet");
	console.log("tweet :: " + tweet);
	console.log("email :: " + req.session.email);

	//var getUserIdQuery = "(select userid from users where email = '" + req.session.email + "')";
	var doTweetQuery = "insert into tweets (userid, tweet, date, time) values (" + req.session.userid + ",'" + tweet + "', CURDATE(), CURTIME())";

	console.log("Query :: " + doTweetQuery);

	mysql.storeData(doTweetQuery, function(err, results) {
		if(!err) {
			console.log("Valid Tweet Operation!");
			json_responses = {"statusCode" : 200};

			var taglistarray = tweet.match(/#\S+/g);
			for(tag in taglistarray) {
				handleHashtag(taglistarray[tag], req.session.userid);
			}

			res.send(json_responses);
		}
		else {
			console.log("Invalid Tweet Operation!");
			console.log(err);
			json_responses = {"statusCode" : 401};
			res.send(json_responses);
		}
	})
};

var handleHashtag = function(tag, userid) {

	var getTweetIdQuery = "select max(tweetid) from tweets where userid=" + userid;
	var insertTagQuery = "insert into hashtag (tweetid, hashtagstring) values((" + getTweetIdQuery + "),'" + tag + "')";

	mysql.storeData(insertTagQuery, function(err, result){
		//render on success
		if(!err){
			console.log('New Following user successfully added!');
		}
		else{
			console.log('ERROR! Insertion not done');
			throw err;
		}
	});


}