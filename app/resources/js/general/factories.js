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