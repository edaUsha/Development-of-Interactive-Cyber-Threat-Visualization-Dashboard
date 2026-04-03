CREATE TABLE public.api_keys (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  key_value TEXT NOT NULL,
  service TEXT NOT NULL DEFAULT 'custom',
  is_active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

ALTER TABLE public.api_keys ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow public read access to api_keys" ON public.api_keys FOR SELECT USING (true);
CREATE POLICY "Allow public insert to api_keys" ON public.api_keys FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow public update to api_keys" ON public.api_keys FOR UPDATE USING (true);
CREATE POLICY "Allow public delete to api_keys" ON public.api_keys FOR DELETE USING (true);