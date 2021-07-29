import FooApi from "./FooApi";
import { v4 as uuidv4 } from "uuid";

beforeEach(async () => {
  // HTTP Adapter required to solve CORS error.
  // axios.defaults.adapter = require("axios/lib/adapters/http");

  // Set the timeout.
  jest.setTimeout(45000);
});

test("can generate and get qr message", async () => {
  const message: string = "Hello this is a unique message: " + uuidv4();
  const generateMessageResponse = await FooApi.generateQRFromMessage(message);
  console.log(generateMessageResponse);
  expect(generateMessageResponse.status).toBe(200);
  expect(generateMessageResponse.payload).toHaveProperty("tag");

  const tag = generateMessageResponse.payload["tag"];
  const getMessageResponse = await FooApi.getMessageFromTag(tag);
  console.log(getMessageResponse);
  expect(getMessageResponse.status).toBe(200);
  expect(getMessageResponse.payload).toHaveProperty("message");
  expect(getMessageResponse.payload["message"]).toBe(message);
});
