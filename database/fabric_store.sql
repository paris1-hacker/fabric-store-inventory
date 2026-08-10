-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1:3306
-- Generation Time: Aug 10, 2026 at 06:45 PM
-- Server version: 9.4.0
-- PHP Version: 8.1.25

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `fabric_store`
--

-- --------------------------------------------------------

--
-- Table structure for table `categories`
--

CREATE TABLE `categories` (
  `id` int NOT NULL,
  `name` varchar(100) NOT NULL,
  `description` text NOT NULL,
  `created_at` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Dumping data for table `categories`
--

INSERT INTO `categories` (`id`, `name`, `description`, `created_at`) VALUES
(1, 'Ankara', 'African print fabrics', '2026-08-07 00:34:30'),
(2, 'Chiffon', 'Lightweight sheer fabrics', '2026-08-07 00:34:57'),
(3, 'Silk', 'Smooth natural silk fabrics', '2026-08-07 00:35:15'),
(4, 'Laces', 'Decorative lace fabrics commonly used for weddings, ceremonies and special occasions.', '2026-08-10 16:09:47'),
(5, 'Cotton', 'Soft and breathable fabric suitable for everyday clothing and casual wear.', '2026-08-10 16:09:47'),
(6, 'Denim', 'Strong and durable fabric commonly used for jeans, jackets, skirts and casual clothing.', '2026-08-10 16:09:47'),
(7, 'Velvet', 'Soft fabric with a rich textured surface, commonly used for luxury and evening outfits.', '2026-08-10 16:09:47'),
(8, 'Guipure', 'Decorative embroidered lace fabric often used for bridal wear and special occasion outfits.', '2026-08-10 16:09:47'),
(9, 'Kente', 'Traditional African woven fabric featuring bold colors and distinctive patterns.', '2026-08-10 16:09:47'),
(10, 'Adire', 'Traditional Nigerian tie-dye and indigo fabric known for unique handmade patterns.', '2026-08-10 16:09:47');

-- --------------------------------------------------------

--
-- Table structure for table `inventory`
--

CREATE TABLE `inventory` (
  `id` int NOT NULL,
  `product_id` int NOT NULL,
  `quantity` decimal(10,2) NOT NULL DEFAULT '0.00',
  `reorder_level` decimal(10,2) NOT NULL DEFAULT '10.00',
  `updated_at` datetime DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Dumping data for table `inventory`
--

INSERT INTO `inventory` (`id`, `product_id`, `quantity`, `reorder_level`, `updated_at`) VALUES
(3, 1, 200.00, 10.00, '2026-08-10 01:34:54'),
(14, 2, 28.00, 8.00, '2026-08-10 16:14:21'),
(15, 3, 60.00, 15.00, '2026-08-10 16:14:21'),
(16, 4, 35.00, 10.00, '2026-08-10 16:14:21'),
(17, 5, 18.00, 5.00, '2026-08-10 16:14:21'),
(18, 6, 42.00, 10.00, '2026-08-10 16:14:21'),
(19, 7, 0.00, 5.00, '2026-08-10 16:16:11'),
(20, 8, 20.00, 8.00, '2026-08-10 16:15:35'),
(21, 9, 9.00, 10.00, '2026-08-10 16:14:21'),
(22, 10, 32.00, 10.00, '2026-08-10 16:14:21');

-- --------------------------------------------------------

--
-- Table structure for table `products`
--

CREATE TABLE `products` (
  `id` int NOT NULL,
  `name` varchar(150) NOT NULL,
  `category_id` int NOT NULL,
  `supplier_id` int NOT NULL,
  `material` varchar(100) DEFAULT NULL,
  `color` varchar(100) DEFAULT NULL,
  `pattern` varchar(100) DEFAULT NULL,
  `price_per_yard` decimal(12,2) NOT NULL,
  `description` text,
  `created_at` datetime DEFAULT CURRENT_TIMESTAMP,
  `updated_at` datetime DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Dumping data for table `products`
--

INSERT INTO `products` (`id`, `name`, `category_id`, `supplier_id`, `material`, `color`, `pattern`, `price_per_yard`, `description`, `created_at`, `updated_at`) VALUES
(1, 'Royal Blue Ankara', 1, 1, 'Cotton', 'Royal Blue', 'African Print', 5500.00, 'Premium quality Ankara fabric', '2026-08-07 00:44:10', '2026-08-07 00:44:10'),
(2, 'Vintage Top', 2, 2, 'Cotton', 'Multicolor', 'Stripped', 9000.00, NULL, '2026-08-10 00:38:25', '2026-08-10 01:07:31'),
(3, 'Royal Blue Ankara', 1, 1, 'Cotton', 'Royal Blue', 'African Print', 5500.00, 'Premium royal blue Ankara fabric suitable for dresses, shirts and traditional outfits.', '2026-08-10 16:12:04', '2026-08-10 16:12:04'),
(4, 'Gold Lace Elegance', 2, 2, 'Lace', 'Gold', 'Floral', 8500.00, 'Elegant gold lace fabric suitable for weddings, ceremonies and special occasions.', '2026-08-10 16:12:04', '2026-08-10 16:12:04'),
(5, 'Sky Blue Chiffon', 3, 3, 'Chiffon', 'Sky Blue', 'Plain', 4500.00, 'Lightweight sky blue chiffon suitable for gowns, blouses and flowing dresses.', '2026-08-10 16:12:04', '2026-08-10 16:12:04'),
(6, 'White Premium Cotton', 4, 4, 'Cotton', 'White', 'Plain', 3200.00, 'Soft breathable white cotton fabric suitable for everyday clothing.', '2026-08-10 16:12:04', '2026-08-10 16:12:04'),
(7, 'Emerald Green Silk', 5, 5, 'Silk', 'Emerald Green', 'Plain', 12000.00, 'Luxurious emerald green silk fabric suitable for premium dresses and special occasions.', '2026-08-10 16:12:04', '2026-08-10 16:12:04'),
(8, 'Classic Blue Denim', 6, 1, 'Denim', 'Dark Blue', 'Twill', 6500.00, 'Durable dark blue denim suitable for jeans, jackets and casual outfits.', '2026-08-10 16:12:04', '2026-08-10 16:12:04'),
(9, 'Burgundy Velvet', 7, 2, 'Velvet', 'Burgundy', 'Plain', 9000.00, 'Soft burgundy velvet fabric with a rich finish for luxury and evening outfits.', '2026-08-10 16:12:04', '2026-08-10 16:12:04'),
(10, 'Ivory Guipure Lace', 8, 3, 'Guipure', 'Ivory', 'Floral', 10500.00, 'Beautiful ivory Guipure lace suitable for bridal wear and special occasions.', '2026-08-10 16:12:04', '2026-08-10 16:12:04'),
(11, 'Royal Kente Gold', 9, 4, 'Kente', 'Gold', 'Traditional', 15000.00, 'Traditional African Kente fabric featuring bold gold patterns and colors.', '2026-08-10 16:12:04', '2026-08-10 16:12:04'),
(12, 'Indigo Adire', 10, 5, 'Adire', 'Indigo Blue', 'Tie-Dye', 1000.00, 'Handmade Nigerian Adire fabric with distinctive indigo tie-dye patterns.', '2026-08-10 16:12:04', '2026-08-10 16:12:04');

-- --------------------------------------------------------

--
-- Table structure for table `settings`
--

CREATE TABLE `settings` (
  `id` int NOT NULL,
  `store_name` varchar(150) NOT NULL DEFAULT 'Fabric Store',
  `updated_at` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Dumping data for table `settings`
--

INSERT INTO `settings` (`id`, `store_name`, `updated_at`) VALUES
(1, 'Fabric Store', '2026-08-10 02:34:30');

-- --------------------------------------------------------

--
-- Table structure for table `stock_movements`
--

CREATE TABLE `stock_movements` (
  `id` int NOT NULL,
  `product_id` int NOT NULL,
  `user_id` int NOT NULL,
  `movement_type` enum('IN','OUT') NOT NULL,
  `quantity` decimal(10,2) NOT NULL,
  `previous_quantity` decimal(10,2) NOT NULL,
  `new_quantity` decimal(10,2) NOT NULL,
  `reference` varchar(255) DEFAULT NULL,
  `created_at` datetime DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Dumping data for table `stock_movements`
--

INSERT INTO `stock_movements` (`id`, `product_id`, `user_id`, `movement_type`, `quantity`, `previous_quantity`, `new_quantity`, `reference`, `created_at`) VALUES
(4, 1, 2, 'IN', 50.00, 150.00, 200.00, 'Supplier delivery', '2026-08-07 03:00:17'),
(5, 1, 4, 'IN', 50.00, 200.00, 250.00, NULL, '2026-08-10 01:30:05'),
(6, 1, 4, 'OUT', 50.00, 250.00, 200.00, NULL, '2026-08-10 01:34:54'),
(7, 8, 3, 'OUT', 5.00, 25.00, 20.00, NULL, '2026-08-10 16:15:35'),
(8, 7, 3, 'OUT', 12.00, 12.00, 0.00, NULL, '2026-08-10 16:16:11');

-- --------------------------------------------------------

--
-- Table structure for table `suppliers`
--

CREATE TABLE `suppliers` (
  `id` int NOT NULL,
  `name` varchar(150) NOT NULL,
  `contact_person` varchar(100) DEFAULT NULL,
  `phone` varchar(30) DEFAULT NULL,
  `email` varchar(150) DEFAULT NULL,
  `address` text,
  `created_at` datetime DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Dumping data for table `suppliers`
--

INSERT INTO `suppliers` (`id`, `name`, `contact_person`, `phone`, `email`, `address`, `created_at`) VALUES
(1, 'Premium Fabrics Nigeria', 'John Smith', '08012345678', 'premium@example.com', 'Calabar, Cross River State', '2026-08-07 00:30:30'),
(2, 'Global Textile Suppliers', 'Mary James', '08123456789', 'global@example.com', 'Lagos, Nigeria', '2026-08-07 00:31:24'),
(3, 'African Prints Wholesale', 'David Brown', '07098765432', 'africanprints@example.com', 'Onitsha, Anambra State', '2026-08-07 00:31:41'),
(4, 'Royal Textiles Ltd', 'Emeka Okoro', '08031234567', 'royaltextiless@example.com', '12 Market Road, Lagos', '2026-08-10 16:08:15'),
(5, 'Ankara World Fabrics', 'Blessing Johnson', '08029876543', 'ankaraworld@example.com', '45 Marian Road, Calabar', '2026-08-10 16:08:15'),
(6, 'Premium Fabrics Nigeria', 'Daniel Ekanem', '08145678901', 'premiumfabrics@example.com', '18 Watt Market Road, Calabar', '2026-08-10 16:08:15'),
(7, 'Classic Textile Suppliers', 'Mary Williams', '07034567890', 'classictextiles@example.com', '27 Aba Road, Port Harcourt', '2026-08-10 16:08:15'),
(8, 'African Prints Hub', 'Samuel Etim', '09012345678', 'africanprints@example.com', '8 Ikot Ekpene Road, Uyo', '2026-08-10 16:08:15');

-- --------------------------------------------------------

--
-- Table structure for table `users`
--

CREATE TABLE `users` (
  `id` int NOT NULL,
  `name` varchar(100) NOT NULL,
  `email` varchar(150) NOT NULL,
  `password` varchar(255) NOT NULL,
  `role` enum('ADMIN','STAFF') CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL DEFAULT 'STAFF',
  `created_at` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Dumping data for table `users`
--

INSERT INTO `users` (`id`, `name`, `email`, `password`, `role`, `created_at`) VALUES
(2, 'Admin User', 'admin@fabricstore.com', '1234', 'ADMIN', '2026-08-07 02:56:59'),
(3, 'Patrick', 'ofempatrick10@gmail.com', '$2b$10$jMiIu8kXgcdQcp5cmvjNJuDhZYHdhxkSgiRtShdmkJuWZv.0GIumu', 'STAFF', '2026-08-09 00:54:13'),
(4, 'Paris', 'parioflondon@gmail.com', '$2b$10$Jd2XAnIJZMa5hXESLFHRXOTDz976TZjP49FRxT.BuftWrHL0LZ1re', 'ADMIN', '2026-08-10 00:37:31'),
(5, 'Ofem Patrick', 'ofem@gmail.com', '$2b$10$m7W0/.Y/ajmRYXkI0ltf5eGgmkAP/KRIDKO/Y8yRBXQKLI0Tp8H8G', 'STAFF', '2026-08-10 02:27:16'),
(6, 'Paris', 'paris@gmail.com', '$2b$10$zZaGQcmnk/2GSvUaocy7lu.2MQvuwBDI2gCz9LXKuJJ9iAwvfoMwu', 'ADMIN', '2026-08-10 16:20:41');

--
-- Indexes for dumped tables
--

--
-- Indexes for table `categories`
--
ALTER TABLE `categories`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `name` (`name`);

--
-- Indexes for table `inventory`
--
ALTER TABLE `inventory`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `product_id` (`product_id`);

--
-- Indexes for table `products`
--
ALTER TABLE `products`
  ADD PRIMARY KEY (`id`),
  ADD KEY `category_id` (`category_id`),
  ADD KEY `supplier_id` (`supplier_id`);

--
-- Indexes for table `settings`
--
ALTER TABLE `settings`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `stock_movements`
--
ALTER TABLE `stock_movements`
  ADD PRIMARY KEY (`id`),
  ADD KEY `product_id` (`product_id`),
  ADD KEY `fk_stock_movements_user` (`user_id`);

--
-- Indexes for table `suppliers`
--
ALTER TABLE `suppliers`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `users`
--
ALTER TABLE `users`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `email` (`email`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `categories`
--
ALTER TABLE `categories`
  MODIFY `id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=12;

--
-- AUTO_INCREMENT for table `inventory`
--
ALTER TABLE `inventory`
  MODIFY `id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=23;

--
-- AUTO_INCREMENT for table `products`
--
ALTER TABLE `products`
  MODIFY `id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=13;

--
-- AUTO_INCREMENT for table `settings`
--
ALTER TABLE `settings`
  MODIFY `id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- AUTO_INCREMENT for table `stock_movements`
--
ALTER TABLE `stock_movements`
  MODIFY `id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=9;

--
-- AUTO_INCREMENT for table `suppliers`
--
ALTER TABLE `suppliers`
  MODIFY `id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=10;

--
-- AUTO_INCREMENT for table `users`
--
ALTER TABLE `users`
  MODIFY `id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=7;

--
-- Constraints for dumped tables
--

--
-- Constraints for table `inventory`
--
ALTER TABLE `inventory`
  ADD CONSTRAINT `inventory_ibfk_1` FOREIGN KEY (`product_id`) REFERENCES `products` (`id`);

--
-- Constraints for table `products`
--
ALTER TABLE `products`
  ADD CONSTRAINT `products_ibfk_1` FOREIGN KEY (`category_id`) REFERENCES `categories` (`id`),
  ADD CONSTRAINT `products_ibfk_2` FOREIGN KEY (`supplier_id`) REFERENCES `suppliers` (`id`);

--
-- Constraints for table `stock_movements`
--
ALTER TABLE `stock_movements`
  ADD CONSTRAINT `fk_stock_movements_user` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`),
  ADD CONSTRAINT `stock_movements_ibfk_1` FOREIGN KEY (`product_id`) REFERENCES `products` (`id`);
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
