-- Room 1: the-trio  →  Donald (ADMIN), Jagger, Deidad
INSERT INTO mango.members (role, status, "userId", "roomId") VALUES
  ('ADMIN'::mango."MemberRole", 'ACTIVE'::mango."MemberStatus", 1, 1),
  ('USER'::mango."MemberRole",  'ACTIVE'::mango."MemberStatus", 2, 1),
  ('USER'::mango."MemberRole",  'ACTIVE'::mango."MemberStatus", 3, 1),

-- Room 2: quad-squad  →  Jagger (ADMIN), Donald, Mystic, Supreme
  ('ADMIN'::mango."MemberRole", 'ACTIVE'::mango."MemberStatus", 2, 2),
  ('USER'::mango."MemberRole",  'ACTIVE'::mango."MemberStatus", 1, 2),
  ('USER'::mango."MemberRole",  'ACTIVE'::mango."MemberStatus", 4, 2),
  ('USER'::mango."MemberRole",  'ACTIVE'::mango."MemberStatus", 5, 2),

-- Room 3: all-stars  →  Deidad (ADMIN), Donald, Jagger, Mystic (LEAVED), Supreme
  ('ADMIN'::mango."MemberRole", 'ACTIVE'::mango."MemberStatus",  3, 3),
  ('USER'::mango."MemberRole",  'ACTIVE'::mango."MemberStatus",  1, 3),
  ('USER'::mango."MemberRole",  'ACTIVE'::mango."MemberStatus",  2, 3),
  ('USER'::mango."MemberRole",  'LEAVED'::mango."MemberStatus", 4, 3),
  ('USER'::mango."MemberRole",  'ACTIVE'::mango."MemberStatus",  5, 3),

-- Room 4: duo  →  Mystic (ADMIN), Supreme
  ('ADMIN'::mango."MemberRole", 'ACTIVE'::mango."MemberStatus", 4, 4),
  ('USER'::mango."MemberRole",  'ACTIVE'::mango."MemberStatus", 5, 4);
