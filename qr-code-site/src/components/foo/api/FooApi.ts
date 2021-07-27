import BaseApi from "../../util/base_api/BaseApi";
import { FooResponse, withFooResponse } from "./FooResponse";

class FooApi extends BaseApi {
  protected static getEndpoint(): string {
    return "https://api.qr.pixegami.com/foo";
  }

  public static foo(): Promise<FooResponse> {
    return this.call("foo", {});
  }

  private static call(apiName: string, params: any): Promise<FooResponse> {
    const responsePromise = this.getRequest(apiName, params);
    return withFooResponse(responsePromise);
  }
}

export default FooApi;
