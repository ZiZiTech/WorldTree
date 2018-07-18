package com.worldtree.finance.token;

import com.alibaba.fastjson.JSON;
import com.worldtree.finance.res.MessageCode;
import com.worldtree.finance.res.Response;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import javax.servlet.FilterChain;
import javax.servlet.ServletException;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.io.IOException;
import java.io.PrintWriter;

@Component
public class TokenFilter extends OncePerRequestFilter {
    @Autowired
    private TokenHelper tokenHelper;

    @Value("${jwt.header}")
    private String header;

    @Value("${jwt.tokenHeader}")
    private String tokenHeader;

    @Value("${jwt.project}")
    private String project;

    @Autowired
    private TokenUser tokenUser;

    @Override
    protected void doFilterInternal(HttpServletRequest httpServletRequest, HttpServletResponse httpServletResponse,
                                    FilterChain filterChain) throws ServletException, IOException {

        String authHeader = httpServletRequest.getHeader(this.header);
        if (authHeader != null && authHeader.startsWith(tokenHeader)) {
            final String authToken = authHeader.substring(tokenHeader.length());
            TokenObject tokenObject = tokenHelper.getUserAccountFromToken(authToken);
            logger.info("JwtAuthenticationTokenFilter[doFilterInternal] checking authentication " + JSON.toJSONString(tokenObject));

            if (tokenObject != null && project.equals(tokenObject.getProject()) && tokenHelper.validateTokenTemp(authToken)) {//token校验通过
                if (tokenUser == null) {
                    tokenUser = new TokenUser();
                }
                tokenUser.setUserId(tokenObject.getUserId());
            } else {
                writeToResponse(httpServletResponse, MessageCode.MSG_TOKEN_HEADER_NOT_FOUND);
                return;
            }
        } else {
            // throw new MessageException(MessageCode.MSG_TOKEN_HEADER_NOT_FOUND);
            writeToResponse(httpServletResponse, MessageCode.MSG_TOKEN_HEADER_NOT_FOUND);
            return;
        }

        filterChain.doFilter(httpServletRequest, httpServletResponse);

    }

    private void writeToResponse(HttpServletResponse httpServletResponse, MessageCode code) throws IOException {
        PrintWriter writer = httpServletResponse.getWriter();
        try {

            httpServletResponse.setCharacterEncoding("UTF-8");
            httpServletResponse.setContentType("application/json; charset=utf-8");
            writer.write(JSON.toJSONString(new Response().error(code)));
        } catch (Exception ex) {
            writer.close();
        }
    }
}
