
from generate_qr_message_handler import GenerateQRMessageHandler
from get_qr_message_handler import GetQRMessageHandler
from api_utils import ApiEntrypoint


def handler(event, context=None):

    entry_point = (
        ApiEntrypoint()
        .with_handler(GenerateQRMessageHandler())
        .with_handler(GetQRMessageHandler())
    )

    return entry_point.handle(event, context)
