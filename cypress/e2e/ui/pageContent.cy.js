const burgerMenuButton = "#react-burger-menu-btn";
const cartLink = '[data-test="shopping-cart-link"]';

const landingPageElements = [
  '[data-test="inventory-item"]',
  '[data-test="product-sort-container"]',
  cartLink,
  burgerMenuButton,
];
const itemPageElements = [
  '[data-test="inventory-item-desc"]',
  '[data-test="inventory-item-name"]',
  ".inventory_details_img",
  '[data-test="inventory-item-price"]',
  '[data-test="add-to-cart"]',
  '[data-test="back-to-products"]',
  cartLink,
  burgerMenuButton,
];

describe("Existing page content check", () => {
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

  it("landing page content", () => {
    cy.checkPageContent(landingPageElements);
  });

  it("item page content", () => {
    cy.get('[data-test="inventory-item-name"]').first().click();
    cy.url().should("include", "inventory-item");
    cy.checkPageContent(itemPageElements);
  });
});
