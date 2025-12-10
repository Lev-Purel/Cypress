const username = '[data-test="username"]';
const password = '[data-test="password"]';
const LoginButton = '[data-test="login-button"]';

describe("Should test authorization", () => {
  beforeEach(() => {
    const baseUrl = Cypress.config("baseUrl");
    cy.visit(baseUrl);
  });

  it("should test authorization", () => {
    cy.get(username).type(Cypress.env("username"));
    cy.get(password).type(Cypress.env("password"));
    cy.get(LoginButton).click({ force: true });
    cy.url().should("include", "inventory");
  });

  it("should test authorization with enter", () => {
    cy.get(username).type(Cypress.env("username"));
    cy.get(password).type(`${Cypress.env("password")}{enter}`);
    cy.url().should("include", "inventory");
  });

  it("should fail authorization (invalid credentials)", () => {
    cy.get(username).type(Cypress.env("username"));
    cy.get(password).type("Wrong Password");
    cy.get(LoginButton).click({ force: true });
    cy.get('[data-test="error"]').should("be.visible");
    cy.get(username).should("have.class", "input_error");
    cy.get(password).should("have.class", "input_error");
  });

  it("should fail authorization (empty fields)", () => {
    cy.get(LoginButton).click({ force: true });
    cy.get('[data-test="error"]')
      .should("be.visible")
      .and("contain.text", "Username is required");
    cy.get(username).should("have.class", "input_error");
    cy.get(password).should("have.class", "input_error");
  });

  it.skip("should pass authorization (space before username)", () => {
    cy.get(username).type(` ${Cypress.env("username")}`); // This test case fails due to bug on source
    cy.get(password).type(`${Cypress.env("password")}{enter}`);
    cy.get(".error-message-container").should("be.empty");
    cy.url().should("include", "inventory");
  });

  it("should test logout", () => {
    cy.login();
    cy.get(".bm-burger-button").click();
    cy.get('[data-test="logout-sidebar-link"]').click();
    cy.url().should("not.include", "inventory");
  });
});
