-- MySQL dump 10.13  Distrib 8.0.22, for Win64 (x86_64)
--
-- Host: 127.0.0.1    Database: delilah_resto
-- ------------------------------------------------------
-- Server version	5.7.24

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!50503 SET NAMES utf8 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

--
-- Table structure for table `auths`
--

DROP TABLE IF EXISTS `auths`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `auths` (
  `auth_id` int(11) NOT NULL AUTO_INCREMENT,
  `auth_password` text,
  `auth_create_at` datetime DEFAULT '2020-12-29 13:02:31',
  `user_id` int(11) DEFAULT NULL,
  PRIMARY KEY (`auth_id`),
  KEY `user_id` (`user_id`),
  CONSTRAINT `auths_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`user_id`) ON DELETE SET NULL ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `auths`
--

LOCK TABLES `auths` WRITE;
/*!40000 ALTER TABLE `auths` DISABLE KEYS */;
INSERT INTO `auths` VALUES (1,'$2b$10$6JT4YplXokCYcD1LwfHTxuYxSIb3cuwIUNLpAxl8ooD8/N4FH4Waq','2020-12-29 13:02:31',1);
/*!40000 ALTER TABLE `auths` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `order__products`
--

DROP TABLE IF EXISTS `order__products`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `order__products` (
  `op_id` int(11) NOT NULL AUTO_INCREMENT,
  `op_create_time` datetime NOT NULL DEFAULT '2020-12-29 13:02:31',
  `op_quantity` int(11) DEFAULT NULL,
  `op_price` float DEFAULT NULL,
  `order_create_at` datetime DEFAULT '2020-12-29 13:02:31',
  `user_id` int(11) DEFAULT NULL,
  `order_id` int(11) DEFAULT NULL,
  `product_id` int(11) DEFAULT NULL,
  PRIMARY KEY (`op_id`),
  KEY `user_id` (`user_id`),
  KEY `order_id` (`order_id`),
  KEY `product_id` (`product_id`),
  CONSTRAINT `order__products_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`user_id`) ON DELETE SET NULL ON UPDATE CASCADE,
  CONSTRAINT `order__products_ibfk_2` FOREIGN KEY (`order_id`) REFERENCES `orders` (`order_id`) ON DELETE SET NULL ON UPDATE CASCADE,
  CONSTRAINT `order__products_ibfk_3` FOREIGN KEY (`product_id`) REFERENCES `products` (`prod_id`) ON DELETE SET NULL ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `order__products`
--

