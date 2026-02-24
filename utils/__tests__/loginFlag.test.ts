import { setWelcomeUser, consumeWelcomeUser } from "../loginFlag";

describe("loginFlag", () => {
  beforeEach(() => {
    // Reset state between tests by consuming any pending flag
    consumeWelcomeUser();
  });

  afterEach(() => {
    // Guard against stale state if a test throws before consuming the flag
    consumeWelcomeUser();
  });

  it("setWelcomeUser stores the first name", () => {
    setWelcomeUser("Jordan");
    expect(consumeWelcomeUser()).toBe("Jordan");
  });

  it("consumeWelcomeUser clears the flag after reading", () => {
    setWelcomeUser("Jordan");
    consumeWelcomeUser();
    expect(consumeWelcomeUser()).toBeNull();
  });

  it("consumeWelcomeUser returns null when no flag is set", () => {
    expect(consumeWelcomeUser()).toBeNull();
  });
});
