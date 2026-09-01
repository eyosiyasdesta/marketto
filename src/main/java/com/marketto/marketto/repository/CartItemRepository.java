package com.marketto.marketto.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import com.marketto.marketto.model.CartItem;

public interface CartItemRepository extends JpaRepository<CartItem, Long> {
}