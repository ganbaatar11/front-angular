/**
 * Created by ganbaatar on 11/2/16.
 */
(function (Controllers, undefined) {
    FAN.Modules.FAN.controller("PlayerProfileCtrl", ['$http', '$scope', '$state', 'player', 'game_log',
        function ($http, $scope, $state, player, game_log) {
            $scope.player = player;
            $scope.game_log = game_log;
            console.log('player: ', $scope.player);
        }]);
}(FAN.Controllers = FAN.Controllers || {}));