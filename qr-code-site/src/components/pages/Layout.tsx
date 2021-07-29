import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faGithub } from "@fortawesome/free-brands-svg-icons";
import { Link, NavLink } from "react-router-dom";

const Layout: React.FC<{}> = (props) => {
  const githubIcon = <FontAwesomeIcon icon={faGithub} />;

  return (
    <div className="flex">
      <div className="max-w-sm w-full mx-auto md:mt-8">
        <div className="bg-white p-6 md:rounded-md">{props.children}</div>
        <div className="flex -mt-2 md:mt-4 flex-col text-gray-500 ">
          <div className="mx-auto text-sm">
            <a href="https://blog.pixegami.com">by pixegami</a>
          </div>
          <div className="mx-auto text-2xl mt-2">
            <a href="https://github.com/pixegami/qr-code-webapp">
              {githubIcon}
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Layout;
