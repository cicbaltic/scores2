/* jshint browser:true, es5:true */
(function() {
    'use strict';
    angular.module('app').factory('authenticationService', ['Base64', '$http', '$cookies',
    '$rootScope', '$timeout', function(Base64, $http, $cookies, $rootScope,
    $timeout) {
        var service = {};

        service.login = function(username, password, callback) {
            $http({
                method: 'GET',
                url: '/api/gettoken',
                headers: {
                    Authorization: 'Basic ' + Base64.encode(username + ':' + password)
                }
            }).then(
                function(result) {
                    $cookies.put('x-token', result.data.token);
                    callback(result);
                },
                function(err) {
                    callback(err);
                }
            );
        };

        /*
        {
            "userAuth":true,
            "userId":"c3a195263119d03b9c305eb373e4efa2ce552601",
            "email":"tom@mail.com",
            "iat":1451981141,
            "exp":1452240341
        }
        '{
            "userAuth":true,
            "userId":"fb9cbf815a93dddccbb0f261412da134248e22c7",
            "email":"rimas@mail.com",
            "iat":1451981179,
            "exp":1452240379
        }'
        */
        service.setCredentials = function(token, callback) {
            $http.defaults.headers.common['x-token'] = token;
            $http({
                method: 'GET',
                url: '/api/getroles',
                headers: {
                    'x-token': token
                }
            }).success(function(roles) {
                $rootScope.globals = {
                    currentUser: Object.keys(roles)[0],
                    roles: roles[Object.keys(roles)[0]]
                };
                callback($rootScope.globals);
            });
        };

        service.resetCredentials = function(callback){
            if ($cookies.get('x-token') !== undefined) {
                var xToken = $cookies.get('x-token');
                service.setCredentials(xToken, function(res){});
            }
            callback($rootScope.globals);
        }
        service.validateCredentials = function(callback) {
            if ($cookies.get('x-token') !== undefined) {
                var xToken = $cookies.get('x-token');
                $http({
                    method: 'GET',
                    url: '/api/checktoken',
                    headers: {
                        'x-token': xToken
                    }
                }).success(function(result) {
                    if (result.userAuth === true) {
                        $rootScope.$emit('headerLoginButtonChanger', 'dotMenu');
                        service.setCredentials(xToken, function(r) {
                            callback(r);
                        });
                    } else {
                        $cookies.remove('x-token');
                        callback({});
                    }
                });
            } else {
                callback({});
            }
        };

        service.clearCredentials = function() {
            // $rootScope.globals = {};
            // $cookies.remove('globals');
            // $http.defaults.headers.common.Authorization = 'Basic ';
            $rootScope.globals = {};
            $cookies.remove('x-token');
        };
        service.resetPassword = function(payload, callback) {
            $http.post('./api/passwordReset', {email: payload})
            .then(function(result) {
                callback(result);
            },
            function(err) {
                callback(err);
            });
        };

        // service.validateCredentials(function(a) {});

        return service;
    }])
    .factory('roleService', ['$rootScope', function($rootScope) {
        var roleService = {
            getRoles: function() {
                return $rootScope.globals.roles;
            },
            canAccess: function(hack, role) {
                if ($rootScope.globals.roles) {
                    if ($rootScope.globals.roles[hack]) {
                        if ($rootScope.globals.roles[hack][role]) {
                            return true;
                        } else {
                            return false;
                        }
                    } else {
                        return false;
                    }
                } else {
                    return false;
                }
            }
        };
        return roleService;
    }])
    .factory('Base64', function() {
        var keyStr = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=';

        return {
            encode: function(input) {
                var output = '';
                var chr1, chr2, chr3 = ''; // jshint ignore:line
                var enc1, enc2, enc3, enc4 = '';  // jshint ignore:line
                var i = 0;

                do {
                    chr1 = input.charCodeAt(i++);
                    chr2 = input.charCodeAt(i++);
                    chr3 = input.charCodeAt(i++);

                    enc1 = chr1 >> 2;
                    enc2 = ((chr1 & 3) << 4) | (chr2 >> 4);
                    enc3 = ((chr2 & 15) << 2) | (chr3 >> 6);
                    enc4 = chr3 & 63;

                    if (isNaN(chr2)) {
                        enc3 = enc4 = 64;
                    } else if (isNaN(chr3)) {
                        enc4 = 64;
                    }

                    output = output +
                        keyStr.charAt(enc1) +
                        keyStr.charAt(enc2) +
                        keyStr.charAt(enc3) +
                        keyStr.charAt(enc4);
                    chr1 = chr2 = chr3 = '';
                    enc1 = enc2 = enc3 = enc4 = '';
                } while (i < input.length);

                return output;
            },

            decode: function(input) {
                var output = '';
                var chr1, chr2, chr3 = ''; // jshint ignore:line
                var enc1, enc2, enc3, enc4 = ''; // jshint ignore:line
                var i = 0;

                // remove all characters that are not A-Z, a-z, 0-9, +, /, or =
                var base64test = /[^A-Za-z0-9\+\/\=]/g;
                if (base64test.exec(input)) {
                    window.alert('There were invalid base64 characters in the input text.\n' +
                        'Valid base64 characters are A-Z, a-z, 0-9, +, /,and =\n' +
                        'Expect errors in decoding.');
                }
                input = input.replace(/[^A-Za-z0-9\+\/\=]/g, '');

                do {
                    enc1 = keyStr.indexOf(input.charAt(i++));
                    enc2 = keyStr.indexOf(input.charAt(i++));
                    enc3 = keyStr.indexOf(input.charAt(i++));
                    enc4 = keyStr.indexOf(input.charAt(i++));

                    chr1 = (enc1 << 2) | (enc2 >> 4);
                    chr2 = ((enc2 & 15) << 4) | (enc3 >> 2);
                    chr3 = ((enc3 & 3) << 6) | enc4;

                    output = output + String.fromCharCode(chr1);

                    if (enc3 != 64) {
                        output = output + String.fromCharCode(chr2);
                    }
                    if (enc4 != 64) {
                        output = output + String.fromCharCode(chr3);
                    }

                    chr1 = chr2 = chr3 = '';
                    enc1 = enc2 = enc3 = enc4 = '';

                } while (i < input.length);

                return output;
            }
        };
    });
})();
