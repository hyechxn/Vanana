import React, { useState } from "react";

export default function ClickCounter() {
  const [count, setCount] = useState(0);

  return (
    <div className="min-h-screen bg-black flex flex-col items-center justify-center text-white">
      <div className="absolute top-8 text-4xl font-bold">{count}</div>
      <div className="flex justify-center items-center w-full">
        <img
          src="public\Vanana.png"
          alt="Clickable"
          onClick={() => setCount(count + 1)}
          className="cursor-pointer hover:scale-105 transition-transform"
        />
      </div>
    </div>
  );
}
