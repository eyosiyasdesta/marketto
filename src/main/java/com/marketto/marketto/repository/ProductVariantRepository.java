package com.marketto.marketto.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import com.marketto.marketto.model.ProductVariant;

public interface ProductVariantRepository extends JpaRepository<ProductVariant, Long> {
}