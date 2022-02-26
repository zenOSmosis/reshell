import { render, screen } from "@testing-library/react";
import MSAzureHackathonPortal from "./MSAzureHackathonPortal";

test("renders learn react link", () => {
  render(<MSAzureHackathonPortal />);
  const linkElement = screen.getByText(/learn react/i);
  expect(linkElement).toBeInTheDocument();
});
