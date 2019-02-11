CREATE TABLE `subjects` (
    `id` int(11) NOT NULL AUTO_INCREMENT,
    `name` varchar(64) DEFAULT NULL,
    `description` text,
    `color` varchar(6) DEFAULT NULL,
    PRIMARY KEY (`id`)
);

CREATE TABLE `courses` (
    `id` int(11) NOT NULL AUTO_INCREMENT,
    `order` int(11) NOT NULL,
    `name` varchar(50) DEFAULT NULL,
    `description` text,
    `subject_id` int(11) DEFAULT NULL,
    PRIMARY KEY (`id`),
    UNIQUE KEY `id_UNIQUE` (`id`),
    UNIQUE KEY `name` (`name`),
    KEY `fk_subject_id` (`subject_id`),
    CONSTRAINT `fk_subject_id` FOREIGN KEY (`subject_id`) REFERENCES `subjects` (`id`) ON DELETE SET NULL ON UPDATE CASCADE
);

CREATE TABLE `units` (
    `id` int(11) NOT NULL AUTO_INCREMENT,
    `order` int(11) NOT NULL,
    `name` varchar(50) DEFAULT NULL,
    `description` text,
    `course_id` int(11) DEFAULT NULL,
    PRIMARY KEY (`id`),
    UNIQUE KEY `name` (`name`),
    KEY `fk_course_id` (`course_id`),
    CONSTRAINT `fk_course_id` FOREIGN KEY (`course_id`) REFERENCES `courses` (`id`) ON DELETE SET NULL ON UPDATE CASCADE
);

CREATE TABLE `articles` (
    `id` int(11) NOT NULL AUTO_INCREMENT,
    `order` int(11) NOT NULL,
    `title` varchar(100) DEFAULT NULL,
    `publish_date` timestamp NULL DEFAULT NULL,
    `update_date` timestamp NULL DEFAULT NULL,
    `content` text,
    `unit_id` int(11) DEFAULT NULL,
    PRIMARY KEY (`id`),
    KEY `fk_unit_id` (`unit_id`),
    CONSTRAINT `fk_unit_id` FOREIGN KEY (`unit_id`) REFERENCES `units` (`id`) ON DELETE SET NULL ON UPDATE CASCADE
);

CREATE TABLE `users` (
    `first_name` varchar(50) NOT NULL,
    `last_name` varchar(50) NOT NULL,
    `email` varchar(254) NOT NULL,
    `password` binary(60) NOT NULL,
    `valid_email` tinyint(1) NOT NULL,
    PRIMARY KEY (`email`),
    UNIQUE KEY `email` (`email`)
);

CREATE TABLE `email_verification` (
    `email` varchar(254) NOT NULL,
    `query` char(9) NOT NULL,
    PRIMARY KEY (`email`),
    UNIQUE KEY `query` (`query`),
    CONSTRAINT `fk_email` FOREIGN KEY (`email`) REFERENCES `users` (`email`) ON DELETE CASCADE ON UPDATE CASCADE
);
