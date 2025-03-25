-- Insert Employees (Managers & Regular Employees)
INSERT INTO employee (id, name, is_manager) VALUES
    ('550e8400-e29b-41d4-a716-446655440000', 'Alice Johnson', TRUE),  -- Manager
    ('550e8400-e29b-41d4-a716-446655440001', 'Bob Smith', FALSE),
    ('550e8400-e29b-41d4-a716-446655440002', 'Charlie Brown', FALSE),
    ('550e8400-e29b-41d4-a716-446655440003', 'David Lee', FALSE),
    ('550e8400-e29b-41d4-a716-446655440004', 'Emma Williams', TRUE),  -- Manager
    ('550e8400-e29b-41d4-a716-446655440005', 'Frank Harris', FALSE),
    ('550e8400-e29b-41d4-a716-446655440006', 'Grace Martin', FALSE),
    ('550e8400-e29b-41d4-a716-446655440007', 'Henry Wilson', FALSE),
    ('550e8400-e29b-41d4-a716-446655440008', 'Isabella Scott', FALSE),
    ('550e8400-e29b-41d4-a716-446655440009', 'Jack Thompson', FALSE);

-- Clear existing data from the product table
DELETE FROM product;

-- Insert Products (Menu Items)
INSERT INTO product (id, name, description, price, customizations, has_boba) VALUES
    -- Classic Milk Tea Variants (Boba Optional)
    ('10000000-0000-0000-0000-000000000001', 'Classic Milk Black Tea', 'Traditional milk tea with rich black tea flavor.', 5.00, '', TRUE),
    ('10000000-0000-0000-0000-000000000002', 'Classic Milk Green Tea', 'Classic milk tea blended with fragrant green tea.', 5.00, '', TRUE),
    ('10000000-0000-0000-0000-000000000003', 'Classic Milk Oolong Tea', 'Smooth milk tea infused with bold oolong tea.', 5.00, '', TRUE),

    -- Honey Milk Tea Variants (Boba Optional)
    ('10000000-0000-0000-0000-000000000004', 'Honey Milk Black Tea', 'Sweet honey milk tea with a deep black tea aroma.', 6.00, '', TRUE),
    ('10000000-0000-0000-0000-000000000005', 'Honey Milk Green Tea', 'A delightful honey milk tea with fresh green tea.', 6.00, '', TRUE),
    ('10000000-0000-0000-0000-000000000006', 'Honey Milk Oolong Tea', 'Bold and smooth honey milk tea with oolong tea.', 6.00, '', TRUE),

    -- Ginger Tea Variants (Boba Optional)
    ('10000000-0000-0000-0000-000000000007', 'Ginger Black Tea', 'Spiced ginger tea infused with black tea.', 5.00, '', TRUE),
    ('10000000-0000-0000-0000-000000000008', 'Ginger Green Tea', 'A warming green tea with a hint of ginger.', 5.00, '', TRUE),
    ('10000000-0000-0000-0000-000000000009', 'Ginger Oolong Tea', 'Bold oolong tea with a spicy ginger kick.', 5.00, '', TRUE),

    -- Taro Pearl Milk Tea (Boba Optional)
    ('10000000-0000-0000-0000-000000000010', 'Taro Pearl Black Tea', 'Creamy taro milk tea with black tea.', 6.00, '', TRUE),

    -- Classic Tea Variants (No Boba)
    ('10000000-0000-0000-0000-000000000011', 'Classic Black Tea', 'Simple and elegant black tea.', 4.00, '', FALSE),
    ('10000000-0000-0000-0000-000000000012', 'Classic Green Tea', 'Refreshing and fragrant green tea.', 4.00, '', FALSE),
    ('10000000-0000-0000-0000-000000000013', 'Classic Oolong Tea', 'Smooth and bold oolong tea.', 4.00, '', FALSE),

    -- Other Flavored Teas (No Boba)
    ('10000000-0000-0000-0000-000000000014', 'Wintermelon Tea', 'Sweet and refreshing wintermelon-infused tea.', 5.00, '', FALSE),
    ('10000000-0000-0000-0000-000000000015', 'Mango Green Tea', 'Light and tropical green tea infused with mango.', 6.00, '', FALSE),
    ('10000000-0000-0000-0000-000000000016', 'Strawberry Green Tea', 'A sweet and tangy green tea with fresh strawberries.', 6.00, '', FALSE),
    ('10000000-0000-0000-0000-000000000017', 'Passion Fruit Green Tea', 'Green tea with exotic passion fruit flavor.', 6.00, '', FALSE),
    ('10000000-0000-0000-0000-000000000018', 'Tropical Fruit Green Tea', 'A vibrant mix of green tea with passion fruit, mango, and strawberry.', 7.00, '', FALSE),

    -- Creama Teas (No Boba)
    ('10000000-0000-0000-0000-000000000019', 'Creama Black Tea', 'Black tea topped with a creamy whipped finish.', 6.00, '', FALSE),
    ('10000000-0000-0000-0000-000000000020', 'Creama Green Tea', 'Green tea with a rich, frothy creama topping.', 6.00, '', FALSE),
    ('10000000-0000-0000-0000-000000000021', 'Creama Oolong Tea', 'Smooth oolong tea paired with fluffy whipped creama.', 6.00, '', FALSE),

    -- Mojitos (No Boba)
    ('10000000-0000-0000-0000-000000000022', 'Lime Mojito', 'A refreshing citrusy mojito tea with lime.', 6.00, '', FALSE),
    ('10000000-0000-0000-0000-000000000023', 'Mango Mojito', 'A tropical mango twist on the classic mojito tea.', 6.00, '', FALSE),
    ('10000000-0000-0000-0000-000000000024', 'Strawberry Mojito', 'A sweet and tangy strawberry mojito tea.', 6.00, '', FALSE);

