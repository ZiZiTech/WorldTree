package com.worldtree.finance.model;

public class ProductModel {
    // 产品ID
    private int id;
    // 产品标题
    private String title;
    // 产品副标题
    private String comment;
    // 产品标签，相互之间以","隔开
    private String label;
    // 产品收益率
    private float returns;
    // 积分比例
    private float integral = 1;
    // 推荐度
    private int recommend;

    public int getId() {
        return id;
    }

    public void setId(int id) {
        this.id = id;
    }

    public String getTitle() {
        return title;
    }

    public void setTitle(String title) {
        this.title = title;
    }

    public String getComment() {
        return comment;
    }

    public void setComment(String comment) {
        this.comment = comment;
    }

    public String getLabel() {
        return label;
    }

    public void setLabel(String label) {
        this.label = label;
    }

    public float getReturns() {
        return returns;
    }

    public void setReturns(float returns) {
        this.returns = returns;
    }

    public float getIntegral() {
        return integral;
    }

    public void setIntegral(float integral) {
        this.integral = integral;
    }

    public int getRecommend() {
        return recommend;
    }

    public void setRecommend(int recommend) {
        this.recommend = recommend;
    }
}
