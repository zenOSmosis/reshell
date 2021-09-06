import Menu from "../Menu";

// @see https://www.electronjs.org/docs/api/menu#examples

// TODO: Document
// TODO: Add prop-types
export default function Menubar({ menuData = [] }) {
  // TODO: Automatically open hovered-over menu buttons if another menu is currently open

  // TODO: Remove
  console.log({ menuData });

  // TODO: Determine if overflown, and adjust as necessary

  // TODO: Dynamically render menu based on data
  return (
    <div style={{ whiteSpace: "nowrap" }}>
      {menuData.map((predicate, idx) => (
        <Menu key={idx} menuData={predicate} />
      ))}
    </div>
  );
}
