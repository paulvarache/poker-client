angular.module('pokerPlaning.controllers', [])

.controller('MenuCtrl', ['$scope', '$state', 'User', 'Socket', function ($scope, $state, User, Socket) {
  $scope.logout = function () {
    console.log('Logout');
    User.logout();
    Socket.disconnect();
    $state.go('login');
  }
}])

.controller('LoginCtrl', function($scope, $state, Google, User) {
  if (User.get() !== null) {
    $state.go('app.poker');
    return;
  }

  $scope.googleLogin = function () {
    console.log("Google login");
    Google.getUser().then(function (user) {
      User.login(user);
      $state.go('app.poker');
    }, function (reason) {
      console.error(reason);
    });
    };
})

.controller('MainCtrl', ['$scope', 'Socket', 'User', '$timeout', function($scope, Socket, User, $timeout) {

  $scope.connected = false;
  $scope.turnEnd = false;
  $scope.selected = null;
  $scope.user = User.get();
  $scope.users = {};

  var socket = Socket.init("http://10.19.1.186:3000");
  $scope.choices = [1, 2, 3, 5, 8, 13, 20, 40, 100];
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
