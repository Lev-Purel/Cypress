const baseUrl = Cypress.config("baseUrl");
Cypress.Commands.add(
  "createUser",
  (
    id = 0,
    username = "johndoe1",
    firstName = "John",
    lastName = "Doe",
    email = "johndoe@gmail.com",
    password = "SecretSauce",
    phone = "+1893406789",
    userStatus = 0
  ) => {
    return cy
      .request({
        method: "POST",
        url: baseUrl.concat("/user"),

        body: {
          id,
          username,
          firstName,
          lastName,
          email,
          password,
          phone,
          userStatus,
        },
      })
      .then((res) => res.body);
  }
);

Cypress.Commands.add("getUserByUsername", (username) => {
  return cy
    .request({ method: "GET", url: baseUrl.concat(`/user/${username}`) })
    .then((res) => res.body);
});
