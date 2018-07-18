package com.worldtree.finance.token;

import org.springframework.stereotype.Component;

@Component
public class TokenUser {
    private int userId;

    public int getUserId() {
        return userId;
    }

    public void setUserId(int userId) {
        this.userId = userId;
    }
}
