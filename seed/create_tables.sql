-- Drop tables if they exist to avoid conflicts
DROP TABLE IF EXISTS product_order;
DROP TABLE IF EXISTS ordertable;
DROP TABLE IF EXISTS product_ingredient;
DROP TABLE IF EXISTS product;
DROP TABLE IF EXISTS ingredient;
DROP TABLE IF EXISTS employee;

-- Employee Table
CREATE TABLE employee (
    id TEXT PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    role VARCHAR(100) NOT NULL,
    hire_date DATE NOT NULL
);

-- Product Table
CREATE TABLE product (
    id TEXT PRIMARY KEY,
    name VARCHAR(255) UNIQUE NOT NULL,
    description TEXT NOT NULL,
    price NUMERIC(10, 2) NOT NULL,
    has_boba BOOLEAN NOT NULL DEFAULT FALSE
);

-- Ingredient Table
CREATE TABLE ingredient (
    id TEXT PRIMARY KEY,
    name VARCHAR(255) UNIQUE NOT NULL,
    quantity INT NOT NULL,
    supplier VARCHAR(255) NOT NULL,
    expiration DATE NOT NULL
);

-- Product_Ingredient Table (Many-to-Many Relationship between Products & Ingredients)
CREATE TABLE product_ingredient (
    id TEXT PRIMARY KEY,
    productid TEXT NOT NULL REFERENCES product(id) ON DELETE CASCADE,
    ingredientid TEXT NOT NULL REFERENCES ingredient(id) ON DELETE CASCADE,
    quantity INT NOT NULL
);

-- Order Table
CREATE TABLE ordertable (
    id TEXT PRIMARY KEY,
    employeeid TEXT NOT NULL REFERENCES employee(id) ON DELETE SET NULL,
    total NUMERIC(10, 2) NOT NULL,
    order_date DATE NOT NULL
);

-- Product_Order Table (Many-to-Many Relationship between Orders & Products)
CREATE TABLE product_order (
    id TEXT PRIMARY KEY,
    orderid TEXT NOT NULL REFERENCES ordertable(id) ON DELETE CASCADE,
    productid TEXT NOT NULL REFERENCES product(id) ON DELETE CASCADE,
    quantity INT NOT NULL
);
