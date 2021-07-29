import React from "react";
import FooApi from "../foo/api/FooApi";
import Layout from "./Layout";
import QRImageView from "./QRImageView";
import TextInputView from "./TextInputView";

interface IndexPageProps {}

const IndexPage: React.FC<IndexPageProps> = (props) => {
  const [message, setMessage] = React.useState<string>("");
  const [imageUrl, setImageUrl] = React.useState<string>("");
  const [tag, setTag] = React.useState<string>("");
  const [isLoading, setIsLoading] = React.useState(false);

  const generateQrMessage = () => {
    setIsLoading(true);
    FooApi.generateQRFromMessage(message).then((r) => {
      console.log(r);
      const presignedUrl: string = r.payload["presigned_url"];
      const tag: string = r.payload["tag"];
      setTag(tag);
      setImageUrl(presignedUrl);
    });
  };

  let interactiveElement = null;

  if (imageUrl) {
    interactiveElement = <QRImageView imageUrl={imageUrl} tag={tag} />;
  } else {
    interactiveElement = (
      <TextInputView
        message={message}
        setMessage={setMessage}
        generateQrMessage={generateQrMessage}
        isLoading={isLoading}
      />
    );
  }

  return <Layout>{interactiveElement}</Layout>;
};

export default IndexPage;
