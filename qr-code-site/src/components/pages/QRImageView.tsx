import React from "react";
import { Link } from "react-router-dom";

interface QRImageViewProps {
  imageUrl: string;
  tag: string;
}

const QRImageView: React.FC<QRImageViewProps> = (props) => {
  const tag: string = props.tag;

  return (
    <div className="text-center">
      <h1 className="text-xl font-bold text-black mb-2">QR Message Code</h1>
      <div className="text-gray-600">Scan this code to see your message!</div>
      <div className="h-48 flex">
        <img
          alt="QR code for viewing the message"
          className="h-48 mx-auto"
          src={props.imageUrl}
        />
      </div>

      <div
        className="bg-blue-100 text-blue-700 
      p-2 rounded-md w-10/12 mx-auto mb-2 font-mono"
      >
        <Link className="hover:underline" to={"/view?tag=" + tag}>
          {tag}
        </Link>
      </div>
    </div>
  );
};

export default QRImageView;
