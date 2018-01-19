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