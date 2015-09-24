'use strict';

angular.module('dablarWhereigoAppApp')
  .config(function($routeProvider) {
    $routeProvider
      .when('/', {
        templateUrl: 'app/main/main.html',
        controller: 'MainCtrl'
      });
  })
  .directive('onLastRepeat', function() {
    return function(scope, element, attrs) {
        if (scope.$last) { setTimeout(function() {
            scope.$emit('onRepeatLast', element, attrs);
          }, 1);
        }
    };
});
