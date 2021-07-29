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
  const MAX_MESSAGE_SIZE = 512;
  const currentMessageSize = props.message.length;

  const messageStyle =
    currentMessageSize == MAX_MESSAGE_SIZE ? "text-red-500" : "text-gray-400";

  const messageElement = (
    <div className={"text-right text-sm " + messageStyle}>
      {currentMessageSize}/{MAX_MESSAGE_SIZE}
    </div>
  );

  return (
    <div className="text-center">
      <h1 className="text-xl font-bold text-black mb-4">
        QR Message Generator
      </h1>
      <div className="w-full mb-6">
        <textarea
          className="border border-gray-400 mb-2 w-full p-4 rounded-md appearance-none"
          defaultValue={props.message}
          value={props.message}
          placeholder={"Type in a message and I'll make a QR code for it!"}
          onChange={(x) => {
            const newMessageSize = x.currentTarget.value.length;
            if (newMessageSize <= MAX_MESSAGE_SIZE) {
              props.setMessage(x.currentTarget.value);
            }
          }}
        />
        {messageElement}
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
