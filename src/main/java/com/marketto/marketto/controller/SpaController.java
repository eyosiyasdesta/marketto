package com.marketto.marketto.controller;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;

/** Serves the React entry point for browser-history routes in the production bundle. */
@Controller
public class SpaController {

    @GetMapping({
            "/products", "/products/{id}", "/cart", "/checkout", "/account", "/login", "/register",
            "/orders", "/wishlist", "/terms", "/privacy", "/track-order", "/contact", "/faqs",
            "/store-locations", "/careers", "/returns-policy", "/shipping-info"
    })
    public String forwardToReactApp() {
        return "forward:/index.html";
    }
}
