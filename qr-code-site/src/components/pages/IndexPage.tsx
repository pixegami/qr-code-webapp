import React from "react";
import FooApi from "../foo/api/FooApi";

interface IndexPageProps {}

const IndexPage: React.FC<IndexPageProps> = (props) => {
  const [message, setMessage] = React.useState<string>("");
  const [imageUrl, setImageUrl] = React.useState<string>("");

  const generateQrMessage = () => {
    FooApi.generateQRFromMessage(message).then((r) => {
      console.log(r);
      const presignedUrl: string = r.payload["presigned_url"];
      setImageUrl(presignedUrl);
    });
  };

  let interactiveElement = null;

  if (imageUrl) {
    interactiveElement = <img src={imageUrl} />;
  } else {
    interactiveElement = (
      <div>
        <div className="text-2xl mb-4">This is the index page</div>
        <div>
          <textarea
            className="border border-black"
            defaultValue={message}
            onChange={(x) => setMessage(x.currentTarget.value)}
          />
        </div>
        <div>
          <button onClick={generateQrMessage}>Send</button>
        </div>
      </div>
    );
  }

  return <div>{interactiveElement}</div>;
};

export default IndexPage;
