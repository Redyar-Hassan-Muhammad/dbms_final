-- E-Commerce Database Setup Script
-- Run this in SQL Developer

-- Enable output
SET SERVEROUTPUT ON;

BEGIN
    DBMS_OUTPUT.PUT_LINE('Starting database setup...');
END;
/

-- Drop tables in correct order (due to foreign keys)
BEGIN
    EXECUTE IMMEDIATE 'DROP TABLE payment CASCADE CONSTRAINTS';
    DBMS_OUTPUT.PUT_LINE('Dropped PAYMENT table');
EXCEPTION WHEN OTHERS THEN
    IF SQLCODE != -942 THEN RAISE; END IF;
END;
/

BEGIN
    EXECUTE IMMEDIATE 'DROP TABLE order_items CASCADE CONSTRAINTS';
    DBMS_OUTPUT.PUT_LINE('Dropped ORDER_ITEMS table');
EXCEPTION WHEN OTHERS THEN
    IF SQLCODE != -942 THEN RAISE; END IF;
END;
/

BEGIN
    EXECUTE IMMEDIATE 'DROP TABLE orders CASCADE CONSTRAINTS';
    DBMS_OUTPUT.PUT_LINE('Dropped ORDERS table');
EXCEPTION WHEN OTHERS THEN
    IF SQLCODE != -942 THEN RAISE; END IF;
END;
/

BEGIN
    EXECUTE IMMEDIATE 'DROP TABLE customer CASCADE CONSTRAINTS';
    DBMS_OUTPUT.PUT_LINE('Dropped CUSTOMER table');
EXCEPTION WHEN OTHERS THEN
    IF SQLCODE != -942 THEN RAISE; END IF;
END;
/

BEGIN
    EXECUTE IMMEDIATE 'DROP TABLE product CASCADE CONSTRAINTS';
    DBMS_OUTPUT.PUT_LINE('Dropped PRODUCT table');
EXCEPTION WHEN OTHERS THEN
    IF SQLCODE != -942 THEN RAISE; END IF;
END;
/

BEGIN
    EXECUTE IMMEDIATE 'DROP TABLE category CASCADE CONSTRAINTS';
    DBMS_OUTPUT.PUT_LINE('Dropped CATEGORY table');
EXCEPTION WHEN OTHERS THEN
    IF SQLCODE != -942 THEN RAISE; END IF;
END;
/

-- Create CATEGORY table
CREATE TABLE category (
    category_id NUMBER GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    name VARCHAR2(100) NOT NULL,
    created_date DATE DEFAULT SYSDATE
);

BEGIN
    DBMS_OUTPUT.PUT_LINE('Created CATEGORY table');
END;
/

-- Create PRODUCT table
CREATE TABLE product (
    product_id NUMBER GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    name VARCHAR2(200) NOT NULL,
    description VARCHAR2(1000),
    price NUMBER(10,2) NOT NULL,
    stock NUMBER DEFAULT 0,
    category_id NUMBER,
    created_date DATE DEFAULT SYSDATE,
    FOREIGN KEY (category_id) REFERENCES category(category_id)
);

BEGIN
    DBMS_OUTPUT.PUT_LINE('Created PRODUCT table');
END;
/

-- Create CUSTOMER table
CREATE TABLE customer (
    customer_id NUMBER GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    fullname VARCHAR2(100) NOT NULL,
    email VARCHAR2(100) UNIQUE NOT NULL,
    phone VARCHAR2(20),
    password VARCHAR2(255) NOT NULL,
    created_date DATE DEFAULT SYSDATE
);

BEGIN
    DBMS_OUTPUT.PUT_LINE('Created CUSTOMER table');
END;
/

-- Create ORDERS table
CREATE TABLE orders (
    order_id NUMBER GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    customer_id NUMBER NOT NULL,
    order_date DATE DEFAULT SYSDATE,
    total_amount NUMBER(10,2) DEFAULT 0,
    status VARCHAR2(50) DEFAULT 'PENDING',
    shipping_address VARCHAR2(500),
    FOREIGN KEY (customer_id) REFERENCES customer(customer_id)
);

