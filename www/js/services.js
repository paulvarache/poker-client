angular.module('pokerPlaning.services', [])

.factory('Google', ['$http', "$cordovaOauth", "$q", function ($http, $cordovaOauth, $q) {
    var clientId = "626450708562-sg49cekkukft0phin3c0h6fh143ppaml.apps.googleusercontent.com";
    var appScope = ["https://www.googleapis.com/auth/userinfo.profile"];
    return {
        getUser: function () {
            var deffered = $q.defer();
            $cordovaOauth.google(clientId, appScope).then(function (result) {
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
	    },
        browserLogin: function () {
            window.open('https://accounts.google.com/o/oauth2/auth?client_id=' + clientId + '&redirect_uri=http://poker.paulvarache.ninja/callback/&scope=' + appScope.join(" ") + '&approval_prompt=force&response_type=token', '_blank', 'location=no,clearsessioncache=yes,clearcache=yes');
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
