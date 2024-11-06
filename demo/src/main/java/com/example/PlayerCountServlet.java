package com.example;

import java.io.BufferedReader;
import java.io.IOException;

import javax.servlet.ServletException;
import javax.servlet.annotation.WebServlet;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import org.json.JSONObject;

@WebServlet("/setPlayerCount")
public class PlayerCountServlet extends HttpServlet {
    private int playerCount;

    @Override
    protected void doPost(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
        // JSON 데이터를 읽어 playerCount로 변환
        StringBuilder sb = new StringBuilder();
        BufferedReader reader = request.getReader();
        String line;
        while ((line = reader.readLine()) != null) {
            sb.append(line);
        }
        
        // JSON 파싱하여 인원수 추출
        JSONObject json = new JSONObject(sb.toString());
        playerCount = json.getInt("playerCount");

        // 콘솔에 출력
        System.out.println("현재 인원 수: " + playerCount);
    }

    public int getPlayerCount() {
        return playerCount;
    }
}
