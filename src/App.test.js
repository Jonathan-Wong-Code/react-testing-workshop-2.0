import React from "react";
import { render, fireEvent, wait, cleanup } from "@testing-library/react";
import App from "./App";
import "./setupTests";
import axios from "axios";

jest.mock("axios");

const response = {
  data: {
    name: "Pikachu",
    sprites: { front_default: "wwww.testImage.com" }
  }
};

afterEach(cleanup);

describe("<App />", () => {
  it("renders", () => {
    const { container, getByTestId } = render(<App />); // We use getByTestId to get our component by it's ID.
    expect(container).toMatchSnapshot(); // container gives us a picture of the whole App Component.

    const appContainer = getByTestId("app-container");
    expect(appContainer).toBeDefined(); // We can assert container has rendered. Usually it renders is fine though.
  });

  it("should NOT render the error to start", () => {
    const { queryByTestId } = render(<App />);
    expect(queryByTestId("error")).toBeNull(); // We use query to assert "nullness" or else throws error
  });

  it("Should render the header text", () => {
    const { getByTestId } = render(<App />);
    const header = getByTestId("header");

    expect(header).toHaveTextContent("Pokemon Searcher!");
    expect(header).toHaveTextContent("Searcher!"); // Can have any part of the text included

    expect(header.textContent).toBe("Pokemon Searcher!"); // Better for an exact match.

    expect(header).not.toHaveTextContent("It's a turtle!");
  });

  it("Should have an input the user can type into", async () => {
    const { getByLabelText, getByText } = render(<App />);

    const input = getByLabelText("Enter pokemon name:");
    const button = getByText("Search");

    expect(button).toHaveAttribute("disabled"); // Get attribute to assert any normal HTML attribute.

    fireEvent.change(input, { target: { value: "Pikachu" } }); // We use fireEvent to sim events.

    expect(input).toHaveValue("Pikachu"); // To have value asserts values on inputs.
    expect(button).not.toHaveAttribute("disabled");
  });

  it("Searches successfully when the user searches.", async () => {
    const {
      getByLabelText,
      getByText,
      getByTestId,
      getByAltText,
      queryByTestId
    } = render(<App />);

    axios.get.mockImplementation(() => Promise.resolve(response)); // Mock out a successful axios call.

    const input = getByLabelText("Enter pokemon name:");
    const button = getByText("Search");
    fireEvent.change(input, { target: { value: "Pikachu" } });

    fireEvent.click(button); // Simualte the search button being clicked.

    await wait(() => {
      // use await wait to let the asynchronicity play out.
      const image = getByAltText("Pikachu");
      expect(getByTestId("result")).toBeDefined(); // Assert the result renders
      expect(queryByTestId("error")).toBeNull(); // Assert the error message does not render
      expect(image).toHaveAttribute("src", response.data.sprites.front_default); // Assert correct image src just for fun.
      // I normally would be happy just with result rendering but more practise!
    });
  });

  it("Throws an error when the user searches", async () => {
    const { getByLabelText, getByText, getByTestId, queryByTestId } = render(
      <App />
    );

    axios.get.mockImplementation(() => Promise.reject(new Error())); // Mock out bad request.

    const input = getByLabelText("Enter pokemon name:");
    const button = getByText("Search");

    fireEvent.change(input, { target: { value: "hello" } });
    fireEvent.click(button);

    await wait(() => {
      expect(queryByTestId("result")).toBeNull(); // Assert result does not render.
      expect(getByTestId("error")).toBeDefined(); // Assert error renders.
    });
  });

  // **** BONUS Jest-styled-components *****//

  it("renders H1 with the appropriate font-size", () => {
    const { getByTestId } = render(<App />);
    const header = getByTestId("header");

    expect(header).toHaveStyleRule("font-size", "20px");
    expect(header).toHaveStyleRule("font-size", "36px", {
      media: "screen and (min-width: 768px)" // MUST match exact wording of media query
    });
    expect(header).toHaveStyleRule("color", "red", {
      modifier: "&:hover"
    });
  });
});
