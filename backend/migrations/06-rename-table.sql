RENAME TABLE logintokens TO login_tokens;
ALTER TABLE login_tokens CHANGE `userid` `user_id` INT;
