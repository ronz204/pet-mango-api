-- Fake users for testing purposes. Passwords are hashed using Argon2id with the following parameters:
INSERT INTO mango.users (name, email, password) VALUES
  ('Donald', 'donald@mango.com', '$argon2id$v=19$m=65536,t=2,p=1$TW6D+mo7ZAjcWZZWTx929pXZrhbRZyxMgcX+u3vdlYk$oU7kV9Na4Fx1tkQJ3Om/FipSRinvMoNSZ16GFVJsabg'),
  ('Jagger', 'jagger@mango.com', '$argon2id$v=19$m=65536,t=2,p=1$vB4pwHCRH9H+bS9mP649lIMwacyDCuINL0siX7DSoNk$uRKNAzILqVbXhsZVKgqlRJgjcs3HLds1a4EJCePE20g'),
  ('Deidad', 'deidad@mango.com', '$argon2id$v=19$m=65536,t=2,p=1$B4pFDr7RaninwCBcCA7EEsppgNShw1BxWRhs/z6Xx6I$/xW8Nak7Xma3ud4AXp/bkGHhq1eDhzlqJw9n6s13iD4'),
  ('Mystic', 'mystic@mango.com', '$argon2id$v=19$m=65536,t=2,p=1$z4VQ/ScyaDGeGIIBhOcluol4bCwjMz2tjrBoXmOf5wo$eNyHrTgCgQ3JHwXVe8ngoiNB6m3YXFVsiZxgc4c2TOw'),
  ('Supreme', 'supreme@mango.com', '$argon2id$v=19$m=65536,t=2,p=1$vy5DbU8Poqgcz9Z69iVERg2P/6iD2BCc5dm7NOkUvMw$kf3IikAnQPyaJVQCwEo/7jy1mVh0+SyRWzt0qVmfItU');
