const prompt = require('readline-sync');

class DiceGame {
  constructor () {
    this.player = [];
    this.currentPlayer = 0;
    this.finalScore = 50;
  }

  setPlayer() {
    let numOfPlayer = prompt.question(console.log('Type number of players'));
    for (let i = 1; i <= numOfPlayer; i++) {
      let playerName = prompt.question(console.log(`Type player${i} name`));
      this.player.push(new Player(playerName));
    }
  }

  printDice(player) {
    let diceValues = player.dice.map( die => die.value );
    console.log(`${player.name}'s Dice roll result: ${diceValues}`);
  }

  printSavedDice(player) {
    let savedDiceIdx = [];
    player.dice.forEach((die, idx) => {
      if (die.isSaved) { savedDiceIdx.push(idx) }
    });
    console.log(`${player.name}'s saved dice: ${savedDiceIdx}`);
  }

  playUntilScore() {
    for (let i = 0; i < this.player.length; i++) {
      this.rollDiceNTimes(this.player[i], 3);
      if (this.player[i].score.totalScore >= this.finalScore) {
        return console.log(`Congratulations, ${this.player[i].name}, you've won!`);
      }
    }
    this.playUntilScore();
  }

  rollDiceNTimes(curPlayer, n) {
    console.log(`===== ${curPlayer.name}'s turn =====`);
    for (let i = 1; i <= n; i++) {
      curPlayer.rollDice();
      this.printDice(curPlayer);
      this.printSavedDice(curPlayer);
      let saveDiceIdx = prompt.question(console.log('Type index of dice that you want to save (ig: 1, 4, 5). If you don\'t want to save anything, type N. To stop rolling dice, type STOP' ));
      if ( i === n || saveDiceIdx === 'STOP') {
        return curPlayer.score.updateScore(curPlayer.dice);
      } else if ( saveDiceIdx === 'N' ) {
        continue;
      }else {
        curPlayer.saveDice(saveDiceIdx);
      }
    }
  }

  startPlay() {
      this.setPlayer();
      console.log('game start!');
      this.playUntilScore();
  }
}

class Player {
  constructor(name) {
    this.name = name;
    this.dice = this.getInitialDice(5);
    this.score = new Score;
  }

  getInitialDice(diceCount) {
    let initialDice = [];
    for (let i = 0; i < diceCount; i++) {
      initialDice.push(new Die);
    }
    return initialDice;
  }
  
  rollDice() {
    this.dice.forEach((die) => {
      if (!die.isSaved) { return die.getValue(); }
    });
  }

  saveDice(diceIndex) {
    let diceIdxArr = diceIndex.split(', ').map( idxStr => parseInt(idxStr) );
    diceIdxArr.forEach((idx) => {
      return this.dice[idx].isSaved = true;
    });
  }

  resetSaveDice() {
    this.dice.forEach(die => { die.isSaved = false });
  }
}

class Die {
  constructor() {
    this.value = null;
    this.isSaved = false;
  }

  getValue() {
    this.value =  Math.floor(Math.random() * 6 + 1);
  }
}

class Score {
  constructor() {
    this.totalScore = 0;
  }

  updateScore(resultDice) {
    let totalValue = resultDice.reduce((acc, cur) => {
      return acc += cur.value;
    }, 0);

    this.totalScore += totalValue;
    console.log(`Your score of this round is ${totalValue}`);
    console.log(`Your total score is ${this.totalScore}`);
  }
}

let game = new DiceGame;
game.startPlay();