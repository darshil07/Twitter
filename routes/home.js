var ejs = require("ejs");
var mysql = require('./mysql');
var bcrypt = require('./bCrypt.js')

function home(req,res) {
	
	if(req.session.username && req.session.email && req.session.userid) {
		res.header('Cache-Control', 'no-cache, private, no-store, must-revalidate, max-stale=0, post-check=0, pre-check=0');
		
		//here all the data should be post
		res.render("homepage",{username : req.session.username, userid : req.session.userid,email : req.session.email});
	}
	else {
		ejs.renderFile('./views/home.ejs',function(err, result) {
			   // render on success
			   if (!err) {
			            res.end(result);
			   }
			   // render or error
			   else {
			            res.end('An error occurred');
			            console.log(err);
			   }
		   });
	}
}

function signin(req,res) {

	ejs.renderFile('./views/signin.ejs',function(err, result) {
	   // render on success
	   if (!err) {
	            res.end(result);
	   }
	   // render or error
	   else {
	            res.end('An error occurred');
	            console.log(err);
	   }
   });
}

function checksignup(req,res) {

	//request parameters
	var email = req.param("email");

	if(email!='') {
		//check if email already exists
		var checkEmailQuery =  "select email from users where email = '" + email + "'";
		console.log("Query is :: " + checkEmailQuery);
	
		mysql.fetchData(function(err,results) {
			if(err) {
				throw err;
			}
			else {
				if(results. length > 0) {
					console.log("Email exists!");
					res.send("true");
				}
				else {
					console.log("Email Doesn't exists");
					res.send("false");
				}
			}
		}, checkEmailQuery); 
	}
	
}

function checklogin(req,res) {

	console.log("in checklogin");

	var email = req.param("email");
	var password = req.param("password");
	
	console.log("email :: " + email);
	console.log("password :: " + password);

	if(email != '') {
		var checkLoginQuery = "select username,userid from users where email = '" + email + "' and password = '" + password + "'";
		console.log("Query:: " + checkLoginQuery);

		mysql.fetchData(function(err,results) {
			if(err) {
				throw err;
			}
			else {
				if(results.length > 0) {
					//if(bcrypt.compareSync(password,results[0].password)) {
						console.log("Successful Login");
						console.log("Username :  " + results[0].username);
						//Assigning the session
						req.session.email = email;
						req.session.username = results[0].username;
						req.session.userid = results[0].userid;
						console.log("Session Initialized with email : " + req.session.email);
						console.log("username :: " + req.session.username);
						console.log("userid :: " + req.session.userid);
						json_responses = {"statusCode" : 200};
						res.send(json_responses);
					}
					//else {
					//	console.log("Invalid Password");
					//	json_responses = {"statusCode" : 401};
					//	res.send(json_responses);
					//}
				//}
				else {
					console.log("Invalid Login");
					json_responses = {"statusCode" : 401};
					res.send(json_responses);
				}
			}
		}, checkLoginQuery);
	}
}

function signup(req,res) {

	//console.log("isEmailExists :: " + req.param("isEmailExists"));
	ejs.renderFile('./views/signup.ejs',function(err, result) {
	   // render on success
	   if (!err) {
	            res.end(result);
	   }
	   //render or error
	   else {
	            res.end('An error occurred during rendering signup Page!');
	            console.log(err);
	   }
   });
}



function aftersignup(req, res) {
	console.log("In aftersignup");

	var username = req.param("username");
	var lastname = req.param("lastname");
	var firstname = req.param("firstname");
	var email = req.param("email");
	var gender = req.param("gender");
	var password = req.param("password");
	var birthdate = req.param("birthdate");
	var contact = req.param("contact");
	var location = req.param("location");

	console.log("username :: " + username);
	console.log("lastname :: " + lastname);
	console.log("firstname :: " + firstname);
	console.log("password :: " + password);
	console.log("email :: " + email);
	console.log("gender :: " + gender);
	console.log("contact :: " + contact);
	console.log("birthday :: " + birthdate);
	console.log("location : " + location);

	var hash = bcrypt.hashSync(password);

	var query = "INSERT INTO users (username, password, firstname, lastname, email, gender, birthdate, location, contact) VALUES ('" + username + "','" + hash + "','" + firstname + "','" + lastname + "','" + email + "','" + gender + "','" + birthdate + "','" + location + "','" + contact  + "')";
	console.log("Query:: " + query);

	mysql.storeData(query, function(err, result){
		//render on success
		if(!err){
			console.log('Valid SignUp!');
			/*ejs.renderFile('./views/successSignUp.ejs', {data : result}, function(err, result){
				//render on success
				if(!err){
					res.end(result);
				}
				//render or error
				else{
					res.end('Error occurred during successSignUp.ejs');
					console.log(err);
				}
			});*/
			res.send("true");
		}
		//render or error
		else{
			console.log('Invalid SingUp!');
			/*ejs.renderFile('./views/failSignUp.ejs', function(err, result){
				//render on success
				if(!err){
					res.end(result);
				}
				//render or error
				else{
					res.end('Error occurred during failSignUp.ejs');
					console.log(err);
				}
			});*/
			res.send("false");
		}
	});
}

