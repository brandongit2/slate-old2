ALTER TABLE email_verification RENAME TO email_codes;
ALTER TABLE email_codes ADD COLUMN type ENUM('password-reset', 'new-account') NOT NULL DEFAULT 'new-account' AFTER `expiry`;
ALTER TABLE email_codes ALTER COLUMN type DROP DEFAULT;