package com.marketto.marketto.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import com.marketto.marketto.model.Category;

public interface CategoryRepository extends JpaRepository<Category, Long> {
}