-- Supabase Database Schema for Quiz App

-- Quiz Questions Table
CREATE TABLE quiz_questions (
    id SERIAL PRIMARY KEY,
    category VARCHAR(50) NOT NULL, -- 'mandatory', 'warning', 'informatory'
    authority VARCHAR(20) NOT NULL, -- 'GOP', 'GOPUN', 'GOKPK', 'GOSINDH', 'GOBALOCH', 'NHA'
    question TEXT NOT NULL,
    question_urdu TEXT NOT NULL,
    image_url TEXT NOT NULL, -- URL or emoji for the sign image
    options JSONB NOT NULL, -- Array of option objects
    correct_answer VARCHAR(1) NOT NULL, -- 'a', 'b', 'c', 'd'
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Sign Categories Table
CREATE TABLE sign_categories (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    name_urdu VARCHAR(100) NOT NULL,
    description TEXT,
    icon VARCHAR(50),
    color VARCHAR(7), -- Hex color code
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Quiz Results Table
CREATE TABLE quiz_results (
    id SERIAL PRIMARY KEY,
    user_id VARCHAR(255) NOT NULL, -- Firebase user ID
    authority VARCHAR(20) NOT NULL,
    category VARCHAR(50) NOT NULL,
    score INTEGER NOT NULL,
    total_questions INTEGER NOT NULL,
    percentage INTEGER NOT NULL,
    completed_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Sample data for sign categories
INSERT INTO sign_categories (name, name_urdu, description, icon, color) VALUES
('Mandatory Road Signs', 'لازمی روڈ سائنز', 'Signs that must be obeyed', 'checkmark-circle-outline', '#e74c3c'),
('Warning Road Signs', 'انتباہی روڈ سائنز', 'Signs that warn of hazards', 'warning-outline', '#f39c12'),
('Informatory Road Signs', 'معلوماتی روڈ سائنز', 'Signs that provide information', 'information-circle-outline', '#3498db');

-- Sample quiz questions (you can add more)
INSERT INTO quiz_questions (category, authority, question, question_urdu, image_url, options, correct_answer) VALUES
('mandatory', 'GOP', 'What does this sign mean?', 'اس سائن کا کیا مطلب ہے؟', '🚦', 
 '[{"id": "a", "text": "Stop", "text_urdu": "روکیں"}, {"id": "b", "text": "Go", "text_urdu": "جائیں"}, {"id": "c", "text": "Wait", "text_urdu": "انتظار کریں"}, {"id": "d", "text": "Turn", "text_urdu": "مڑیں"}]', 
 'a'),

('warning', 'GOP', 'What does this sign indicate?', 'یہ سائن کیا ظاہر کرتا ہے؟', '⚠️', 
 '[{"id": "a", "text": "School ahead", "text_urdu": "آگے اسکول"}, {"id": "b", "text": "Hospital ahead", "text_urdu": "آگے ہسپتال"}, {"id": "c", "text": "Danger ahead", "text_urdu": "آگے خطرہ"}, {"id": "d", "text": "Parking ahead", "text_urdu": "آگے پارکنگ"}]', 
 'c'),

('informatory', 'GOP', 'What does this sign tell you?', 'یہ سائن آپ کو کیا بتاتا ہے؟', 'ℹ️', 
 '[{"id": "a", "text": "Information center", "text_urdu": "معلوماتی مرکز"}, {"id": "b", "text": "Rest area", "text_urdu": "آرام کی جگہ"}, {"id": "c", "text": "Fuel station", "text_urdu": "پٹرول پمپ"}, {"id": "d", "text": "Hospital", "text_urdu": "ہسپتال"}]', 
 'a');

-- Create indexes for better performance
CREATE INDEX idx_quiz_questions_category_authority ON quiz_questions(category, authority);
CREATE INDEX idx_quiz_results_user_id ON quiz_results(user_id);
CREATE INDEX idx_quiz_results_authority_category ON quiz_results(authority, category);

-- Enable Row Level Security (RLS)
ALTER TABLE quiz_questions ENABLE ROW LEVEL SECURITY;
ALTER TABLE sign_categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE quiz_results ENABLE ROW LEVEL SECURITY;

-- Create policies for public read access to questions and categories
CREATE POLICY "Allow public read access to quiz questions" ON quiz_questions
    FOR SELECT USING (true);

CREATE POLICY "Allow public read access to sign categories" ON sign_categories
    FOR SELECT USING (true);

-- Create policy for authenticated users to insert quiz results
CREATE POLICY "Allow authenticated users to insert quiz results" ON quiz_results
    FOR INSERT WITH CHECK (auth.uid()::text = user_id);

-- Create policy for users to read their own quiz results
CREATE POLICY "Allow users to read their own quiz results" ON quiz_results
    FOR SELECT USING (auth.uid()::text = user_id);