-- Clear existing data from ingredient table
DELETE FROM ingredient;

-- Insert Ingredients
INSERT INTO ingredient (id, name, quantity, supplier, expiration) VALUES
    ('30000000-0000-0000-0000-000000000001', 'Black Tea', 100, 'Tea Supplier', '2025-12-31'),
    ('30000000-0000-0000-0000-000000000002', 'Green Tea', 100, 'Tea Supplier', '2025-12-31'),
    ('30000000-0000-0000-0000-000000000003', 'Oolong Tea', 100, 'Tea Supplier', '2025-12-31'),
    ('30000000-0000-0000-0000-000000000004', 'Boba', 100, 'Boba Supplier', '2025-12-31'),
    ('30000000-0000-0000-0000-000000000005', 'Sugar', 200, 'Sugar Supplier', '2025-12-31'),
    ('30000000-0000-0000-0000-000000000006', 'Straw', 500, 'Packaging Supplier', '2026-12-31'),
    ('30000000-0000-0000-0000-000000000007', 'Honey', 100, 'Honey Supplier', '2025-12-31'),
    ('30000000-0000-0000-0000-000000000008', 'Cup', 500, 'Packaging Supplier', '2026-12-31'),
    ('30000000-0000-0000-0000-000000000009', 'Ginger', 100, 'Ginger Supplier', '2025-12-31'),
    ('30000000-0000-0000-0000-000000000010', 'Taro', 100, 'Taro Supplier', '2025-12-31'),
    ('30000000-0000-0000-0000-000000000011', 'Mango', 100, 'Fruit Supplier', '2025-12-31'),
    ('30000000-0000-0000-0000-000000000012', 'Strawberry', 100, 'Fruit Supplier', '2025-12-31'),
    ('30000000-0000-0000-0000-000000000013', 'Passion Fruit', 100, 'Fruit Supplier', '2025-12-31'),
    ('30000000-0000-0000-0000-000000000014', 'Whipped Cream', 100, 'Dairy Supplier', '2025-12-31'),
    ('30000000-0000-0000-0000-000000000015', 'Lime', 100, 'Fruit Supplier', '2025-12-31');

-- Clear existing data from product_ingredient
DELETE FROM product_ingredient;

