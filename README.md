# Portfolio QA Automation (Cypress)

## Overview

- UI tests for https://www.saucedemo.com/: login/logout, product sorting, cart operations, purchase flow, page content checks.
- API tests for Restful-Booker: auth + full booking CRUD (create/read/update/partial update/delete) with contract validation via Ajv/ajv-formats.
- Data factories, JSON-schema fixtures, custom Cypress commands, baseUrl switching for UI/API.

## Stack

- Cypress 15 (E2E UI + API)
- Ajv 8 + ajv-formats (JSON Schema validation)
- Node 22, dotenv

## Setup

1. Install deps: `npm install`
2. Create `.env` (or copy `.env.sample`):

```
USERNAME=your_username            # saucedemo creds
PASSWORD=your_password
API_BASE_URL=https://restful-booker.herokuapp.com
API_TOKEN=your_api_token          # optional, if you use direct auth
```

## Scripts

- `npm run cy:ui` — open Cypress with UI specs.
- `npm run cy:api` — open Cypress with API specs.
- `npm run cy:run:ui` / `npm run cy:run:api` — headless runs.

## Test coverage

**UI (Saucedemo)**

- `authorization.cy.js` — positive/negative login, logout.
- `items.cy.js` — sorts A→Z, Z→A, price low→high, high→low; add/remove from cart.
- `pageContent.cy.js` — basic content and navigation checks.
- `purchase.cy.js` — purchase flow with form filling and final confirmation.

**API (Restful-Booker)**

- `auth.cy.js` — obtain token.
- `booking.cy.js` — list bookings, create with schema validation, get by id, full update, partial update, delete, verify 404 after delete.
- Schemas: `cypress/fixtures/api/*.json`, validated via `cy.task("validateSchema", { schema, data })` (Ajv + formats).
- Data: factory `cypress/support/api/factories/booking.factory.js` generates random valid bookings.

## How to run

- UI: `npm run cy:ui` (or `npm run cy:run:ui`).
- API: `npm run cy:api` (or `npm run cy:run:api`) with `API_BASE_URL` set in `.env`.
- Default `baseUrl` for UI is saucedemo; for API it is taken from `API_BASE_URL`.

## Structure

```
cypress/
  e2e/
    ui/
      authorization.cy.js
      items.cy.js
      pageContent.cy.js
      purchase.cy.js
    api/
      auth.cy.js
      booking.cy.js
  fixtures/
    api/
      create.booking.entity.schem.json
      get.booking.entity.schem.json
      get.bookings.entity.schem.json
  support/
    ui/
      commands.js
    api/
      auth.commands.js
      booking.commands.js
      factories/
        booking.factory.js
    e2e.js
cypress.config.js
.env.sample
package.json
```

## Contacts

email: [levpourel0@gmail.com](mailto:levpourel0@gmail.com)
