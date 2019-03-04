-- MySQL dump 10.13  Distrib 8.0.13, for Win64 (x86_64)
--
-- Host: localhost    Database: slate
-- ------------------------------------------------------
-- Server version	8.0.13
--
-- Table structure for table `articles`
--

DROP TABLE IF EXISTS `articles`;
CREATE TABLE `articles` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `order` int(11) DEFAULT NULL,
  `title` varchar(128) NOT NULL,
  `display_title` text,
  `publish_date` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `update_date` timestamp NULL DEFAULT NULL,
  `content` text,
  `unit_id` int(11) DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `title` (`title`),
  KEY `fk_unit_id` (`unit_id`),
  CONSTRAINT `fk_unit_id` FOREIGN KEY (`unit_id`) REFERENCES `units` (`id`) ON DELETE SET NULL ON UPDATE CASCADE
);

--
-- Dumping data for table `articles`
--

INSERT INTO `articles` VALUES (1,1,'01-slope-review','Slope Review','2019-02-05 19:19:21','2019-02-05 19:19:21','ya you gotta find the slopes of things lol',1),(2,2,'01-secant-lines','Secant Lines','2019-02-05 19:20:30','2019-02-05 19:20:30','a secant line is a line which intersects with a function twice.',1),(3,1,'02-intro-to-limits','Intro to Limits','2019-02-05 19:23:23','2019-02-05 19:23:23','A limit takes a function and allows us to know what happens when the function approaches a value.',2),(4,1,'03-the-fundamental-theorem-of-calculus-part-1','The Fundamental Theorem of Calculus, part 1','2019-02-06 17:36:17','2019-02-06 17:36:17','wow',3);

--
-- Table structure for table `courses`
--

DROP TABLE IF EXISTS `courses`;
CREATE TABLE `courses` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `order` int(11) DEFAULT NULL,
  `name` varchar(64) NOT NULL,
  `display_name` text NOT NULL,
  `description` text,
  `subject_id` int(11) DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `id_UNIQUE` (`id`),
  UNIQUE KEY `name` (`name`),
  KEY `fk_subject_id` (`subject_id`),
  CONSTRAINT `fk_subject_id` FOREIGN KEY (`subject_id`) REFERENCES `subjects` (`id`) ON DELETE SET NULL ON UPDATE CASCADE
);

--
-- Dumping data for table `courses`
--

INSERT INTO `courses` VALUES (1,1,'differential-calculus','Differential calculus','haha calculus',1),(2,2,'integral-calculus','Integral calculus','finding area under curves, antiderivatives, etc.',1),(3,1,'cells','Cells','cells are pretty cool!',2);

--
-- Table structure for table `email_verification`
--

DROP TABLE IF EXISTS `email_verification`;
CREATE TABLE `email_verification` (
  `email` varchar(254) NOT NULL,
  `query` char(9) NOT NULL,
  PRIMARY KEY (`email`),
  UNIQUE KEY `query` (`query`),
  CONSTRAINT `fk_email` FOREIGN KEY (`email`) REFERENCES `users` (`email`) ON DELETE CASCADE ON UPDATE CASCADE
);

--
-- Table structure for table `login_tokens`
--

DROP TABLE IF EXISTS `login_tokens`;
CREATE TABLE `login_tokens` (
  `token` char(16) NOT NULL,
  `user_id` int(11) DEFAULT NULL,
  `creation` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `expiry` timestamp NOT NULL,
  `extend` int(11) NOT NULL,
  `valid` tinyint(1) NOT NULL DEFAULT '1',
  PRIMARY KEY (`token`),
  KEY `userid` (`user_id`),
  CONSTRAINT `login_tokens_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
);

--
-- Dumping data for table `login_tokens`
--

INSERT INTO `login_tokens` VALUES ('9cZ8R3yLIzoFnoCD',1,'2019-03-03 20:02:50','2019-03-04 02:59:11',2,1),('nrSpVUmFJkkZe9Mu',1,'2019-03-02 19:01:57','2019-03-02 21:01:57',2,1),('Prm7fKKrYBAvmHfa',1,'2019-03-02 18:50:42','2019-03-02 20:50:42',2,1),('roljNk51JHF2uxt/',1,'2019-03-02 19:02:42','2019-03-03 04:58:49',2,1),('RqjChel2D67ThRUs',1,'2019-03-02 19:00:21','2019-03-02 21:00:21',2,1),('u6P3AojGYYrywrRQ',1,'2019-03-01 23:25:03','2019-03-02 01:25:03',2,1);

--
-- Table structure for table `subjects`
--

DROP TABLE IF EXISTS `subjects`;
CREATE TABLE `subjects` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `order` int(11) DEFAULT NULL,
  `name` varchar(64) NOT NULL,
  `display_name` text NOT NULL,
  `description` text,
  `color` varchar(6) DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `name` (`name`),
  UNIQUE KEY `order` (`order`)
);

--
-- Dumping data for table `subjects`
--

INSERT INTO `subjects` VALUES (1,1,'mathematics','Mathematics','Mathematics (from Greek μάθημα máthēma, \"knowledge, study, learning\") includes the study of such topics as quantity, structure, space, and change.','3f73d9'),(2,2,'biology','Biology','wowie isn\'t biology fun','d13692'),(3,3,'chemistry','Chemistry','Chemistry is the scientific discipline involved with elements and compounds composed of atoms, molecules and ions: their composition, structure, properties, behavior and the changes they undergo during a reaction with other substances.','eae02c');

--
-- Table structure for table `units`
--

DROP TABLE IF EXISTS `units`;
CREATE TABLE `units` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `order` int(11) DEFAULT NULL,
  `name` varchar(64) NOT NULL,
  `display_name` text NOT NULL,
  `description` text,
  `course_id` int(11) DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `name` (`name`),
  KEY `fk_course_id` (`course_id`),
  CONSTRAINT `fk_course_id` FOREIGN KEY (`course_id`) REFERENCES `courses` (`id`) ON DELETE SET NULL ON UPDATE CASCADE
);

--
-- Dumping data for table `units`
--

INSERT INTO `units` VALUES (1,1,'01-slopes-of-secant-and-tangent-lines','Slopes of secant and tangent lines','Find the slopes of lines intersecting functions.',1),(2,2,'01-limits','Limits','One of the most important aspects of calculus.',1),(3,1,'02-the-fundamental-theorem-of-calculus','The fundamental theorem of calculus','yeah',2),(4,1,'03-intro-to-cells','Intro to cells','introduction to cells',3);

--
-- Table structure for table `users`
--

DROP TABLE IF EXISTS `users`;
CREATE TABLE `users` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `first_name` varchar(50) NOT NULL,
  `last_name` varchar(50) NOT NULL,
  `email` varchar(254) NOT NULL,
  `password` binary(60) NOT NULL,
  `valid_email` tinyint(1) NOT NULL,
  `permissions` int(11) NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `email` (`email`)
);

--
-- Dumping data for table `users`
--

INSERT INTO `users` VALUES (1,'Brandon','Tsang','brandononline2@gmail.com',_binary '$2b$10$jqQTGQiIfWcRx5GgeXazJuWAHghYruM6fN2rD.kz5Y.eYHkmjDdtu',1,5);

-- Dump completed on 2019-03-03 20:02:53
