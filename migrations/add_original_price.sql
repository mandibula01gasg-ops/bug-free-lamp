-- Adiciona coluna original_price na tabela products
ALTER TABLE products 
ADD COLUMN original_price DECIMAL(10, 2) NULL 
AFTER price;
