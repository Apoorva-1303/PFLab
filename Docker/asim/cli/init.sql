CREATE DATABASE IF NOT EXISTS payment_db;
USE payment_db;

CREATE TABLE IF NOT EXISTS accounts (
    account_id INT PRIMARY KEY,
    name       VARCHAR(255) NOT NULL,
    email      VARCHAR(255) NOT NULL,
    password   VARCHAR(255) NOT NULL,
    balance    DOUBLE DEFAULT 0.0
);
