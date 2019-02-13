ALTER TABLE users DROP PRIMARY KEY;
ALTER TABLE users ADD id INT NOT NULL AUTO_INCREMENT PRIMARY KEY FIRST;

CREATE TABLE logintokens (
    token char(16) NOT NULL,
    userid INT NOT NULL,
    creation TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    expiry TIMESTAMP NOT NULL,
    extend INT NOT NULL,
    valid TINYINT(1) NOT NULL DEFAULT 1,
    PRIMARY KEY (token),
    FOREIGN KEY (userid)
        REFERENCES users (id)
        ON DELETE CASCADE ON UPDATE CASCADE
);
