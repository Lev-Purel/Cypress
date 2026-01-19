const generateId = () => {
  if (globalThis.crypto?.randomUUID) return globalThis.crypto.randomUUID();
  return `${Date.now()}-${Math.random().toString(16).slice(2, 10)}`;
};

const createUser = (overrides = {}) => {
  const id = generateId();
  return {
    id: Date.now(),
    username: `User${id.slice(0, 5)}`,
    firstName: "Cypress",
    lastName: "Test Engineer",
    email: `user_${id}@ur.company.com`,
    password: "SecretSauce",
    phone: "+1893406789",
    userStatus: 0,
    ...overrides,
  };
};

export default createUser;
