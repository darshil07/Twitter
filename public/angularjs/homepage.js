console.log("in homepage.js");

var homepage = angular.module('homepage',['ngRoute']);

homepage.controller('homepage', function($scope, $http, $route) {
	
	//get Tweet Count
	$http({
		method : "POST",
		url : "/gettweetcount",
	}).success(function(data) {
		console.log("in getTweetCount success");
		console.log(data);
		if(data.statusCode==200) {
			console.log("statusCode==200");
			console.log(data.results);
			console.log(data.results[0].countoftweets);
			$scope.tweetcount = "Tweets : " + data.results[0].countoftweets;

		}
		else if(data.statusCode == 401) {
			console.log("statusCode=401");
		}
	}).error(function(error) {
		console.log("in getTweetCount Error");
	});


	//get following Count
	$http({
		method : "POST",
		url : "/getfollowingcount",
	}).success(function(data) {
		console.log("in getfollowingcount success");
		console.log(data);
		if(data.statusCode==200) {
			console.log("statusCode==200");
			console.log(data.results);
			console.log(data.results[0].countoffollowing);
			$scope.followingcount = "Following : " + data.results[0].countoffollowing;

		}
		else if(data.statusCode == 401) {
			console.log("statusCode=401");
		}
	}).error(function(error) {
		console.log("in followerscount Error");
	});

	//get follower Count
	$http({
		method : "POST",
		url : "/getfollowercount",
	}).success(function(data) {
		console.log("in getfollowercount success");
		console.log(data);
		if(data.statusCode==200) {
			console.log("statusCode==200");
			console.log(data.results);
			console.log(data.results[0].countoffollower);
			$scope.followercount = "Followers : " + data.results[0].countoffollower;

		}
		else if(data.statusCode == 401) {
			console.log("statusCode=401");
		}
	}).error(function(error) {
		console.log("in followercount Error");
	});


	//get following users' tweets
	$http({
		method : 'POST',
		url : '/getfollowingtweets'
	}).success(function(data) {
		console.log("in getfollowingtweets success");
		console.log(data);
		if(data.statusCode==200) {
			//setting the follwing users' tweets data
			$scope.tweet = new Array();
			$scope.date_formatted = new Array();
			$scope.time = new Array();
			$scope.followingusername = new Array();
			$scope.followingtweetid = new Array();
			$scope.isRetweeted = new Array();

			var index=0;
			
			angular.forEach(data.results, function(value, key) {
				console.log(value.tweet);
				console.log(value.date_formatted);
				console.log(value.time);
				console.log(value.username);
				console.log(value.tweetid);
				
				$scope.tweet[index] = value.tweet;
				$scope.date_formatted[index] = value.date_formatted;
				$scope.time[index] = value.time;
				$scope.followingusername[index] = value.username;
				$scope.followingtweetid[index] = value.tweetid;
				$scope.isRetweeted[index] = false;

				index++;
			});

			console.log($scope.tweet);
			console.log($scope.date_formatted);
			console.log($scope.time);
			console.log($scope.followingusername);
			console.log($scope.followingtweetid);
			console.log($scope.isRetweeted);

			getRetweetDetails();
		}
		else if(data.statusCode==401) {
			console.log("ERROR :: statusCode=401");
			$scope.tweet = new Array();
		}
	}).error(function(error) {
		console.log("in getfollowingtweets error");
	});

	var getRetweetDetails = function(){
		$http({
			method : 'POST',
			url : '/getretweetdetails'
		}).success(function(data) {
			console.log("in getRetweetDetails data");
			console.log(data);
			console.log("data.results");
			if(data.statusCode==401) { //no retweet
				console.log("statusCode == 401");
				$scope.retweetid= new Array();
			}
			else if(data.statusCode == 200) { //no retweets
				console.log("getretweetdetails - statusCode == 200");
				$scope.retweetid= new Array();

				var index = 0;

				angular.forEach(data.results, function(value, key) {
					console.log(value.tweetid);

					$scope.retweetid[index] = value.tweetid;

					index++;
				});

				console.log("retweetid::" + $scope.retweetid);

				for(var i=0;i<$scope.retweetid.length;i++){
					for(var j=0;j<$scope.followingtweetid.length;j++){
						if($scope.retweetid[i] == $scope.followingtweetid[j]){
							console.log("i=" + i);
							console.log("j=" + j);
							$scope.isRetweeted[j] = true;
						}
					}
				}
			}

		}).error(function(error) {
			console.log("in getRetweetDetails error");
			console.log(error);
		});
	}

	$scope.retweet = function(clickedTweetId) {
		console.log("in retweet function");
		console.log("clickedTweetId :: " + clickedTweetId);
		console.log($scope.retweetid);
		var isRetweeted = false;

		if($scope.retweetid.length>0){
			for(var i=0;i<$scope.retweetid.length;i++){
				if(clickedTweetId == $scope.retweetid[i]){
					isRetweeted=true;

					//delete retweet
					console.log("delete retweet");
					$http({
						method : 'POST',
						url : '/deleteretweet',
						data : {
							deleteretweetid : clickedTweetId
						}
					}).success(function(data){
						console.log("in success of delete retweet");
						console.log(data);
						if(data.statusCode == 401) {
							console.log("in statusCode=401");
							window.alert("ERROR!");
						}
						else if(data.statusCode == 200) {
							console.log("in statusCode=200");
							var loc = window.location.toString();
							console.log(loc);
							var locationString = loc.split("localhost:3000");
					    	console.log(locationString[1]);
					    	window.location.assign(locationString[1]);	
						}
					}).error(function(error){
						console.log("in error of delete retweet user");
					});

				}
			}
		}

		if(!isRetweeted){

			//insert Retweet
			console.log("do retweet");

			$http({
				method : 'POST',
				url : '/insertretweet',
				data : {
						insertretweetid : clickedTweetId
					}
			}).success(function(data){
				console.log("in success of insert retweet");
				console.log(data);
				if(data.statusCode == 401) {
					console.log("in statusCode=401");
					window.alert("ERROR!");
				}
				else if(data.statusCode == 200) {
					console.log("in statusCode=200");
					var loc = window.location.toString();
					console.log(loc);
					var locationString = loc.split("localhost:3000");
				   	console.log(locationString[1]);
				   	window.location.assign(locationString[1]);	
				}
			}).error(function(error){
				console.log("in error of insert retweet");
			});
		}
	}

	$scope.doTweet = function() {
		
		console.log("Tweet is " + $scope.inputTweet);
		if($scope.inputTweet!='')
			$http({
				method : "POST",
				url : "/doTweet",
				data : {
					tweet : $scope.inputTweet
				}
			}).success( function(data) {
				console.log("in success of tweet");
				if(data.statusCode == 401) {
					console.log("in statusCode=401");
					window.alert("ERROR! Tweet is not posted! Please try again");
				}
				else if(data.statusCode == 200) {
					/*window.location.assign('/homepage');*/
					//window.loaction.reload();
					//$route.reload();
					var loc = window.location.toString();
					console.log(loc);
					var locationString = loc.split("localhost:3000");
				    console.log(locationString[1]);
				    window.location.assign(locationString[1]);
				}
			}).error(function(error) {
				console.log("in error of tweet");
			})
	};

	$scope.search = function() {
		console.log("in search Function");

		var searchStr = $scope.inputSearch.toString();

		console.log("searchString :: " + searchStr);

		if(searchStr.length>0) {
			if(searchStr.charAt(0)!= '#'){ //Search String is a user Search
				console.log("in user search");
				console.log("searchString:" + searchStr);
				
				$http({
					method : "POST",
					url : "/userSearchResults",
					data : {
						searchUsername : searchStr
					}
				}).success( function(data) {
					console.log("in success of search");
					console.log(data);
					if(data.statusCode == 401) {
						console.log("in statusCode=401");
						window.alert("ERROR!");
					}
					else if(data.statusCode == 200) {
						console.log("in statusCode=200");
						window.location.assign("/usrSearchResults");
						
					}
				}).error(function(error) {
					console.log("in error of search");
					console.log(error);
				});

				//window.location.assign("/userSearchResults/?searchUsername=" + searchStr);
			}
			else {//Search String is HashTag Search
				if(searchStr.length>1){
					console.log("in hashtag search");

					$http({
						method : 'POST',
						url : '/searchHashTag',
						data : {
							hashtag : searchStr
						}
					}).success(function(data) {
						
						console.log(data);
						if(data.statusCode == 401) {
							console.log("in statusCode=401");
							window.alert("ERROR!");
						}
						else if(data.statusCode == 200) {
							console.log("in statusCode=200");
							window.location.assign("/srcHashTag");
						}
					}).error(function(error) {
						console.log("in error hashtag search");
						console.log(error);
					});
					//window.location.assign("/hashtagSearchResults/?hashtag=" + searchString);
				}
			}
		}
	};
})