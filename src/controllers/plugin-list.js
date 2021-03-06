app.controller('PluginListController', ['$scope', '$routeParams', '$http', 'viewFactory', 'toast',
    function ($scope, $routeParams, $http, viewFactory, toast) {

    viewFactory.title = "Plugin List";

    var filters = [];

    if ($routeParams.consumerId) {
        filters.push('consumer_id=' + $routeParams.consumerId);

    } else {
        viewFactory.prevUrl = null;
    }

    $scope.pluginList = [];
    $scope.fetchPluginList = function(url) {
        $http({
            method: 'GET',
            url: url
        }).then(function (response) {
            $scope.nextUrl = response.data.next || '';

            for (var i=0; i<response.data.data.length; i++ ) {
                $scope.pluginList.push(response.data.data[i]);
            }

        }, function () {
            toast.error('Could not load list of plugins')
        })
    };

    angular.element('#pluginsTable').on('click', 'input[type="checkbox"].plugin-state', function (event) {
        var checkbox = angular.element(event.target), payload={};

        payload.enabled = checkbox.is(':checked');

        $http({
            method: 'PATCH',
            url: buildUrl('/plugins/' + checkbox.val()),
            data: payload,
            headers: {'Content-Type': 'application/json'}
        }).then(function () {
            toast.success('Plugin ' + (payload.enabled ? 'enabled' : 'disabled'));

        }, function () {
            toast.error('Could not ' + (payload.enabled ? 'enable' : 'disable') + ' this plugin');
        })
    });

    $scope.fetchPluginList(buildUrl('/plugins' + ((filters.length > 0) ? ('?' + filters.join('&') ) : '')));
}]);