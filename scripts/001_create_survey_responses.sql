-- Create survey_responses table to store all survey submissions
CREATE TABLE IF NOT EXISTS public.survey_responses (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  age_range TEXT,
  mobile_money_services TEXT[],
  transaction_frequency TEXT,
  lost_money TEXT,
  fraud_method TEXT,
  amount_lost TEXT,
  time_to_realize TEXT,
  guided_on_phone TEXT,
  caller_identity TEXT,
  actions_instructed TEXT,
  emotional_state TEXT,
  help_received TEXT,
  trust_level TEXT,
  warning_adequacy TEXT,
  desire_ai_prevention TEXT,
  comfort_with_blocking TEXT,
  preferred_provider TEXT,
  willingness_to_use TEXT,
  open_feedback TEXT,
  submitted_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create an index on submitted_at for faster queries
CREATE INDEX IF NOT EXISTS idx_survey_responses_submitted_at 
  ON public.survey_responses(submitted_at DESC);

-- Enable Row Level Security
ALTER TABLE public.survey_responses ENABLE ROW LEVEL SECURITY;

-- Create policy to allow anyone to insert (public survey)
CREATE POLICY "Allow public survey submissions"
  ON public.survey_responses
  FOR INSERT
  WITH CHECK (true);

-- Create policy for reading (only for authenticated users/admins)
CREATE POLICY "Allow authenticated users to read"
  ON public.survey_responses
  FOR SELECT
  USING (auth.role() = 'authenticated');
