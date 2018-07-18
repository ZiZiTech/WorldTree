package com.worldtree.finance.utils;

import java.util.Random;
import java.util.regex.Matcher;
import java.util.regex.Pattern;

public class WTStringUtils {

    /**
     * 判断字符串是否为手机号码
     * @param pn
     * @return
     */
    public static boolean isPhoneNumber(String pn){
        Pattern p=Pattern.compile("^[1][3-9][0-9]{9}$");
        Matcher m =p.matcher(pn);
        return m.matches();
    }
    /**
     * 获取一定长度的随机字符串
     * @param length 指定字符串长度
     * @return 一定长度的字符串
     */
    public static String getRandomStringByLength(int length) {
        String base = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
        return getRandomStr(base, length);
    }
    /**
     * 获取一定长度的随机字符串
     * @param length 指定字符串长度
     * @return 一定长度的字符串
     */
    public static String getNumberRandomStringByLength(int length) {
        String base = "0123456789";
        return getRandomStr(base, length);
    }

    private static String getRandomStr(String base, int length) {
        Random random = new Random();
        StringBuffer sb = new StringBuffer();
        for (int i = 0; i < length; i++) {
            int number = random.nextInt(base.length());
            sb.append(base.charAt(number));
        }
        return sb.toString();
    }

    public static String getVerificationCode(int length){
        double basic = Math.pow(10, length - 1);
        return  String.valueOf(new Random().nextInt((int)basic * 9) + (int)basic);
    }
}
