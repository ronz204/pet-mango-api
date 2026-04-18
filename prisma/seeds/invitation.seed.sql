-- Donald invited Supreme & Mystic to the-trio (one accepted, one declined)
-- Jagger invited Deidad to quad-squad (accepted, that's why she's not there but could have been)
-- Supreme has a pending invite to the-trio from someone
INSERT INTO mango.invitations (status, "inviteeId", "roomId") VALUES
  ('ACCEPTED'::mango."InvitationStatus",  2, 1),  -- Jagger accepted invite to the-trio
  ('ACCEPTED'::mango."InvitationStatus",  3, 1),  -- Deidad accepted invite to the-trio
  ('DECLINED'::mango."InvitationStatus",  3, 2),  -- Deidad declined quad-squad
  ('EXPIRED'::mango."InvitationStatus",   4, 1),  -- Mystic's invite to the-trio expired
  ('PENDING'::mango."InvitationStatus",   1, 4),  -- Donald pending invite to duo
  ('PENDING'::mango."InvitationStatus",   2, 4);  -- Jagger pending invite to duo
