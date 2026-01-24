const addBikeLightToCart = '[data-test="add-to-cart-sauce-labs-bike-light"]';
const cartLink = '[data-test="shopping-cart-link"]';
const checkoutRequiredFields = [
  '[data-test="firstName"]',
  '[data-test="lastName"]',
  '[data-test="postalCode"]',
];
const checkout = '[data-test="checkout"]';
const continueButton = '[data-test="continue"]';

describe("Purchase tests", () => {
  beforeEach(() => {
    cy.session(
      "login",
      () => {
        cy.loginUi();
      },
      {
        validate() {
          cy.url().should("include", "inventory");
        },
      },
    );
    cy.visit(Cypress.config("baseUrl").concat("inventory.html"), {
      failOnStatusCode: false,
    });
  });

  it("completes purchase", () => {
    cy.get(addBikeLightToCart).click();
    cy.get(cartLink).click();
    cy.get(checkout).click();
    cy.get('[data-test="firstName"]').type("John");
    cy.get('[data-test="lastName"]').type("Doe");
    cy.get('[data-test="postalCode"]').type("557908");
    cy.get(continueButton).click();
    cy.get('[data-test="finish"]').click();
    cy.get('[data-test="complete-header"]').should("be.visible");
  });

  it("shows validation errors when checkout form is empty.", () => {
    cy.get(addBikeLightToCart).click();
    cy.get(cartLink).click();
    cy.get(checkout).click();
    cy.get(continueButton).click();
    cy.get(checkoutRequiredFields).each((itm) => {
      cy.get(itm).should("have.class", "error");
    });
    cy.get('[data-test="error"]').should("be.visible");
  });

  it("Validates order total calculation", () => {
    cy.get(".btn_inventory").click({ multiple: true });
    cy.get(cartLink).click();
    cy.get('[data-test="inventory-item-price"]')
      .then(($items) => {
        const prices = [...$items].map(($itm) =>
          parseFloat($itm.innerText.replace("$", "")),
        );
        return prices.reduce((sum, value) => sum + value, 0);
      })
      .as("calculatedTotal");
    cy.get(checkout).click();
    cy.get('[data-test="firstName"]').type("John");
    cy.get('[data-test="lastName"]').type("Doe");
    cy.get('[data-test="postalCode"]').type("557908");
    cy.get(continueButton).click();
    cy.get("@calculatedTotal").then((total) => {
      cy.get('[data-test="subtotal-label"]')
        .invoke("text")
        .then((text) => {
          const subtotal = parseFloat(text.replace(/[^\d.]/g, ""));
          expect(subtotal).to.be.equal(total);
        });
    });
  });
});
