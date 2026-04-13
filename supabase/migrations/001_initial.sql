-- Enable extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Enums
CREATE TYPE metric_type_enum AS ENUM ('weight', 'blood_pressure_systolic', 'blood_pressure_diastolic', 'calories');
CREATE TYPE message_role_enum AS ENUM ('user', 'assistant');

-- Tables
CREATE TABLE measurements (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL,
    recorded_at TIMESTAMPTZ NOT NULL,
    metric_type metric_type_enum NOT NULL,
    value NUMERIC NOT NULL,
    unit VARCHAR(50)
);

CREATE TABLE chat_messages (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL,
    role message_role_enum NOT NULL,
    content TEXT NOT NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Indexes
CREATE INDEX idx_measurements_user_id ON measurements(user_id);
CREATE INDEX idx_measurements_recorded_at ON measurements(recorded_at);
CREATE INDEX idx_chat_messages_user_id ON chat_messages(user_id);
CREATE INDEX idx_chat_messages_created_at ON chat_messages(created_at);

-- RLS
ALTER TABLE measurements ENABLE ROW LEVEL SECURITY;
ALTER TABLE chat_messages ENABLE ROW LEVEL SECURITY;

-- Policies
-- For measurements
CREATE POLICY "Users can view their own measurements" ON measurements
    FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert their own measurements" ON measurements
    FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update their own measurements" ON measurements
    FOR UPDATE USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can delete their own measurements" ON measurements
    FOR DELETE USING (auth.uid() = user_id);

-- For chat_messages
CREATE POLICY "Users can view their own chat messages" ON chat_messages
    FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert their own chat messages" ON chat_messages
    FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update their own chat messages" ON chat_messages
    FOR UPDATE USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can delete their own chat messages" ON chat_messages
    FOR DELETE USING (auth.uid() = user_id);
