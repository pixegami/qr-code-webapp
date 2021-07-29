import React from "react";
import { useLocation } from "react-router-dom";
import FooApi from "../foo/api/FooApi";

interface ViewPageProps {}

function useQuery() {
  return new URLSearchParams(useLocation().search);
}

const ViewPage: React.FC<ViewPageProps> = (props) => {
  const [message, setMessage] = React.useState("no message");
  const query = useQuery();
  const tag = query.get("tag");

  React.useEffect(() => {
    if (tag) {
      FooApi.getMessageFromTag(tag).then((r) => {
        setMessage(r.payload["message"]);
      });
    }
  }, []);

  return (
    <div className="text-2xl mt-48">
      This is the view page. The tag is {tag}. Loaded message: {message}
    </div>
  );
};

export default ViewPage;
