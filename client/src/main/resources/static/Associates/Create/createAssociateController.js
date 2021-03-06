angular.module('rhmsApp').controller('createAssociateController', ['$scope', '$http', '$mdDialog','$state', '$stateParams', '$mdToast', '$rootScope', function($scope, $http, $mdDialog, $state, $stateParams, $mdToast, $rootScope) {

	$scope.selected = {};
    $http.get("/api/associates/associates/")
    .then(function(response) {
        $scope.associates = response.data;
    });
   
	$http.get('/api/complex/office')
	.then(function(response){
		$scope.offices = response.data;
	}, function(response){
		$mdToast.show($mdToast.simple().textContent("An Error Occured. Error " + response.status).position('top right'));
	});
	
    $scope.createResidentFormSubmit = function () {

    	$scope.associate.officeId = JSON.parse($scope.selected).officeId;
    	
        var onSuccess = function (data, status, headers, config) {
        	$http.post("/api/slack/resident/invite",{email:$scope.associate.email,fname:$scope.associate.firstName,lname:$scope.associate.lastName, token:$rootScope.rootUser.token});
        	$mdToast.show($mdToast.simple().textContent("Associate Created").position('top right'));
            $state.go('home.showAssociate', { residentId: data.associateId});
            $scope.hide();
            
        };

        var onError = function (data, status, headers, config) {
        	$mdToast.show($mdToast.simple().textContent("An Error Occured").position('top right'));
        }

        $http.post('/api/associates/associates/createOrUpdate/', $scope.associate)
            .success(onSuccess)
            .error(onError);
    };
    
    $scope.hide = function() {
        $mdDialog.hide();
      };
 
      $scope.cancel = function() {
        $mdDialog.cancel();
      };
      
    $scope.resetForm = function () {
        $scope.associate = "";
    };
}]);
