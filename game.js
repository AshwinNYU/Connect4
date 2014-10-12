/*'use strict';

// TODO: remove stateService before launching the game.
angular.module('myApp',
    ['myApp.messageService', 'myApp.gameLogic', 'platformApp'])
  .controller('Ctrl', function (
      $window, $scope, $log,
      messageService, stateService, gameLogic) {

    function updateUI(params) {
      $scope.jsonState = angular.toJson(params.stateAfterMove, true);
      $scope.board = params.stateAfterMove.board;
      if ($scope.board === undefined) {
        $scope.board = [['', '', '','','','',''],
        ['', '', '','','','',''],
        ['', '', '','','','',''],
        ['', '', '','','','',''],
        ['', '', '','','','',''],
        ['', '', '','','','','']];
      }
    }
    updateUI({stateAfterMove: {}});
    var game = {
      gameDeveloperEmail: "ashwin.thobbi@gmail.com",
      minNumberOfPlayers: 2,
      maxNumberOfPlayers: 2,
      //exampleGame: gameLogic.getExampleGame(),
      //riddles: gameLogic.getRiddles()
    };

    var isLocalTesting = $window.location.origin === "file://";
    $scope.move = "[{setTurn: {turnIndex: 1}}, {set: {key: 'board', value: [['', '', '','','','',''],['', '', '','','','',''],['', '', '','','','',''],['', '', '','','','',''], ['', '', '','','','',''],['R', '', '','','','','']]}}, {set: {key: 'delta', value: {row: 5, col: 0}}}]";




    $scope.makeMove = function () {
      $log.info(["Making move:", $scope.move]);
      var moveObj = eval($scope.move);
      if (isLocalTesting) {
        stateService.makeMove(moveObj);
      } else {
        messageService.sendMessage({makeMove: moveObj});
      }
    };

    if (isLocalTesting) {
      game.isMoveOk = gameLogic.isMoveOk;
      game.updateUI = updateUI;
      stateService.setGame(game);
    } else {
      messageService.addMessageListener(function (message) {
        if (message.isMoveOk !== undefined) {
          var isMoveOkResult = gameLogic.isMoveOk(message.isMoveOk);
          messageService.sendMessage({isMoveOkResult: isMoveOkResult});
        } else if (message.updateUI !== undefined) {
          updateUI(message.updateUI);
        }
      });

      messageService.sendMessage({gameReady : game});
    }
  });
*/
'use strict';

// TODO: remove stateService before launching the game.
angular.module('myApp',
    ['myApp.messageService', 'myApp.gameLogic', 'myApp.scaleBodyService',
     'platformApp'])
  .controller('Ctrl', function (
      $window, $scope, $log,
      messageService, scaleBodyService, stateService, gameLogic) {

    var isLocalTesting = $window.parent === $window;

    function updateUI(params) {
      $scope.jsonState = angular.toJson(params.stateAfterMove, true);
      $scope.board = params.stateAfterMove.board;
      if ($scope.board === undefined) {
        $scope.board = gameLogic.getInitialBoard();
      }
      $scope.isYourTurn = params.turnIndexAfterMove >= 0 && // game is ongoing
        params.yourPlayerIndex === params.turnIndexAfterMove; // it's my turn
      $scope.turnIndex = params.turnIndexAfterMove;
    }

    function sendMakeMove(move) {
      $log.info(["Making move:", move]);
      if (isLocalTesting) {
        stateService.makeMove(move);
      } else {
        messageService.sendMessage({makeMove: move});
      }
    }

    // Before getting any updateUI message, we show an empty board to a viewer (so you can't perform moves).
    updateUI({stateAfterMove: {}, turnIndexAfterMove: 0, yourPlayerIndex: -2});
    var game = {
      gameDeveloperEmail: "yoav.zibin@gmail.com",
      minNumberOfPlayers: 2,
      maxNumberOfPlayers: 2,
      //exampleGame: gameLogic.getExampleGame(),
      //riddles: gameLogic.getRiddles()
    };

    $scope.move = "[{setTurn: {turnIndex: 1}}, {set: {key: 'board', value:[['X', '', ''], ['', '', ''], ['', '', '']]}}, {set: {key: 'delta', value: {row: 0, col: 0}}}]";
    $scope.makeMove = function () {
      sendMakeMove(eval($scope.move));
    };
    $scope.cellClicked = function (row, col) {
      $log.info(["Clicked on cell:", row, col]);
      if (!$scope.isYourTurn) {
        return;
      }
      try {
        var move = gameLogic.createMove($scope.board, row, col, $scope.turnIndex);
        $scope.isYourTurn = false; // to prevent making another move
        // TODO: show animations and only then send makeMove.
        sendMakeMove(move);
      } catch (e) {
        $log.info(["Cell is already full in position:", row, col]);
        return;
      }
    };

    scaleBodyService.scaleBody({width: 10, height: 10});

    if (isLocalTesting) {
      game.isMoveOk = gameLogic.isMoveOk;
      game.updateUI = updateUI;
      stateService.setGame(game);
    } else {
      messageService.addMessageListener(function (message) {
        if (message.isMoveOk !== undefined) {
          var isMoveOkResult = gameLogic.isMoveOk(message.isMoveOk);
          messageService.sendMessage({isMoveOkResult: isMoveOkResult});
        } else if (message.updateUI !== undefined) {
          updateUI(message.updateUI);
        }
      });

      messageService.sendMessage({gameReady : game});
    }
  });
