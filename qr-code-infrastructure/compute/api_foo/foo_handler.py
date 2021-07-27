from api_utils import api_response, ApiHandler


class FooHandler(ApiHandler):
    def __init__(self):
        super().__init__()
        self.operation_name = "foo"

    def handle_action(self, request_data: dict, event: dict, context: dict):
        response_payload = {
            "hello": "world"
        }

        return api_response(
            200,
            f"Successfully ran foo: {response_payload}",
            response_payload,
        )
