import React from "react";

const Layout: React.FC<{}> = (props) => {
  return (
    <div className="flex">
      <div
        className="max-w-sm w-full mx-auto 
        md:mt-8 bg-white p-6 md:rounded-md"
      >
        {props.children}
      </div>
    </div>
  );
};

export default Layout;
