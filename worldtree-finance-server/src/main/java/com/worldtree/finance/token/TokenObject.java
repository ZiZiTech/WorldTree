package com.worldtree.finance.token;

public class TokenObject {
    private String phoneNumber;

    private int userId;

    private String project;

    public String getPhoneNumber() {
        return phoneNumber;
    }

    public void setPhoneNumber(String phoneNumber) {
        this.phoneNumber = phoneNumber;
    }

    public int getUserId() {
        return userId;
    }

    public void setUserId(int userId) {
        this.userId = userId;
    }

    public String getProject() {
        return project;
    }

    public void setProject(String project) {
        this.project = project;
    }

    @Override
    public boolean equals(Object obj) {
        TokenObject tokenObject = (TokenObject)obj;
        return (getUserId() + getPhoneNumber() + getProject())
                .equals(tokenObject.getUserId() + tokenObject.getPhoneNumber() + tokenObject.getProject());
    }
}
