SELECT * FROM users;
SELECT * FROM tasks;
SELECT * FROM task_entries;

SELECT * FROM tasks JOIN task_entries ON tasks.id = task_entries.task_id;
SELECT
	tasks.id AS task_id,
	tasks.title AS title,
	tasks.category AS category,
	task_entries.id AS entry_id,
	task_entries.time_spent_minutes AS duration,
	task_entries.created_at
FROM
	tasks
LEFT JOIN task_entries ON tasks.id = task_entries.task_id
ORDER BY tasks.id, task_entries.created_at DESC;
	

INSERT INTO tasks (user_id, title, category) VALUES (13, 'Work', 'Weekly');
INSERT INTO task_entries(task_id, time_spent_minutes) VALUES (1, 1920

DELETE FROM tasks WHERE id = 18 RETURNING *;


-- TRUNCATE TABLE task_entries RESTART IDENTITY CASCADE;
-- TRUNCATE TABLE tasks RESTART IDENTITY CASCADE;

