//loading the 'login' angularJS module
var login = angular.module('login', []);
//defining the login controller
login.controller('login', function($scope, $window ,$http) {
	//Initializing the 'invalid_login' and 'unexpected_error' 
	//to be hidden in the UI by setting them true,
	//Note: They become visible when we set them to false
	$scope.invalid_login = true;
	$scope.unexpected_error = true;
	$scope.submit = function() {
		console.log("inside submit");
		console.log("email ::" + $scope.email);
		console.log("password:: " + $scope.password)

		$http({
			method : "POST",
			url : '/checklogin',
			data : {
				"email" : $scope.email,
				"password" : $scope.password
			}
		}).success(function(data) {
			console.log("inside success");
			console.log("data is ::");
			console.log(data);
			console.log(data.statusCode);
			//checking the response data for statusCode
			if (data.statusCode == 401) {
				$scope.invalid_login = false;
				$scope.unexpected_error = true;
				$window.alert("invalid_login");

			}
			else if(data.statusCode != 401 && data.statusCode == 200) {
				//Login Successful
				$scope.invalid_login = true;
				$scope.unexpected_error = true;
				//Redirecting to HomePage
				console.log("Redirecting to HomePage");
				window.location.assign("/homepage");
			}
				//Making a get call to the '/redirectToHomepage' API
				 
		}).error(function(error) {
			console.log("inside error");
			console.log(error);
			$scope.unexpected_error = false;
			$scope.invalid_login = true;
			$window.alert("unexpected_error");
		});
	};

	$scope.signup = function() {
		console.log("in sign up controller");
		$http({
			method : "GET",
			url : '/signup'
			}).success(function(data) {
				//checking the response data for statusCode
				if (data.statusCode == 401) {
					
				}
				else
					//Making a get call to the '/redirectToHomepage' API
					window.location.assign("/signup");
			}).error(function(error) {
				
			})
	};
})
