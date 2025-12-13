const addBikeLightToCart = '[data-test="add-to-cart-sauce-labs-bike-light"]';
const cartLink = '[data-test="shopping-cart-link"]';
const addRemoveButtons = ".btn_inventory";
const cartBadge = '[data-test="shopping-cart-badge"]';

describe("Inventory items", () => {
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

  it("sort options reorder items", () => {
    const sortOptions = ["az", "za", "lohi", "hilo"];
    cy.wrap(sortOptions).each((itm) => {
      cy.get('[data-test="product-sort-container"]').select(`${itm}`);
      cy.sortCheck(itm);
    });
  });

  it("adds item to cart", () => {
    cy.get(addBikeLightToCart).click();
    cy.get(cartBadge).invoke("text").should("be.equal", "1");
  });

  it("removes item from cart", () => {
    cy.get(addBikeLightToCart).click();
    cy.contains("Button", "Remove").click();
    cy.get(cartLink).click();
    cy.get('[data-test="inventory-item"]').should("not.exist");
  });

  it("adds multiple items", () => {
    cy.get(addRemoveButtons).its("length").as("addRemoveButtons");
    cy.get(addRemoveButtons).click({ multiple: true });
    cy.get("@addRemoveButtons").then((count) => {
      cy.get(cartBadge).invoke("text").should("be.equal", `${count}`);
    });
  });
});
