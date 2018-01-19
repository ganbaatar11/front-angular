/**
 * Created by ganbaatar on 12/13/16.
 */
(function (Controllers, undefined) {
    FAN.Modules.FAN.controller("ContestUpcomingPageCtrl", ['$http', '$scope', '$state', 'lineups',
        function ($http, $scope, $state, lineups) {
            $scope.lineups = lineups[0];
            console.log('lineups: ', $scope.lineups);
        }]);
}(FAN.Controllers = FAN.Controllers || {}));
