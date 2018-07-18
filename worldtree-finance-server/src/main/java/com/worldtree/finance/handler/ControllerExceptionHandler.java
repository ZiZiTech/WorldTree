package com.worldtree.finance.handler;

import com.worldtree.finance.exception.FinanceControllerException;
import com.worldtree.finance.res.MessageCode;
import com.worldtree.finance.res.Response;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.web.bind.annotation.ControllerAdvice;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.ResponseBody;

import javax.servlet.http.HttpServletRequest;
import java.io.PrintWriter;
import java.io.StringWriter;

/**
 * * Created by IntelliJ IDEA.
 * User: HaiQuan
 * Date: 2017/10/11 0011
 * Time: 16:40
 * version: V1.0
 */
@ControllerAdvice
public class ControllerExceptionHandler {
    private static final Logger LOGGER = LoggerFactory.getLogger(ControllerExceptionHandler.class);

    @ExceptionHandler(Exception.class)
    @ResponseBody
    public Response afterException(HttpServletRequest request, Exception ex) {
        StringWriter sw = new StringWriter();
        PrintWriter pw = new PrintWriter(sw);
        ex.printStackTrace(pw);
        pw.close();
        LOGGER.error(sw.toString());
        return new Response().error(MessageCode.ERR_UNKNOWN_EXCEPTION);
    }

    @ExceptionHandler(FinanceControllerException.class)
    @ResponseBody
    public Response afterControllerException(HttpServletRequest request, FinanceControllerException ex) {
        MessageCode messageCode = ex.getMessageCode();

        if (messageCode.getCode() > 90000) {
            LOGGER.error(request.getRequestURI() + ":" + ex.getLogMessage());
            messageCode = MessageCode.ERR_UNKNOWN_EXCEPTION;
        } else {
            LOGGER.warn(request.getRequestURI() + ":" + ex.getLogMessage());
        }
        return new Response().error(messageCode);
    }
}
