CREATE DATABASE IF NOT EXISTS payment_db;
USE payment_db;

CREATE USER IF NOT EXISTS 'admin'@'%' IDENTIFIED BY 'pass';
GRANT ALL PRIVILEGES ON payment_db.* TO 'admin'@'%';
FLUSH PRIVILEGES;

CREATE TABLE IF NOT EXISTS accounts (
    account_id INT PRIMARY KEY,
    name       VARCHAR(255) NOT NULL,
    email      VARCHAR(255) NOT NULL,
    password   VARCHAR(255) NOT NULL,
    balance    DOUBLE DEFAULT 0.0
);
