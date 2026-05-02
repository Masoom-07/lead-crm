
CREATE EXTENSION IF NOT EXISTS "pgcrypto";


DROP TABLE IF EXISTS leads;


CREATE TABLE leads (
  id           UUID         PRIMARY KEY DEFAULT gen_random_uuid(),
  name         VARCHAR(100) NOT NULL,
  phone        VARCHAR(15)  NOT NULL,
  source       VARCHAR(20)  NOT NULL CHECK (source IN ('call', 'whatsapp', 'field')),
  status       VARCHAR(30)  NOT NULL DEFAULT 'New'
                            CHECK (status IN ('New', 'Interested', 'Not Interested', 'Converted')),
  notes        TEXT         DEFAULT '',
  created_at   TIMESTAMPTZ  NOT NULL DEFAULT NOW(),
  updated_at   TIMESTAMPTZ  NOT NULL DEFAULT NOW()
);


CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER set_updated_at
  BEFORE UPDATE ON leads
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at();


CREATE INDEX idx_leads_status   ON leads(status);
CREATE INDEX idx_leads_source   ON leads(source);
CREATE INDEX idx_leads_name     ON leads(LOWER(name));
CREATE INDEX idx_leads_created  ON leads(created_at DESC);


INSERT INTO leads (name, phone, source, status, notes) VALUES
  ('Rahul Sharma',  '9876543210', 'call',      'Interested',     'Interested in 2BHK, follow up Monday'),
  ('Priya Mehta',   '9123456789', 'whatsapp',  'Converted',      'Booked unit 4B, payment done'),
  ('Amit Verma',    '9988776655', 'field',     'New',            'Met at housing expo'),
  ('Sonal Gupta',   '9871234567', 'call',      'Not Interested', 'Budget too low'),
  ('Rohan Singh',   '9812345678', 'whatsapp',  'Interested',     'Looking for 3BHK ready possession'),
  ('Neha Joshi',    '9756341230', 'field',     'New',            'Referred by existing customer'),
  ('Kiran Patel',   '9654321098', 'call',      'Converted',      'Closed deal for plot in sector 5'),
  ('Deepak Nair',   '9543210987', 'whatsapp',  'Interested',     'Wants site visit this weekend');


SELECT COUNT(*) AS total_leads FROM leads;
SELECT status, COUNT(*) FROM leads GROUP BY status ORDER BY status;
