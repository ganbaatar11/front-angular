/**
 * Created by ganbaatar on 11/28/16.
 */
(function (Controllers, undefined) {
    FAN.Modules.FAN.controller("ContestListPageCtrl", ['$http', '$scope', '$state', 'contests',
        function ($http, $scope, $state, contests) {
            $scope.contests = contests;
        }]);
}(FAN.Controllers = FAN.Controllers || {}));