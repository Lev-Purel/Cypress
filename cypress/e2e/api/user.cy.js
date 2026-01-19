import createUser from "../../support/api/factories/user.factory";

describe("user api spec", () => {
  const user = createUser();

  beforeEach(() => {
    cy.fixture("api/user.response.schema.json").as("createSchema");
    cy.fixture("api/user.entity.schema.json").as("userSchema");
  });

  it("creates user and check if it created", () => {
    cy.get("@createSchema").then((createSchema) => {
      cy.createUser(user).then((body) => {
        cy.task("validateSchema", { schema: createSchema, data: body }).should(
          "equal",
          true,
        );
        expect(body.code).to.equal(200);
        expect(body.message).to.not.be.empty;
        cy.wrap(user.username).as("username");
      });
    });

    cy.get("@userSchema").then((userSchema) => {
      cy.getUserByUsername(user.username).then((body) => {
        cy.task("validateSchema", { schema: userSchema, data: body }).should(
          "equal",
          true,
        );
        expect(body.username).to.equal(user.username);
      });
    });
  });

  it("Gets user", () => {
    cy.get("@userSchema").then((schema) => {
      cy.getUserByUsername(user.username).then((body) => {
        cy.task("validateSchema", { schema, data: body }).should("equal", true);
      });
    });
  });
});
