package com.marketto.marketto.config;

import java.math.BigDecimal;
import java.util.List;

import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;

import com.marketto.marketto.model.Category;
import com.marketto.marketto.model.Product;
import com.marketto.marketto.model.ProductVariant;
import com.marketto.marketto.repository.CategoryRepository;
import com.marketto.marketto.repository.ProductRepository;
import com.marketto.marketto.repository.ProductVariantRepository;

@Component
public class DataSeeder implements CommandLineRunner {

        private final CategoryRepository categoryRepository;
        private final ProductRepository productRepository;
        private final ProductVariantRepository productVariantRepository;

        public DataSeeder(CategoryRepository categoryRepository, ProductRepository productRepository,
                        ProductVariantRepository productVariantRepository) {
                this.categoryRepository = categoryRepository;
                this.productRepository = productRepository;
                this.productVariantRepository = productVariantRepository;
        }

        @Override
        public void run(String... args) {
                if (categoryRepository.count() > 0) {
                        System.out.println("Data already seeded, skipping.");
                        return;
                }

                Category electronics = categoryRepository.save(new Category(null, "Electronics", null));
                Category clothing = categoryRepository.save(new Category(null, "Clothing", null));
                Category home = categoryRepository.save(new Category(null, "Home", null));
                Category books = categoryRepository.save(new Category(null, "Books", null));
                Category accessories = categoryRepository.save(new Category(null, "Accessories", null));

                categoryRepository.save(new Category(null, "Audio", electronics));
                categoryRepository.save(new Category(null, "Computers", electronics));
                categoryRepository.save(new Category(null, "Wearables", electronics));

                categoryRepository.save(new Category(null, "Men", clothing));
                categoryRepository.save(new Category(null, "Women", clothing));
                categoryRepository.save(new Category(null, "Kids", clothing));

                categoryRepository.save(new Category(null, "Furniture", home));
                categoryRepository.save(new Category(null, "Kitchen", home));
                categoryRepository.save(new Category(null, "Decor", home));

                categoryRepository.save(new Category(null, "Fiction", books));
                categoryRepository.save(new Category(null, "Non-Fiction", books));
                categoryRepository.save(new Category(null, "Kids Books", books));

                categoryRepository.save(new Category(null, "Bags", accessories));
                categoryRepository.save(new Category(null, "Jewelry", accessories));
                categoryRepository.save(new Category(null, "Eyewear", accessories));

                productRepository.save(new Product(null, "Smart Watch Series 7", "Fitness tracking smartwatch",
                                new BigDecimal("399.99"), new BigDecimal("329.99"), "TechWatch", 50,
                                "https://images.unsplash.com/photo-1546868871-7041f2a55e12?w=800&auto=format&fit=crop&q=80", 4.7, 689, electronics, null));

                productRepository.save(new Product(null, "Portable Bluetooth Speaker", "Waterproof 360-degree speaker",
                                new BigDecimal("89.99"), new BigDecimal("69.99"), "SoundWave", 40,
                                "https://images.unsplash.com/photo-1608043152269-423dbba4e7e1?w=800&auto=format&fit=crop&q=80", 4.6, 523, electronics, null));

                productRepository.save(new Product(null, "Flagship Smartphone Pro", "Latest flagship smartphone",
                                new BigDecimal("999.99"), new BigDecimal("899.99"), "TechPhone", 20,
                                "https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=800&auto=format&fit=crop&q=80", 4.5, 445, electronics, null));

                productRepository.save(new Product(null, "Premium Wireless Headphones", "Noise-cancelling headphones",
                                new BigDecimal("299.99"), new BigDecimal("249.99"), "SoundWave", 35,
                                "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=800&auto=format&fit=crop&q=80", 4.7, 342, electronics, null));

                productRepository.save(new Product(null, "Fitness Tracker Band", "Slim fitness band, 14-day battery",
                                new BigDecimal("79.99"), null, "FitBand", 60,
                                "https://images.unsplash.com/photo-1575311373937-040b8e1fd5b6?w=800&auto=format&fit=crop&q=80", 4.3, 1024, electronics, null));

                productRepository.save(new Product(null, "Gaming Mechanical Keyboard", "RGB mechanical keyboard",
                                new BigDecimal("149.99"), new BigDecimal("119.99"), "GameGear", 30,
                                "https://images.unsplash.com/photo-1587829741301-dc798b83add3?w=800&auto=format&fit=crop&q=80", 4.6, 412, electronics, null));

                Product tee = productRepository.save(new Product(null, "Premium Black Tee", "Soft cotton t-shirt",
                                new BigDecimal("34.99"), new BigDecimal("24.99"), "BasicCo", 100,
                                "https://images.unsplash.com/photo-1521572267360-ee0c2909d518?w=800&auto=format&fit=crop&q=80", 4.5, 345, clothing, null));

                Product sneakers = productRepository
                                .save(new Product(null, "High-Top Canvas Sneakers", "Classic canvas sneakers",
                                                new BigDecimal("119.99"), new BigDecimal("89.99"), "StepUp", 45,
                                                "https://images.unsplash.com/photo-1525966222134-fcfa99b8ae77?w=800&auto=format&fit=crop&q=80", 4.4, 156, clothing, null));

                productRepository.save(new Product(null, "Retro Coffee Maker", "Classic style coffee maker",
                                new BigDecimal("199.99"), new BigDecimal("149.99"), "BrewMaster", 25,
                                "https://images.unsplash.com/photo-1517668808822-9ebb02f2a0e6?w=800&auto=format&fit=crop&q=80", 4.4, 178, home, null));

                productRepository.save(new Product(null, "Artisan Ceramic Vase", "Handcrafted ceramic vase",
                                new BigDecimal("39.99"), new BigDecimal("29.99"), "Artisan", 50,
                                "https://images.unsplash.com/photo-1581783342308-f792dbdd27c5?w=800&auto=format&fit=crop&q=80", 4.5, 156, home, null));

                productRepository.save(new Product(null, "Mystery of the Night", "Bestselling mystery novel",
                                new BigDecimal("19.99"), new BigDecimal("14.99"), "PenPress", 80,
                                "https://images.unsplash.com/photo-1544947950-fa07a98d237f?w=800&auto=format&fit=crop&q=80", 4.2, 189, books, null));

                Product backpack = productRepository.save(new Product(null, "Canvas Daypack",
                                "Everyday canvas backpack",
                                new BigDecimal("69.99"), new BigDecimal("49.99"), "CarryAll", 40,
                                "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=800&auto=format&fit=crop&q=80", 4.3, 345, accessories, null));

                seedVariants(tee, List.of("S", "M", "L", "XL"), List.of("Black", "White", "Gray"));
                seedVariants(sneakers, List.of("8", "9", "10", "11"), List.of("Black", "White"));
                seedVariants(backpack, List.of("One Size"), List.of("Black", "Navy", "Tan"));

                System.out.println("Database seeded with categories, subcategories, products, and variants.");
        }

        private void seedVariants(Product product, List<String> sizes, List<String> colors) {
                for (String color : colors) {
                        for (String size : sizes) {
                                ProductVariant variant = new ProductVariant();
                                variant.setProduct(product);
                                variant.setColor(color);
                                variant.setSize(size);
                                variant.setStock(15);
                                productVariantRepository.save(variant);
                        }
                }
        }
}