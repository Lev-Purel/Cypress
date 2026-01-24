const baseUrl = Cypress.config("baseUrl");

Cypress.Commands.add("login", (body) => {
  return cy
    .request({
      method: "POST",
      url: `${baseUrl}/auth`,
      headers: {
        "Content-Type": "application/json",
      },
      body,
    })
    .then((response) => {
      const token = response.body.token;
      return token;
    });
});
