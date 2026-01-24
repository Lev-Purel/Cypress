const createBooking = (overrides = {}) => {
  const id = generateId();
  const checkin = getRandomFutureCheckinDate();
  const checkout = getRandomCheckoutDate(checkin);
  return {
    firstname: `Jim ${id.slice(0, 5)}`,
    lastname: `Brown ${id.slice(0, 5)}`,
    totalprice: getRandomInt1to1000(),
    depositpaid: getRandomBoolean(),
    bookingdates: {
      checkin,
      checkout,
    },
    additionalneeds: getRandomArrayItem(additionalneedsArray),
    ...overrides,
  };
};

export default createBooking;

function getRandomInt1to1000() {
  return Math.floor(Math.random() * 1000) + 1;
}
function getRandomBoolean() {
  return Math.random() < 0.5;
}
function getRandomFutureCheckinDate(maxDaysAhead = 365) {
  const today = new Date();

  const checkin = new Date(today);
  checkin.setDate(today.getDate() + 1);

  const randomDays = Math.floor(Math.random() * maxDaysAhead);
  checkin.setDate(checkin.getDate() + randomDays);

  return checkin;
}
function getRandomCheckoutDate(checkinDate, maxStayDays = 14) {
  if (!(checkinDate instanceof Date)) {
    throw new Error("checkinDate must be a Date");
  }

  const checkout = new Date(checkinDate);
  checkout.setDate(checkout.getDate() + 1);

  const randomDays = Math.floor(Math.random() * maxStayDays);
  checkout.setDate(checkout.getDate() + randomDays);

  return checkout;
}
const generateId = () => {
  if (globalThis.crypto?.randomUUID) return globalThis.crypto.randomUUID();
  return `${Date.now()}-${Math.random().toString(16).slice(2, 10)}`;
};

const additionalneedsArray = [
  "Breakfast",
  "Dinner",
  "Bag Storage",
  "Hair dryer",
  "Late check-in",
];

function getRandomArrayItem(arr) {
  return arr[Math.floor(Math.random() * arr.length)];
}
