import React from "react";

const BoxStyling: React.FC<{}> = ({ children }) => {
  return <div className="bg-white p-4 py-6 mb-4 rounded-md">{children}</div>;
};

const withBoxStyling =
  (Component: any) =>
  ({ ...props }) =>
    (
      <BoxStyling>
        <Component {...props} />
      </BoxStyling>
    );

export default withBoxStyling;
