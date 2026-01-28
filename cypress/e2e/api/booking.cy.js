import createBooking from "../../support/api/factories/booking.factory";
const toISODate = (d) => {
  if (!d) throw new Error("toISODate: date is undefined/null");
  if (d instanceof Date) return d.toISOString().split("T")[0];
  if (typeof d === "string") return d.split("T")[0];
  throw new Error(`toISODate: unsupported type ${typeof d}`);
};

describe("Booking spec", () => {
  let booking;
  let BookingId;
  let token;
  before(() => {
    booking = createBooking();
    cy.fixture("api/get.bookings.entity.schem.json").as("getBookingsSchema");
    cy.login({
      username: Cypress.env("api_username"),
      password: Cypress.env("api_password"),
    }).then((itm) => {
      token = itm.token;
    });
  });
  it("get All Bookings", () => {
    cy.get("@getBookingsSchema").then((schema) => {
      cy.getBookingsIds().then((res) => {
        cy.task("validateSchema", { schema: schema, data: res.body }).should(
          "equal",
          true,
        );
      });
    });
  });

  it("create Booking", () => {
    cy.fixture("api/create.booking.entity.schem.json").then(
      (createBookingSchema) => {
        cy.createBooking(booking).then((res) => {
          BookingId = res.booking.bookingid;
          cy.task("validateSchema", {
            schema: createBookingSchema,
            data: res.booking,
          });
          cy.fixture("api/get.booking.entity.schem.json").then((schema) => {
            cy.getBookingById(BookingId).then((res) => {
              cy.task("validateSchema", { schema, data: res.body }).should(
                "equal",
                true,
              );
              expect(res.body).to.deep.equal({
                ...booking,
                bookingdates: {
                  checkin: toISODate(booking.bookingdates.checkin),
                  checkout: toISODate(booking.bookingdates.checkout),
                },
              });
            });
          });
        });
      },
    );
  });

  it("Get Booking by Id", () => {
    cy.fixture("api/get.booking.entity.schem.json").then((schema) => {
      cy.getBookingById(BookingId).then((res) => {
        cy.task("validateSchema", { schema, data: res.body }).should(
          "equal",
          true,
        );
        expect(res.body).to.deep.equal({
          ...booking,
          bookingdates: {
            checkin: toISODate(booking.bookingdates.checkin),
            checkout: toISODate(booking.bookingdates.checkout),
          },
        });
      });
    });
  });

  it("update Booking", () => {
    const updatedBookingData = createBooking();
    const expectedValue = {
      ...updatedBookingData,
      bookingdates: {
        checkin: toISODate(updatedBookingData.bookingdates.checkin),
        checkout: toISODate(updatedBookingData.bookingdates.checkout),
      },
    };
    cy.fixture("api/get.booking.entity.schem.json").then((schema) => {
      cy.updateBookingById(BookingId, token, updatedBookingData).then((res) => {
        cy.task("validateSchema", { schema, data: res.body }).should(
          "equal",
          true,
        );
        expect(res.body).to.deep.equal(expectedValue);
      });
      cy.getBookingById(BookingId).then((res) => {
        cy.task("validateSchema", { schema, data: res.body }).should(
          "equal",
          true,
        );
        booking = res.body;
        expect(res.body).to.deep.equal(expectedValue);
      });
    });
  });

  it("partial Update Booking", () => {
    const updatedBookingData = createBooking();
    const expectedValue = {
      bookingdates: {
        checkin: toISODate(booking.bookingdates.checkin),
        checkout: toISODate(booking.bookingdates.checkout),
      },
      ...booking,
      firstname: updatedBookingData.firstname,
      lastname: updatedBookingData.lastname,
    };
    cy.fixture("api/get.booking.entity.schem.json").then((schema) => {
      cy.partuallyUpdateBookingById(BookingId, token, {
        firstname: updatedBookingData.firstname,
        lastname: updatedBookingData.lastname,
      }).then((res) => {
        cy.task("validateSchema", { schema, data: res.body }).should(
          "equal",
          true,
        );
        booking = res.body;
        expect(res.body).to.deep.equal(expectedValue);
      });
      cy.getBookingById(BookingId).then((res) => {
        cy.task("validateSchema", { schema, data: res.body }).should(
          "equal",
          true,
        );
        expect(res.body).to.deep.equal(expectedValue);
      });
    });
  });

  it("negative: create Booking with invalid firstname", () => {
    const invalidBooking = createBooking({ firstname: 123 });

    cy.createBooking(invalidBooking, false).then((res) => {
      expect(res.response.status).to.be.equal(500);
    });
  });
  it("negative: create Booking with invalid bookingdates", () => {
    const invalidBooking = createBooking({ bookingdates: 123 });

    cy.createBooking(invalidBooking, false).then((res) => {
      expect(res.response.status).to.be.equal(500);
    });
  });

  it("negative: create Booking with invalid depositpaid", () => {
    const invalidBooking = createBooking({ depositpaid: null });

    cy.createBooking(invalidBooking, false).then((res) => {
      expect(res.response.status).to.be.equal(500);
    });
  });

  it("negative: create Booking with invalid totalprice", () => {
    const invalidBooking = createBooking({ totalprice: undefined });

    cy.createBooking(invalidBooking, false).then((res) => {
      expect(res.response.status).to.be.equal(500);
    });
  });

  it("negative: get Booking with indalid ID", () => {
    cy.getBookingById(undefined, false).then((res) => {
      expect(res.status).to.be.equal(404);
    });
  });

  it("negative: update Booking with invalid data", () => {
    const updatedBookingData = createBooking({ firstname: 123 });
    cy.fixture("api/get.booking.entity.schem.json").then((schema) => {
      cy.updateBookingById(BookingId, token, updatedBookingData, false).then(
        (res) => {
          expect(res.status).to.equal(500);
        },
      );
      cy.getBookingById(BookingId).then((res) => {
        cy.task("validateSchema", { schema, data: res.body }).should(
          "equal",
          true,
        );
        booking = res.body;
        expect(res.body).to.deep.equal(booking);
      });
    });
  });

  it.skip("negative: partually Update Booking with invalid data", () => {
    /*
    This case has been omitted due to a bug on the resource. See details in folder Bug Reports
  */

    cy.fixture("api/get.booking.entity.schem.json").then((schema) => {
      cy.partuallyUpdateBookingById(BookingId, token, {
        firstname: "null",
        depositpaid: null,
        totalprice: "undefined",
      }).then((res) => {
        cy.task("validateSchema", { schema, data: res.body }).should(
          "equal",
          true,
        );
        expect(res.body).to.deep.equal(booking);
      });
      cy.getBookingById(BookingId).then((res) => {
        cy.task("validateSchema", { schema, data: res.body }).should(
          "equal",
          true,
        );
        expect(res.body).to.deep.equal(booking);
      });
    });
  });

  it("delete Booking", () => {
    cy.deleteBookingByID(BookingId, token);
    cy.getBookingById(BookingId, false).then((res) => {
      expect(res.status).equal(404);
    });
  });
});
