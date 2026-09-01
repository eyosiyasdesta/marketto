package com.marketto.marketto.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.marketto.marketto.dto.AddToCartRequest;
import com.marketto.marketto.dto.UpdateCartItemRequest;
import com.marketto.marketto.model.Cart;
import com.marketto.marketto.service.CartService;

@RestController
@RequestMapping("/api/cart")
public class CartController {

    @Autowired
    private CartService cartService;

    @GetMapping
    public Cart getCart(Authentication authentication) {
        return cartService.getOrCreateCart(authentication.getName());
    }

    @PostMapping("/add")
    public Cart addToCart(Authentication authentication, @RequestBody AddToCartRequest request) {
        return cartService.addToCart(authentication.getName(), request.getProductId(), request.getQuantity(),
                request.getVariantId());
    }

    @PutMapping("/update/{cartItemId}")
    public Cart updateCartItem(Authentication authentication, @PathVariable Long cartItemId,
            @RequestBody UpdateCartItemRequest request) {
        return cartService.updateCartItemQuantity(authentication.getName(), cartItemId, request.getQuantity());
    }

    @DeleteMapping("/remove/{cartItemId}")
    public Cart removeFromCart(Authentication authentication, @PathVariable Long cartItemId) {
        return cartService.removeFromCart(authentication.getName(), cartItemId);
    }
}