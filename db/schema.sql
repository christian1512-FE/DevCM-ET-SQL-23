
-- Drops the employeetracker_db; if it exist currently 
DROP DATABASE IF EXISTS employeetracker_db;

-- Create the employeetracker_db;
CREATE DATABASE employeetracker_db;

-- Use employeetracker_db;
USE employeetracker_db;

-- Creates the table for "department" within employeetracker_db;
CREATE TABLE department (
    id INT NOT NULL AUTO_INCREMENT PRIMARY KEY,             
    department_name VARCHAR(30)
);

-- Creates the table for "role" within employeetracker_db;
CREATE TABLE role (
    id INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
    title VARCHAR(30) NOT NULL,
    salary DECIMAL, 
    department_id INT,
    FOREIGN KEY(department_id) REFERENCES department(id) ON DELETE CASCADE          
);

-- Creates the table for "employee" within employeetracker_db;
CREATE TABLE employee (
    id INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
    first_name VARCHAR(30) NOT NULL,
   last_name VARCHAR(30) NOT NULL,
    role_id INT,
    FOREIGN KEY(role_id) REFERENCES role(id) ON DELETE CASCADE,
    manager_id INT,
    FOREIGN KEY(manager_id) REFERENCES employee(id) ON DELETE SET NULL
--   set null if i delete the manager all employees go null 
);


-- NOT NULL = IF WE ADD A RECORD TO THIS TABLE WE CANT FORGET THE ID IS MANDATORY

-- Colum 

-- //07
-- INSERT INTO produce (id, name)
-- VALUES
--     ( 1, "apple"),
--     ( 2, "orange"),
--     ( 3, "banana");
    
    

-- SELECT * FROM employeetracker_db; 
-- THIS IS JUST SAYING LETS LOOK AND SEE INSIDE OF EMPLOYEETRACKER_DB TABLE WHAT ALL OF OUR DATA LOOKS LIKE. 
-- PRIMARY KEY IS RESERVED FOR THE UNIQUE IDENTIFIER OF A RECORD. 
-- FOREING KEY IS PUT ON A COLUM TO FORM A RELATIONSHIP TO ANOTHER TABLES PRIMARY KEY BY THAT COLUM