angular.module('rhmsApp').controller('showApartmentController', ['$scope', '$mdBottomSheet','$http', '$mdDialog','$stateParams','$state' ,'$mdToast', '$rootScope', function($scope, $mdBottomSheet,$http, $mdDialog, $stateParams, $state, $mdToast, $rootScope ) {

	$scope.error = false;
	$scope.aptannouncement = ' ';
	
     $http.get("/api/complex/unit/"+$stateParams.apartmentId).then(function(response) {
         $scope.unit = response.data;
         
         $http.get("/api/associates/associates/"+$stateParams.apartmentId+"/unit").then(function(response){
        	 $scope.associates = response.data;
         });
         
        	 $http.get("/api/request/units/"+$scope.unit.unitId +'/maintenance').then(function(response) {
            	 $scope.maintenanceRequests = response.data;
        	 });
        	 
        	 $http.get("/api/request/units/"+$scope.unit.unitId +'/supply').then(function(response) {
            	 $scope.supplyRequests = response.data;
        	 });
        	 
        	 
             if($scope.unit.complex === ''){
            	 $mdToast.show($mdToast.simple().textContent("Complex Not Found").position('top right'));
            	 $scope.error = true;
             } else {
            	 var parsedAddress = "https://www.google.com/maps/embed/v1/directions?key=AIzaSyC9rOv9rx7A2EL0oOZGXkhuvkJYIVfkqGA&origin="+$scope.unit.complex.address.split(' ').join('+')+"&destination="+$scope.unit.complex.office.address+"&avoid=tolls|highways";
            	 document.getElementById('complexMap').src = parsedAddress;
             }
         
     }, function(){
    	 $mdToast.show($mdToast.simple().textContent("Apartment not found").position('top right'));
    	 $scope.error = true;
     });
     
	  $scope.showConfirm = function(deleteApartment) {

		    var confirm = $mdDialog.confirm()
		          .title('Do you really want to delete the Apartment?')
		          .targetEvent(event)
		          .ok('Delete')
		          .cancel('Cancel');

		    $mdDialog.show(confirm).then(function() {
		      $scope.deleteApartment();
		    });
		  };

  $scope.deleteApartment = function () {

      var onSuccess = function (data, status, headers, config) {
    	  $http.post('/api/slack/unit/delete', {channelName: $scope.channelName,token:$rootScope.rootUser.token});
    	  $mdToast.show($mdToast.simple().textContent("Apartment Deleted").position('top right'));
          $state.go('home.showComplex', { complexId: $scope.unit.complex.complexId});
      };

      var onError = function (data, status, headers, config) {
    	  $mdToast.show($mdToast.simple().textContent(data));
      };
      
      $http.get('/api/slack/unit/channelName' + $scope.unit.complex.name + '/' + 
    		  $scope.unit.buildingNumber + '/' + $scope.unit.unitNumber,{token:$rootScope.rootUser.token})
    		  .success(function(data){
    			 $scope.channelName = data; 
    		  });

      $http.delete('/api/complex/unit/'+$stateParams.apartmentId)
      	.success(onSuccess)
      	.error(onSuccess);

  };
  
  $scope.showEditApartmentForm = function(ev) {
	  
	    $mdDialog.show({
	      controller: 'editApartmentController',
	      templateUrl: '/../../Apartments/Edit/edit.html',
	      parent: angular.element(document.body),
	      targetEvent: ev,
	      clickOutsideToClose:true,
	      fullscreen: $scope.customFullscreen // Only for -xs, -sm breakpoints.
	    });
  };
  
  $scope.showRemoveResidentConfirm = function(residentId, removeResident) {

	    var confirm = $mdDialog.confirm()
	          .title('Do you really want to remove the Associate?')
	          .targetEvent(event)
	          .ok('Remove')
	          .cancel('Cancel');

	    $mdDialog.show(confirm).then(function() {
	      $scope.removeResident(residentId);
	    });
	  };
  
	 $scope.removeResident = function (associateId) {

	      var onSuccess = function (data, status, headers, config) {
	    	  $mdToast.show($mdToast.simple().textContent("Resident Removed").position('top right'));
	          $state.go('home.showApartment', { apartmentId: $scope.unit.unitId});
	          $state.reload();
	      };

	      var onError = function (data, status, headers, config) {
	    	  $mdToast.show($mdToast.simple().textContent(data));
	      };

	      $http.delete('api/associates/associates/'+associateId+'/unit')
	      	.success(onSuccess)
	      	.error(onSuccess);

	  };
	  
  $scope.showAssignResidentForm = function(ev) {
		  
		  $mdDialog.show({
			  controller: 'assignResidentController',
			  templateUrl: '/../../Apartments/Assign/assign.html',
			  parent: angular.element(document.body),
			  targetEvent: ev,
			  clickOutsideToClose:true,
			  fullscreen: $scope.customFullscreen // Only for -xs, -sm breakpoints.
		  });
			  
	  };
	  
$scope.sendAnnouncementFormSubmit = function(event){
		  
	  var onSuccess = function (data, status, headers, config) {
          
     	 $mdToast.show($mdToast.simple().textContent("Message sent!").position('top right'));
         
     };

     var onError = function (data, status, headers, config) {
     	 $mdToast.show($mdToast.simple().textContent("An Error Occured").position('top right'));
     }

     let complexName = $scope.unit.complex.name;
     let unitNumber = $scope.unit.unitNumber;
     let buildingNumber = $scope.unit.buildingNumber;
     let token = $rootScope.rootUser.token;
     let message = $scope.aptannouncement;
     
     $http.post('/api/slack/resident/messageUnit', {complex: complexName, unit: unitNumber, building: buildingNumber, message: message, token: token})
         .success(onSuccess)
         .error(onError);

	  };
	  
}]);