package com.example;
import java.util.ArrayList;
class Player{
    int PlayerNum = 0;
    String PlayerName = "";

    int Ones=0;
    int Twos=0;
    int Threes=0;
    int Fours=0;
    int Fives=0;
    int Sixes=0;
    
    int subTotal=0;//63점 이상이면 35점 추가

    int Choice=0;
    int FourOfAKind=0;
    int FullHouse=0;
    int SmallStraight=0;
    int LargeStraight=0;
    int Yacht=0;

    int Total=0;
}
public class Yacht 
{
    public static void main( String[] args )
    {
        
        int PlayerCount = 4; //PlayerCountServlet.getPlayerCount();
        Player Player[] = new Player[PlayerCount+1];
        int[] dice = new int[5];
        for(int i=0;i<12;i++){
            for(int j=0;j<PlayerCount;j++){
                Roll(j);
            }
        }

    }
    public static void Roll(int num) {
        ArrayList<Integer> dice = new ArrayList<Integer>();
        ArrayList<Integer> save = new ArrayList<Integer>();
        int leftNum = 5;
        for(int i=0;i<3;i++){
            for(int j=0;j<leftNum;j++){
                dice.add((int)(Math.random() * 6) + 1);
            }
        }

    }
}
