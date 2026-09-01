package com.marketto.marketto.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.marketto.marketto.model.Cart;
import com.marketto.marketto.model.CartItem;
import com.marketto.marketto.model.Product;
import com.marketto.marketto.model.ProductVariant;
import com.marketto.marketto.model.User;
import com.marketto.marketto.repository.CartItemRepository;
import com.marketto.marketto.repository.CartRepository;
import com.marketto.marketto.repository.ProductRepository;
import com.marketto.marketto.repository.ProductVariantRepository;
import com.marketto.marketto.repository.UserRepository;

@Service
public class CartService {

    @Autowired
    private CartRepository cartRepository;

    @Autowired
    private CartItemRepository cartItemRepository;

    @Autowired
    private ProductRepository productRepository;

    @Autowired
    private ProductVariantRepository productVariantRepository;

    @Autowired
    private UserRepository userRepository;

    public Cart getOrCreateCart(String email) {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found"));

        return cartRepository.findByUserId(user.getId())
                .orElseGet(() -> {
                    Cart newCart = new Cart();
                    newCart.setUser(user);
                    return cartRepository.save(newCart);
                });
    }

    public Cart addToCart(String email, Long productId, int quantity, Long variantId) {
        Cart cart = getOrCreateCart(email);
        Product product = productRepository.findById(productId)
                .orElseThrow(() -> new RuntimeException("Product not found"));

        ProductVariant variant = null;
        if (variantId != null) {
            variant = productVariantRepository.findById(variantId)
                    .orElseThrow(() -> new RuntimeException("Variant not found"));
        }

        for (CartItem item : cart.getItems()) {
            boolean sameProduct = item.getProduct().getId().equals(productId);
            boolean sameVariant = (item.getVariant() == null && variant == null)
                    || (item.getVariant() != null && variant != null
                            && item.getVariant().getId().equals(variant.getId()));
            if (sameProduct && sameVariant) {
                item.setQuantity(item.getQuantity() + quantity);
                cartRepository.save(cart);
                return cart;
            }
        }

        CartItem newItem = new CartItem();
        newItem.setCart(cart);
        newItem.setProduct(product);
        newItem.setVariant(variant);
        newItem.setQuantity(quantity);
        cart.getItems().add(newItem);

        return cartRepository.save(cart);
    }

    public Cart removeFromCart(String email, Long cartItemId) {
        Cart cart = getOrCreateCart(email);
        cart.getItems().removeIf(item -> item.getId().equals(cartItemId));
        return cartRepository.save(cart);
    }

    public Cart updateCartItemQuantity(String email, Long cartItemId, int quantity) {
        Cart cart = getOrCreateCart(email);
        for (CartItem item : cart.getItems()) {
            if (item.getId().equals(cartItemId)) {
                if (quantity <= 0) {
                    cart.getItems().remove(item);
                } else {
                    item.setQuantity(quantity);
                }
                return cartRepository.save(cart);
            }
        }
        throw new RuntimeException("Cart item not found");
    }
}