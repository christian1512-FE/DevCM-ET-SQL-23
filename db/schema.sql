
-- Drops the business_db if it exist currently 
DROP DATABASE IF EXIST business_db;

-- Create the business_db
CREATE DATABASE business_db;

-- Use business_db
USE business_db;

-- Creates the table for "department" within business_db
CREATE TABLE department (
    id INT NOT NULL AUTO_INCREMENT PRIMARY KEY 
    name VARCHAR(30)
);

-- Creates the table for "role" within business_db
CREATE TABLE role (
    id INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
    title VARCHAR(30) NOT NULL,
    salary DECIMAL 
    department_id INT 
);

-- Creates the table for "employee" within business_db
CREATE TABLE employee (
    id INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
    first_name VARCHAR(30) NOT NULL,
    last_name VARCHAR(30) NOT NULL,
    role_id INT
    manager_id INT  
);