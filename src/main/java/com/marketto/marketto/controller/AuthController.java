package com.marketto.marketto.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.marketto.marketto.dto.LoginRequest;
import com.marketto.marketto.dto.LoginResponse;
import com.marketto.marketto.dto.RegisterRequest;
import com.marketto.marketto.dto.UserResponse;
import com.marketto.marketto.service.UserService;

@RestController
@RequestMapping("/api/auth")
public class AuthController {

    @Autowired
    private UserService userService;

    @GetMapping("/me")
    public String me(Authentication authentication) {
        if (authentication == null) {
            return "Not logged in";
        }
        return "You are logged in as: " + authentication.getName();
    }

    @PostMapping("/register")
    public UserResponse register(@RequestBody RegisterRequest request) {
        return userService.register(request);
    }

    @PostMapping("/login")
    public LoginResponse login(@RequestBody LoginRequest request) {
        return userService.login(request);
    }
}