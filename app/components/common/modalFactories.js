/**
 * Created by ganbaatar on 11/3/16.
 */
(function (Factory, undefined) {
    FAN.Modules.FAN.factory('modalFactory', ['Popeye', function (Popeye) {
        return {
            show_player: function (player) {
                var modal = Popeye.openModal({
                    templateUrl: "../components/common/player_profile/player_profile.view.html",
                    controller: "PlayerProfileCtrl",
                    resolve: {
                        player: function() {
                            return player
                        },
                        game_log: function(dataFactory){
                            return dataFactory.get_game_log(player.player_code);
                        }
                    }
                });

                modal.resolved.then(function() {
                    console.log('modal.resolved');
                });

                modal.closed.then(function() {
                    console.log('modal.closed');
                });

                return modal;
            },

            show_games: function (contest){
                var modal = Popeye.openModal({
                    templateUrl: "../components/common/games_popup/games_popup.view.html",
                    controller: "GamesPopupCtrl",
                    resolve: {
                        contest: function() {
                            return contest
                        }
                    }
                });

                modal.resolved.then(function() {
                    console.log('modal.resolved');
                });

                modal.closed.then(function() {
                    console.log('modal.closed');
                });

                return modal;
            }
        }
    }]);

}(FAN.Factory = FAN.Factory || {}));