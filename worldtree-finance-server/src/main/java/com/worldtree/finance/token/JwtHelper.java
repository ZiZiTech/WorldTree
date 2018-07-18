package com.worldtree.finance.token;

import com.alibaba.fastjson.JSON;
import com.alibaba.fastjson.JSONObject;
import com.worldtree.finance.exception.MessageException;
import com.worldtree.finance.res.MessageCode;
import io.jsonwebtoken.JwtBuilder;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.SignatureAlgorithm;
import io.jsonwebtoken.impl.Base64Codec;
import org.apache.commons.lang3.StringUtils;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;

import javax.servlet.http.HttpServletRequest;
import java.util.Date;

@Component
public class JwtHelper {
    private static Logger logger = LoggerFactory.getLogger(JwtHelper.class);

    @Value("${jwt.header}")
    private String header;

    @Value("${jwt.secret}")
    private String secret;

    @Value("${jwt.expiration}")
    private int expiration;

    @Value("${jwt.tokenHeader}")
    private String tokenHeader;


    /**
     * 校验Token
     * @param jwt
     * @param httpRequest
     * @return
     */
    public int checkToken(String jwt, HttpServletRequest httpRequest){
        if (!StringUtils.isBlank(jwt)){
            if (jwt.split("\\.").length==3) {
                logger.info("jwt:" + jwt);
                String[] split = jwt.split("\\.");
                String content = split[1];
                String s = Base64Codec.BASE64URL.decodeToString(content);
                logger.info("s:" + s);
                String sign = split[2];
                logger.info("sign:" + sign);
                JSONObject jsonObject1 = JSONObject.parseObject(s);



                long nowMillis = System.currentTimeMillis();
                Date now = new Date(nowMillis);
                long expiresSecond = (long) jsonObject1.get("expiresSecond");

                //判断是否过期
                if(now.getTime()>expiresSecond)
                    return 2;


                TokenObject o = JSONObject.toJavaObject(jsonObject1, TokenObject.class);
                if (o!=null){
                    String project = o.getProject();
//                    if (!StaticInfo.PROJECT.equals(project))
                    if (!"finance".equals(project))
                        return 0;
                }
                String jwtByStr = createJWTByObj(o);
                String s2 = jwtByStr.split("\\.")[2];
                logger.info("s2:" + s2);
                if (sign.equals(s2)) {
                    return 1;
                } else
                    return 0;
            }
        }
        return 0;
    }

    /**
     * 获取用户id
     * @param jwt
     * @return
     */
    public int  getIdByJWT(String jwt){
        if (!StringUtils.isBlank(jwt)) {
            if (jwt.split("\\.").length == 3) {
                logger.info("jwt:" + jwt);
                String[] split = jwt.split("\\.");
                String content = split[1];
                String s = Base64Codec.BASE64URL.decodeToString(content);
                JSONObject jsonObject1 = JSONObject.parseObject(s);
                TokenObject o = JSONObject.toJavaObject(jsonObject1, TokenObject.class);
                return o.getUserId();
            }
        }
        return 0;
    }

    /**
     * 获取客户信息
     * @param request
     * @return
     * @throws MessageException
     */
    public int getIdByRequest(HttpServletRequest request) throws MessageException {
        int i = 0;
        String auth = request.getHeader(header);
        if ((auth != null) && (auth.length() > 6)) {
            String HeadStr = auth.substring(0, 5).toLowerCase();
            if (HeadStr.compareTo("basic") == 0) {
                auth = auth.substring(6, auth.length());
                i = getIdByJWT(auth);
            }
        }
        if (i==0)
            throw new MessageException(MessageCode.MSG_FORBIDDEN_BY_TOKEN_RIGHT);
        return i;
    }

    public String createJWTByObj(TokenObject tokenObject) {
        JSONObject jsonObject = JSON.parseObject(JSON.toJSONString(tokenObject));
        SignatureAlgorithm signatureAlgorithm = SignatureAlgorithm.HS256;

        long nowMillis = System.currentTimeMillis();
        Date now = new Date(nowMillis);

        //生成签名密钥
//        byte[] apiKeySecretBytes = DatatypeConverter.parseBase64Binary(tokenObject.getBase64Secret());
//        Key signingKey = new SecretKeySpec(apiKeySecretBytes, signatureAlgorithm.getJcaName());
        //添加构成JWT的参数
        JwtBuilder builder = Jwts.builder().setHeaderParam("typ", "JWT")
                .setHeaderParam("alg", "HS256")
                .setPayload(jsonObject.toString())
                .signWith(signatureAlgorithm, secret);

        //生成JWT
        return builder.compact();
    }
}
