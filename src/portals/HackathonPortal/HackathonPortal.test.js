import { render, screen } from "@testing-library/react";
import HackathonPortal from "./HackathonPortal";

test("renders learn react link", () => {
  render(<HackathonPortal />);
  const linkElement = screen.getByText(/learn react/i);
  expect(linkElement).toBeInTheDocument();
});
