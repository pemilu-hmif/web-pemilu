import React from "react";

type DialogBoxErrorProps = {
  title: string;
  message: string;
  onConfirm: () => void;
};

const DialogBoxError: React.FC<DialogBoxErrorProps> = ({
  title,
  message,
  onConfirm,
}) => {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <div className="w-11/12 rounded-lg bg-white p-6 shadow-xl sm:w-96">
        <h2 className="text-lg font-bold text-gray-800">{title}</h2>
        <p className="mt-2 text-gray-600">{message}</p>
        <div className="mt-4 flex justify-end gap-4">
          <button
            className="rounded-lg bg-blue-500 px-4 py-2 text-white transition hover:bg-blue-600"
            onClick={onConfirm}
          >
            Confirm
          </button>
        </div>
      </div>
    </div>
  );
};

export default DialogBoxError;
