import React from "react";
import { render, cleanup, fireEvent } from "@testing-library/react";
import { sayHelloAgain } from "../../utils";
import SayHello from "..";

// Allows us to mock and write mock implementations for all imports coming from this file path.
jest.mock("../../utils");

// Set our two functions to jest mock functions by calling jest.fn();
sayHelloAgain.mockImplementation(() => jest.fn());
const sayHello = jest.fn();

beforeEach(() => {
  // Resets each mock function so that it calls the right number of times in the test-dom;
  jest.clearAllMocks();
});

afterEach(cleanup);

describe("<SayHello />", () => {
  it("renders", () => {
    render(<SayHello sayHello={sayHello} />);
  });

  it("Calls our sayHello and sayHelloAgain function when the button is pressed", () => {
    const { getByTestId } = render(<SayHello sayHello={sayHello} />);
    const button = getByTestId("hello-button");
    fireEvent.click(button);
    // Assert that each function has been called 1 time when the button is pushed.
    expect(sayHello).toHaveBeenCalledTimes(1);
    expect(sayHelloAgain).toHaveBeenCalledTimes(1);
  });
});