function homepage(req,res) {
	if(req.session.username && req.session.email && req.session.userid) {
		//Set these headers to notify the browser not to maintain any cache for the page being loaded
		res.header('Cache-Control', 'no-cache, private, no-store, must-revalidate, max-stale=0, post-check=0, pre-check=0');
		
		//here all the data should be post
		res.render("homepage",{username : req.session.username, userid : req.session.userid,email : req.session.email});
		
	}
	else {
		res.redirect('/');
	}
}

function logout(req,res) {
	console.log("in logout");
	req.session.destroy();
	
	res.redirect("/");
}

function viewprofile(req,res) {
	console.log("in view profile node");
	if(req.session.username && req.session.email && req.session.userid) {
		var email = req.session.email;
	
		console.log("email :: " + email);
	
		if(email != '') {
			
			res.render('viewprofile',{userid:req.session.userid,username:req.session.username,email : req.session.email});
			
		}
	}
}

function gettweetcount(req, res) {
	console.log("in home.gettweetcount node");
	//var getTweetCountQuery = "select count(tweet) as countoftweets from tweets where userid=" + req.session.userid;
	var getTweetCountQuery = "select (count1 + count2) as countoftweets from (select count(DISTINCT tweets.tweet) as count1, count(DISTINCT retweets.tweetid) as count2 from tweets, retweets where tweets.userid=" + req.session.userid + " and retweets.retweeterid="+ req.session.userid + " group by tweets.userid, retweets.retweeterid) as t";

	mysql.fetchData(function(err,results) {
			if(err) {
				console.log("ERROR!");
				throw err;
			}
			else {
				if(results. length > 0) {
					console.log("count of tweets::");
					console.log(results.countoftweets);
					json_responses = {
						"statusCode" : 200,
						"results" : results
					}
					console.log(json_responses)
					res.send(json_responses);
				}
				else {
					console.log("tweet count::0");
					json_responses = {
						"statusCode" : 401
					}
					console.log(json_responses);
					res.send(json_responses);
				}
			}
	}, getTweetCountQuery);

}

function getfollowingcount(req, res) {
	console.log("in home.getfollowingcount node");
	var getFollowingCountQuery = "select count(followingid) as countoffollowing from follow where followerid=" + req.session.userid;

	mysql.fetchData(function(err,results) {
			if(err) {
				console.log("ERROR!");
				throw err;
			}
			else {
				if(results. length > 0) {
					console.log("count of following::");
					console.log(results.countoffollowing);
					json_responses = {
						"statusCode" : 200,
						"results" : results
					}
					console.log(json_responses)
					res.send(json_responses);
				}
				else {
					console.log("following count::0");
					json_responses = {
						"statusCode" : 401
					}
					console.log(json_responses);
					res.send(json_responses);
				}
			}
	}, getFollowingCountQuery);
}

function getfollowercount(req, res) {
	console.log("in home.getfollowercount node");
	var getFollowerCountQuery = "select count(followerid) as countoffollower from follow where followingid=" + req.session.userid;

	mysql.fetchData(function(err,results) {
			if(err) {
				console.log("ERROR!");
				throw err;
			}
			else {
				if(results. length > 0) {
					console.log("count of follower::");
					console.log(results.countoffollower);
					json_responses = {
						"statusCode" : 200,
						"results" : results
					}
					console.log(json_responses)
					res.send(json_responses);
				}
				else {
					console.log("follower count::0");
					json_responses = {
						"statusCode" : 401
					}
					console.log(json_responses);
					res.send(json_responses);
				}
			}
	}, getFollowerCountQuery);
}

function error(req, res) {
	ejs.renderFile('./views/errorpage.ejs',function(err, result) {
	   // render on success
	   if (!err) {
	            res.end(result);
	   }
	   // render or error
	   else {
	            res.end('An error occurred');
	            console.log(err);
	   }
   });
}

exports.home=home;
exports.signin=signin;
exports.checksignup= checksignup;
exports.checklogin=checklogin;
exports.signup=signup;
exports.aftersignup=aftersignup;
exports.homepage=homepage;
exports.logout=logout;
exports.viewprofile = viewprofile;
exports.gettweetcount = gettweetcount;
exports.getfollowingcount = getfollowingcount;
exports.getfollowercount = getfollowercount;
exports.error = error;
//exports.failsignUp=failsignup;