BEGIN
    DBMS_OUTPUT.PUT_LINE('Created ORDERS table');
END;
/

-- Create ORDER_ITEMS table
CREATE TABLE order_items (
    item_id NUMBER GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    order_id NUMBER NOT NULL,
    product_id NUMBER NOT NULL,
    quantity NUMBER NOT NULL,
    price NUMBER(10,2) NOT NULL,
    FOREIGN KEY (order_id) REFERENCES orders(order_id),
    FOREIGN KEY (product_id) REFERENCES product(product_id)
);

BEGIN
    DBMS_OUTPUT.PUT_LINE('Created ORDER_ITEMS table');
END;
/

-- Create PAYMENT table
CREATE TABLE payment (
    payment_id NUMBER GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    order_id NUMBER NOT NULL,
    amount NUMBER(10,2) NOT NULL,
    payment_method VARCHAR2(50) NOT NULL,
    payment_date DATE DEFAULT SYSDATE,
    status VARCHAR2(50) DEFAULT 'COMPLETED',
    transaction_id VARCHAR2(100),
    FOREIGN KEY (order_id) REFERENCES orders(order_id)
);

BEGIN
    DBMS_OUTPUT.PUT_LINE('Created PAYMENT table');
END;
/

-- Insert sample data
INSERT INTO category (name) VALUES ('Electronics');
INSERT INTO category (name) VALUES ('Clothing');
INSERT INTO category (name) VALUES ('Books');
INSERT INTO category (name) VALUES ('Home & Garden');

INSERT INTO product (name, description, price, stock, category_id) 
VALUES ('MacBook Pro 16"', 'Apple MacBook Pro 16-inch with M2 Pro chip', 2399.99, 25, 1);

INSERT INTO product (name, description, price, stock, category_id) 
VALUES ('iPhone 15 Pro', 'Latest Apple iPhone with advanced camera', 1199.99, 50, 1);

INSERT INTO product (name, description, price, stock, category_id) 
VALUES ('Cotton T-Shirt', 'Premium cotton t-shirt, various colors', 24.99, 100, 2);

INSERT INTO product (name, description, price, stock, category_id) 
VALUES ('JavaScript Book', 'Learn JavaScript programming', 49.99, 30, 3);

INSERT INTO product (name, description, price, stock, category_id) 
VALUES ('Gaming Chair', 'Ergonomic gaming chair with lumbar support', 299.99, 15, 4);

INSERT INTO product (name, description, price, stock, category_id) 
VALUES ('Wireless Earbuds', 'Noise-cancelling wireless earbuds', 179.99, 40, 1);

-- Insert sample customers (password is 'password123' hashed with bcrypt)
INSERT INTO customer (fullname, email, phone, password) 
VALUES ('John Doe', 'john.doe@email.com', '+1234567890', '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi');

INSERT INTO customer (fullname, email, phone, password) 
VALUES ('Jane Smith', 'jane.smith@email.com', '+0987654321', '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi');

INSERT INTO customer (fullname, email, phone, password) 
VALUES ('Admin User', 'admin@ecommerce.com', '+1112223333', '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi');

COMMIT;

BEGIN
    DBMS_OUTPUT.PUT_LINE('');
    DBMS_OUTPUT.PUT_LINE('✅ Database setup completed successfully!');
    DBMS_OUTPUT.PUT_LINE('📊 Sample data inserted:');
    DBMS_OUTPUT.PUT_LINE('   - 4 Categories');
    DBMS_OUTPUT.PUT_LINE('   - 6 Products'); 
    DBMS_OUTPUT.PUT_LINE('   - 3 Customers');
    DBMS_OUTPUT.PUT_LINE('');
    DBMS_OUTPUT.PUT_LINE('🔑 Default password for all users: password123');
END;
/