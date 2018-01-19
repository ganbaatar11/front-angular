/**
 * Created by ganbaatar on 11/3/16.
 */
(function (Controllers, undefined) {
    FAN.Modules.FAN.controller("LineupExportPageCtrl", ['$http', '$scope', 'contests', 'lineup', 'modalFactory',
        function ($http, $scope, contests, lineup, modalFactory) {
            $scope.contests = contests;
            $scope.lineup = lineup;
            $scope.lineup_slots = $scope.lineup[0].lineup_slots;

            $scope.openPlayerProfile = function (player_code) {
                console.log('player_code: ', player_code);
                modalFactory.show_player(self.get_player(player_code));
            };

            console.log('contests: ', $scope.contests);
            console.log('lineup: ', $scope.lineup);
        }]);
}(FAN.Controllers = FAN.Controllers || {}));