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