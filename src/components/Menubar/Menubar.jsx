import Menu from "../Menu";

// @see https://www.electronjs.org/docs/api/menu#examples

// TODO: Document
export default function Menubar({ menuData = [] }) {
  // TODO: Remove
  console.log({ menuData });

  // TODO: Determine if overflown, and adjust as necessary

  // TODO: Dynamically render menu based on data
  return (
    <div>
      {menuData.map((predicate, idx) => (
        <Menu key={idx} menuData={predicate} />
      ))}
    </div>
  );
}