INSERT INTO product_ingredient (id, productid, ingredientid, quantity)
VALUES
  -- Classic Milk Tea Variants
  -- Classic Milk Black Tea: Black Tea, Boba, Sugar, Straw.
  ('10000000-0000-0000-0000-000000000001', (SELECT id FROM product WHERE name = 'Classic Milk Black Tea' LIMIT 1), (SELECT id FROM ingredient WHERE name = 'Black Tea' LIMIT 1), 1),
  ('10000000-0000-0000-0000-000000000002', (SELECT id FROM product WHERE name = 'Classic Milk Black Tea' LIMIT 1), (SELECT id FROM ingredient WHERE name = 'Boba' LIMIT 1), 1),
  ('10000000-0000-0000-0000-000000000003', (SELECT id FROM product WHERE name = 'Classic Milk Black Tea' LIMIT 1), (SELECT id FROM ingredient WHERE name = 'Sugar' LIMIT 1), 1),
  ('10000000-0000-0000-0000-000000000004', (SELECT id FROM product WHERE name = 'Classic Milk Black Tea' LIMIT 1), (SELECT id FROM ingredient WHERE name = 'Straw' LIMIT 1), 1),

  -- Classic Milk Green Tea: Green Tea, Boba, Sugar, Straw.
  ('10000000-0000-0000-0000-000000000005', (SELECT id FROM product WHERE name = 'Classic Milk Green Tea' LIMIT 1), (SELECT id FROM ingredient WHERE name = 'Green Tea' LIMIT 1), 1),
  ('10000000-0000-0000-0000-000000000006', (SELECT id FROM product WHERE name = 'Classic Milk Green Tea' LIMIT 1), (SELECT id FROM ingredient WHERE name = 'Boba' LIMIT 1), 1),
  ('10000000-0000-0000-0000-000000000007', (SELECT id FROM product WHERE name = 'Classic Milk Green Tea' LIMIT 1), (SELECT id FROM ingredient WHERE name = 'Sugar' LIMIT 1), 1),
  ('10000000-0000-0000-0000-000000000008', (SELECT id FROM product WHERE name = 'Classic Milk Green Tea' LIMIT 1), (SELECT id FROM ingredient WHERE name = 'Straw' LIMIT 1), 1),

  -- Classic Milk Oolong Tea: Oolong Tea, Boba, Sugar, Straw.
  ('10000000-0000-0000-0000-000000000009', (SELECT id FROM product WHERE name = 'Classic Milk Oolong Tea' LIMIT 1), (SELECT id FROM ingredient WHERE name = 'Oolong Tea' LIMIT 1), 1),
  ('10000000-0000-0000-0000-00000000000A', (SELECT id FROM product WHERE name = 'Classic Milk Oolong Tea' LIMIT 1), (SELECT id FROM ingredient WHERE name = 'Boba' LIMIT 1), 1),
  ('10000000-0000-0000-0000-00000000000B', (SELECT id FROM product WHERE name = 'Classic Milk Oolong Tea' LIMIT 1), (SELECT id FROM ingredient WHERE name = 'Sugar' LIMIT 1), 1),
  ('10000000-0000-0000-0000-00000000000C', (SELECT id FROM product WHERE name = 'Classic Milk Oolong Tea' LIMIT 1), (SELECT id FROM ingredient WHERE name = 'Straw' LIMIT 1), 1),

  -- Honey Milk Tea Variants
  -- Honey Milk Black Tea: Black Tea, Boba, Sugar, Honey, Cup, Straw.
  ('10000000-0000-0000-0000-00000000000D', (SELECT id FROM product WHERE name = 'Honey Milk Black Tea' LIMIT 1), (SELECT id FROM ingredient WHERE name = 'Black Tea' LIMIT 1), 1),
  ('10000000-0000-0000-0000-00000000000E', (SELECT id FROM product WHERE name = 'Honey Milk Black Tea' LIMIT 1), (SELECT id FROM ingredient WHERE name = 'Boba' LIMIT 1), 1),
  ('10000000-0000-0000-0000-00000000000F', (SELECT id FROM product WHERE name = 'Honey Milk Black Tea' LIMIT 1), (SELECT id FROM ingredient WHERE name = 'Sugar' LIMIT 1), 1),
  ('10000000-0000-0000-0000-000000000010', (SELECT id FROM product WHERE name = 'Honey Milk Black Tea' LIMIT 1), (SELECT id FROM ingredient WHERE name = 'Honey' LIMIT 1), 1),
  ('10000000-0000-0000-0000-000000000011', (SELECT id FROM product WHERE name = 'Honey Milk Black Tea' LIMIT 1), (SELECT id FROM ingredient WHERE name = 'Cup' LIMIT 1), 1),
  ('10000000-0000-0000-0000-000000000012', (SELECT id FROM product WHERE name = 'Honey Milk Black Tea' LIMIT 1), (SELECT id FROM ingredient WHERE name = 'Straw' LIMIT 1), 1),

  -- Honey Milk Green Tea: Green Tea, Boba, Sugar, Honey, Cup, Straw.
  ('10000000-0000-0000-0000-000000000013', (SELECT id FROM product WHERE name = 'Honey Milk Green Tea' LIMIT 1), (SELECT id FROM ingredient WHERE name = 'Green Tea' LIMIT 1), 1),
  ('10000000-0000-0000-0000-000000000014', (SELECT id FROM product WHERE name = 'Honey Milk Green Tea' LIMIT 1), (SELECT id FROM ingredient WHERE name = 'Boba' LIMIT 1), 1),
  ('10000000-0000-0000-0000-000000000015', (SELECT id FROM product WHERE name = 'Honey Milk Green Tea' LIMIT 1), (SELECT id FROM ingredient WHERE name = 'Sugar' LIMIT 1), 1),
  ('10000000-0000-0000-0000-000000000016', (SELECT id FROM product WHERE name = 'Honey Milk Green Tea' LIMIT 1), (SELECT id FROM ingredient WHERE name = 'Honey' LIMIT 1), 1),
  ('10000000-0000-0000-0000-000000000017', (SELECT id FROM product WHERE name = 'Honey Milk Green Tea' LIMIT 1), (SELECT id FROM ingredient WHERE name = 'Cup' LIMIT 1), 1),
  ('10000000-0000-0000-0000-000000000018', (SELECT id FROM product WHERE name = 'Honey Milk Green Tea' LIMIT 1), (SELECT id FROM ingredient WHERE name = 'Straw' LIMIT 1), 1),

  -- Honey Milk Oolong Tea: Oolong Tea, Boba, Sugar, Honey, Cup, Straw.
  ('10000000-0000-0000-0000-000000000019', (SELECT id FROM product WHERE name = 'Honey Milk Oolong Tea' LIMIT 1), (SELECT id FROM ingredient WHERE name = 'Oolong Tea' LIMIT 1), 1),
  ('10000000-0000-0000-0000-00000000001A', (SELECT id FROM product WHERE name = 'Honey Milk Oolong Tea' LIMIT 1), (SELECT id FROM ingredient WHERE name = 'Boba' LIMIT 1), 1),
  ('10000000-0000-0000-0000-00000000001B', (SELECT id FROM product WHERE name = 'Honey Milk Oolong Tea' LIMIT 1), (SELECT id FROM ingredient WHERE name = 'Sugar' LIMIT 1), 1),
  ('10000000-0000-0000-0000-00000000001C', (SELECT id FROM product WHERE name = 'Honey Milk Oolong Tea' LIMIT 1), (SELECT id FROM ingredient WHERE name = 'Honey' LIMIT 1), 1),
  ('10000000-0000-0000-0000-00000000001D', (SELECT id FROM product WHERE name = 'Honey Milk Oolong Tea' LIMIT 1), (SELECT id FROM ingredient WHERE name = 'Cup' LIMIT 1), 1),
  ('10000000-0000-0000-0000-00000000001E', (SELECT id FROM product WHERE name = 'Honey Milk Oolong Tea' LIMIT 1), (SELECT id FROM ingredient WHERE name = 'Straw' LIMIT 1), 1),

  -- Ginger Tea Variants
  -- Ginger Black Tea: Black Tea, Boba, Ginger, Sugar, Cup, Straw.
  ('10000000-0000-0000-0000-00000000001F', (SELECT id FROM product WHERE name = 'Ginger Black Tea' LIMIT 1), (SELECT id FROM ingredient WHERE name = 'Black Tea' LIMIT 1), 1),
  ('10000000-0000-0000-0000-000000000020', (SELECT id FROM product WHERE name = 'Ginger Black Tea' LIMIT 1), (SELECT id FROM ingredient WHERE name = 'Boba' LIMIT 1), 1),
  ('10000000-0000-0000-0000-000000000021', (SELECT id FROM product WHERE name = 'Ginger Black Tea' LIMIT 1), (SELECT id FROM ingredient WHERE name = 'Ginger' LIMIT 1), 1),
  ('10000000-0000-0000-0000-000000000022', (SELECT id FROM product WHERE name = 'Ginger Black Tea' LIMIT 1), (SELECT id FROM ingredient WHERE name = 'Sugar' LIMIT 1), 1),
  ('10000000-0000-0000-0000-000000000023', (SELECT id FROM product WHERE name = 'Ginger Black Tea' LIMIT 1), (SELECT id FROM ingredient WHERE name = 'Cup' LIMIT 1), 1),
  ('10000000-0000-0000-0000-000000000024', (SELECT id FROM product WHERE name = 'Ginger Black Tea' LIMIT 1), (SELECT id FROM ingredient WHERE name = 'Straw' LIMIT 1), 1),

  -- Ginger Green Tea: Green Tea, Boba, Ginger, Sugar, Cup, Straw.
  ('10000000-0000-0000-0000-000000000025', (SELECT id FROM product WHERE name = 'Ginger Green Tea' LIMIT 1), (SELECT id FROM ingredient WHERE name = 'Green Tea' LIMIT 1), 1),
  ('10000000-0000-0000-0000-000000000026', (SELECT id FROM product WHERE name = 'Ginger Green Tea' LIMIT 1), (SELECT id FROM ingredient WHERE name = 'Boba' LIMIT 1), 1),
  ('10000000-0000-0000-0000-000000000027', (SELECT id FROM product WHERE name = 'Ginger Green Tea' LIMIT 1), (SELECT id FROM ingredient WHERE name = 'Ginger' LIMIT 1), 1),
  ('10000000-0000-0000-0000-000000000028', (SELECT id FROM product WHERE name = 'Ginger Green Tea' LIMIT 1), (SELECT id FROM ingredient WHERE name = 'Sugar' LIMIT 1), 1),
  ('10000000-0000-0000-0000-000000000029', (SELECT id FROM product WHERE name = 'Ginger Green Tea' LIMIT 1), (SELECT id FROM ingredient WHERE name = 'Cup' LIMIT 1), 1),
  ('10000000-0000-0000-0000-00000000002A', (SELECT id FROM product WHERE name = 'Ginger Green Tea' LIMIT 1), (SELECT id FROM ingredient WHERE name = 'Straw' LIMIT 1), 1),

  -- Ginger Oolong Tea: Oolong Tea, Boba, Ginger, Sugar, Cup, Straw.
  ('10000000-0000-0000-0000-00000000002B', (SELECT id FROM product WHERE name = 'Ginger Oolong Tea' LIMIT 1), (SELECT id FROM ingredient WHERE name = 'Oolong Tea' LIMIT 1), 1),
  ('10000000-0000-0000-0000-00000000002C', (SELECT id FROM product WHERE name = 'Ginger Oolong Tea' LIMIT 1), (SELECT id FROM ingredient WHERE name = 'Boba' LIMIT 1), 1),
  ('10000000-0000-0000-0000-00000000002D', (SELECT id FROM product WHERE name = 'Ginger Oolong Tea' LIMIT 1), (SELECT id FROM ingredient WHERE name = 'Ginger' LIMIT 1), 1),
  ('10000000-0000-0000-0000-00000000002E', (SELECT id FROM product WHERE name = 'Ginger Oolong Tea' LIMIT 1), (SELECT id FROM ingredient WHERE name = 'Sugar' LIMIT 1), 1),
  ('10000000-0000-0000-0000-00000000002F', (SELECT id FROM product WHERE name = 'Ginger Oolong Tea' LIMIT 1), (SELECT id FROM ingredient WHERE name = 'Cup' LIMIT 1), 1),
  ('10000000-0000-0000-0000-000000000030', (SELECT id FROM product WHERE name = 'Ginger Oolong Tea' LIMIT 1), (SELECT id FROM ingredient WHERE name = 'Straw' LIMIT 1), 1),

  -- Taro Pearl Milk Tea: Black Tea, Taro, Boba, Sugar, Cup, Straw.
  ('10000000-0000-0000-0000-000000000031', (SELECT id FROM product WHERE name = 'Taro Pearl Black Tea' LIMIT 1), (SELECT id FROM ingredient WHERE name = 'Black Tea' LIMIT 1), 1),
  ('10000000-0000-0000-0000-000000000032', (SELECT id FROM product WHERE name = 'Taro Pearl Black Tea' LIMIT 1), (SELECT id FROM ingredient WHERE name = 'Taro' LIMIT 1), 1),
  ('10000000-0000-0000-0000-000000000033', (SELECT id FROM product WHERE name = 'Taro Pearl Black Tea' LIMIT 1), (SELECT id FROM ingredient WHERE name = 'Boba' LIMIT 1), 1),
  ('10000000-0000-0000-0000-000000000034', (SELECT id FROM product WHERE name = 'Taro Pearl Black Tea' LIMIT 1), (SELECT id FROM ingredient WHERE name = 'Sugar' LIMIT 1), 1),
  ('10000000-0000-0000-0000-000000000035', (SELECT id FROM product WHERE name = 'Taro Pearl Black Tea' LIMIT 1), (SELECT id FROM ingredient WHERE name = 'Cup' LIMIT 1), 1),
  ('10000000-0000-0000-0000-000000000036', (SELECT id FROM product WHERE name = 'Taro Pearl Black Tea' LIMIT 1), (SELECT id FROM ingredient WHERE name = 'Straw' LIMIT 1), 1),

  -- Classic Tea Variants
  -- Classic Black Tea: Black Tea, Sugar, Cup, Straw.
  ('10000000-0000-0000-0000-000000000037', (SELECT id FROM product WHERE name = 'Classic Black Tea' LIMIT 1), (SELECT id FROM ingredient WHERE name = 'Black Tea' LIMIT 1), 1),
  ('10000000-0000-0000-0000-000000000038', (SELECT id FROM product WHERE name = 'Classic Black Tea' LIMIT 1), (SELECT id FROM ingredient WHERE name = 'Sugar' LIMIT 1), 1),
  ('10000000-0000-0000-0000-000000000039', (SELECT id FROM product WHERE name = 'Classic Black Tea' LIMIT 1), (SELECT id FROM ingredient WHERE name = 'Cup' LIMIT 1), 1),
  ('10000000-0000-0000-0000-00000000003A', (SELECT id FROM product WHERE name = 'Classic Black Tea' LIMIT 1), (SELECT id FROM ingredient WHERE name = 'Straw' LIMIT 1), 1),

  -- Classic Green Tea: Green Tea, Sugar, Cup, Straw.
  ('10000000-0000-0000-0000-00000000003B', (SELECT id FROM product WHERE name = 'Classic Green Tea' LIMIT 1), (SELECT id FROM ingredient WHERE name = 'Green Tea' LIMIT 1), 1),
  ('10000000-0000-0000-0000-00000000003C', (SELECT id FROM product WHERE name = 'Classic Green Tea' LIMIT 1), (SELECT id FROM ingredient WHERE name = 'Sugar' LIMIT 1), 1),
  ('10000000-0000-0000-0000-00000000003D', (SELECT id FROM product WHERE name = 'Classic Green Tea' LIMIT 1), (SELECT id FROM ingredient WHERE name = 'Cup' LIMIT 1), 1),
  ('10000000-0000-0000-0000-00000000003E', (SELECT id FROM product WHERE name = 'Classic Green Tea' LIMIT 1), (SELECT id FROM ingredient WHERE name = 'Straw' LIMIT 1), 1),

  -- Classic Oolong Tea: Oolong Tea, Sugar, Cup, Straw.
  ('10000000-0000-0000-0000-00000000003F', (SELECT id FROM product WHERE name = 'Classic Oolong Tea' LIMIT 1), (SELECT id FROM ingredient WHERE name = 'Oolong Tea' LIMIT 1), 1),
  ('10000000-0000-0000-0000-000000000040', (SELECT id FROM product WHERE name = 'Classic Oolong Tea' LIMIT 1), (SELECT id FROM ingredient WHERE name = 'Sugar' LIMIT 1), 1),
  ('10000000-0000-0000-0000-000000000041', (SELECT id FROM product WHERE name = 'Classic Oolong Tea' LIMIT 1), (SELECT id FROM ingredient WHERE name = 'Cup' LIMIT 1), 1),
  ('10000000-0000-0000-0000-000000000042', (SELECT id FROM product WHERE name = 'Classic Oolong Tea' LIMIT 1), (SELECT id FROM ingredient WHERE name = 'Straw' LIMIT 1), 1),

  -- Wintermelon Tea: Black Tea, Sugar, Cup, Straw.
  ('10000000-0000-0000-0000-000000000043', (SELECT id FROM product WHERE name = 'Wintermelon Tea' LIMIT 1), (SELECT id FROM ingredient WHERE name = 'Black Tea' LIMIT 1), 1),
  ('10000000-0000-0000-0000-000000000044', (SELECT id FROM product WHERE name = 'Wintermelon Tea' LIMIT 1), (SELECT id FROM ingredient WHERE name = 'Sugar' LIMIT 1), 1),
  ('10000000-0000-0000-0000-000000000045', (SELECT id FROM product WHERE name = 'Wintermelon Tea' LIMIT 1), (SELECT id FROM ingredient WHERE name = 'Cup' LIMIT 1), 1),
  ('10000000-0000-0000-0000-000000000046', (SELECT id FROM product WHERE name = 'Wintermelon Tea' LIMIT 1), (SELECT id FROM ingredient WHERE name = 'Straw' LIMIT 1), 1),

  -- Mango Green Tea: Green Tea, Sugar, Mango, Cup, Straw.
  ('10000000-0000-0000-0000-000000000047', (SELECT id FROM product WHERE name = 'Mango Green Tea' LIMIT 1), (SELECT id FROM ingredient WHERE name = 'Green Tea' LIMIT 1), 1),
  ('10000000-0000-0000-0000-000000000048', (SELECT id FROM product WHERE name = 'Mango Green Tea' LIMIT 1), (SELECT id FROM ingredient WHERE name = 'Sugar' LIMIT 1), 1),
  ('10000000-0000-0000-0000-000000000049', (SELECT id FROM product WHERE name = 'Mango Green Tea' LIMIT 1), (SELECT id FROM ingredient WHERE name = 'Mango' LIMIT 1), 1),
  ('10000000-0000-0000-0000-00000000004A', (SELECT id FROM product WHERE name = 'Mango Green Tea' LIMIT 1), (SELECT id FROM ingredient WHERE name = 'Cup' LIMIT 1), 1),
  ('10000000-0000-0000-0000-00000000004B', (SELECT id FROM product WHERE name = 'Mango Green Tea' LIMIT 1), (SELECT id FROM ingredient WHERE name = 'Straw' LIMIT 1), 1),

  -- Strawberry Green Tea: Green Tea, Sugar, Strawberry, Cup, Straw.
  ('10000000-0000-0000-0000-00000000004C', (SELECT id FROM product WHERE name = 'Strawberry Green Tea' LIMIT 1), (SELECT id FROM ingredient WHERE name = 'Green Tea' LIMIT 1), 1),
  ('10000000-0000-0000-0000-00000000004D', (SELECT id FROM product WHERE name = 'Strawberry Green Tea' LIMIT 1), (SELECT id FROM ingredient WHERE name = 'Sugar' LIMIT 1), 1),
  ('10000000-0000-0000-0000-00000000004E', (SELECT id FROM product WHERE name = 'Strawberry Green Tea' LIMIT 1), (SELECT id FROM ingredient WHERE name = 'Strawberry' LIMIT 1), 1),
  ('10000000-0000-0000-0000-00000000004F', (SELECT id FROM product WHERE name = 'Strawberry Green Tea' LIMIT 1), (SELECT id FROM ingredient WHERE name = 'Cup' LIMIT 1), 1),
  ('10000000-0000-0000-0000-000000000050', (SELECT id FROM product WHERE name = 'Strawberry Green Tea' LIMIT 1), (SELECT id FROM ingredient WHERE name = 'Straw' LIMIT 1), 1),

  -- Passion Fruit Green Tea: Green Tea, Sugar, Passion Fruit, Cup, Straw.
  ('10000000-0000-0000-0000-000000000051', (SELECT id FROM product WHERE name = 'Passion Fruit Green Tea' LIMIT 1), (SELECT id FROM ingredient WHERE name = 'Green Tea' LIMIT 1), 1),
  ('10000000-0000-0000-0000-000000000052', (SELECT id FROM product WHERE name = 'Passion Fruit Green Tea' LIMIT 1), (SELECT id FROM ingredient WHERE name = 'Sugar' LIMIT 1), 1),
  ('10000000-0000-0000-0000-000000000053', (SELECT id FROM product WHERE name = 'Passion Fruit Green Tea' LIMIT 1), (SELECT id FROM ingredient WHERE name = 'Passion Fruit' LIMIT 1), 1),
  ('10000000-0000-0000-0000-000000000054', (SELECT id FROM product WHERE name = 'Passion Fruit Green Tea' LIMIT 1), (SELECT id FROM ingredient WHERE name = 'Cup' LIMIT 1), 1),
  ('10000000-0000-0000-0000-000000000055', (SELECT id FROM product WHERE name = 'Passion Fruit Green Tea' LIMIT 1), (SELECT id FROM ingredient WHERE name = 'Straw' LIMIT 1), 1),

  -- Tropical Fruit Green Tea: Green Tea, Sugar, Passion Fruit, Mango, Strawberry, Cup, Straw.
  ('10000000-0000-0000-0000-000000000056', (SELECT id FROM product WHERE name = 'Tropical Fruit Green Tea' LIMIT 1), (SELECT id FROM ingredient WHERE name = 'Green Tea' LIMIT 1), 1),
  ('10000000-0000-0000-0000-000000000057', (SELECT id FROM product WHERE name = 'Tropical Fruit Green Tea' LIMIT 1), (SELECT id FROM ingredient WHERE name = 'Sugar' LIMIT 1), 1),
  ('10000000-0000-0000-0000-000000000058', (SELECT id FROM product WHERE name = 'Tropical Fruit Green Tea' LIMIT 1), (SELECT id FROM ingredient WHERE name = 'Passion Fruit' LIMIT 1), 1),
  ('10000000-0000-0000-0000-000000000059', (SELECT id FROM product WHERE name = 'Tropical Fruit Green Tea' LIMIT 1), (SELECT id FROM ingredient WHERE name = 'Mango' LIMIT 1), 1),
  ('10000000-0000-0000-0000-00000000005A', (SELECT id FROM product WHERE name = 'Tropical Fruit Green Tea' LIMIT 1), (SELECT id FROM ingredient WHERE name = 'Strawberry' LIMIT 1), 1),
  ('10000000-0000-0000-0000-00000000005B', (SELECT id FROM product WHERE name = 'Tropical Fruit Green Tea' LIMIT 1), (SELECT id FROM ingredient WHERE name = 'Cup' LIMIT 1), 1),
  ('10000000-0000-0000-0000-00000000005C', (SELECT id FROM product WHERE name = 'Tropical Fruit Green Tea' LIMIT 1), (SELECT id FROM ingredient WHERE name = 'Straw' LIMIT 1), 1),

  -- Creama Tea Variants
  -- Creama Black Tea: Black Tea, Sugar, Whipped Cream, Cup, Straw.
  ('10000000-0000-0000-0000-00000000005D', (SELECT id FROM product WHERE name = 'Creama Black Tea' LIMIT 1), (SELECT id FROM ingredient WHERE name = 'Black Tea' LIMIT 1), 1),
  ('10000000-0000-0000-0000-00000000005E', (SELECT id FROM product WHERE name = 'Creama Black Tea' LIMIT 1), (SELECT id FROM ingredient WHERE name = 'Sugar' LIMIT 1), 1),
  ('10000000-0000-0000-0000-00000000005F', (SELECT id FROM product WHERE name = 'Creama Black Tea' LIMIT 1), (SELECT id FROM ingredient WHERE name = 'Whipped Cream' LIMIT 1), 1),
  ('10000000-0000-0000-0000-000000000060', (SELECT id FROM product WHERE name = 'Creama Black Tea' LIMIT 1), (SELECT id FROM ingredient WHERE name = 'Cup' LIMIT 1), 1),
  ('10000000-0000-0000-0000-000000000061', (SELECT id FROM product WHERE name = 'Creama Black Tea' LIMIT 1), (SELECT id FROM ingredient WHERE name = 'Straw' LIMIT 1), 1),

  -- Creama Green Tea: Green Tea, Sugar, Whipped Cream, Cup, Straw.
  ('10000000-0000-0000-0000-000000000062', (SELECT id FROM product WHERE name = 'Creama Green Tea' LIMIT 1), (SELECT id FROM ingredient WHERE name = 'Green Tea' LIMIT 1), 1),
  ('10000000-0000-0000-0000-000000000063', (SELECT id FROM product WHERE name = 'Creama Green Tea' LIMIT 1), (SELECT id FROM ingredient WHERE name = 'Sugar' LIMIT 1), 1),
  ('10000000-0000-0000-0000-000000000064', (SELECT id FROM product WHERE name = 'Creama Green Tea' LIMIT 1), (SELECT id FROM ingredient WHERE name = 'Whipped Cream' LIMIT 1), 1),
  ('10000000-0000-0000-0000-000000000065', (SELECT id FROM product WHERE name = 'Creama Green Tea' LIMIT 1), (SELECT id FROM ingredient WHERE name = 'Cup' LIMIT 1), 1),
  ('10000000-0000-0000-0000-000000000066', (SELECT id FROM product WHERE name = 'Creama Green Tea' LIMIT 1), (SELECT id FROM ingredient WHERE name = 'Straw' LIMIT 1), 1),

  -- Creama Oolong Tea: Oolong Tea, Sugar, Whipped Cream, Cup, Straw.
  ('10000000-0000-0000-0000-000000000067', (SELECT id FROM product WHERE name = 'Creama Oolong Tea' LIMIT 1), (SELECT id FROM ingredient WHERE name = 'Oolong Tea' LIMIT 1), 1),
  ('10000000-0000-0000-0000-000000000068', (SELECT id FROM product WHERE name = 'Creama Oolong Tea' LIMIT 1), (SELECT id FROM ingredient WHERE name = 'Sugar' LIMIT 1), 1),
  ('10000000-0000-0000-0000-000000000069', (SELECT id FROM product WHERE name = 'Creama Oolong Tea' LIMIT 1), (SELECT id FROM ingredient WHERE name = 'Whipped Cream' LIMIT 1), 1),
  ('10000000-0000-0000-0000-00000000006A', (SELECT id FROM product WHERE name = 'Creama Oolong Tea' LIMIT 1), (SELECT id FROM ingredient WHERE name = 'Cup' LIMIT 1), 1),
  ('10000000-0000-0000-0000-00000000006B', (SELECT id FROM product WHERE name = 'Creama Oolong Tea' LIMIT 1), (SELECT id FROM ingredient WHERE name = 'Straw' LIMIT 1), 1),

  -- Mojitos
  -- Lime Mojito: Lime, Sugar, Cup, Straw.
  ('10000000-0000-0000-0000-00000000006C', (SELECT id FROM product WHERE name = 'Lime Mojito' LIMIT 1), (SELECT id FROM ingredient WHERE name = 'Lime' LIMIT 1), 1),
  ('10000000-0000-0000-0000-00000000006D', (SELECT id FROM product WHERE name = 'Lime Mojito' LIMIT 1), (SELECT id FROM ingredient WHERE name = 'Sugar' LIMIT 1), 1),
  ('10000000-0000-0000-0000-00000000006E', (SELECT id FROM product WHERE name = 'Lime Mojito' LIMIT 1), (SELECT id FROM ingredient WHERE name = 'Cup' LIMIT 1), 1),
  ('10000000-0000-0000-0000-00000000006F', (SELECT id FROM product WHERE name = 'Lime Mojito' LIMIT 1), (SELECT id FROM ingredient WHERE name = 'Straw' LIMIT 1), 1),

  -- Mango Mojito: Mango, Sugar, Cup, Straw.
  ('10000000-0000-0000-0000-000000000070', (SELECT id FROM product WHERE name = 'Mango Mojito' LIMIT 1), (SELECT id FROM ingredient WHERE name = 'Mango' LIMIT 1), 1),
  ('10000000-0000-0000-0000-000000000071', (SELECT id FROM product WHERE name = 'Mango Mojito' LIMIT 1), (SELECT id FROM ingredient WHERE name = 'Sugar' LIMIT 1), 1),
  ('10000000-0000-0000-0000-000000000072', (SELECT id FROM product WHERE name = 'Mango Mojito' LIMIT 1), (SELECT id FROM ingredient WHERE name = 'Cup' LIMIT 1), 1),
  ('10000000-0000-0000-0000-000000000073', (SELECT id FROM product WHERE name = 'Mango Mojito' LIMIT 1), (SELECT id FROM ingredient WHERE name = 'Straw' LIMIT 1), 1),

  -- Strawberry Mojito: Strawberry, Sugar, Cup, Straw.
  ('10000000-0000-0000-0000-000000000074', (SELECT id FROM product WHERE name = 'Strawberry Mojito' LIMIT 1), (SELECT id FROM ingredient WHERE name = 'Strawberry' LIMIT 1), 1),
  ('10000000-0000-0000-0000-000000000075', (SELECT id FROM product WHERE name = 'Strawberry Mojito' LIMIT 1), (SELECT id FROM ingredient WHERE name = 'Sugar' LIMIT 1), 1),
  ('10000000-0000-0000-0000-000000000076', (SELECT id FROM product WHERE name = 'Strawberry Mojito' LIMIT 1), (SELECT id FROM ingredient WHERE name = 'Cup' LIMIT 1), 1),
  ('10000000-0000-0000-0000-000000000077', (SELECT id FROM product WHERE name = 'Strawberry Mojito' LIMIT 1), (SELECT id FROM ingredient WHERE name = 'Straw' LIMIT 1), 1);

