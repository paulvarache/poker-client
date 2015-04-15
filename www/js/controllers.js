angular.module('pokerPlaning.controllers', [])

.controller('IndexController', ['$scope', '$stateParams', '$window', function ($scope, $stateParams, $window) {
  var urlParts = window.location.href.split('#');
  if (!urlParts[1]) return;
  var oauth = urlParts[1];
  var parts = oauth.split('&');
  var subparts = {};
  var params = parts.reduce(function (total, item) {
    subparts = item.split('=');
    if(subparts[1]) {
      total[subparts[0]] = subparts[1];
    }
    return total;
  }, {});
  $window.localStorage.oauth = JSON.stringify(params);
  window.opener.location.reload(1);
  window.close();
}])

.controller('MenuCtrl', ['$scope', '$state', 'User', 'Socket', function ($scope, $state, User, Socket) {
  $scope.logout = function () {
    console.log('Logout');
    User.logout();
    Socket.disconnect();
    $state.go('login');
  }
}])

.controller('LoginCtrl', function($scope, $window, $state, Google, User) {
  if (User.get() !== null) {
    $state.go('app.poker');
    return;
  }
  if($window.localStorage.oauth) {
    var oauth = JSON.parse($window.localStorage.oauth);
    delete $window.localStorage.oauth;
    Google.getUserWithToken(oauth).then(function (user){
	User.login(user);
	$state.go('app.poker');
    }, function (reason){
	console.error(reason);
    });
    console.log(oauth);
  }

  $scope.googleLogin = function () {
    console.log("Google login");
    Google.getUser().then(function (user) {
      User.login(user);
      $state.go('app.poker');
    }, function (reason) {
      if (reason === "Cannot authenticate via a web browser") {
        Google.browserLogin();
      }
    });
    };
})

.controller('MainCtrl', ['$scope', 'Socket', 'User', '$timeout', function($scope, Socket, User, $timeout) {

  $scope.connected = false;
  $scope.turnEnd = false;
  $scope.selected = null;
  $scope.user = User.get();
  $scope.users = {};

  var socket = Socket.init("http://paulvarache.ninja:4000");
  $scope.choices = [0,'1/2',1, 2, 3, 5, 8, 13, 20, 40, 100, '?', '☕'];
  socket.on('disconnect', function () {
    $timeout(function () {
      $scope.connected = false;
    });
  });
  socket.on('connect', function () {
    socket.emit('poker:user', $scope.user);
    $scope.$apply(function () {
      $scope.connected = true;
    });
  });

  socket.on('poker:user:init', function (infos) {
    $scope.$apply(function () {
      $scope.turnEnd = infos.turnEnded;
      $scope.users = infos.users;
      console.log($scope.users);
    });
  });

  socket.on('poker:user', function (user) {
    $scope.$apply(function () {
      $scope.users[user.id] = user;
    });
  });

  socket.on('poker:user:disconnected', function (id) {
    $scope.$apply(function () {
      delete $scope.users[id];
    });
  });

  socket.on('poker:show', function () {
    $scope.$apply(function () {
      $scope.turnEnd = true;
    });
  });

  socket.on('poker:reset', function () {
    $scope.$apply(function () {
      $scope.turnEnd = true;
      $scope.selected = null;
    });
  });

  $scope.choice = function (choiceIndex) {
    if ($scope.selected === null) {
      socket.emit('poker:choice', {choice: $scope.choices[choiceIndex]});
      $scope.selected = choiceIndex;
    } else if (!$scope.turnEnd){
      socket.emit('poker:cancel');
      $scope.selected = null;
    }
  };

  $scope.reset = function () {
    socket.emit('poker:reset');
    $scope.selected = null;
    $scope.turnEnd = false;
  };
}]);
