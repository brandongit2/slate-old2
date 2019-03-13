CREATE TABLE password_reset(
    `user_id` INT NOT NULL UNIQUE,
    `query` CHAR(9) NOT NULL UNIQUE,
    PRIMARY KEY (`user_id`),
    CONSTRAINT `fk_pw_reset` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
);
