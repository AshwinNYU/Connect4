describe("In Connect4 ", function() {

  var Connect4logic;

  beforeEach(module("myApp.gameLogic"));

  beforeEach(inject(function (gameLogic) {
    Connect4logic = gameLogic;
  }));

  function expectMoveOk(turnIndexBeforeMove, stateBeforeMove, move) {
    expect(Connect4logic.isMoveOk({turnIndexBeforeMove: turnIndexBeforeMove,
      stateBeforeMove: stateBeforeMove,
      move: move})).toBe(true);
  }

  function expectIllegalMove(turnIndexBeforeMove, stateBeforeMove, move) {
    expect(Connect4logic.isMoveOk({turnIndexBeforeMove: turnIndexBeforeMove,
      stateBeforeMove: stateBeforeMove,
      move: move})).toBe(false);
  }

  it("placing R in 5x0 from initial state is legal", function() {
    expectMoveOk(0, {},
      [{setTurn: {turnIndex : 1}},
        {set: {key: 'board', value:
          [['', '', '','','','',''],
           ['', '', '','','','',''],
           ['', '', '','','','',''],
           ['', '', '','','','',''],
           ['', '', '','','','',''],
           ['R', '', '','','','','']]

           }},
        {set: {key: 'delta', value: {row: 5, col: 0}}}]);
  });

  it("placing B in 4x0 after R placed R in 5x0 is legal", function() {
    expectMoveOk(1,
      {board:
        [['', '', '','','','',''],
         ['', '', '','','','',''],
         ['', '', '','','','',''],
         ['', '', '','','','',''],
         ['', '', '','','','',''],
         ['R', '', '','','','','']], delta: {row: 5, col: 0}},
      [{setTurn: {turnIndex : 0}},
        {set: {key: 'board', value:
          [['', '', '','','','',''],
            ['', '', '','','','',''],
            ['', '', '','','','',''],
            ['', '', '','','','',''],
            ['B', '', '','','','',''],
            ['R', '', '','','','','']]

           }},
        {set: {key: 'delta', value: {row: 4, col: 0}}}]);
  });

  it("placing a B in a non-empty position is illegal", function() {
    expectIllegalMove(1,
      {board:
        [['', '', '','','','',''],
         ['', '', '','','','',''],
         ['', '', '','','','',''],
         ['', '', '','','','',''],
         ['', '', '','','','',''],
         ['R', '', '','','','','']], delta: {row: 5, col: 0}},
      [{setTurn: {turnIndex : 0}},
        {set: {key: 'board', value:
          [['', '', '','','','',''],
            ['', '', '','','','',''],
            ['', '', '','','','',''],
            ['', '', '','','','',''],
            ['', '', '','','','',''],
            ['B', '', '','','','','']]

           }},
        {set: {key: 'delta', value: {row: 5, col: 0}}}]);
  });


  it("R wins by placing R in 2x4 is legal", function() {
    expectMoveOk(0,
      {board:
        [['',   '',  '', '', '','',''],
          ['',  '',  '', '', '','',''],
          ['',  '',  '', '', '','',''],
          ['',  '',  '', 'R','','',''],
          ['',  '',  '', 'R','','',''],
          ['B', 'B', 'B','R','B','','']], delta: {row: 5, col: 4}},
      [{endMatch: {endMatchScores: [1, 0]}},
            {set: {key: 'board', value:
              [[  '',  '',  '', '',  '', '',''],
                 ['',  '',  '', '',  '','',''],
                 ['',  '',  '', 'R', '','',''],
                 ['',  '',  '', 'R', '','',''],
                 ['',  '',  '', 'R', '','',''],
                 ['B', 'B', 'B','R','B','','']]
               }},
            {set: {key: 'delta', value: {row: 2, col: 3}}}]);
  });

  it("B wins by placing B in 1x1 is legal", function() {
    expectMoveOk(1,
      {board:
        [['', '', '','','','',''],
           ['', '', '','','','',''],
           ['', '', '','','','',''],
           ['', '', 'B','R','','',''],
           ['', 'B', 'B','R','','',''],
           ['B', 'R', 'R','R','B','','']]
        , delta: {row: 3, col: 3}},
      [{endMatch: {endMatchScores: [0, 1]}},
            {set: {key: 'board', value:
                [['', '', '','','','',''],
                 ['', '', '','','','',''],
                 ['', '', '','B','','',''],
                 ['', '', 'B','R','','',''],
                 ['', 'B','B','R','','',''],
                 ['B', 'R','R','R','B','','']]
               }},
            {set: {key: 'delta', value: {row: 2, col: 3}}}]);
  });

  /*it("the game ties when there are no more empty cells", function() {
    expectMoveOk(0,
      {board:
          [['B', 'R', 'B','B','R','B',''],
           ['R', 'B', 'R','B','B','B','B'],
           ['B', 'R', 'B','R','B','R','B'],
           ['B', 'R', 'R','R','B','R','B'],
           ['R', 'B', 'R','B','R','R','R'],
           ['R', 'R', 'B','R','R','B','B']], delta: {row: 0, col: 6}},
      [{endMatch: {endMatchScores: [0, 0]}},
            {set: {key: 'board', value:
               [['B', 'R', 'B','B','R','B','B'],
                ['R', 'B', 'R','B','B','B','R'],
                ['B', 'R', 'B','R','B','R','B'],
                ['B', 'R', 'R','R','B','R','B'],
                ['R', 'B', 'R','B','R','R','R'],
                ['R', 'R', 'B','R','R','B','B']]}},
            {set: {key: 'delta', value: {row: 1, col: 6}}}]);
  });*/

  it("null move is illegal", function() {
    expectIllegalMove(0, {}, null);
  });

  it("move without board is illegal", function() {
    expectIllegalMove(0, {}, [{setTurn: {turnIndex : 1}}]);
  });

  it("move without delta is illegal", function() {
    expectIllegalMove(0, {}, [{setTurn: {turnIndex : 1}},
      {set: {key: 'board', value:
       [['', '', '','','','',''],
          ['', '', '','','','',''],
          ['', '', '','','','',''],
          ['', '', '','','','',''],
          ['', '', '','','','',''],
          ['R', '', '','','','','']]}}]);
  });

  it("placing X outside the board (in 3x0) is illegal", function() {
    expectIllegalMove(0, {}, [{setTurn: {turnIndex : 1}},
      {set: {key: 'board', value:
        [['', '', '','','','',''],
          ['', '', '','','','',''],
          ['', '', '','','','',''],
          ['', '', '','','','',''],
          ['', '', '','','','',''],
          ['R', '', '','','','','']]}},
      {set: {key: 'delta', value: {row: 8, col: 0}}}]);
  });

 /*it("Placing R inrow where(row,column) beneath that is empty is illegal",function(){
    expectIllegalMove(1,
    {board:
      [['', '', '','','','',''],
       ['', '', '','','','',''],
       ['', '', '','','','',''],
       ['', '', '','','','',''],
       ['', '', '','','','',''],
       ['R', '', '','','','','']], delta: {row: 5, col: 0}},
    [{setTurn: {turnIndex : 0}},
      {set: {key: 'board', value:
        [['', '', '','','','',''],
          ['', '', '','','','',''],
          ['', '', '','','','',''],
          ['', '', 'B','','','',''],
          ['', '', '','','','',''],
          ['R', '', '','','','','']]

         }},
      {set: {key: 'delta', value: {row: 3, col: 2}}}]);
    });*/

  it("placing R in 5x0 but setTurn to yourself is illegal", function() {
    expectIllegalMove(0, {}, [{setTurn: {turnIndex : 0}},
      {set: {key: 'board', value:
        [['', '', '','','','',''],
          ['', '', '','','','',''],
          ['', '', '','','','',''],
          ['', '', '','','','',''],
          ['', '', '','','','',''],
          ['R', '', '','','','','']]}},
      {set: {key: 'delta', value: {row: 5, col: 0}}}]);
  });

  it("placing R in 5x0 but setting the board wrong is illegal", function() {
    expectIllegalMove(0, {}, [{setTurn: {turnIndex : 1}},
      {set: {key: 'board', value:
        [['', '', '','','','',''],
          ['', '', '','','','',''],
          ['', '', '','','','',''],
          ['', '', '','','','',''],
          ['', '', '','','','',''],
          ['R', 'R', '','','','','']]}},
      {set: {key: 'delta', value: {row: 5, col: 0}}}]);
  });

  function expectLegalHistoryThatEndsTheGame(history) {
    for (var i = 0; i < history.length; i++) {
      expectMoveOk(history[i].turnIndexBeforeMove,
        history[i].stateBeforeMove,
        history[i].move);
    }
    expect(history[history.length - 1].move[0].endMatch).toBeDefined();
  }

  /*it("getExampleGame returns a legal history and the last move ends the game", function() {
    var exampleGame = Connect4logic.getExampleGame();
    expect(exampleGame.length).toBe(18);
    expectLegalHistoryThatEndsTheGame(exampleGame);
  });*/

  /*it("getRiddles returns legal histories where the last move ends the game", function() {
    var riddles = Connect4logic.getRiddles();
    expect(riddles.length).toBe(2);
    for (var i = 0; i < riddles.length; i++) {
      expectLegalHistoryThatEndsTheGame(riddles[i]);
    }
  });*/

});
