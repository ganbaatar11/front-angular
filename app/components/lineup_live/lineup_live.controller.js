/**
 * Created by ganbaatar on 11/3/16.
 */
(function (Controllers, undefined) {
    FAN.Modules.FAN.controller("LineupLivePageCtrl", ['$http', '$scope', 'contest', 'lineup', 'users', 'modalFactory', 'dataFactory',
        function ($http, $scope, contest, lineup, users, modalFactory, dataFactory) {
            $scope.contest = contest;
            $scope.lineup = lineup;
            $scope.opponent = undefined;
            $scope.users = users;
            $scope.lineup_slots = $scope.lineup[0].lineup_slots;

            $scope.openPlayerProfile = function (player_code) {
                console.log('player_code: ', player_code);
                modalFactory.show_player(self.get_player(player_code));
            };

            $scope.openPlayerProfile = function (player_code) {
                console.log('player_code: ', player_code);
                modalFactory.show_player(self.get_player(player_code));
            };

            $scope.openGamePopup = function () {
                modalFactory.show_games($scope.contest);
            };

            self.get_player = function (index) {
                return $scope.lineup_slots[index].player;
            };

            $scope.show_lineup = function (index) {
                var ent_id = $scope.users[index].ent_id;
                $scope.opponent = dataFactory.get_lineup(ent_id).then(function (data) {
                    $scope.opponent = data[0];
                });
            };

            $scope.close_opponent = function (){
                $scope.opponent = undefined;
            };
        }]);
}(FAN.Controllers = FAN.Controllers || {}));