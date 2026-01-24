import createBooking from "../../support/api/factories/booking.factory";
// const toISODate = (d) => d.toISOString().split("T")[0];
const toISODate = (d) => {
  if (!d) throw new Error("toISODate: date is undefined/null");
  if (d instanceof Date) return d.toISOString().split("T")[0];
  if (typeof d === "string") return d.split("T")[0]; // "YYYY-MM-DD" или ISO
  throw new Error(`toISODate: unsupported type ${typeof d}`);
};

describe("Booking spec", () => {
  let booking;
  let BookingId;
  let token;
  before(() => {
    booking = createBooking();
    cy.fixture("api/get.bookings.entity.schem.json").as("getBookingsSchema");
    cy.login({ username: "admin", password: "password123" }).then((itm) => {
      token = itm;
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
          BookingId = res.bookingid;
          cy.task("validateSchema", { schema: createBookingSchema, data: res });
          cy.fixture("api/get.booking.entity.schem.json").then((schema) => {
            cy.getBookingById(res.bookingid).then((res) => {
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

  it("delete Booking", () => {
    cy.deleteBookingByID(BookingId, token);
    cy.getBookingById(BookingId, false).then((res) => {
      expect(res.status).equal(404);
    });
  });
});
