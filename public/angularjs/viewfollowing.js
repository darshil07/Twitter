console.log("in viewfollowing.js");

var viewfollowing = angular.module('viewfollowing',['ngRoute']);

viewfollowing.controller('viewfollowing', function($scope, $http, $route) {

	$http({
		method : 'POST',
		url : '/getfollowing'
	}).success(function(data) {
		console.log("in getfollowing success");
		console.log(data.results);
		console.log(data.statusCode);
		console.log(data);

		if(data.statusCode == 401) {
			console.log("followingUser--statusCode == 401");
			$scope.isFollowingList=0;
			
		}
		else if(data.statusCode == 200) {
			console.log("followingUser--statusCode == 200");
			$scope.isFollowingList=2;

			//setting the search results' data
			$scope.userid = data.iduser;

			$scope.name = new Array();
			$scope.followingusername = new Array();
			$scope.followinguserid= new Array();
			
			//$scope.isUserInSearch = new Array();

			var index=0;
			
			angular.forEach(data.results, function(value, key) {
				console.log(value.firstname);
				console.log(value.lastname);
				console.log(value.username);
				console.log(value.userid);
				
				$scope.name[index] = value.firstname + " " + value.lastname;
				$scope.followingusername[index] = value.username;
				$scope.followinguserid[index] = value.userid;
				
				index++;
			});

			console.log($scope.name);
			console.log($scope.followingusername);
			console.log($scope.followinguserid);
			
			console.log("userid:: " + $scope.userid);
		}

		
	}).error(function(error) {
		console.log("in error get following");
		console.log(error);
	});

	$scope.unfollow = function(clickedFollowingId) {
		console.log("in unfollow angular");
		console.log("clickedFollowingId:" + clickedFollowingId);

		if(clickedFollowingId!=null || clickedFollowingId!='') {
			
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
});