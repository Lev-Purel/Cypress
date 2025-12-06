// ***********************************************
// This example commands.js shows you how to
// create various custom commands and overwrite
// existing commands.
//
// For more comprehensive examples of custom
// commands please read more here:
// https://on.cypress.io/custom-commands
// ***********************************************
//
//
// -- This is a parent command --
// Cypress.Commands.add('login', (email, password) => { ... })
//
//
// -- This is a child command --
// Cypress.Commands.add('drag', { prevSubject: 'element'}, (subject, options) => { ... })
//
//
// -- This is a dual command --
// Cypress.Commands.add('dismiss', { prevSubject: 'optional'}, (subject, options) => { ... })
//
//
// -- This will overwrite an existing command --
// Cypress.Commands.overwrite('visit', (originalFn, url, options) => { ... })

Cypress.Commands.add("login", () => {
  const baseUrl = Cypress.config("baseUrl");
  cy.visit(baseUrl);
  cy.get('[data-test="username"]').type(Cypress.env("username"));
  cy.get('[data-test="password"]').type(Cypress.env("password"));
  cy.get('[data-test="login-button"]').click();
  cy.url().should("include", "inventory");
});

Cypress.Commands.add("sortCheck", (type) => {
  const alphabetSort = { az: 1, za: -1 };
  const priceSort = { lohi: 1, hilo: -1 };

  const sortBy = (items, dir, mapper) => {
    const arr = [...items].map(mapper);
    const expected = [...arr].sort((a, b) =>
      typeof a === "string" ? dir * a.localeCompare(b) : dir * (a - b)
    );
    expect(arr).to.deep.equal(expected);
  };

  if (type in alphabetSort) {
    cy.get('[data-test="inventory-item-name"]').then(($items) =>
      sortBy($items, alphabetSort[type], (el) => el.innerText.trim())
    );
  } else if (type in priceSort) {
    cy.get('[data-test="inventory-item-price"]').then(($items) =>
      sortBy($items, priceSort[type], (el) =>
        Number(el.innerText.replace("$", ""))
      )
    );
  }
});
