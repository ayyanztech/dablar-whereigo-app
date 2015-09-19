'use strict';

angular.module('dablarWhereigoAppApp')
  .controller('MainCtrl', function ($scope, $http) {
    $scope.bars = {};
    $scope.errorMsg = '';

    var $grid; // masonry variable


/*    $http.get('/api/bars/getFrom/sevilla').success(function(bars) {
      $scope.bars = bars;
    });
*/
    
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
      $http.get('/api/bars/getFrom/' + $scope.giveMeBarsForm.location).success(function (bars) {

        console.log(bars);
        $scope.bars = bars;
        $grid = $('.grid').masonry({ columnWidth: '.grid-item', itemSelector: '.grid-item',  isAnimated: false});
      }).error(function(err) {
        console.log(err);
        $scope.errorMsg = err;
      });
    };

    $scope.addPersonToBar = function(bar) {
      if (! $scope.getCurrentUser() || !$scope.getCurrentUser()._id){
        return alert('log you!!');
      }

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
