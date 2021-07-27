
from foo_handler import FooHandler
from api_utils import ApiEntrypoint


def handler(event, context=None):

    entry_point = (
        ApiEntrypoint()
        .with_handler(FooHandler())
    )

    return entry_point.handle(event, context)
