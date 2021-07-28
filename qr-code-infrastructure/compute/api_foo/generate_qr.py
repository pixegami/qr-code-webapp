import uuid
import qrcode
import os


class QrResult:
    def __init__(self, url: str, image_path: str, qr_tag: str) -> None:
        self.image_path: str = image_path
        self.tag: str = qr_tag
        self.url: str = url

    def __str__(self):
        return f"[QrResult {self.tag}, {self.image_path}, {self.url}]"


def generate_qr(path: str) -> QrResult:
    qr_id = uuid.uuid4().hex[:12]
    qr_tag = f"qr-{qr_id}"
    content = f"https://qr.pixegami.com/view?tag={qr_tag}"

    qr_image = qrcode.make(content)
    image_path = os.path.join(path, f"{qr_tag}.png")
    qr_image.save(image_path)

    print(f"Generating tag: {qr_tag}")
    print(f"Generating image: {type(qr_image)}")
    return QrResult(url=content, image_path=image_path, qr_tag=qr_tag)
