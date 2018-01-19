(function(FAN, undefined)
{
    FAN.Version = "0.0.1";
    FAN.PartialPath = "partials/";
    FAN.Constants = {};
    FAN.Factory = {};
    FAN.Directives = {};
    FAN.Modules = {};
    FAN.Configs = {};
    FAN.Controllers = {};

}(window.FAN = window.FAN || {}));
(function (Modules, undefined) {
    Modules.FAN = angular.module("fan", [
        'satellizer',
        'ui.router',
        'permission',
        'permission.ui',
        'angular-sly',
        'ui.slimscroll',
        'pathgather.popeye'
    ]);
}(FAN.Modules = FAN.Modules || {}));
(function (Constants, undefined) {
    // var urlBase = 'http://fantasy/api/v1/';
    FAN.Modules.FAN.constant('address', {
        urlBase: 'http://fantasy/api/v1/',
        // urlBase: 'http://fan.themeton.com/api/v1/',
        authenticate: function () {
            return this.urlBase + 'authenticate/';
        },

        get_login: function () {
            return this.urlBase + 'authenticate/user';
        },
        get_holders: function () {
            return this.urlBase + 'holders/';
        },
        create_contest: function () {
            return this.urlBase + 'contest/create';
        },
        get_contest: function (contest_id) {
            return this.urlBase + 'contest/' + contest_id;
        },
        get_contest_list: function () {
            return this.urlBase + 'contest/list';
        },
        get_contest_completed: function () {
            return this.urlBase + 'lineups?state=completed';
        },
        get_contest_upcoming: function () {
            return this.urlBase + 'lineups?state=upcoming';
        },
        get_players: function (contest_id) {
            return this.urlBase + 'contest/' + contest_id + '/players';
        },
        get_game_log: function (player_code) {
            return this.urlBase + 'playerGameLog?player_code=' + player_code;
        },
        post_lineup_enter: function () {
            return this.urlBase + 'lineup/enter';
        },
        get_lineup: function (entry_id) {
            return this.urlBase + 'lineup?entry_id=' + entry_id;
        },
        get_users: function (contest_id, page, limit){
            page = page || 1;
            limit = limit || 20;
            return this.urlBase + 'lineup/' + contest_id + '/users/'+ page +'/' + limit;
        }
    });


}(FAN.Constants = FAN.Constants || {}));
(function (Filters, undefined) {
    FAN.Modules.FAN
        .filter("asDate", function () {
            return function (input) {
                return (new Date(input)).getTime();
            }
        })
        .filter('range', function () {
            return function (input, total) {
                total = parseInt(total);

                for (var i = 0; i < total; i++) {
                    input.push(i);
                }

                return input;
            };
        })
        .filter('asDollar', function () {
            return function (number) {
                if (number < 0) {
                    return '-$' + Math.abs(number);
                } else {
                    return '$' + number;
                }
            }
        })
        .filter('head2head', function () {
            return function (number) {
                if (number == 2) {
                    return number + ' (Head to Head)';
                }
                return number;
            }
        })
        .filter('range1', function () {
            return function (input, min, max) {
                min = parseInt(min);
                max = parseInt(max);
                for (var i = min; i < max; i++)
                    input.push(i);
                return input;
            }
        });
}(FAN.Filters = FAN.Filters || {}));
(function (Configs, undefined) {
    FAN.Modules.FAN
        .config(['$stateProvider', '$urlRouterProvider', '$authProvider', 'address',
            function ($stateProvider, $urlRouterProvider, $authProvider, address) {
                $authProvider.loginUrl = address.authenticate();
                $urlRouterProvider.otherwise('/');

                $stateProvider
                    .state('auth', {
                        url: '/auth',
                        data: {
                            permissions: {
                                except: 'authenticated',
                                redirectTo: 'contestList'
                            }
                        },
                        views: {
                            'partial': {
                                templateUrl: 'components/auth/auth.view.html',
                                controller: 'AuthPageCtrl as auth'
                            }
                        }
                    })
                    .state('contestCreate', {
                        url: '/contest/create',
                        data: {
                            permissions: {
                                only: 'authenticated',
                                redirectTo: 'auth'
                            }
                        },
                        views: {
                            'header': {
                                templateUrl: 'components/partials/header.view.html'
                            },
                            'partial': {
                                templateUrl: 'components/contest/create.view.html',
                                controller: 'ContestCreatePageCtrl',
                                resolve: {
                                    holders: function (dataFactory) {
                                        return dataFactory.get_holders();
                                    }
                                }
                            }
                        }
                    })
                    .state('lineup', {
                        url: '/lineup/:contest_id',
                        data: {
                            permissions: {
                                only: 'authenticated',
                                redirectTo: 'auth'
                            }
                        },
                        views: {
                            'header': {
                                templateUrl: 'components/partials/header.view.html'
                            },
                            'partial': {
                                templateUrl: 'components/lineup/setup.view.html',
                                controller: 'LineupSetupPageCtrl',
                                resolve: {
                                    contest: function (dataFactory, $stateParams) {
                                        return dataFactory.get_contest($stateParams.contest_id);
                                    },
                                    players: function (dataFactory, $stateParams) {
                                        return dataFactory.get_players($stateParams.contest_id);
                                    }
                                }
                            }
                        }
                    })
                    .state('lineupUpcoming', {
                        url: '/contest/:contest_id/:entry_id',
                        data: {
                            permissions: {
                                only: 'authenticated',
                                redirectTo: 'auth'
                            }
                        },
                        views: {
                            'header': {
                                templateUrl: 'components/partials/header.view.html'
                            },
                            'sub-header': {
                                templateUrl: 'components/partials/sub-header.view.html'
                            },
                            'partial': {
                                templateUrl: 'components/lineup_upcoming/lineup_upcoming.view.html',
                                controller: 'LineupUpcomingPageCtrl',
                                resolve: {
                                    contest: function (dataFactory, $stateParams) {
                                        return dataFactory.get_contest($stateParams.contest_id);
                                    },
                                    lineup: function (dataFactory, $stateParams) {
                                        return dataFactory.get_lineup($stateParams.entry_id);
                                    }
                                }
                            }
                        }
                    })
                    .state('lineupExport', {
                        url: '/lineup/:lineup_id/export',
                        data: {
                            permissions: {
                                only: 'authenticated',
                                redirectTo: 'auth'
                            }
                        },
                        views: {
                            'header': {
                                templateUrl: 'components/partials/header.view.html'
                            },
                            'partial': {
                                templateUrl: 'components/lineup_export/lineup_export.view.html',
                                controller: 'LineupExportPageCtrl',
                                resolve: {
                                    contests: function (dataFactory) {
                                        return dataFactory.get_contest_list();
                                    },
                                    lineup: function (dataFactory, $stateParams) {
                                        return dataFactory.get_lineup($stateParams.lineup_id);
                                    }
                                }
                            }
                        }
                    })
                    .state('lineupLive', {
                        url: '/contest/:contest_id/lineup/:entry_id',
                        data: {
                            permissions: {
                                only: 'authenticated',
                                redirectTo: 'auth'
                            }
                        },
                        views: {
                            'header': {
                                templateUrl: 'components/partials/header.view.html'
                            },
                            'partial': {
                                templateUrl: 'components/lineup_live/lineup_live.view.html',
                                controller: 'LineupLivePageCtrl',
                                resolve: {
                                    contest: function (dataFactory, $stateParams) {
                                        return dataFactory.get_contest($stateParams.entry_id);
                                    },
                                    lineup: function (dataFactory, $stateParams) {
                                        return dataFactory.get_lineup($stateParams.entry_id);
                                    },
                                    users: function (dataFactory, $stateParams) {
                                        return dataFactory.get_users($stateParams.contest_id);
                                    }
                                }
                            }
                        }
                    })
                    .state('contestHistory', {
                        url: '/contest/history',
                        data: {
                            permissions: {
                                only: 'authenticated',
                                redirectTo: 'auth'
                            }
                        },
                        views: {
                            'header': {
                                templateUrl: 'components/partials/header.view.html'
                            },
                            'sub-header': {
                                templateUrl: 'components/partials/sub-header.view.html'
                            },
                            'partial': {
                                templateUrl: 'components/contest_history/contest_history.view.html',
                                controller: 'ContestHistoryPageCtrl',
                                resolve: {
                                    lineups: function (dataFactory) {
                                        return dataFactory.get_contest_completed();
                                    }
                                }
                            }
                        }
                    })
                    .state('contestUpcoming', {
                        url: '/contest/upcoming',
                        data: {
                            permissions: {
                                only: 'authenticated',
                                redirectTo: 'auth'
                            }
                        },
                        views: {
                            'header': {
                                templateUrl: 'components/partials/header.view.html'
                            },
                            'sub-header': {
                                templateUrl: 'components/partials/sub-header.view.html'
                            },
                            'partial': {
                                templateUrl: 'components/contest_upcoming/contest_upcoming.view.html',
                                controller: 'ContestUpcomingPageCtrl',
                                resolve: {
                                    lineups: function (dataFactory) {
                                        return dataFactory.get_contest_upcoming();
                                    }
                                }
                            }
                        }
                    })
                    .state('contestList', {
                        url: '/',
                        views: {
                            'header': {
                                templateUrl: 'components/partials/header.view.html'
                            },
                            'partial': {
                                templateUrl: 'components/contest_list/contest_list.view.html',
                                controller: 'ContestListPageCtrl',
                                resolve: {
                                    contests: function (dataFactory) {
                                        return dataFactory.get_contest_list();
                                    }
                                }
                            }
                        }
                    });
            }])
        .run(function ($rootScope, $state, $auth, PermRoleStore) {

            PermRoleStore
                .defineRole('authenticated', function () {
                    return $auth.isAuthenticated();
                });

            $rootScope.logout = function () {
                $auth.logout().then(function () {
                    localStorage.removeItem('user');
                    $rootScope.currentUser = null;
                    $state.go('auth');
                });
            };

            $rootScope.currentUser = JSON.parse(localStorage.getItem('user'));
        });
}(FAN.Configs = FAN.Configs || {}));
(function (Factory, undefined) {
    FAN.Modules.FAN.factory('dataFactory', ['$http', 'address', '$state',
        function ($http, address, $state) {
        return {
            get_holders: function () {
                return $http.get(address.get_holders())
                    .then(function (response) {
                        console.log('holders: ', response.data.holders);
                        return response.data.holders;
                    }, function (error) {
                        console.log('error', error);
                        alert(error);
                    });
            },
            get_contest: function (contest_id) {
                return $http.get(address.get_contest(contest_id))
                    .then(function (response) {
                        console.log('contest: ', response.data.contest);
                        return response.data.contest;
                    }, function (error) {
                        console.log('error', error);
                        alert(error);
                    });
            },
            get_contest_list: function(){
                return $http.get(address.get_contest_list())
                    .then(function (response) {
                        console.log('contests: ', response.data.contests);
                        return response.data.contests;
                    }, function (error) {
                        console.log('error', error);
                        alert(error);
                    });
            },
            get_contest_completed: function(){
                return $http.get(address.get_contest_completed())
                    .then(function (response) {
                        console.log('lineups: ', response.data.lineups);
                        return response.data.lineups;
                    }, function (error) {
                        console.log('error', error);
                        alert(error);
                    });
            },
            get_contest_upcoming: function(){
                return $http.get(address.get_contest_upcoming())
                    .then(function (response) {
                        console.log('lineups: ', response.data.lineups);
                        return response.data.lineups;
                    }, function (error) {
                        console.log('error', error);
                        alert(error);
                    });
            },
            get_players: function (contest_id) {
                return $http.get(address.get_players(contest_id))
                    .then(function (response) {
                        console.log('players: ', response.data.players);
                        return response.data.players;
                    }, function (error) {
                        console.log('error', error);
                        alert(error);
                    });
            },
            get_game_log: function (player_code) {
                return $http.get(address.get_game_log(player_code))
                    .then(function (response) {
                        console.log('game_log: ', response.data.game_log);
                        return response.data.game_log;
                    }, function (error) {
                        console.log('error', error);
                        alert(error);
                    });
            },
            post_lineup_enter: function (params){
                return $http.post(address.post_lineup_enter(), params)
                    .then(function (response) {
                        console.log('game_log: ', response.data.contest_lineup);
                        // return response.data.game_log;
                        $state.go('lineupUpcoming', {
                            contest_id: params.contest_id,
                            entry_id: response.data.contest_lineup
                        });
                    }, function (error) {
                        console.log('error', error);
                        // alert(error);
                    });
            },
            get_lineup: function (entry_id){
                return $http.get(address.get_lineup(entry_id))
                    .then(function (response) {
                        response.data.entry_lineup.entry_id = entry_id;
                        console.log('entry_lineup: ', response.data.entry_lineup);
                        return response.data.entry_lineup;
                    }, function (error) {
                        console.log('error', error);
                        alert(error);
                    });
            },
            get_users: function (contest_id, page, limit){
                return $http.get(address.get_users(contest_id, page, limit))
                    .then(function (response) {
                        console.log('users: ', response.data.result);
                        return response.data.result;
                    }, function (error) {
                        console.log('error', error);
                        alert(error);
                    });
            }
        };

        // dataFactory.getHolders = function () {
        //     url = urlBase + 'holders/';
        //     return $http.get(url);
        // };
        //
        // return dataFactory;
    }]);

}(FAN.Factory = FAN.Factory || {}));
/**
 * Created by ganbaatar on 11/3/16.
 */
