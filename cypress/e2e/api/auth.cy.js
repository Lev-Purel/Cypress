describe("Login spec", () => {
  it("login", () => {
    cy.login({ username: "admin", password: "password123" });
  });
});
