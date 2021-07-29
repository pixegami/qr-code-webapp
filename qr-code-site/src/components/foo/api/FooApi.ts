import BaseApi from "../../util/base_api/BaseApi";
import { FooResponse, withFooResponse } from "./FooResponse";

class FooApi extends BaseApi {
  protected static getEndpoint(): string {
    return "https://api.qr.pixegami.com/qr";
  }

  public static generateQRFromMessage(message: string): Promise<FooResponse> {
    return this.call("generate_qr_message", { message });
  }

  public static getMessageFromTag(tag: string): Promise<FooResponse> {
    return this.call("get_qr_message", { tag });
  }

  private static call(apiName: string, params: any): Promise<FooResponse> {
    const responsePromise = this.getRequest(apiName, params);
    return withFooResponse(responsePromise);
  }
}

export default FooApi;
