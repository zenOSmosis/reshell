import { render, screen } from "@testing-library/react";
import ReShellOrg from "./ReShell.org";

test("renders learn react link", () => {
  render(<ReShellOrg />);
  const linkElement = screen.getByText(/learn react/i);
  expect(linkElement).toBeInTheDocument();
});
