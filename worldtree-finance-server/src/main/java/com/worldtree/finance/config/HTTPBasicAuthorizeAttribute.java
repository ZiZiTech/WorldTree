//package com.worldtree.finance.config;
//
//import com.alibaba.fastjson.JSON;
//import com.worldtree.finance.constant.Consts;
//import com.worldtree.finance.res.MessageCode;
//import com.worldtree.finance.res.Response;
//import com.worldtree.finance.token.AccessResultEnum;
//import com.worldtree.finance.token.JwtHelper;
//import org.slf4j.Logger;
//import org.slf4j.LoggerFactory;
//import org.springframework.beans.factory.annotation.Autowired;
//
//import javax.servlet.*;
//import javax.servlet.annotation.WebFilter;
//import javax.servlet.http.HttpServletRequest;
//import javax.servlet.http.HttpServletResponse;
//import java.io.IOException;
//import java.io.PrintWriter;
//
//@WebFilter(filterName = "financeFilter", urlPatterns= "/finance/*")
//public class HTTPBasicAuthorizeAttribute implements Filter {
//    private Logger LOGGER = LoggerFactory.getLogger(HTTPBasicAuthorizeAttribute.class);
//
//
//    @Override
//    public void destroy() {
//        LOGGER.info("后台token过滤器,溜了溜了溜了溜了");
//        //可以日志管理添加
//    }
//
//    @Override
//    public void doFilter(ServletRequest request, ServletResponse response, FilterChain chain)
//            throws IOException, ServletException {
//        LOGGER.info("后台token过滤器检测");
//        //1.检测当前是否需要重新登录
//        if(audience !=null){
//            if (audience.getClientId().equals(Consts.LOG_OUT)){
//                toResponse((HttpServletResponse) response,1,(HttpServletRequest) request);
//                return;
//            }
//        }
//        //2.检测请求同token信息
//        AccessResultEnum resultStatusCode = checkHTTPBasicAuthorize(request);
//        if (resultStatusCode.equals(AccessResultEnum.SINGTIMEOUT)){//超时
//            toResponse((HttpServletResponse) response, 2,(HttpServletRequest) request);
//            return;
//        }else if (resultStatusCode.equals(AccessResultEnum.PERMISSION_DENIED)){//权限不够
//            toResponse((HttpServletResponse) response, 0,(HttpServletRequest) request);
//            return;
//        }
//        LOGGER.info("后台token过滤器检测通过");
//        chain.doFilter(request, response);
//    }
//
//    /**
//     * 响应
//     * @param response
//     * @param i 类型
//     * @throws IOException
//     */
//    private void toResponse(HttpServletResponse response, int i,HttpServletRequest request) throws IOException {
//        HttpServletResponse httpResponse = response;
//        httpResponse.setCharacterEncoding("UTF-8");
//        httpResponse.setContentType("application/json; charset=utf-8");
//        httpResponse.setHeader("Access-Control-Allow-Origin","*");
//        httpResponse.setHeader("Access-Control-Allow-Credentials", "true");
//        httpResponse.setHeader("Access-Control-Allow-Methods", "POST,GET,OPTIONS,DELETE,PATCH,PUT");
//        httpResponse.setHeader("Access-Control-Max-Age", "3600");
//        httpResponse.setHeader("Access-Control-Allow-Headers", "Origin,X-Requested-With,x-requested-with,X-Custom-Header," +
//                "Content-Type,Accept,Authorization");
//        String method = request.getMethod();
//        if ("OPTIONS".equalsIgnoreCase(method)){
//            LOGGER.info("OPTIONS请求");
//            httpResponse.setStatus(HttpServletResponse.SC_ACCEPTED);
//        }
//
//        PrintWriter writer = httpResponse.getWriter();
//        if (i==1)
//            writer.write(JSON.toJSONString(new Response().error(MessageCode.MSG_RELOGIN)));
//        else if (i==2)
//            writer.write(JSON.toJSONString(new Response().error(MessageCode.MSG_TOKEN_CHEDK_TIMEOUT)));
//        else
//            writer.write(JSON.toJSONString(new Response().error(MessageCode.MSG_FORBIDDEN_BY_TOKEN_RIGHT)));
//
//        try {
//            writer.close();
//        }catch (Exception ex) {
//
//        }
//    }
//
//    @Override
//    public void init(FilterConfig arg0) throws ServletException {
//        LOGGER.info("后台token过滤器启动");
//    }
//
//    /**
//     * 检测请求同token信息
//     * @param request
//     * @return
//     */
//    private AccessResultEnum checkHTTPBasicAuthorize(ServletRequest request)
//    {
//        try
//        {
//            HttpServletRequest httpRequest = (HttpServletRequest)request;
//            String auth = httpRequest.getHeader("Authorization");
//            if ((auth != null) && (auth.length() > 6))
//            {
//                String HeadStr = auth.substring(0, 5).toLowerCase();
//                if (HeadStr.compareTo("basic") == 0)
//                {
//                    auth = auth.substring(6, auth.length());
//                    int i = JwtHelper.checkToken(auth, httpRequest);
//                    if (i==1) {
//                        return AccessResultEnum.OK;
//                    }else if (i==2){
//                        return AccessResultEnum.SINGTIMEOUT;
//                    }
//                }
//            }
//            return AccessResultEnum.PERMISSION_DENIED;
//        }
//        catch(Exception ex)
//        {
//            return AccessResultEnum.PERMISSION_DENIED;
//        }
//
//    }
//}
