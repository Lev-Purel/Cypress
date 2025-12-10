const addToCart = '[data-test="add-to-cart-sauce-labs-bike-light"]';
const cartLink = '[data-test="shopping-cart-link"]';

describe("Test items functionality", () => {
  beforeEach(() => {
    cy.session(
      "login",
      () => {
        cy.login();
      },
      {
        validate() {
          cy.url().should("include", "inventory");
        },
      }
    );
    cy.visit(Cypress.config("baseUrl").concat("inventory.html"), {
      failOnStatusCode: false,
    });
  });
  it("should test sort functionality", () => {
    const options = ["az", "za", "lohi", "hilo"];
    cy.wrap(options).each((itm) => {
      cy.get('[data-test="product-sort-container"]').select(`${itm}`);
      cy.sortCheck(itm);
    });
  });

  it("should test adding to chart functionality", () => {
    cy.get(addToCart).click();
    cy.get('[data-test="shopping-cart-badge"]')
      .invoke("text")
      .should("be.equal", "1");
  });

  it("should test removing item from chart", () => {
    cy.get(addToCart).click();
    cy.contains("Button", "Remove").click();
    cy.get(cartLink).click();
    cy.get('[data-test="inventory-item"]').should("not.exist");
  });

  it("should test buying item", () => {
    cy.get(addToCart).click();
    cy.get(cartLink).click();
    cy.get('[data-test="checkout"]').click();
    cy.get('[data-test="firstName"]').type("John");
    cy.get('[data-test="lastName"]').type("Doe");
    cy.get('[data-test="postalCode"]').type("557908");
    cy.get('[data-test="continue"]').click();
    cy.get('[data-test="finish"]').click();
    cy.get('[data-test="complete-header"]').should("be.visible");
  });
});
