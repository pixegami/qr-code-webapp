from api_utils import ApiItem


class QrItem(ApiItem):
    def __init__(self, tag: str = ""):
        super().__init__()
        self.pk = tag
        self.message: str = ""
        self.sk = "QR_ITEM"

    def serialize(self) -> dict:
        data = {"message": self.message}
        data.update(self.basic_keys())
        return data

    def deserialize(self, item: dict) -> "QrItem":
        self.pk = str(item.get("pk"))
        self.sk = str(item.get("sk"))
        self.message = str(item.get("message"))
        return self
