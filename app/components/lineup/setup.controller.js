/**
 * Created by ganbaatar on 10/02/16.
 */
(function (Controllers, undefined) {
    FAN.Modules.FAN.controller("LineupSetupPageCtrl", ['$http', '$scope', 'contest', 'players', 'modalFactory', 'dataFactory',
        function ($http, $scope, contest, players, modalFactory, dataFactory) {

            var self = this;
            $scope.contest = contest;
            $scope.players = players;
            $scope.lineup = [];
            $scope.search_pos = "";
            $scope.salary_cap = $scope.contest.con_salary_cap;
            var wish_pos = undefined;

            self.get_player = function (player_code) {
                if (!player_code) return null;
                for (var ii = 0; ii < $scope.players.length; ii++) {
                    if ($scope.players[ii].player_code === player_code) {
                        console.log(player_code, $scope.players[ii]);
                        return $scope.players[ii];
                    }
                }
            };

            self.submit = function () {
                var players = [];
                $scope.lineup.forEach(function(player, index){
                    players.push({
                        id: player.player_code,
                        pos: index
                    })
                });
                var params = {
                    contest_id: $scope.contest.con_id,
                    players: angular.toJson(players)
                };

                console.log('params: ', params);

                dataFactory.post_lineup_enter(params);
            };

            var add_player = function (player) {
                if (!player) return;
                var eligible_pos = $scope.contest.positions.map(function (pos) {
                    return pos.pos_eligible_positions
                });

                if (wish_pos && !$scope.lineup[wish_pos]) {
                    $scope.lineup[wish_pos] = player;
                    $scope.salary_cap -= $scope.lineup[wish_pos].player_salary;
                    $scope.lineup[wish_pos].on_line = true;
                    return;
                }

                for (var kk = 0; kk < eligible_pos.length; kk++) {
                    if (eligible_pos[kk].includes(player.player_primary_position)) {
                        if (!$scope.lineup[kk]) {
                            $scope.lineup[kk] = player;
                            $scope.salary_cap -= $scope.lineup[kk].player_salary;
                            $scope.lineup[kk].on_line = true;
                            console.log('lineup[kk]: ', $scope.lineup[kk]);
                            return;
                        }
                    }
                }
                alert('Already set!!!');
            };

            var remove_player = function (player) {
                if (!player) return;
                for (var jj = 0; jj < $scope.lineup.length; jj++) {
                    if ($scope.lineup[jj]
                        && $scope.lineup[jj].player_code
                        && $scope.lineup[jj].player_code === player.player_code) {
                        $scope.salary_cap += $scope.lineup[jj].player_salary;
                        $scope.lineup[jj].on_line = false;
                        $scope.lineup[jj] = undefined;
                        return;
                    }
                }
            };

            $scope.toggle_player = function (player_code) {
                console.log('player_code: ', player_code);
                if (!player_code) return;
                var player = self.get_player(player_code);
                console.log('on_line: ', !player.on_line);
                if (player) {
                    if (!player.on_line) {
                        add_player(player);
                    } else {
                        remove_player(player);
                    }
                }
            };

            $scope.avg_fppg = function () {
                var avg_fppg = 0;
                $scope.lineup.forEach(function (player) {
                    if (player) {
                        avg_fppg += player.player_fantasy_points_per_game || 0;
                    }
                });
                if ($scope.get_lineup_size() > 0) {
                    avg_fppg /= $scope.get_lineup_size();
                }
                return avg_fppg;
            };

            $scope.avg_remain_salary = function () {
                var remain_avg = {salary: 0, player: 0};
                remain_avg.player = $scope.contest.positions.length - $scope.get_lineup_size();
                if (remain_avg.player > 0) {
                    remain_avg.salary = $scope.salary_cap / remain_avg.player;
                } else {
                    remain_avg.salary = 0;
                }
                return remain_avg;
            };

            $scope.get_msg = function () {
                var msg = contest.positions.length - $scope.get_lineup_size();
                if (msg == 0) msg = "You're ready to submit your lineup!";
                else msg = "You need " + msg + " players for your lineup";
                return msg;
            };

            $scope.get_lineup_size = function () {
                return $scope.lineup.filter(function (obj) {
                    return (obj)
                }).length;
            };

            $scope.is_full = function () {
                return $scope.contest.positions.length == $scope.get_lineup_size();
            };

            $scope.clear_lineup = function () {
                for (var nn = 0; nn < $scope.lineup.length; nn++) {
                    if ($scope.lineup[nn]) {
                        $scope.lineup[nn].on_line = false;
                        $scope.lineup[nn] = undefined;
                    }
                }
            };

            $scope.filter_pos = function () {
                if ($scope.search_pos === "") {
                    return $scope.players;
                }
                return $scope.players.filter(function (player) {
                    return $scope.search_pos.includes(player.player_primary_position);
                });
            };

            $scope.set_search = function (pos) {
                console.log(pos);
                $scope.search_pos = pos;
                wish_pos = undefined;
            };

            $scope.set_search_pos = function (key, code, index) {
                if (!code)
                    $scope.set_search(key);
                wish_pos = index;

            };

            $scope.search_name = function (name) {
                return $scope.players.filter(function (player) {
                    return player.player_firstname.includes(name)
                        || player.player_lastname.includes(name);
                });
            };

            $scope.openPlayerProfile = function (player_code) {
                console.log('player_code: ', player_code);
                modalFactory.show_player(self.get_player(player_code));
            };

            $scope.openGamePopup = function () {
                modalFactory.show_games($scope.contest);
            };

            $scope.enter_contest = function () {
                if(confirm("Are you sure")){
                    self.submit();
                }
            };
        }]);
}(FAN.Controllers = FAN.Controllers || {}));