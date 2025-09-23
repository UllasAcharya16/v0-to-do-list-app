-- Insert sample tasks for testing (these will only work after a user signs up)
-- This script demonstrates the data structure but won't run until there's an authenticated user

-- Sample daily tasks
-- INSERT INTO public.tasks (user_id, title, notes, tags, list_type, is_recurring, recurring_pattern)
-- VALUES 
--   (auth.uid(), 'Review daily goals', 'Check progress on key objectives', ARRAY['productivity', 'planning'], 'daily', true, '{"frequency": "daily", "days": [1,2,3,4,5]}'),
--   (auth.uid(), 'Exercise routine', '30 minutes of cardio or strength training', ARRAY['health', 'fitness'], 'daily', true, '{"frequency": "daily", "days": [1,2,3,4,5,6,7]}'),
--   (auth.uid(), 'Read for 20 minutes', 'Continue current book or articles', ARRAY['learning', 'personal'], 'daily', true, '{"frequency": "daily", "days": [1,2,3,4,5,6,7]}');

-- Sample monthly tasks  
-- INSERT INTO public.tasks (user_id, title, notes, tags, list_type, due_date)
-- VALUES
--   (auth.uid(), 'Monthly budget review', 'Analyze expenses and adjust budget for next month', ARRAY['finance', 'planning'], 'monthly', DATE_TRUNC('month', CURRENT_DATE) + INTERVAL '1 month - 1 day'),
--   (auth.uid(), 'Backup important files', 'Create backup of documents, photos, and project files', ARRAY['maintenance', 'tech'], 'monthly', DATE_TRUNC('month', CURRENT_DATE) + INTERVAL '1 month - 1 day'),
--   (auth.uid(), 'Plan next month goals', 'Set objectives and priorities for the upcoming month', ARRAY['planning', 'goals'], 'monthly', DATE_TRUNC('month', CURRENT_DATE) + INTERVAL '1 month - 1 day');

-- Note: The above INSERT statements are commented out because they require an authenticated user session
-- They serve as examples of the data structure and can be used for testing after authentication is set up
