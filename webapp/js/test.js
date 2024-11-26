// 야추를 만들기
import {diceResult ,initializeDiceApp, RollDice} from './Dice.js';
import {playerNames,playerCount} from './Setting.js';
const rollBtn = document.querySelector('#roll-btn');
class Player {
    playerNum = 0;
    name = '';
    Ones = 0;
    Twos = 0;
    Threes = 0;
    Fours = 0;
    Fives = 0;
    Sixes = 0;
    Subtotal = 0;
    Bonus = 0;
    Choice = 0;
    FourOfAKind = 0;
    FullHouse = 0;
    SmallStraight = 0;
    LargeStraight = 0;
    Yacht = 0;
    Total = 0;
}

console.log(playerNames); // 닉네임 출력 (테스트용)
console.log(playerCount); // 플레이어 수 출력 (테스트용)
PlayerSet();
// 초기화 및 실행
initializeDiceApp(5);
console.log(diceResult);
// Yacht();
rollBtn.addEventListener('click', RollDice);
function PlayerSet(){
    let players = Array.from({ length: playerCount + 1 }, () => new Player());
    for(let i=1;i<=playerCount;i++){
        players[i].playerNum=i;
        players[i].name=playerNames[i-1];
    }
}
function Yacht(){
    for(var i=0;i<12;i++){
        for(var j=1;j<=playerCount;j++){
            initializeDiceApp(5);
            while(diceResult.size!=5){
                rollBtn.addEventListener('click', RollDice);
            }
            console.log(diceResult);
        }
    }
}