/**
 * Created by ganbaatar on 11/3/16.
 */
(function (Controllers, undefined) {
    FAN.Modules.FAN.controller("LineupUpcomingPageCtrl", ['$http', '$scope', 'contest', 'lineup', 'modalFactory', '$state',
        function ($http, $scope, contest, lineup, modalFactory, $state) {
            $scope.contest = contest;
            $scope.lineup = lineup;
            $scope.lineup_slots = $scope.lineup[0].lineup_slots;

            $scope.openGamePopup = function () {
                modalFactory.show_games($scope.contest);
            };

            $scope.export = function () {
                if ($scope.lineup.entry_id) {
                    $state.go('lineupExport', {lineup_id: $scope.lineup.entry_id});
                }
            };

            console.log('contest: ', $scope.contest);
            console.log('lineup: ', $scope.lineup);
        }]);
}(FAN.Controllers = FAN.Controllers || {}));