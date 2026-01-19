import createUser from "../../support/api/factories/user.factory";

describe("user api spec", () => {
  it("creates user and check if it created", () => {
    cy.fixture("api/user.response.schema.json").as("createSchema");
    cy.fixture("api/user.entity.schema.json").as("userSchema");

    const user = createUser();

    cy.get("@createSchema").then((createSchema) => {
      cy.createUser(user).then((body) => {
        cy.task("validateSchema", { schema: createSchema, data: body });
        expect(body.code).to.equal(200);
        expect(body.message).to.not.be.empty;
        cy.wrap(user.username).as("username");
      });
    });

    cy.get("@username").then((username) => {
      cy.get("@userSchema").then((userSchema) => {
        cy.getUserByUsername(username).then((body) => {
          cy.task("validateSchema", { schema: userSchema, data: body }).should(
            "equal",
            true,
          );
          expect(body.username).to.equal(username);
        });
      });
    });
  });

  it("negative: creates user withoud ");
});
