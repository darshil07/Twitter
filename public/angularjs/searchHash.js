console.log("in searchHash.js");

var searchHash = angular.module('searchHash',['ngRoute']);

searchHash.controller('searchHash', function($scope, $http, $route, $sce) {

	$scope.toTrustedHTML = function (html) {
    	return $sce.trustAsHtml(html);
  	};

	/*$scope.userid = window.useridScript;*/
	console.log("scope.userid :: " + $scope.userid);
	console.log(window.useridScript);
	console.log(window.searchUsername);

	$http({
		method : 'POST',
		url : "/searchHash",
		data : {
			searchHash : window.searchHash
		}
	}).success(function(data) {
		console.log("in searchHash success");
		console.log(data.results);
		console.log(data.statusCode);
		console.log(data);

		if(data.statusCode == 401) {
			console.log("searchHash--statusCode == 401");
			$scope.isTweets=0;
		}
		else if(data.statusCode == 200) {
			console.log("searchHash--statusCode == 200");
			$scope.isTweets=2;

			//setting the search results' data
			$scope.userid = data.iduser;

			$scope.username = new Array();
			$scope.tweet = new Array();
			$scope.date_formatted = new Array();
			$scope.time = new Array();
			//$scope.isUserInSearch = new Array();

			var index=0;
			
			angular.forEach(data.results, function(value, key) {
				console.log(value.username);
				console.log(value.tweet);
				console.log(value.date_formatted);
				console.log(value.time);
				
				$scope.username[index] = value.username;
				$scope.tweet[index] = value.tweet;
				$scope.date_formatted[index] = value.date_formatted;
				$scope.time[index] = value.time;

				index++;
			});

			console.log($scope.username);
			console.log($scope.tweet);
			console.log($scope.date_formatted);
			console.log($scope.time);
			console.log("userid:: " + $scope.userid);

			for(temp in $scope.tweet) {
				var tagslistarr = $scope.tweet[temp].match(/#\S+/g);
				console.log("tagslistarr :: " + tagslistarr);
				for(tag in tagslistarr) {
					//$scope.tweet[temp] = $scope.tweet[temp].replace(tagslistarr[tag],"<a href='/searchHash?hashtag='" + tagslistarr[tag] + "''>" + tagslistarr[tag] + "</a>");
					$scope.tweet[temp] = $scope.tweet[temp].replace(tagslistarr[tag],"<button type= \"submit\" class=\"btn btn-link\" ng-click=\"searchHash(\'"+ tagslistarr[tag] + "\');\">" + tagslistarr[tag] + "</button>");
					console.log($scope.tweet);
				}
			}
		}
	}).error(function(error) {
		console.log("in searchUser error");
		console.log(error);
	});

	console.log("before getFollowing call");

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
			else {
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

	$scope.follow = function(clickedFollowingId) {
		console.log("in follow function");
		var isUnfollowed = false;

		for(var i=0;i<$scope.followingid.length;i++) {
			if(clickedFollowingId == $scope.followingid[i]){
				
				isUnfollowed = true;

				//delete following
				$http({
					method : 'POST',
					url : '/deletefollowing',
					data : {
						deletefollowingid : clickedFollowingId
					}
				}).success(function(data){
					console.log("in success of delete following users");
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
					console.log("in error of delete following user");
				});
			}
		}

		if(!isUnfollowed) {
			//insert follower
			$http({
				method : 'POST',
				url : '/insertfollowing',
				data : {
						insertfollowingid : clickedFollowingId
					}
			}).success(function(data){
				console.log("in success of insert following user");
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
				console.log("in error of insert following user");
			});
		}
	}
});