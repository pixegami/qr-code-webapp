from typing import Union


class ApiRequestResponse:
    def __init__(self, status: int, data: dict):
        self.status = status
        self.data = data
        self._payload = data.get("payload", None)
        self._token = (
            None if self._payload is None else self._payload.get("token", None)
        )

    def get_token(self) -> str:
        assert self._token is not None
        return self._token

    def get_payload(self) -> dict:
        assert self._payload is not None
        return self._payload

    def from_payload(self, key: str) -> Union[str, float, int, bool]:
        assert key in self.get_payload()
        value = self.get_payload().get(key)
        assert value is not None
        return value