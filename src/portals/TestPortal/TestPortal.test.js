import { render, screen } from "@testing-library/react";
import ExamplePortal from "./ExamplePortal";

test("renders learn react link", () => {
  render(<ExamplePortal />);
  const linkElement = screen.getByText(/learn react/i);
  expect(linkElement).toBeInTheDocument();
});
