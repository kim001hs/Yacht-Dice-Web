// 야추를 만들기
import * as Dice from './Dice.js';
const rollBtn = document.querySelector('#roll-btn');// URL 파라미터 읽기
const params = new URLSearchParams(window.location.search);
const playerCount = parseInt(params.get('playerCount'), 10); // 정수로 변환
const playerNames = JSON.parse(params.get('playerNames')); // JSON 문자열을 배열로 변환
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
    visited = Array(12).fill(false);
}

console.log(playerNames); // 닉네임 출력 (테스트용)
console.log(playerCount); // 플레이어 수 출력 (테스트용)
let players;
let showPossibleScore = new Player();
let saveDice = [];
let turn =1;
let rollCount=0;
PlayerSet();
showTable();
// 초기화 및 실행
Dice.initPhysics();
Dice.initScene(5);  
Dice.updateDiceCount(4);
console.log(Dice.diceResult);
console.log(Dice.diceArray);
Yacht();
function PlayerSet(){
    players = Array.from({ length: playerCount + 1 }, () => new Player());
    for(let i=1;i<=playerCount;i++){
        players[i].playerNum=i;
        players[i].name=playerNames[i-1];
    }
}
function Yacht(){
    if(turn==playerCount*12+1){
        console.log("게임 종료");
        return;
    }
    let i=turn%playerCount;
    console.log(players[i].name+"의 차례입니다.");
    showPossibleScore=new Player();//임시로 보일 스코어
    Dice.updateDiceCount(5);
    saveDice = []; //저장할 주사위
    rollBtn.addEventListener('click', RollDiceOnce);
    rollBtn.disabled = false;
    rollBtn.disabled = false;
}
function Yacht1(){
    for(var i=1;i<=12*playerCount;i++){
        console.log(players[i].name+"의 차례입니다.");
        showPossibleScore=new Player();//임시로 보일 스코어
        //Dice.initScene(5);
        saveDice = []; //저장할 주사위
        rollBtn.addEventListener('click', RollDiceOnce);
        // while(Dice.diceResult.size!=5){
        //     rollBtn.disabled = false;
        // }
        nowScore(i);
        //if(스코어 클릭){visited[스코어번호]=true;continue(다음턴);}
        //if(주사위 클릭){saveDice.push(Dice.diceResult[주사위번호]);}
        rollBtn.disabled = false;
        // while(Dice.diceResult.size!=5-saveDice.size){
        //     rollBtn.disabled = false;
        // }
        nowScore(i);
        //if(스코어 클릭){visited[스코어번호]=true;continue;}
        //if(주사위 클릭){saveDice.push(Dice.diceResult[주사위번호]);}
        rollBtn.disabled = false;
        // while(Dice.diceResult.size!=5-saveDice.size){
        //     rollBtn.disabled = false;
        // }
        nowScore(i);
        //if(
        //스코어 클릭){visited[스코어번호]=true;
        //players[j].(클릭한 스코어)=showPossibleScore.(클릭한 스코어);
        //continue;}

        //표에 클릭할 수 있게 점수 보여줌
        //결과버튼 5개 클릭하면 저장
        showTable();
    }
}
async function RollDiceOnce() {
    Dice.throwDice(); // 주사위 굴리기 함수 호출
    rollBtn.disabled = true; // 버튼 비활성화
    await new Promise(resolve => setTimeout(resolve, 2000));
    if(Dice.diceResult.length!=5){
        rollBtn.disabled = false;
        return;
    }
    nowScore(turn%playerCount);
    console.log(Dice.diceResult);
}

function nowScore(playerNum){
    //추가할 수 있는 점수 표시
    for(let i=1;i<=12;i++){
        if(!players[playerNum].visited[i]){
            calculateScore(i,playerNum);
        }
        else{
        }
    }
}
function showTable() {
    const scoreboard = document.querySelector('.scoreboard');

    // 테이블 초기화
    scoreboard.innerHTML = '';

    // 테이블 생성
    const table = document.createElement('table');
    const thead = document.createElement('thead');
    const tbody = document.createElement('tbody');

    // 테이블 헤더
    const headerRow = document.createElement('tr');
    const emptyHeader = document.createElement('th'); // 빈 칸
    headerRow.appendChild(emptyHeader);

    for (let i = 1; i < players.length; i++) {
        const th = document.createElement('th');
        th.textContent = players[i].name || `Player ${i}`;
        headerRow.appendChild(th);
    }
    thead.appendChild(headerRow);

    // 테이블 바디 (점수 표시)
    const categories = Object.keys(new Player()).filter(key => key !== 'playerNum' && key !== 'name' && key !== 'visited');
    categories.forEach(category => {
        const row = document.createElement('tr');
        const categoryCell = document.createElement('td');
        categoryCell.textContent = category;
        row.appendChild(categoryCell);

        for (let i = 1; i < players.length; i++) {
            const scoreCell = document.createElement('td');
            scoreCell.classList.add('score');
            scoreCell.dataset.player = i;
            scoreCell.dataset.category = category;
            scoreCell.textContent = players[i][category];
            row.appendChild(scoreCell);
        }
        tbody.appendChild(row);
    });

    table.appendChild(thead);
    table.appendChild(tbody);
    scoreboard.appendChild(table);
}

