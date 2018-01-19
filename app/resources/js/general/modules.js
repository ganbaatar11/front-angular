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