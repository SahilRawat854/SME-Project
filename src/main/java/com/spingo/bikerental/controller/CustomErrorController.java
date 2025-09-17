package com.spingo.bikerental.controller;

import org.springframework.boot.web.servlet.error.ErrorController;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.RequestMapping;

import jakarta.servlet.RequestDispatcher;
import jakarta.servlet.http.HttpServletRequest;

@Controller
public class CustomErrorController implements ErrorController {

    @RequestMapping("/error")
    public String handleError(HttpServletRequest request, Model model) {
        Object status = request.getAttribute(RequestDispatcher.ERROR_STATUS_CODE);
        Object message = request.getAttribute(RequestDispatcher.ERROR_MESSAGE);
        
        int statusCode = 500; // Default status code
        String errorMessage = "An unexpected error occurred";
        
        if (status != null) {
            statusCode = Integer.valueOf(status.toString());
        }
        
        if (message != null && !message.toString().isEmpty()) {
            errorMessage = message.toString();
        }
        
        // Set default messages for common status codes
        if (statusCode == 404) {
            errorMessage = "The page you are looking for was not found";
        } else if (statusCode == 403) {
            errorMessage = "Access denied. You don't have permission to access this resource";
        } else if (statusCode == 500) {
            errorMessage = "Internal server error occurred";
        }
        
        model.addAttribute("status_code", statusCode);
        model.addAttribute("message", errorMessage);
        
        return "error";
    }
}
