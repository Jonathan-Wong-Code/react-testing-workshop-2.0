import React from "react";
// Import sayHelloAgain that console logs sayHelloAgain
import { sayHelloAgain } from "../utils";

// Say Hello is defined in the parent function and console.logs hello
export default function SayHello({ sayHello }) {
  // On click fires our two functions.
  const onClick = () => {
    sayHello();
    sayHelloAgain();
  };

  return (
    <div>
      <button onClick={onClick} data-testid="hello-button">
        Say Hello
      </button>
    </div>
  );
}
