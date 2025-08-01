-- Enable Row Level Security
ALTER TABLE auth.users ENABLE ROW LEVEL SECURITY;

-- Create decks table
CREATE TABLE IF NOT EXISTS decks (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  description TEXT,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  tags TEXT[] DEFAULT '{}',
  stats JSONB DEFAULT '{"total_views": 0, "total_study_sessions": 0, "average_score": 0}',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create cards table
CREATE TABLE IF NOT EXISTS cards (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  deck_id UUID REFERENCES decks(id) ON DELETE CASCADE,
  front TEXT NOT NULL,
  back TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create study_sessions table
CREATE TABLE IF NOT EXISTS study_sessions (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  deck_id UUID REFERENCES decks(id) ON DELETE CASCADE,
  score INTEGER,
  duration INTEGER,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable RLS on all tables
ALTER TABLE decks ENABLE ROW LEVEL SECURITY;
ALTER TABLE cards ENABLE ROW LEVEL SECURITY;
ALTER TABLE study_sessions ENABLE ROW LEVEL SECURITY;

-- Create RLS policies for decks
CREATE POLICY "Users can view their own decks" ON decks
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own decks" ON decks
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own decks" ON decks
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own decks" ON decks
  FOR DELETE USING (auth.uid() = user_id);

-- Create RLS policies for cards
CREATE POLICY "Users can view cards from their decks" ON cards
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM decks WHERE decks.id = cards.deck_id AND decks.user_id = auth.uid()
    )
  );

CREATE POLICY "Users can insert cards to their decks" ON cards
  FOR INSERT WITH CHECK (
    EXISTS (
      SELECT 1 FROM decks WHERE decks.id = cards.deck_id AND decks.user_id = auth.uid()
    )
  );

CREATE POLICY "Users can update cards from their decks" ON cards
  FOR UPDATE USING (
    EXISTS (
      SELECT 1 FROM decks WHERE decks.id = cards.deck_id AND decks.user_id = auth.uid()
    )
  );

CREATE POLICY "Users can delete cards from their decks" ON cards
  FOR DELETE USING (
    EXISTS (
      SELECT 1 FROM decks WHERE decks.id = cards.deck_id AND decks.user_id = auth.uid()
    )
  );

-- Create RLS policies for study_sessions
CREATE POLICY "Users can view their own study sessions" ON study_sessions
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own study sessions" ON study_sessions
  FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_decks_user_id ON decks(user_id);
CREATE INDEX IF NOT EXISTS idx_cards_deck_id ON cards(deck_id);
CREATE INDEX IF NOT EXISTS idx_study_sessions_user_id ON study_sessions(user_id);
CREATE INDEX IF NOT EXISTS idx_study_sessions_deck_id ON study_sessions(deck_id);

-- Create function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ language 'plpgsql';

-- Create triggers to automatically update updated_at
CREATE TRIGGER update_decks_updated_at BEFORE UPDATE ON decks
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_cards_updated_at BEFORE UPDATE ON cards
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column(); 