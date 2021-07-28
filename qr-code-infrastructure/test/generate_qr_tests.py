from compute.api_foo.generate_qr import generate_qr
import os
import shutil

TEST_IMAGE_DIRECTORY = "./test/images"


def setup():
    os.makedirs(TEST_IMAGE_DIRECTORY, exist_ok=True)


def teardown():
    # shutil.rmtree(TEST_IMAGE_DIRECTORY)
    pass


def test_can_generate_qr():
    result = generate_qr("Hello world", TEST_IMAGE_DIRECTORY)
    print(result)
    pass