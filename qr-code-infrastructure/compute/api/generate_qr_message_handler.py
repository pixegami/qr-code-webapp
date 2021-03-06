from api_utils import api_response, ApiHandler, ApiDatabase
from api_utils.api_exception import ApiException
from generate_qr import generate_qr
from qr_item import QrItem
import boto3
import os


class GenerateQRMessageHandler(ApiHandler):
    def __init__(self):
        super().__init__()
        self.operation_name = "generate_qr_message"
        self.schema = {"message"}
        self.database = ApiDatabase(os.environ["TABLE_NAME"])

    def handle_action(self, request_data: dict, event: dict, context: dict):

        message = request_data["message"]
        qr_result = generate_qr("/tmp")

        # If message is too long, fail.
        if len(message) > 512:
            raise ApiException(400, "Message is too long. Max size is 512 characters.")

        # Put the image into the bucket and return the URL.
        bucket_name = os.environ["IMAGE_BUCKET_NAME"]
        key = f"{qr_result.tag}.png"
        s3client = boto3.client("s3")
        s3client.upload_file(qr_result.image_path, bucket_name, key)

        # Generate a pre-signed S3 URL.
        presigned_url = s3client.generate_presigned_url(
            "get_object",
            Params={"Bucket": bucket_name, "Key": key},
            ExpiresIn=3600,
        )

        # Put an entry into the table (qr-code to message).
        item = QrItem()
        item.pk = qr_result.tag
        item.message = message
        self.database.put_item(item)

        # Assemble the response.
        response_payload = {
            "presigned_url": presigned_url,
            "tag": qr_result.tag
        }

        return api_response(
            200,
            f"Successfully generated QR Code!",
            response_payload,
        )