(function (Directives, undefined) {
    FAN.Modules.FAN
        .directive('backgroundImage', function () {
            return function (scope, element, attrs) {
                //restrict: 'A',
                attrs.$observe('backgroundImage', function (value) {
                    if (value) {
                        element.css({'background-image': 'url(' + value + ')'});
                        element.css({'background-size': '150%'});
                    } else {
                        element.css({'background-image': 'url(assets/img/hidden_player.png)'});
                        element.css({'background-size': '100%'});
                    }
                });
            };
        })
        .directive('userInfo', function ($compile, $rootScope) {
            return {
                link: function (scope, element, attrs) {
                    if ($rootScope.currentUser) {
                        element.replaceWith(
                            $compile(
                                '<a class="user-name">{{ currentUser.name }}, <span ng-click="logout()">sign out</span></a >'
                            )(scope));
                    } else {
                        element.replaceWith(
                            $compile(
                                '<a class="white hollow button" ui-sref="auth">Sign in</a>'
                            )(scope));
                    }
                }
            };
        })
        .directive('countdown', [
            'Util',
            '$interval',
            function (Util, $interval) {
                return {
                    restrict: 'A',
                    scope: {date: '@'},
                    link: function (scope, element) {
                        var future;
                        future = new Date(scope.date);
                        $interval(function () {
                            var diff;
                            diff = Math.floor((future.getTime() - new Date().getTime()) / 1000);
                            return element.text(Util.dhms(diff));
                        }, 1000);
                    }
                };
            }
        ])
        .factory('Util', [function () {
            return {
                dhms: function (t) {
                    var days, hours, minutes, seconds;
                    days = Math.floor(t / 86400);
                    t -= days * 86400;
                    days = days < 10 ? '0' + days : days;

                    hours = Math.floor(t / 3600) % 24;
                    t -= hours * 3600;
                    hours = hours < 10 ? '0' + hours : hours;

                    minutes = Math.floor(t / 60) % 60;
                    t -= minutes * 60;
                    minutes = minutes < 10 ? '0' + minutes : minutes;

                    seconds = t % 60;
                    seconds = seconds < 10 ? '0' + seconds : seconds;
                    return [
                        //days + 'd',
                        hours,
                        minutes,
                        seconds
                    ].join(':');
                }
            };
        }]);

}(FAN.Factory = FAN.Factory || {}));
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
/**
 * Created by ganbaatar on 9/11/16.
 */
