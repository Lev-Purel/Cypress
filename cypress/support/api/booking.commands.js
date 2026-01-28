const baseUrl = Cypress.config("baseUrl");
Cypress.Commands.add("getBookingsIds", () => {
  return cy.request({
    method: "GET",
    url: `${baseUrl}/booking`,
    headers: {
      "Content-Type": "application/json",
    },
  });
});

Cypress.Commands.add("createBooking", (booking, failOnStatusCode = true) => {
  return cy
    .request({
      method: "POST",
      url: `${baseUrl}/booking`,
      headers: {
        "Content-Type": "application/json",
      },
      body: booking,
      failOnStatusCode,
    })
    .then((res) => {
      return { booking: res.body, response: res };
    });
});

Cypress.Commands.add("getBookingById", (id, statusCode = true) => {
  return cy.request({
    method: "GET",
    url: `${baseUrl}/booking/${id}`,
    headers: {
      "Content-Type": "application/json",
    },
    failOnStatusCode: statusCode,
  });
});

Cypress.Commands.add(
  "updateBookingById",
  (id, token, body, failOnStatusCode = true) => {
    return cy.request({
      method: "PUT",
      url: `${baseUrl}/booking/${id}`,
      headers: { Cookie: `token=${token}` },
      body,
      failOnStatusCode,
    });
  },
);

Cypress.Commands.add("partuallyUpdateBookingById", (id, token, body) => {
  return cy.request({
    method: "PATCH",
    url: `${baseUrl}/booking/${id}`,
    headers: { Cookie: `token=${token}` },
    body,
  });
});

Cypress.Commands.add("deleteBookingByID", (id, token) => {
  return cy.request({
    method: "DELETE",
    url: `${baseUrl}/booking/${id}`,
    headers: { Cookie: `token=${token}` },
  });
});
