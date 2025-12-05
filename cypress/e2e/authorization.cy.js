describe("template spec", () => {
  beforeEach(() => {
    const baseUrl = Cypress.config("baseUrl");
    cy.visit(baseUrl);
  });

  it("should test authorization", () => {
    cy.get('[data-test="username"]').type(Cypress.env("username"));
    cy.get('[data-test="password"]').type(Cypress.env("password"));
    cy.get('[data-test="login-button"]').click({ force: true });
    cy.url().should("include", "inventory");
  });

  it("should test authorization with enter", () => {
    cy.get('[data-test="username"]').type(Cypress.env("username"));
    cy.get('[data-test="password"]').type(`${Cypress.env("password")}{enter}`);
    cy.url().should("include", "inventory");
  });

  it("should fail authorization (invalid credentials)", () => {
    const username = '[data-test="username"]';
    const password = '[data-test="password"]';
    cy.get(username).type(Cypress.env("username"));
    cy.get(password).type("Wrong Password");
    cy.get('[data-test="login-button"]').click({ force: true });
    cy.get('[data-test="error"]').should("be.visible");
    cy.get(username).should("have.class", "input_error");
    cy.get(password).should("have.class", "input_error");
  });

  it("should fail authorization (empty fields)", () => {
    cy.get('[data-test="login-button"]').click({ force: true });
    cy.get('[data-test="error"]', { timeout: 8000 })
      .should("be.visible")
      .and("contain.text", "Username is required");
    cy.get('[data-test="username"]').should("have.class", "input_error");
    cy.get('[data-test="password"]').should("have.class", "input_error");
  });

  it("should pass authorization (space before username)", () => {
    cy.log("This test case always fails because of bug");
    cy.get('[data-test="username"]').type(` ${Cypress.env("username")}`);
    cy.get('[data-test="password"]').type(` ${Cypress.env("password")}{enter}`);
    cy.get(".error-message-container").should("be.empty");
    cy.url().should("include", "inventory");
  });
});
