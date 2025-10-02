import React from "react";

function Loading() {
  return (
    <div className="flex justify-center items-center mt-10">
      <div className="w-16 h-16 border-4 border-purple-600 border-t-transparent border-solid rounded-full animate-spin"></div>
    </div>
  );
}

export default Loading;
