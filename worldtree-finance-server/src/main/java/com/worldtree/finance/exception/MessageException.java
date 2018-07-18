package com.worldtree.finance.exception;

import com.worldtree.finance.res.MessageCode;

public class MessageException extends Exception {
    private final int errorCode;
    private final String errorMessage;
    protected final MessageCode messageCode;
    public MessageException(MessageCode messageCode) {
        this.errorCode = messageCode.getCode();
        this.errorMessage = messageCode.getMessage();
        this.messageCode = messageCode;
    }

    public int getErrorCode() {
        return errorCode;
    }

    public String getErrorMessage() {
        return this.errorMessage;
    }

    public MessageCode getMessageCode() {
        return messageCode;
    }

    public String getLogMessage() {
        return this.messageCode.toString();
    }
}
