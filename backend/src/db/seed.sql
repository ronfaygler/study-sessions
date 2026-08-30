INSERT INTO topics (title, subject) VALUES
('React Hooks', 'Frontend'),
('REST APIs', 'Backend'),
('SQL Joins', 'Databases'),
('Authentication', 'Security'),
('WebSockets', 'Backend'),
('Docker Basics', 'DevOps'),
('JavaScript Promises', 'JavaScript'),
('System Design Basics', 'Architecture')
ON CONFLICT (title) DO NOTHING;
