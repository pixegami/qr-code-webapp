import FooApi from "./FooApi";

beforeEach(async () => {
  // HTTP Adapter required to solve CORS error.
  // axios.defaults.adapter = require("axios/lib/adapters/http");

  // Set the timeout.
  jest.setTimeout(45000);
});

test("foo", async () => {
  // Token validation should succeed.
  const response = await FooApi.foo();
  console.log(response);

  expect(response.status).toBe(200);
  expect(response.payload).toHaveProperty("hello");
  expect(response.payload["hello"]).toBe("world");
});
