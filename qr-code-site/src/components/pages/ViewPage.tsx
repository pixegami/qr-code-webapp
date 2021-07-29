import React from "react";
import { Link, useLocation } from "react-router-dom";
import FooApi from "../foo/api/FooApi";
import Layout from "./Layout";

interface ViewPageProps {}

function useQuery() {
  return new URLSearchParams(useLocation().search);
}

const ViewPage: React.FC<ViewPageProps> = (props) => {
  const [isLoading, setIsLoading] = React.useState(true);
  const [isError, setIsError] = React.useState(false);
  const [message, setMessage] = React.useState("no message");
  const query = useQuery();
  const tag = query.get("tag");

  React.useEffect(() => {
    if (tag) {
      FooApi.getMessageFromTag(tag)
        .then((r) => {
          setIsLoading(false);
          setMessage(r.payload["message"]);
        })
        .catch((r) => {
          setIsLoading(false);
          setIsError(true);
        });
    } else {
      setIsLoading(false);
      setIsError(true);
    }
  }, [tag]);

  let messageElement = null;

  if (isError) {
    messageElement = (
      <div className="text-red-500">Error: Unable to load message!</div>
    );
  } else {
    if (isLoading) {
      messageElement = <div className="text-xl text-gray-500">Loading...</div>;
    } else {
      messageElement = (
        <div className="text-xl font-bold text-gray-800">{message}</div>
      );
    }
  }

  return (
    <Layout>
      {messageElement}
      <div className="border-t pt-4 flex mt-6 justify-between text-sm text-gray-500">
        <div className="font-mono">{tag}</div>
        <Link className="text-blue-500" to="/">
          Back
        </Link>
      </div>
    </Layout>
  );
};

export default ViewPage;
