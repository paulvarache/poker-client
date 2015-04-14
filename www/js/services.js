angular.module('pokerPlaning.services', [])

.factory('Google', ['$http', "$cordovaOauth", "$q", function ($http, $cordovaOauth, $q) {
    return {
        getUser: function () {
            var deffered = $q.defer();
            $cordovaOauth.google('626450708562-sg49cekkukft0phin3c0h6fh143ppaml.apps.googleusercontent.com', ["https://www.googleapis.com/auth/userinfo.profile"]).then(function (result) {
              $http({
                method: 'GET',
                url: 'https://www.googleapis.com/oauth2/v1/userinfo?alt=json',
                headers: {
                  "Authorization": result.token_type + " " + result.access_token
                }
              }).then(function (results) {
                var user = {
                  username: results.data.name,
                  picture: results.data.picture
                }
                deffered.resolve(user);
              }, deffered.reject)
            }, deffered.reject);
            return deffered.promise;
        },
	getUserWithToken: function (oauth) {
		var deffered = $q.defer();
              $http({
                method: 'GET',
                url: 'https://www.googleapis.com/oauth2/v1/userinfo?alt=json',
                headers: {
                  "Authorization": oauth.token_type + " " + oauth.access_token
                }
              }).then(function (results) {
                var user = {
                  username: results.data.name,
                  picture: results.data.picture
                }
                deffered.resolve(user);
              }, deffered.reject)
            return deffered.promise;
	}
    };
}])
.factory('Socket', ["$q", function ($q) {
    var url = null;
    var socket = null;
    return {
        init: function (address) {
            socket = io.connect(address, {'forceNew': true });
            return socket;
        },
        getServerAddress: function () {
            return url;
        },
        disconnect: function () {
            socket.disconnect();
        }
    }
}])
.factory('User', [function () {
    var user = null;
    if (window.localStorage.user && window.localStorage.user !== "undefined") {
        user = JSON.parse(window.localStorage.user);
    }
    return {
        login: function (nUser) {
            user = nUser
            window.localStorage.user = JSON.stringify(nUser);
        },
        get: function () {
            return user;
        },
        logout: function () {
            delete window.localStorage.user;
        }
    };
}])
