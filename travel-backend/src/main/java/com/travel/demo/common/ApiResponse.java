package com.travel.demo.common;

public class ApiResponse<T> {
    private int status;
    private String message;
    private T result;

    public static <T> ApiResponse<T> ok(T result) {
        ApiResponse<T> response = new ApiResponse<>();
        response.status = 200;
        response.message = "ok";
        response.result = result;
        return response;
    }

    public static <T> ApiResponse<T> fail(int status, String message) {
        ApiResponse<T> response = new ApiResponse<>();
        response.status = status;
        response.message = message;
        response.result = null;
        return response;
    }

    public int getStatus() {
        return status;
    }

    public void setStatus(int status) {
        this.status = status;
    }

    public String getMessage() {
        return message;
    }

    public void setMessage(String message) {
        this.message = message;
    }

    public T getResult() {
        return result;
    }

    public void setResult(T result) {
        this.result = result;
    }
}