function selectTable(playerIndex, category,i) {
    const possibleValue = showPossibleScore[category];

    const cell = document.querySelector(`.score[data-player="${playerIndex}"][data-category="${category}"]`);
    // 기존 버튼 제거
    const existingButton = cell.querySelector('button');
    if (existingButton) existingButton.remove();

    // 새 버튼 추가
    const button = document.createElement('button');
    button.textContent = possibleValue;
    button.style.color = 'red';
    button.style.fontWeight = 'bold';
    button.style.backgroundColor = 'transparent';
    button.style.border = 'none';
    button.style.cursor = 'pointer';
    button.style.position = 'relative';
    button.style.zIndex = '10';
    //임시임시
    //임시임시
    button.style.width = '50px';
    button.style.height = '30px';
    button.style.backgroundColor = 'yellow'; // 임시 디버깅용

    button.addEventListener('click', () => {
        console.log('버튼이 클릭되었습니다!');
        // 점수 반영
        players[playerIndex][category] = possibleValue;

        // 표 업데이트
        showTable();

        // 방문 처리
        players[playerIndex].visited[i-1] = true;

        // 버튼 제거
        button.remove();

        //다음 턴으로 넘어감
        turn++;
        Yacht();
        return;
    });
    console.log(cell.childNodes); // 버튼이 추가되었는지 확인
    cell.appendChild(button);

}

function calculateScore(i,playerNum) {
    switch (i) {
        case 1: // Ones
            for (let j = 0; j < 5; j++) {
                if (Dice.diceResult[j] === 1) {
                    showPossibleScore.Ones += 1;
                }
            }
            selectTable(playerNum, "Ones",1);
            break;
        case 2: // Twos
            for (let j = 0; j < 5; j++) {
                if (Dice.diceResult[j] === 2) {
                    showPossibleScore.Twos += 2;
                }
            }
            selectTable(playerNum, "Twos",2);
            break;
        case 3: // Threes
            for (let j = 0; j < 5; j++) {
                if (Dice.diceResult[j] === 3) {
                    showPossibleScore.Threes += 3;
                }
            }
            selectTable(playerNum, "Threes",3);
            break;
        case 4: // Fours
            for (let j = 0; j < 5; j++) {
                if (Dice.diceResult[j] === 4) {
                    showPossibleScore.Fours += 4;
                }
            }
            selectTable(playerNum, "Fours",4);
            break;
        case 5: // Fives
            for (let j = 0; j < 5; j++) {
                if (Dice.diceResult[j] === 5) {
                    showPossibleScore.Fives += 5;
                }
            }
            selectTable(playerNum, "Fives",5);
            break;
        case 6: // Sixes
            for (let j = 0; j < 5; j++) {
                if (Dice.diceResult[j] === 6) {
                    showPossibleScore.Sixes += 6;
                }
            }
            selectTable(playerNum, "Sixes",6);
            break;
        case 7: // Choice
            for (let j = 0; j < 5; j++) {
                showPossibleScore.Choice += Dice.diceResult[j];
            }
            selectTable(playerNum, "Choice",7);
            break;
        case 8: // Four of a Kind
            if (hasNOfAKind(Dice.diceResult, 4)) {
                for (let j = 0; j < 5; j++) {
                    showPossibleScore.FourOfAKind += Dice.diceResult[j];
                }
            }
            selectTable(playerNum, "FourOfAKind",8);
            break;
        case 9: // Full House
            if (isFullHouse(Dice.diceResult)) {
                showPossibleScore.FullHouse = 25;
            }
            selectTable(playerNum, "FullHouse",9);
            break;
        case 10: // Small Straight
            if (isSmallStraight(Dice.diceResult)) {
                showPossibleScore.SmallStraight = 30;
            }
            selectTable(playerNum, "SmallStraight",10);
            break;
        case 11: // Large Straight
            if (isLargeStraight(Dice.diceResult)) {
                showPossibleScore.LargeStraight = 40;
            }
            selectTable(playerNum, "LargeStraight",11);
            break;
        case 12: // Yacht
            if (hasNOfAKind(Dice.diceResult, 5)) {
                showPossibleScore.Yacht = 50;
            }
            selectTable(playerNum, "Yacht",12);
            break;
        default:
            throw new Error("유효하지 않은 카테고리입니다.");
    }
}

// Helper: 같은 숫자가 n개 이상 있는지 확인
function hasNOfAKind(dice, n) {
    for (let value = 1; value <= 6; value++) {
        if (dice.filter(num => num === value).length >= n) {
            return true;
        }
    }
    return false;
}

// Helper: Full House 확인
function isFullHouse(dice) {
    const counts = dice.reduce((count, num) => {
        count[num] = (count[num] || 0) + 1;
        return count;
    }, {});
    const values = Object.values(counts);
    return values.includes(3) && values.includes(2);
}

// Helper: Small Straight 확인
function isSmallStraight(dice) {
    const unique = [...new Set(dice)].sort();
    const small = [[1, 2, 3, 4], [2, 3, 4, 5], [3, 4, 5, 6]];
    return small.some(pattern => pattern.every(num => unique.includes(num)));
}

// Helper: Large Straight 확인
function isLargeStraight(dice) {
    const unique = [...new Set(dice)].sort();
    return JSON.stringify(unique) === JSON.stringify([1, 2, 3, 4, 5]) ||
        JSON.stringify(unique) === JSON.stringify([2, 3, 4, 5, 6]);
}
