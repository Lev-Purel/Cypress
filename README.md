# Portfolio QA Automation (Cypress)

## Description

Auto tests written to demonstrate Cypress skills.
The project contains UI tests, API tests (work in progress), work with fixtures (work in progress), and CI pipeline (work in progress).

## Functionality

- test authorization
- sorting items A-Z, Z-A, high price - low price, low price - high price
- adding item to cart
- removing item from cart
- buying item

## Tech Stack

- Cypress 15
- Node 22

## Prerequisites

- Node 22, npm installed

## How to run the Project

- git clone https://github.com/Lev-Purel/Cypress.git
- npm install
- Create a file named .env in the project root and add the following environment variables:

```
USERNAME=your_username
PASSWORD=your_password
```

Replace your_username and your_password with your actual credentials.

- npx cypress open / npx cypress run

## Structure of the Project

```
cypress/
  e2e/
    authorization.cy.js
    items.cy.js
  fixtures/
    example.json
  support/
    commands.js
    e2e.js
.env
.env.sample
.gitignore
cypress.config.js
package-lock.json
package.json
README.md
```

## Features

- Custom commands for authorization have been added.

### Contacts

email: [levpourel0@gmail.com](mailto:levpourel0@gmail.com)
