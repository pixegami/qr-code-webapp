import React from "react";

interface TextInputViewProps {
  message: string;
  setMessage(x: string): void;
  generateQrMessage: any;
  isLoading: boolean;
}

const TextInputView: React.FC<TextInputViewProps> = (props) => {
  const buttonText: string = props.isLoading ? "Loading" : "Generate";
  const buttonStyle: string = props.isLoading ? "opacity-60 " : "";

  return (
    <div className="text-center">
      <h1 className="text-xl font-bold text-black mb-4">
        QR Message Generator
      </h1>
      <div className="w-full">
        <textarea
          className="border border-gray-400 mb-6 w-full p-4 rounded-md appearance-none"
          defaultValue={props.message}
          placeholder={"Type in a message and I'll make a QR code for it!"}
          onChange={(x) => props.setMessage(x.currentTarget.value)}
        />
      </div>
      <div>
        <button
          className={
            buttonStyle +
            "bg-green-600 text-white p-2 w-full rounded-md font-bold"
          }
          onClick={props.generateQrMessage}
          disabled={props.isLoading}
        >
          {buttonText}
        </button>
      </div>
    </div>
  );
};

export default TextInputView;
