'use strict';

angular.module('dablarWhereigoAppApp')
  .controller('MainCtrl', function ($scope, $http, Auth) {
    $scope.bars = {};
    $scope.errorMsg = '';
    var $grid; // masonry variable

    //searhcing for the last user location
    if (Auth.getCurrentUser() && Auth.getCurrentUser().lastLocation) {
      console.log('Searching in last location user searched: ' + Auth.getCurrentUser().lastLocation);
      $scope.isProcessing = true;
      $http.get('/api/bars/getFrom/' + Auth.getCurrentUser().lastLocation).success(function (bars) {
        $scope.bars = bars;
        $grid = $('.grid').masonry({ columnWidth: '.grid-item', itemSelector: '.grid-item',  isAnimated: true});
        $scope.isProcessing = false;
      }).error(function(err) {
        console.log(err);
        $scope.errorMsg = err;
      });
    }

   
    $scope.$on('onRepeatLast', function(  ) {
      $grid.masonry('reloadItems'); 

      $grid.imagesLoaded().progress( function() {
        $grid.masonry('layout');
      });
    });
    
    $scope.searchBars = function() { 
      if ($scope.giveMeBarsForm.location === '') {
        $scope.errorMsg = 'Invalid location';
        return;
      }
      $scope.isProcessing = true;
      $scope.errorMsg = '';
      $http.get('/api/bars/getFrom/' + $scope.giveMeBarsForm.location).success(function (bars) {

        $scope.bars = bars;
        $grid = $('.grid').masonry({ columnWidth: '.grid-item', itemSelector: '.grid-item',  isAnimated: true});

        $scope.isProcessing = false;

        //if user is logged, save the location searched
        if (Auth.getCurrentUser() &&  $scope.getCurrentUser()._id) {
          $http.put('/api/users/' + $scope.getCurrentUser()._id + '/location', 
              {lastLocation: $scope.giveMeBarsForm.location}).success( function(userUpdated) {
          });
        }
      }).error(function(err) {
        console.log(err);
        $scope.errorMsg = err;
      });
    };

    $scope.addOrRemovePersonToBar = function(bar) {
      $scope.isProcessing = true;
      if (! $scope.getCurrentUser() || !$scope.getCurrentUser()._id){
        return;
      }

      //delete from the bar
      if ( $scope.isCurrentUserInThisBar(bar.usersIn) ) {
        if (bar.usersIn.length === 1) { //delete the bar 
          $http.delete('/api/bars/' + bar._id).success(function (){ 
            bar.usersIn = [];
            delete bar._id;
            $scope.isProcessing = false;
          }).error(function (err) {
            console.log(err);
            $scope.errorMsg = err;
         });
        } else { //delete only the user from the bar

          for (var i =0; i < bar.usersIn.length; i++){
             if (bar.usersIn[i].userId === $scope.getCurrentUser()._id) {
                bar.usersIn.splice(i,1);
                i = bar.usersIn.length;
             }
          }
          var newBar = { 
            _id: bar._id,
            yelpId: bar.id,
            usersIn: bar.usersIn
          };
          // and update the bar
          $http.put('/api/bars/' + bar._id, newBar).success(function (barUpdated){ 
            bar.usersIn = barUpdated.usersIn;
            $scope.isProcessing = false;
          }).error(function (err) {
            console.log(err);
            $scope.errorMsg = err;
         });
        }

        return; 
      }

      //adding user in a bar
      bar.usersIn.push({ userId: $scope.getCurrentUser()._id });
      var ob = { 
        _id: bar._id,
        yelpId: bar.id,
        usersIn: bar.usersIn
      };

      if (bar.usersIn.length === 1) { //create a bar
        $http.post('/api/bars/', ob).success(function(barCreated) {
          bar._id = barCreated._id;
           $scope.isProcessing = false;
        }).error(function (err) {
          console.log(err);
          $scope.errorMsg = err;
        });     
      } else { //update the bar
        $http.put('/api/bars/' + ob._id, ob).success(function(barCreated) {
          bar._id = barCreated._id;
          $scope.isProcessing = false;
        });
      }
    };

    $scope.isCurrentUserInThisBar = function (usersIn) {
      if (!usersIn || usersIn.length <= 0) {
        return false;
      }

      var isIn = false;
      var i = 0;
      
      while (!isIn && i < usersIn.length) {
        //console.log('entra ' + i + ' - ' + $scope.getCurrentUser()._id + ' - ' + usersIn[i].userId);
        if ($scope.getCurrentUser()._id === usersIn[i].userId) {
          isIn = true; 
        }
        i++;
      }
      return isIn;
    };
  });
