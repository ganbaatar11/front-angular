/**
 * Created by ganbaatar on 11/3/16.
 */
(function (Controllers, undefined) {
    FAN.Modules.FAN.controller("ContestHistoryPageCtrl", ['$http', '$scope', 'lineups', '$state',
        function ($http, $scope, lineups, $state) {
            $scope.lineups = lineups;
        }]);
}(FAN.Controllers = FAN.Controllers || {}));