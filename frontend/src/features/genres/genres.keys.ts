export const genresKeys = {
  all: ["genres"] as const,
  lists: () => [...genresKeys.all, "list"] as const,
  user: (userId: number) =>
  [...genresKeys.all, "user", userId] as const,
};
  