(function (Controllers, undefined) {
    FAN.Modules.FAN.controller("ContestCreatePageCtrl", ['$http', '$scope', '$state', 'holders', 'address',
        function ($http, $scope, $state, holders, address) {
            $scope.contest = {
                name: "",
                total_entrants: 2,
                entry_fee: 0,
                prize_structure: 0
            };
            $scope.option = {
                entry_fee: [0, 1, 2, 5, 10, 25, 50, 109, 270, 530, 1050, 5025, 10500],
                prize_structure: [
                    {val: 0, text: "Winner Takes All"},
                    {val: 1, text: "Top 3 Win"},
                    {val: 2, text: "Top 1/3 Win"},
                    {val: 3, text: "50-50"}
                ],
                prize: ""
            };
            $scope.holders = holders;
            $scope.holder = $scope.holders[0];

            $scope.change_name = function (entry_fee) {
                $scope.contest.name = entry_fee + " "
                    + $scope.contest.total_entrants + "-Team "
                    + $scope.option.prize_structure[$scope.contest.prize_structure].text;
            };

            $scope.reloadSly = function (id) {
                angular.element(document.getElementById(id)).sly("reload").sly("toStart");
            };

            $(window).on("resize", function () {
                $scope.reloadSly();
            });

            $scope.create_contest = function () {
                var url = address.create_contest();
                console.log('url: ', url);
                console.log('ych_code: ', $scope.holder.ych_code);
                console.log('sport_code: ', 'nba');
                console.log('title: ', $scope.contest.name);
                console.log('scope: ', 'public');
                console.log('entry_fee: ', $scope.contest.entry_fee);
                console.log('entry_limit: ', $scope.contest.total_entrants);
                console.log('total_prize: ', $scope.contest.total_prize || 0);
                console.log('start_time: ', $scope.holder.ych_start_time);
                $http.post(url, {
                    ych_code: $scope.holder.ych_code,
                    sport_code: 'nba',
                    title: $scope.contest.name,
                    scope: 'public',
                    entry_fee: $scope.contest.entry_fee,
                    entry_limit: $scope.contest.total_entrants,
                    total_prize: $scope.contest.total_prize || 0,
                    start_time: $scope.holder.ych_start_time
                }).success(function (response) {
                    // $state.go('lineup', {contest_id: response.result});
                    console.log('>>>>>', response);
                    $state.go('lineup', {contest_id: response.result});
                }).error(function () {
                    alert("error");
                });
            };
        }]);
}(FAN.Controllers = FAN.Controllers || {}));
// /**
//  * Created by ganbaatar on 9/11/16.
//  */
// (function (Directives, undefined)
// {
//     FAN.Modules.FAN.directive("homepage", [ function ()
//     {
//         return {
//             restrict: 'E',
//             controller: 'HomePageCtrl',
//             link: function (scope, elm, attrs)
//             {
//                 console.log('i am the directive for the contest page');
//             }
//         }
//     }]);
// }(FAN.Directives = FAN.Directives || {} ));
/**
 * Created by ganbaatar on 11/3/16.
 */
