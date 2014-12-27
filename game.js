'use strict';

angular.module('myApp', ['ngTouch'])
.controller('Ctrl', function (
  $window, $scope, $log, $timeout,
  gameService, scaleBodyService, gameLogic) {

    var moveAudioB = new Audio('audio/move1.mp3');
    moveAudioB.load();
    var moveAudioW = new Audio('audio/move1.mp3');
    moveAudioW.load();

    function sendComputerMove(){
      gameService.makeMove(
        gameLogic.createComputerMove($scope.board, $scope.turnIndex));
      }

      function updateUI(params) {
        // check if commented: $scope.jsonState = angular.toJson(params.stateAfterMove, true);
        $scope.board = params.stateAfterMove.board;
        $scope.delta = params.stateAfterMove.delta;
        if ($scope.board === undefined) {
          $scope.board = [
          ['', '', '', '', '', '', ''],
          ['', '', '', '', '', '', ''],
          ['', '', '', '', '', '', ''],
          ['', '', '', '', '', '', ''],
          ['', '', '', '', '', '', ''],
          ['', '', '', '', '', '', ''],

          ];
        }

        else {
          if($scope.turnIndex === 0){
            moveAudioB.play();
          }
          else if($scope.turnIndex === 1){
            moveAudioW.play();
          }
        }

        $scope.isYourTurn = params.turnIndexAfterMove >= 0 && // game is ongoing
        params.yourPlayerIndex === params.turnIndexAfterMove; //it's my turn
        $scope.turnIndex = params.turnIndexAfterMove;
        // Is it the computer's turn?
        if ($scope.isYourTurn
          && params.playersInfo[params.yourPlayerIndex].playerId === '') {
            $scope.isYourTurn = false;
            $timeout(sendComputerMove, 1100);
          }
        }

        updateUI({stateAfterMove: {}, turnIndexAfterMove: 0, yourPlayerIndex: -2});

        $scope.cellClicked = function (row, col) {
          $log.info(["Clicked on cell:", row, col]);
          if (!$scope.isYourTurn) {
            return;
          }

          try {
            var move = gameLogic.createMove($scope.board, row, col, $scope.turnIndex);
            $scope.isYourTurn = false; // to prevent making another move

            gameService.makeMove(move);
          } catch (e) {
            $log.info(["wrong move", row, col]);
            return;
          }
        };

        $scope.shouldSlowlyAppear = function (row, col) {
          return $scope.delta !== undefined
          && $scope.delta.row === row && $scope.delta.col === col;
        }

        $scope.isWhite = function (row, col) {
          if ($scope.board[row][col] === 'B')
          {
            return true;
          }
          else
          {
            return false;
          }
        }

        $scope.isBlack = function (row, col) {
          if ($scope.board[row][col] === 'R')
          {
            return true;
          }
          else
          {
            return false;
          }
        }

        $scope.oddSum = function (row, col){
          if ((row + col) % 2 !== 0)
          {
            return true;
          }
          else
          {
            return false;
          }
        }

        $scope.evenSum = function (row, col){
          if ((row + col) % 2 === 0)
          {
            return true;
          }
          else
          {
            return false;
          }
        }

        scaleBodyService.scaleBody({width: 567, height: 567});

        gameService.setGame({
          gameDeveloperEmail: "purnima.p01@gmail.com",
          minNumberOfPlayers: 2,
          maxNumberOfPlayers: 2,
        //  exampleGame: gameLogic.exampleGame(),
          //riddles: gameLogic.riddles(),
          isMoveOk: gameLogic.isMoveOk,
          updateUI: updateUI
        });
      });
