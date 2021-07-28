from api_utils import api_response, ApiHandler, ApiDatabase
from qr_item import QrItem
import os


class GetQRMessageHandler(ApiHandler):
    def __init__(self):
        super().__init__()
        self.operation_name = "get_qr_message"
        self.schema = {"tag"}
        self.database = ApiDatabase(os.environ["TABLE_NAME"])

    def handle_action(self, request_data: dict, event: dict, context: dict):

        tag = request_data["tag"]

        # Put an entry into the table (qr-code to message).
        serialized_item = self.database.get_item(QrItem(tag))
        item = QrItem().deserialize(serialized_item)
        message = item.message

        # Assemble the response.
        response_payload = {"message": message}

        return api_response(
            200,
            f"Successfully retrieved QR message!",
            response_payload,
        )