(function (Controllers, undefined) {
    FAN.Modules.FAN.controller("ContestHistoryPageCtrl", ['$http', '$scope', 'lineups', '$state',
        function ($http, $scope, lineups, $state) {
            $scope.lineups = lineups;
        }]);
}(FAN.Controllers = FAN.Controllers || {}));
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

/**
 * Created by ganbaatar on 11/28/16.
 */
(function (Controllers, undefined) {
    FAN.Modules.FAN.controller("ContestListPageCtrl", ['$http', '$scope', '$state', 'contests',
        function ($http, $scope, $state, contests) {
            $scope.contests = contests;
        }]);
}(FAN.Controllers = FAN.Controllers || {}));
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
/**
 * Created by ganbaatar on 10/3/16.
 */
// (function (Directives, undefined) {
//     FAN.Modules.FAN
//         .directive('backgroundImage', function () {
//             return function (scope, element, attrs) {
//                 //restrict: 'A',
//                 attrs.$observe('backgroundImage', function (value) {
//                     if (value) {
//                         element.css({'background-image': 'url(' + value + ')'});
//                         element.css({'background-size': '150%'});
//                     } else {
//                         element.css({'background-image': 'url(assets/img/hidden_player.png)'});
//                         element.css({'background-size': '100%'});
//                     }
//                 });
//             };
//         });
// }(FAN.Directives = FAN.Directives || {}));
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
/**
 * Created by ganbaatar on 11/20/16.
 */
(function (Controllers, undefined) {
    FAN.Modules.FAN.controller("AuthPageCtrl", ['$auth', '$state', '$http', '$rootScope', 'address',
        function ($auth, $state, $http, $rootScope, address) {
            var vm = this;

            vm.loginError = false;
            vm.loginErrorText;

            vm.login = function () {

                var credentials = {
                    email: vm.email,
                    password: vm.password
                };

                $auth.login(credentials).then(function () {
                    $http.get(address.get_login()).success(function (response) {
                        var user = JSON.stringify(response.user);
                        localStorage.setItem('user', user);
                        $rootScope.authenticated = true;
                        $rootScope.currentUser = response.user;
                        $state.go('contestList');
                    })
                        .error(function () {
                            vm.loginError = true;
                            vm.loginErrorText = error.data.error;
                            console.log(vm.loginErrorText);
                        })
                });
            }
        }]);
}(FAN.Controllers = FAN.Controllers || {}));