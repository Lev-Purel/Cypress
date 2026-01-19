import createUser from "./factories/user.factory";

Cypress.Commands.add("createUser", (overrides = {}) => {
  const baseUrl = Cypress.config("baseUrl");
  const user = { ...createUser(), ...overrides };
  return cy
    .request({
      method: "POST",
      url: baseUrl.concat("/user"),

      body: user,
    })
    .then((res) => res.body);
});

Cypress.Commands.add("getUserByUsername", (username) => {
  const baseUrl = Cypress.config("baseUrl");
  return cy
    .request({ method: "GET", url: baseUrl.concat(`/user/${username}`) })
    .then((res) => res.body);
});
