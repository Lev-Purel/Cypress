describe("Login spec", () => {
  beforeEach(() => {
    cy.fixture("api/post.auth.entity.schem.json").then((schema) => {
      cy.wrap(schema).as("authSchema");
    });
  });
  it("login", () => {
    cy.get("@authSchema").then((schema) => {
      cy.login({
        username: Cypress.env("api_username"),
        password: Cypress.env("api_password"),
      }).then((res) => {
        expect(res.response.status).to.equal(200);
        cy.task("validateSchema", {
          schema,
          data: res.response.body,
        }).should("equal", true);
      });
    });
  });

  it("negative: login with invalid Credentials", () => {
    cy.log("TEST INVALID USERNAME");

    cy.get("@authSchema").then((schema) => {
      cy.login({
        username: "Invalid Username",
        password: Cypress.env("api_password"),
      }).then((res) => {
        expect(res.response.body.reason).to.include("Bad credentials");
        cy.task("validateSchema", {
          schema,
          data: res.response.body,
        }).should("equal", true);
      });

      cy.log("TEST INVALID PASSWORD");
      cy.get("@authSchema").then((schema) => {
        cy.login({
          username: Cypress.env("api_username"),
          password: "FAKE FAKE FAKE",
        }).then((res) => {
          expect(res.response.body.reason).to.include("Bad credentials");
          cy.task("validateSchema", {
            schema,
            data: res.response.body,
          }).should("equal", true);
        });
      });
    });
  });
});
