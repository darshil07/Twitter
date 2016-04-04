console.log("in tweet angular controller");

var viewprofile = angular.module('viewprofile',['ngRoute']);

viewprofile.controller('viewprofile', function($scope, $http, $route, $location) {

	$scope.doTweet = function() {
		
		console.log("Tweet is " + $scope.inputTweet);
		console.log(window.location);
		console.log($location.path());
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
					window.loaction.reload();
					//$route.reload();
				}
			}).error(function(error) {
				console.log("in error of tweet");
			})
		}
})