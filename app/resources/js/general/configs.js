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