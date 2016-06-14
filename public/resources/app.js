angular.module('OathStructure', ['perfect_scrollbar', 'ui.sortable'])


.config(function ($locationProvider) {
  $locationProvider.html5Mode({
    enabled: true
    // requireBase: false
  });
})
