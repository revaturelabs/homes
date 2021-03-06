angular.module('rhmsApp').controller('editApartmentController', ['$scope', '$http', '$mdDialog','$state', '$stateParams','$mdToast','$rootScope', function($scope, $http, $mdDialog, $state, $stateParams, $mdToast, $rootScope) {
	
    $http.get("/api/complex/unit/"+$stateParams.apartmentId)
    .success(function(data) {
        $scope.unit = data;
        $scope.oldUnit = data;
        
    })
    .error(function(){
    	$mdToast.show($mdToast.simple().textContent("An Error Occured").position('top right'));
    });

	
    $scope.editApartmentFormSubmit = function () {

        var onSuccess = function (data, status, headers, config) {
        	
            let oldBuildingNumber = $scope.oldUnit.buildingNumber;
            let oldUnitNumber = $scope.oldUnit.unitNumber;
            let oldComplex = $scope.oldUnit.complex.name;
            let oldChannelName = "";
        	
            $http.get('/api/slack/unit/channelName/' + oldComplex + '/' + oldBuildingNumber + 
            		'/' + oldUnitNumber)
            		.success(function(data){
            			oldChannelName = data; 
            		
            			$http.post('api/slack/unit/update', {oldName: oldChannelName,
            				newComplex: $scope.unit.complex,
            				newBuilding: $scope.unit.buildingNumber, 
            				newUnit: $scope.unit.unitNumber,token:$rootScope.rootUser.token});
        	
        	$mdToast.show($mdToast.simple().textContent("Unit Updated").position('top right'));
            $state.go('home.showApartment', { apartmentId: $stateParams.apartmentId});
            		});
        };

        var onError = function (data, status, headers, config) {
        	$mdToast.show($mdToast.simple().textContent("An Error Occured").position('top right'));
        }
        		
        $http.put('/api/complex/unit/'+$stateParams.apartmentId, $scope.unit)
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
        $scope.apartment = "";
    };
}]);
