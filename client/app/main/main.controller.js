'use strict';

angular.module('dablarWhereigoAppApp')
  .controller('MainCtrl', function ($scope, $http, Auth) {
    $scope.bars = {};
    $scope.errorMsg = '';
    console.log( Auth.getCurrentUser() );


    //$scope.giveMeBarsForm.location = $scope.getCurrentUser(); 
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

   
    $scope.$on('onRepeatLast', function(scope, element, attrs) {
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

        console.log(bars);
        $scope.bars = bars;
        $grid = $('.grid').masonry({ columnWidth: '.grid-item', itemSelector: '.grid-item',  isAnimated: true});

        $scope.isProcessing = false;

        //if user is logged, save the location searched
        if (Auth.getCurrentUser() && Auth.getCurrentUser().lastLocation) {
          console.log('entra')
          $http.put('/api/users/' + $scope.getCurrentUser()._id + '/location', {lastLocation: $scope.giveMeBarsForm.location});
        }
      }).error(function(err) {
        console.log(err);
        $scope.errorMsg = err;
      });
    };

    $scope.addOrRemovePersonToBar = function(bar, event) {
      $scope.isProcessing = true;
      if (! $scope.getCurrentUser() || !$scope.getCurrentUser()._id){
        return alert('log you!!');
      }



      //delete from the bar
      if ( $scope.isCurrentUserInThisBar(bar.usersIn) ) {
        if (bar.usersIn.length == 1) { //delete the bar 
          $http.delete('/api/bars/' + bar._id).success(function (){ 
            bar.usersIn = [];
            delete bar._id;
            $scope.isProcessing = false;
            console.log(bar)
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
          var ob = { 
            _id: bar._id,
            yelpId: bar.id,
            usersIn: bar.usersIn
          };
          // and update the bar
          $http.put('/api/bars/' + bar._id, ob).success(function (barUpdated){ 
            bar.usersIn = barUpdated.usersIn;
            console.log(bar)
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

      if (bar.usersIn.length == 1) { //create a bar
        console.log('creating: ')
        console.log(ob)

        $http.post('/api/bars/', ob).success(function(barCreated) {
          bar._id = barCreated._id;
          console.log('created!')
          console.log(barCreated)
          $scope.isProcessing = false;
        }).error(function (err) {
          console.log(err);
          $scope.errorMsg = err;
        });     
      } else { //update the bar
        console.log('updating: ')
        console.log(ob)
        $http.put('/api/bars/' + ob._id, ob).success(function(barCreated) {
          bar._id = barCreated._id;
          console.log('updated!')
          console.log(barCreated)
          $scope.isProcessing = false;
        });
      }
    };

    $scope.isCurrentUserInThisBar = function (usersIn) { //console.log(usersIn);
      if (!usersIn || usersIn.length <= 0)
        return false  ;

      var isIn = false;
      var i = 0;
      
      while (!isIn && i < usersIn.length) {
        //console.log('entra ' + i + ' - ' + $scope.getCurrentUser()._id + ' - ' + usersIn[i].userId);
        if ($scope.getCurrentUser()._id == usersIn[i].userId) {
          isIn = true; 
        }
        i++;
      }
      //console.log('resultado ' + isIn);
      return isIn;
    }

/*
    $scope.addThing = function() {
      if ($scope.newThing === '') {
        return;
      }
      $http.post('/api/things', { name: $scope.newThing });
      $scope.newThing = '';
    };

    $scope.deleteThing = function(thing) {
      $http.delete('/api/things/' + thing._id);
    };
*/
  });
