package com.marketto.marketto.service;

import java.math.BigDecimal;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.marketto.marketto.dto.BuyNowRequest;
import com.marketto.marketto.dto.CheckoutRequest;
import com.marketto.marketto.model.Cart;
import com.marketto.marketto.model.CartItem;
import com.marketto.marketto.model.Order;
import com.marketto.marketto.model.OrderItem;
import com.marketto.marketto.model.Product;
import com.marketto.marketto.model.ProductVariant;
import com.marketto.marketto.model.User;
import com.marketto.marketto.repository.CartRepository;
import com.marketto.marketto.repository.OrderRepository;
import com.marketto.marketto.repository.ProductRepository;
import com.marketto.marketto.repository.ProductVariantRepository;
import com.marketto.marketto.repository.UserRepository;

@Service
public class OrderService {

    @Autowired
    private OrderRepository orderRepository;

    @Autowired
    private CartService cartService;

    @Autowired
    private CartRepository cartRepository;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private ProductRepository productRepository;

    @Autowired
    private ProductVariantRepository productVariantRepository;

    @Transactional
    public Order buyNow(String email, BuyNowRequest request) {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found"));
        Product product = productRepository.findById(request.getProductId())
                .orElseThrow(() -> new RuntimeException("Product not found"));

        ProductVariant variant = null;
        if (request.getVariantId() != null) {
            variant = productVariantRepository.findById(request.getVariantId())
                    .orElseThrow(() -> new RuntimeException("Variant not found"));
        }

        int availableStock = variant != null ? variant.getStock() : product.getStock();
        if (availableStock < request.getQuantity()) {
            throw new RuntimeException("Insufficient stock for: " + product.getName());
        }

        Order order = new Order();
        order.setUser(user);
        order.setShippingAddress(request.getShippingAddress());

        OrderItem orderItem = new OrderItem();
        orderItem.setOrder(order);
        orderItem.setProduct(product);
        orderItem.setVariant(variant);
        orderItem.setQuantity(request.getQuantity());

        BigDecimal price = product.getDiscountPrice() != null ? product.getDiscountPrice() : product.getPrice();
        orderItem.setPriceAtPurchase(price);
        order.getItems().add(orderItem);
        BigDecimal subtotal = price.multiply(BigDecimal.valueOf(request.getQuantity()));
        BigDecimal shipping = subtotal.compareTo(BigDecimal.valueOf(75)) >= 0 ? BigDecimal.ZERO
                : BigDecimal.valueOf(6.99);
        order.setShippingCost(shipping);
        order.setTotalAmount(subtotal.add(shipping));

        if (variant != null) {
            variant.setStock(variant.getStock() - request.getQuantity());
        } else {
            product.setStock(product.getStock() - request.getQuantity());
        }

        return orderRepository.save(order);
    }

    @Transactional
    public Order checkout(String email, CheckoutRequest request) {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found"));

        Cart cart = cartService.getOrCreateCart(email);

        if (cart.getItems().isEmpty()) {
            throw new RuntimeException("Cart is empty");
        }

        Order order = new Order();
        order.setUser(user);
        order.setShippingAddress(request.getShippingAddress());

        BigDecimal total = BigDecimal.ZERO;

        for (CartItem cartItem : cart.getItems()) {
            Product product = cartItem.getProduct();
            ProductVariant variant = cartItem.getVariant();

            int availableStock = variant != null ? variant.getStock() : product.getStock();
            if (availableStock < cartItem.getQuantity()) {
                throw new RuntimeException("Insufficient stock for: " + product.getName());
            }

            OrderItem orderItem = new OrderItem();
            orderItem.setOrder(order);
            orderItem.setProduct(product);
            orderItem.setVariant(variant);
            orderItem.setQuantity(cartItem.getQuantity());

            BigDecimal price = product.getDiscountPrice() != null
                    ? product.getDiscountPrice()
                    : product.getPrice();
            orderItem.setPriceAtPurchase(price);

            total = total.add(price.multiply(BigDecimal.valueOf(cartItem.getQuantity())));

            order.getItems().add(orderItem);

            if (variant != null) {
                variant.setStock(variant.getStock() - cartItem.getQuantity());
            } else {
                product.setStock(product.getStock() - cartItem.getQuantity());
            }
        }

        BigDecimal shipping = total.compareTo(BigDecimal.valueOf(75)) >= 0 ? BigDecimal.ZERO
                : BigDecimal.valueOf(6.99);
        order.setShippingCost(shipping);
        order.setTotalAmount(total.add(shipping));
        Order savedOrder = orderRepository.save(order);

        cart.getItems().clear();
        cartRepository.save(cart);

        return savedOrder;
    }

    public List<Order> getUserOrders(String email) {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found"));
        return orderRepository.findByUserId(user.getId());
    }
}