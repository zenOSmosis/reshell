import { render, screen } from "@testing-library/react";
import SpeakerAppPortal from "./SpeakerAppPortal";

test("renders learn react link", () => {
  render(<SpeakerAppPortal />);
  const linkElement = screen.getByText(/learn react/i);
  expect(linkElement).toBeInTheDocument();
});
