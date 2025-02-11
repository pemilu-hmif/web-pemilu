import React from "react";

type DialogBoxProps = {
  title: string;
  message: string;
  onConfirm: () => void;
  onCancel: () => void;
};

const DialogBox: React.FC<DialogBoxProps> = ({ title, message, onConfirm, onCancel }) => {
  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
      <div className="bg-white rounded-lg shadow-xl p-6 w-11/12 sm:w-96">
        <h2 className="text-lg font-bold text-gray-800">{title}</h2>
        <p className="mt-2 text-gray-600">{message}</p>
        <div className="mt-4 flex justify-end gap-4">
          <button
            className="px-4 py-2 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300 transition"
            onClick={onCancel}
          >
            Cancel
          </button>
          <button
            className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition"
            onClick={onConfirm}
          >
            Confirm
          </button>
        </div>
      </div>
    </div>
  );
};

export default DialogBox;
