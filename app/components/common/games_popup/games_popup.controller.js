/**
 * Created by ganbaatar on 11/3/16.
 */
(function (Controllers, undefined) {
    FAN.Modules.FAN.controller("GamesPopupCtrl", ['$http', '$scope', '$state', 'contest',
        function ($http, $scope, $state, contest) {
            $scope.contest = contest;
            console.log('contest: ', $scope.contest);
        }]);
}(FAN.Controllers = FAN.Controllers || {}));