package com.example.accessorystorebackend.repository;

import com.example.accessorystorebackend.entity.Product;
import org.springframework.data.jpa.repository.JpaRepository;

public interface ProductRepository extends JpaRepository<Product, Long> {
}
