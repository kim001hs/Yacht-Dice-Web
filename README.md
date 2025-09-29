### 한국어버전 md파일은 [여기](https://github.com/kim001hs/Yacht-Dice-Web/blob/main/READMEkr.md)있습니다
### Yacht-Dice-Web

- Yacht-Dice-Web is a game that allows users to play the Yacht game on the web.  
- It is linked to GitHub Pages and can be played directly via [this link](https://kim001hs.github.io/Yacht-Dice-Web/).

## Table of Contents

1. [How to Run](#how-to-run)
2. [Game Instructions](#game-instructions)
   1. [Game Entry Screen](#game-entry-screen)
   2. [Game Start Screen](#game-start-screen)
   3. [Dice Saving Screen](#dice-saving-screen)
   4. [Re-Roll](#re-roll)
3. [Code Description](#code-description)
4. [Tech Stack](#tech-stack)
5. [License](#license)
6. [Reference](#reference)
7. [Review](#review)

### How to Run

- **Web Link**  
  - [https://kim001hs.github.io/Yacht-Dice-Web/](https://kim001hs.github.io/Yacht-Dice-Web/)

- **Run Locally**  
  - Download from GitHub and run it on a local server using Python server, VSCode Live Server, etc.

### Demo Video

[Demo Video](https://youtu.be/ebhHvrGuSeA)

### Game Instructions

#### Game Entry Screen

![start](image/start.png)  
This is the initial settings screen before the game starts. You can adjust the number of players using the "+" and "−" buttons and set nicknames through the input fields. Once you've finished entering the details, click the check button to proceed to the next screen.

#### Game Start Screen

![start](image/diceStart.png)  
This is the default screen after completing the settings. Scores are displayed on the left, and the "Roll Dice" button at the bottom right allows you to roll the dice up to three times per turn.

#### Dice Saving Screen

![start](image/saveDice.png)  
This screen appears after rolling the dice at least once. Possible scores are displayed on the left, and clicking a score will save it and end the turn. On the right, you can see the dice to roll and the dice to save. You can switch them by clicking.

#### Re-Roll

![start](image/reRoll.png)  
If the dice values are not determined within 2 seconds due to overlaps or other issues, the game assumes an error and allows you to re-roll the dice.

### Code Description

#### Core Code

```javascript
function Yacht() {
    if (turn == playerCount * 12) {
        console.log("Game Over");
        return;
    }
    let i = turn % playerCount + 1;
    Dice.updateDiceCount(5);
    saveDice = []; // Dice to save
    rollCount = 0;
    render();
    rollBtn.disabled = false;
}

async function RollDice() {
    hideMessage();
    Dice.updateDiceCount(5 - saveDice.length);
    showPossibleScore = new Player(); // Temporary scores
    Dice.throwDice(); // Call dice rolling function
    rollBtn.disabled = true; // Disable button
    await new Promise(resolve => setTimeout(resolve, 2000)); // Wait 2 seconds
    if (Dice.diceResult.length != 5 - saveDice.length) { // Assume overlap if not resolved
        showMessage("The dice values weren't determined within 2 seconds. Please re-roll.");
        rollBtn.disabled = false;
        return;
    }
    rollCount++;
    diceResult = [...Dice.diceResult, ...saveDice];
    nowScore(turn % playerCount + 1); // Display possible scores
    render();
    if (rollCount < 3) { // Allow up to three rolls
        rollBtn.disabled = false;
    }
}
```

This code drives the game. It initiates a new turn with `Yacht()`, allows up to three rolls with `RollDice()`, re-rolls if the dice values are not determined within 2 seconds, and displays current and selectable scores through `nowScore()` and `render()`.

#### Suggested Modifications

```javascript
function increaseCount() {
    if (playerCount === 4) return; // Limit players to 4
}
```

In `increaseCount()` of `index.html`, the maximum number of players is set to 4. Modify this to allow more players if needed.

```javascript
async function RollDice() {
    await new Promise(resolve => setTimeout(resolve, 2000)); // Wait 2 seconds
    if (Dice.diceResult.length != 5 - saveDice.length) { // Assume overlap
        showMessage("The dice values weren't determined within 2 seconds. Please re-roll.");
        rollBtn.disabled = false;
        return;
    }
}
```

In `RollDice()` of `test.js`, the decision time for stuck dice is set to 2 seconds. Adjust this to make faster or slower decisions as needed.

### Tech Stack

![stack](image/stack.png)

### License

[MIT License](https://github.com/kim001hs/Yacht-Dice-Web/blob/main/LICENSE)

### Reference

**Third-Party Libraries and Licenses**  
This project includes code from the following source(s):  
- [Threejs-rolling-dice-tutorial](https://github.com/uuuulala/Threejs-rolling-dice-tutorial/tree/master) by [uuuulala], licensed under the MIT License.

### Review

#### Notable Changes I Made

- Combined the rules of the Yacht game with a 5-dice rolling game.
- Added functions to adjust the number of dice and players.
- Implemented score display and updates.
- Added functionality to save dice and roll only the remaining dice.

#### Limitations

- Game performance slows down as turns progress (resolved).
- Started the project with no prior knowledge of HTML, CSS, or JavaScript; couldn't study CSS thoroughly (used ChatGPT for most issues).
- Couldn't add a special ending screen due to time constraints.
- Found it nearly impossible to modify code involving Three.js and Cannon.js due to lack of familiarity (should have studied beforehand).

#### Overall

This project taught me a lot, especially about JavaScript. I look forward to taking on new challenges in the future.

