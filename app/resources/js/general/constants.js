(function (Constants, undefined) {
    // var urlBase = 'http://fantasy/api/v1/';
    FAN.Modules.FAN.constant('address', {
        urlBase: 'http://{url-to-back-end}/api/v1/',
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