LOCK TABLES `order__products` WRITE;
/*!40000 ALTER TABLE `order__products` DISABLE KEYS */;
/*!40000 ALTER TABLE `order__products` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `orders`
--

DROP TABLE IF EXISTS `orders`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `orders` (
  `order_id` int(11) NOT NULL AUTO_INCREMENT,
  `order_create_time` datetime NOT NULL DEFAULT '2020-12-29 13:02:31',
  `order_create_at` datetime DEFAULT '2020-12-29 13:02:31',
  `user_id` int(11) DEFAULT NULL,
  `status_id` int(11) DEFAULT NULL,
  `payment_id` int(11) DEFAULT NULL,
  PRIMARY KEY (`order_id`),
  KEY `user_id` (`user_id`),
  KEY `status_id` (`status_id`),
  KEY `payment_id` (`payment_id`),
  CONSTRAINT `orders_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`user_id`) ON DELETE SET NULL ON UPDATE CASCADE,
  CONSTRAINT `orders_ibfk_2` FOREIGN KEY (`status_id`) REFERENCES `statuses` (`status_id`) ON DELETE SET NULL ON UPDATE CASCADE,
  CONSTRAINT `orders_ibfk_3` FOREIGN KEY (`payment_id`) REFERENCES `payments` (`pay_id`) ON DELETE SET NULL ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `orders`
--

LOCK TABLES `orders` WRITE;
/*!40000 ALTER TABLE `orders` DISABLE KEYS */;
/*!40000 ALTER TABLE `orders` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `payments`
--

DROP TABLE IF EXISTS `payments`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `payments` (
  `pay_id` int(11) NOT NULL AUTO_INCREMENT,
  `pay_name` varchar(60) DEFAULT NULL,
  `pay_create_at` datetime DEFAULT '2020-12-29 13:02:31',
  PRIMARY KEY (`pay_id`),
  UNIQUE KEY `payments_name_unique` (`pay_name`)
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `payments`
--

LOCK TABLES `payments` WRITE;
/*!40000 ALTER TABLE `payments` DISABLE KEYS */;
INSERT INTO `payments` VALUES (1,'EFECTIVO','2020-12-29 13:02:31'),(2,'T DEBITO','2020-12-29 13:02:31'),(3,'T CREDITO','2020-12-29 13:02:31');
/*!40000 ALTER TABLE `payments` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `products`
--

DROP TABLE IF EXISTS `products`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `products` (
  `prod_id` int(11) NOT NULL AUTO_INCREMENT,
  `prod_name` varchar(60) DEFAULT NULL,
  `prod_img_url` text,
  `prod_price` int(11) DEFAULT '0',
  `prod_enable` int(11) DEFAULT '1',
  `prod_create_at` datetime DEFAULT '2020-12-29 13:02:31',
  PRIMARY KEY (`prod_id`),
  UNIQUE KEY `products_name_unique` (`prod_name`)
) ENGINE=InnoDB AUTO_INCREMENT=7 DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `products`
--

LOCK TABLES `products` WRITE;
/*!40000 ALTER TABLE `products` DISABLE KEYS */;
INSERT INTO `products` VALUES (1,'Bagel de salmón','https://okdiario.com/img/2018/12/03/bagel-de-salmon-655x368.jpg',100,1,'2020-12-29 13:02:31'),(2,'Hamburguesa Clásica','https://sifu.unileversolutions.com/image/es-MX/recipe-topvisual/2/1260-709/hamburguesa-clasica-50425188.jpg',200,1,'2020-12-29 13:02:31'),(3,'Sandwich veggie','https://danzadefogones.com/wp-content/fotos/Veggie-sandwich/Veggie-sandwich-4.jpg',100,1,'2020-12-29 13:02:31'),(4,'Ensalada veggie','https://img-global.cpcdn.com/recipes/365784663a8df297/751x532cq70/ensalada-veggie-de-pepino-foto-principal.jpg',200,1,'2020-12-29 13:02:31'),(5,'Focaccia','https://diariodegastronomia.com/wp-content/uploads/2019/05/Focaccia-casera-759x500.jpg',100,1,'2020-12-29 13:02:31'),(6,'Sandwich de Focaccia','https://www.petitchef.es/imgupl/recipe/focaccia-sandwich--md-166713p249402.jpg',200,1,'2020-12-29 13:02:31');
/*!40000 ALTER TABLE `products` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `statuses`
--

DROP TABLE IF EXISTS `statuses`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `statuses` (
  `status_id` int(11) NOT NULL AUTO_INCREMENT,
  `status_name` varchar(60) DEFAULT NULL,
  `status_create_at` datetime DEFAULT '2020-12-29 13:02:31',
  PRIMARY KEY (`status_id`),
  UNIQUE KEY `statuses_name_unique` (`status_name`)
) ENGINE=InnoDB AUTO_INCREMENT=7 DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `statuses`
--

LOCK TABLES `statuses` WRITE;
/*!40000 ALTER TABLE `statuses` DISABLE KEYS */;
INSERT INTO `statuses` VALUES (1,'NUEVO','2020-12-29 13:02:31'),(2,'CONFIRMADO','2020-12-29 13:02:31'),(3,'PREPARANDO','2020-12-29 13:02:31'),(4,'ENVIANDO','2020-12-29 13:02:31'),(5,'ENTREGADO','2020-12-29 13:02:31'),(6,'CANCELADO','2020-12-29 13:02:31');
/*!40000 ALTER TABLE `statuses` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `users`
--

DROP TABLE IF EXISTS `users`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `users` (
  `user_id` int(11) NOT NULL AUTO_INCREMENT,
  `user_username` varchar(60) DEFAULT NULL,
  `user_fullname` varchar(60) DEFAULT NULL,
  `user_email` varchar(60) DEFAULT NULL,
  `user_phone` varchar(20) DEFAULT NULL,
  `user_address` varchar(60) DEFAULT NULL,
  `user_admin` int(11) DEFAULT '0',
  `user_enable` int(11) DEFAULT '1',
  `user_created_at` datetime DEFAULT '2020-12-29 13:02:31',
  PRIMARY KEY (`user_id`),
  UNIQUE KEY `users_username_unique` (`user_username`),
  UNIQUE KEY `users_email_unique` (`user_email`)
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `users`
--

LOCK TABLES `users` WRITE;
/*!40000 ALTER TABLE `users` DISABLE KEYS */;
INSERT INTO `users` VALUES (1,'admin','Admin','admin@admin.com','1234567890','Cl 10 52A 18',1,1,'2020-12-29 13:02:31');
/*!40000 ALTER TABLE `users` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Dumping events for database 'delilah_resto'
--

--
-- Dumping routines for database 'delilah_resto'
--
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2020-12-30  9:39:18
