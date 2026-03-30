import { t, type Static } from "elysia";

export const SearchUsersQuery = t.Object({
  name: t.Optional(t.String()),
  page: t.Optional(t.Number({ minimum: 1, default: 1 })),
  limit: t.Optional(t.Number({ minimum: 1, maximum: 100, default: 10 })),
});

export const SearchUsersRequest = t.Object({
  query: SearchUsersQuery,
  user: t.Number(),
});

export const SearchUsersResponse = t.Array(t.Object({
  id: t.Number(),
  name: t.String(),
}));

export type SearchUsersRequest = Static<typeof SearchUsersRequest>;
export type SearchUsersResponse = Static<typeof SearchUsersResponse>;
