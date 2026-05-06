-- Insertar categorías
INSERT INTO categories (name, description) VALUES
('Programación', 'Cursos de desarrollo de software y programación'),
('Diseño', 'Cursos de diseño gráfico, UI y UX'),
('Marketing', 'Cursos de marketing digital y redes sociales');

-- Insertar cursos
INSERT INTO products (name, price, stock, category_id) VALUES
('JavaScript desde cero',     29.99, 100, (SELECT id FROM categories WHERE name = 'Programación')),
('React y TypeScript',        49.99,  80, (SELECT id FROM categories WHERE name = 'Programación')),
('Figma para principiantes',  19.99,  60, (SELECT id FROM categories WHERE name = 'Diseño')),
('UI/UX Design Avanzado',     59.99,  40, (SELECT id FROM categories WHERE name = 'Diseño')),
('SEO y posicionamiento web', 34.99,  50, (SELECT id FROM categories WHERE name = 'Marketing'));