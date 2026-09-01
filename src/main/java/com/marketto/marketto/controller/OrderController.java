package com.marketto.marketto.controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.marketto.marketto.dto.BuyNowRequest;
import com.marketto.marketto.dto.CheckoutRequest;
import com.marketto.marketto.model.Order;
import com.marketto.marketto.service.OrderService;

@RestController
@RequestMapping("/api/orders")
public class OrderController {

    @Autowired
    private OrderService orderService;

    @PostMapping("/checkout")
    public Order checkout(Authentication authentication, @RequestBody CheckoutRequest request) {
        return orderService.checkout(authentication.getName(), request);
    }

    @PostMapping("/buy-now")
    public Order buyNow(Authentication authentication, @RequestBody BuyNowRequest request) {
        return orderService.buyNow(authentication.getName(), request);
    }

    @GetMapping
    public List<Order> getMyOrders(Authentication authentication) {
        return orderService.getUserOrders(authentication.getName());
    }
}