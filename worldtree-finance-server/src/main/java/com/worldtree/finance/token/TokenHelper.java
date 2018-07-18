package com.worldtree.finance.token;

import com.alibaba.fastjson.JSON;
import com.alibaba.fastjson.JSONObject;
import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.SignatureAlgorithm;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;

import java.util.Calendar;
import java.util.Date;
import java.util.HashMap;
import java.util.Map;

@Component
public class TokenHelper {

    private static final String CLAIM_KEY_USER_ACCOUNT = "sub";
//    private static final String CLAIM_KEY_CREATED = "created";

    @Value("${jwt.header}")
    private String header;

    @Value("${jwt.secret}")
    private String secret;

    @Value("${jwt.expiration}")
    private int expiration;

    @Value("${jwt.tokenHeader}")
    private String tokenHeader;
    /**
     * 从token中获取用户account
     * @param token
     * @return
     */
    public TokenObject getUserAccountFromToken(String token) {
        TokenObject tokenObject;
        try {
            final Claims claims = getClaimsFromToken(token);
            tokenObject = JSON.toJavaObject(new JSONObject(claims), TokenObject.class);
        } catch (Exception e) {
            tokenObject = null;
        }
        return tokenObject;
    }

//    /**
//     * 从token中获取创建时间
//     * @param token
//     * @return
//     */
//    public long getCreatedDateFromToken(String token) {
//        long created;
//        try {
//            final Claims claims = getClaimsFromToken(token);
//            created = Long.valueOf(claims.get(CLAIM_KEY_CREATED).toString());
//        } catch (Exception e) {
//            created = 0;
//        }
//        return created;
//    }

    /**
     * 获取token的过期时间
     * @param token
     * @return
     */
    public Date getExpirationDateFromToken(String token) {
        Date expiration;
        try {
            final Claims claims = getClaimsFromToken(token);
            expiration = claims.getExpiration();
        } catch (Exception e) {
            expiration = null;
        }
        return expiration;
    }

    /**
     * 从token中获取claims
     * @param token
     * @return
     */
    private Claims getClaimsFromToken(String token) {
        Claims claims;
        try {
            claims = Jwts.parser()
                    .setSigningKey(secret)
                    .parseClaimsJws(token)
                    .getBody();
        } catch (Exception e) {
            claims = null;
        }
        return claims;
    }

    /**
     * 生存token的过期时间
     * @return
     */
    private Date generateExpirationDate() {
        return new Date(System.currentTimeMillis() + expiration * 1000);
    }

    /**
     * 判断token是否过期
     * @param token
     * @return
     */
    private Boolean isTokenExpired(String token) {
        final Date expiration = getExpirationDateFromToken(token);
        Boolean result= expiration.before(new Date());
        return result;
    }



    /**
     * 生成token
     * @param tokenObject
     * @return
     */
    public String generateToken(TokenObject tokenObject) {
//        Map<String, Object> claims = new HashMap<>();
//        claims.put(CLAIM_KEY_USER_ACCOUNT, tokenObject);
//        claims.put(CLAIM_KEY_CREATED, new Date());
        return tokenHeader + generateToken(JSON.parseObject(JSON.toJSONString(tokenObject)));
    }

    private String generateToken(Map<String, Object> claims) {
        return Jwts.builder()
                .setClaims(claims)
                .setExpiration(generateExpirationDate())
                .signWith(SignatureAlgorithm.HS512, secret)
                .compact();
    }

    /**
     * token 是否可刷新
     * @param token
     * @return
     */
    public Boolean canTokenBeRefreshed(String token) {
//        final Date created = getCreatedDateFromToken(token);
        return !isTokenExpired(token);
    }

    /**
     * 刷新token
     * @param token
     * @return
     */
    public String refreshToken(String token) {
        String refreshedToken;
        try {
            final Claims claims = getClaimsFromToken(token);
//            claims.put(CLAIM_KEY_CREATED, Calendar.getInstance().getTimeInMillis());
            refreshedToken = generateToken(claims);
        } catch (Exception e) {
            refreshedToken = null;
        }
        return refreshedToken;
    }

    /**
     * 验证token
     * @param token
     * @param tokenObject
     * @return
     */
    public Boolean validateToken(String token, TokenObject tokenObject) {
        final TokenObject clientTokenObject = getUserAccountFromToken(token);
        final Date expiration = getExpirationDateFromToken(token);
        Boolean result= (
                clientTokenObject.equals(tokenObject)
                        && !isTokenExpired(token) && expiration.getTime() > Calendar.getInstance().getTimeInMillis()
        );
        return result;
    }
    /**
     * 验证token
     * @param token
     * @param
     * @return
     */
    public Boolean validateTokenTemp(String token) {
        return !isTokenExpired(token);
    }
}
