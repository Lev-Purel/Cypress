const addToCart = '[data-test="add-to-cart-sauce-labs-bike-light"]';
const cartLink = '[data-test="shopping-cart-link"]';
const buttons = ".btn_inventory";
const cartBadge = '[data-test="shopping-cart-badge"]';
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
  it("should test sort", () => {
    const options = ["az", "za", "lohi", "hilo"];
    cy.wrap(options).each((itm) => {
      cy.get('[data-test="product-sort-container"]').select(`${itm}`);
      cy.sortCheck(itm);
    });
  });

  it("adds item to cart", () => {
    cy.get(addToCart).click();
    cy.get(cartBadge).invoke("text").should("be.equal", "1");
  });

  it("removes item from cart", () => {
    cy.get(addToCart).click();
    cy.contains("Button", "Remove").click();
    cy.get(cartLink).click();
    cy.get('[data-test="inventory-item"]').should("not.exist");
  });

  it("completes purchase", () => {
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

  it("add few items to cart", () => {
    cy.get(buttons).its("length").as("buttons");
    cy.get(buttons).click({ multiple: true });
    cy.get("@buttons").then((count) => {
      cy.get(cartBadge).invoke("text").should("be.equal", `${count}`);
    });
  });
});
