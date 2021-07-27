import ApiResponse from "../../util/base_api/ApiResponse";

export interface FooResponse extends ApiResponse {}

export const withFooResponse = (
  promise: Promise<ApiResponse>
): Promise<FooResponse> => {
  return new Promise<FooResponse>((resolve, reject) => {
    promise
      .then((apiResponse) => {
        const authResponse: FooResponse = {
          ...apiResponse,
        };
        resolve(authResponse);
      })
      .catch(reject);
  });
};
