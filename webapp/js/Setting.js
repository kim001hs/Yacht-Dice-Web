// playerCount 요소 가져오기
let playerCountElement = document.querySelector('#playerCount');
// 요소의 텍스트 내용을 숫자로 변환
export let playerCount = 1;
const saveBtn = document.querySelector('#save-player'); // 저장 버튼 가져오기
export let playerNames = []; // 닉네임 저장 배열
document.addEventListener('DOMContentLoaded', () => {
    const saveBtn = document.querySelector('#save-player');
    if (saveBtn) {
        saveBtn.addEventListener('click', () => {
            updatePlayerCount();
            saveNicknames();
        });
    } else {
        console.error('저장 버튼이 없습니다.');
    }
});
function updatePlayerCount() {
    playerCountElement = document.querySelector('#playerCount');
    playerCount = parseInt(playerCountElement.textContent, 10);
}
function saveNicknames() {
    for (let i = 1; i <= playerCount; i++) {
        const input = document.querySelector(`#player-${i} input`); // 각 입력 필드 가져오기
        playerNames[i - 1] = input.value; // 배열에 저장
    }
    console.log(playerNames); // 닉네임 출력 (테스트용)
    console.log(playerCount); // 플레이어 수 출력 (테스트용)
    const params = new URLSearchParams({
        playerCount: playerCount, // HTML에서 사용 중인 count 변수
        playerNames: JSON.stringify(playerNames),
    });
    window.location.href = `Dice.html?${params.toString()}`; // 주사위 페이지로 이동
}