DO $$
DECLARE
    i INT := 0;
    order_seq INT := 1;           -- Counter for order IDs
    product_order_seq INT := 1;   -- Counter for product_order IDs
    order_datetime TIMESTAMP;
    total_sales NUMERIC := 0;
    peak_days DATE[];
    employee_count INT;
    order_id UUID;
    product_count INT;
    product_id UUID;
    product_price NUMERIC;
    random_employee UUID;
    quantity INT;
    peak_boost NUMERIC;
    daily_sales NUMERIC;
    product_order_id UUID;
    daily_avg_sales NUMERIC := 2750;  -- Average daily revenue needed to reach $1.25M over 455 days
    min_daily_sales NUMERIC := 2000;  -- Minimum daily sales threshold
    peak_multiplier NUMERIC := 3.0;   -- Peak days boost revenue by 3x
    random_hour INT;
    random_minute INT;
    random_second INT;
BEGIN
    -- Define 3 peak sales days (Start of semester, mid-year event, game day)
    peak_days := ARRAY[
        (CURRENT_DATE - INTERVAL '455 days' + INTERVAL '7 days'),  -- Start of semester
        (CURRENT_DATE - INTERVAL '300 days'),                      -- Mid-year event
        (CURRENT_DATE - INTERVAL '50 days')                        -- Game day
    ];

    -- Get total employees
    SELECT COUNT(*) INTO employee_count FROM employee;

    -- Loop through 455 days (65 weeks)
    WHILE total_sales < 1250000 LOOP
        -- Generate order date over 65 weeks
        order_datetime := CURRENT_DATE - INTERVAL '455 days' + (i * INTERVAL '1 day');

        -- Assign random time within the day (00:00:00 to 23:59:59)
        random_hour := FLOOR(RANDOM() * 24);
        random_minute := FLOOR(RANDOM() * 60);
        random_second := FLOOR(RANDOM() * 60);
        
        -- Append the random time to the order date
        order_datetime := order_datetime 
                          + (random_hour || ' hours')::INTERVAL
                          + (random_minute || ' minutes')::INTERVAL
                          + (random_second || ' seconds')::INTERVAL;

        -- Check if it's a peak sales day
        IF order_datetime::DATE = ANY(peak_days) THEN
            peak_boost := peak_multiplier;  -- Triple sales on peak days
        ELSE
            peak_boost := 1.0;
        END IF;

        -- Generate order ID using a deterministic UUID-like structure
        order_id := ('11111111-1111-1111-1111-' || LPAD(order_seq::TEXT, 12, '0'))::UUID;
        order_seq := order_seq + 1;

        -- Assign a random employee to the order
        SELECT id INTO random_employee FROM employee ORDER BY RANDOM() LIMIT 1;

        -- Insert the order with total set to 0 initially
        INSERT INTO ordertable (id, employeeid, total, order_date)
        VALUES (order_id, random_employee, 0, order_datetime);

        -- Reset daily sales for this order
        daily_sales := 0;

        -- Randomly add 1-5 products per order
        product_count := (FLOOR(RANDOM() * 4) + 1)::INT;

        FOR j IN 1..product_count LOOP
            -- Select a random product
            SELECT id, price INTO product_id, product_price FROM product ORDER BY RANDOM() LIMIT 1;

            -- Generate a quantity of 1-3 for the product
            quantity := (FLOOR(RANDOM() * 3) + 1)::INT;

            -- Generate a new product_order ID using a deterministic UUID format
            product_order_id := ('22222222-2222-2222-2222-' || LPAD(product_order_seq::TEXT, 12, '0'))::UUID;
            product_order_seq := product_order_seq + 1;

            -- Insert product into product_order table
            INSERT INTO product_order (id, orderid, productid, quantity)
            VALUES (product_order_id, order_id, product_id, quantity);

            -- Update sales for the order (applying peak boost)
            daily_sales := daily_sales + (product_price * quantity * peak_boost);
        END LOOP;

        -- Adjust daily sales to fit revenue goal ($1.25M over 455 days)
        IF daily_sales < min_daily_sales THEN
            daily_sales := min_daily_sales + (RANDOM() * (daily_avg_sales - min_daily_sales));
        END IF;

        -- Update order total in ordertable
        UPDATE ordertable SET total = daily_sales WHERE id = order_id;

        -- Increment total sales
        total_sales := total_sales + daily_sales;
        i := i + 1;
    END LOOP;

    -- Output verification notices
    RAISE NOTICE 'Total Sales Generated: $%', total_sales;
    RAISE NOTICE 'Orders Spread Over: 65 Weeks (455 Days)';
END $$;