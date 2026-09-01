package com.marketto.marketto.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

import com.marketto.marketto.model.Product;

public interface ProductRepository extends JpaRepository<Product, Long> {
    List<Product> findByCategoryId(Long categoryId);

    List<Product> findByBrand(String brand);
}