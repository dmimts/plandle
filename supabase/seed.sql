-- Seed data for testing
-- Insert a default share code
INSERT INTO share_codes (code, label, is_active)
VALUES ('SP-DEMO-1234', 'Standard Freigabe', true)
ON CONFLICT (code) DO NOTHING;

-- Insert app settings
INSERT INTO app_settings (key, value)
VALUES ('active_share_code', 'SP-DEMO-1234')
ON CONFLICT (key) DO UPDATE SET value = EXCLUDED.value;

-- Sample lessons for current week (adjust week_key as needed)
-- These are just examples
INSERT INTO lessons (week_key, day, subject, teacher, room, start_time, end_time, color, notes)
VALUES
  ('2024-W42', 0, 'Mathematik', 'Dr. Müller', 'Raum 201', '08:00', '09:30', '#0058be', 'Kapitel 4 mitbringen'),
  ('2024-W42', 0, 'Physik', 'Prof. Schmidt', 'Labor B', '10:00', '11:30', '#00a472', 'Schutzbrille erforderlich'),
  ('2024-W42', 1, 'Informatik', 'Fr. Weber', 'PC-Raum 3', '08:00', '09:30', '#7c3aed', 'Laptop mitbringen'),
  ('2024-W42', 1, 'Deutsch', 'Hr. Fischer', 'Raum 105', '11:00', '12:30', '#ea580c', NULL),
  ('2024-W42', 2, 'Englisch', 'Ms. Johnson', 'Raum 302', '09:00', '10:30', '#0891b2', NULL),
  ('2024-W42', 3, 'Geschichte', 'Dr. Braun', 'Raum 204', '13:00', '14:30', '#4338ca', NULL),
  ('2024-W42', 4, 'Sport', 'Hr. Klein', 'Sporthalle', '08:00', '09:30', '#db2777', NULL)
ON CONFLICT DO NOTHING;
