let pendingFirstName: string | null = null;

export const setWelcomeUser = (firstName: string): void => {
  pendingFirstName = firstName;
};

export const consumeWelcomeUser = (): string | null => {
  const name = pendingFirstName;
  pendingFirstName = null;
  return name;
};
