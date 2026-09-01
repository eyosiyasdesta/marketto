package com.marketto.marketto.dto;

import lombok.Data;

@Data
public class BuyNowRequest {
    private Long productId;
    private Integer quantity;
    private String shippingAddress;
    private Long variantId;
}