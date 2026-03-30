import { t, type Static } from "elysia";

export const UpdateProfileBody = t.Object({
  name: t.String({ minLength: 4, maxLength: 20 }),
  password: t.String({ minLength: 8, maxLength: 64 }),
});

export const UpdateProfileRequest = t.Object({
  body: UpdateProfileBody,
  user: t.Number(),
});

export const UpdateProfileResponse = t.Object({
  id: t.Number(),
  name: t.String(),
  email: t.String(),
});

export type UpdateProfileRequest = Static<typeof UpdateProfileRequest>;
export type UpdateProfileResponse = Static<typeof UpdateProfileResponse>;
