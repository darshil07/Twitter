console.log("in viewfollowing.js");

var viewfollower = angular.module('viewfollower',['ngRoute']);

viewfollower.controller('viewfollower', function($scope, $http, $route) {

	$http({
		method : 'POST',
		url : '/getfollower'
	}).success(function(data) {
		console.log("in getfollower success");
		console.log(data.results);
		console.log(data.statusCode);
		console.log(data);

		if(data.statusCode == 401) {
			console.log("followerUser--statusCode == 401");
			$scope.isFollowerList=0;
			
		}
		else if(data.statusCode == 200) {
			console.log("followerUser--statusCode == 200");
			$scope.isFollowerList=2;

			//setting the follower results' data
			$scope.userid = data.iduser;

			$scope.name = new Array();
			$scope.followerusername = new Array();
			$scope.followeruserid= new Array();
			$scope.isFollowing = new Array();
			//$scope.isUserInSearch = new Array();

			var index=0;
			
			angular.forEach(data.results, function(value, key) {
				console.log(value.firstname);
				console.log(value.lastname);
				console.log(value.username);
				console.log(value.userid);
				
				$scope.name[index] = value.firstname + " " + value.lastname;
				$scope.followerusername[index] = value.username;
				$scope.followeruserid[index] = value.userid;
				$scope.isFollowing[index] = false;
				
				index++;
			});

			console.log($scope.name);
			console.log($scope.followerusername);
			console.log($scope.followeruserid);
			console.log($scope.isFollowing);
			console.log("userid:: " + $scope.userid);

			getFollowing();
		}
	}).error(function(error) {
		console.log("in error get follower");
		console.log(error);
	});



	//getFollowing
	var getFollowing = function() {
		$http({
			method : 'POST',
			url : '/getfollowingid'
		}).success(function(data) {
			console.log("in success get followingid");
			console.log(data);
			console.log(data.results);

			if(data.statusCode == 401) {
				console.log("getfollowingid--statusCode == 401");
				$scope.followingid = new Array();

			}
			else if(data.statusCode == 200) {
				console.log("getfollowingid--statusCode == 200");
				
				$scope.followingid = new Array();

				var index = 0;

				angular.forEach(data.results, function(value, key) {
					console.log(value.followingid);

					$scope.followingid[index] = value.followingid;

					index++;
				});


				console.log("followeruserid::" + $scope.followeruserid);
				console.log("followeruserid.length::" + $scope.followeruserid.length);

				for(var i=0;i<$scope.followingid.length;i++){
					for(var j=0;j<$scope.followeruserid.length;j++){
						if($scope.followingid[i] == $scope.followeruserid[j]){
							console.log("i=" + i);
							console.log("j=" + j);
							$scope.isFollowing[j] = true;
						}
					}
				}

				console.log("isFollowing :: " + $scope.isFollowing);
				console.log("followingId :: " + $scope.followingid);
			}

		}).error(function(error){
			console.log("in error get followeruserid");
			console.log(error);
		});
	}

	$scope.follow = function(clickedFollowingId) {
		console.log("in follow angular");
		console.log("clickedFollowingId:" + clickedFollowingId);
		var isUnfollowed = false;

		if($scope.followingid.length>0){
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
		}

		if(!isUnfollowed) {
			//insert following
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