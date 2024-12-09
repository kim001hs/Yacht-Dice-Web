# Yacht-Dice-Web
 - Yacht-Dice-Web은 Yacht게임을 웹에서 즐길 수 있도록 만든 게임입니다.
 - Github Pages로 연동을 해 놓아 [이 링크](https://kim001hs.github.io/Yacht-Dice-Web/)로 바로 플레이 하실 수 있습니다.


## Table of Contents

[]()

1.  [Getting Started]()
2.  [How to Play]()
    1.  [게임 입장 화면]()
    2.  [게임 시작 화면]()
    3.  [주사위 저장 가능]()
    4.  [다시 굴리기]()
3.  [API Function Docs]()
4.  [기술 스택]()
5.  [Reference]()
6.  [Third-Party Libraries and Licenses]()


### Getting Started


-   Web Link
    -   https://kim001hs.github.io/Yacht-Dice-Web/

-   로컬 서버 실행
    -  Python 서버, VSCode Live Server 등


###  실행 영상

[실행 영상](https://youtu.be/ebhHvrGuSeA)
 

### How to play
![start](image/start.png)
시작 전 세팅화면입니다. +와 -버튼을 통해 플레이어 수를 조정할 수 있고 입력란을 통해 닉네임을 설정할 수 있습니다. 
입력을 완료한 후 체크버튼을 누르면 다음 화면으로 넘어갑니다

![start](image/diceStart.png)
세팅 후 나오는 기본 화면입니다. 왼쪽에 점수가 나오고 오른쪽 밑의 Roll Dice버튼을 통해 각 턴마다 주사위를 세 번까지 굴릴 수 있습니다. 

![start](image/saveDice.png)
주사위를 한 번 이상 굴리면 나오는 화면입니다. 왼쪽에는 획득 가능한 점수가 나옵니다. 점수를 클릭하면 그 점수가 저장되고 턴이 넘어갑니다.
오른쪽에는 굴릴 주사위와 저장할 주사위가 나옵니다. 클릭을 통해 전환할 수 있습니다.

![start](image/reRoll.png)
2초안에 주사위의 눈이 결정되지 않았을 시 끼임 등으로 정해지지 않았다고 가정해 주사위를 다시 굴릴 수 있도록 합니다.

## License
    (MIT License)[https://github.com/H00ong/NinjaFrog/blob/main/LICENSE]


## Third-Party Libraries and Licenses

This project includes code from the following source(s):

- [Threejs-rolling-dice-tutorial](https://github.com/uuuulala/Threejs-rolling-dice-tutorial/tree/master) by [uuuulala], licensed under the MIT License.
