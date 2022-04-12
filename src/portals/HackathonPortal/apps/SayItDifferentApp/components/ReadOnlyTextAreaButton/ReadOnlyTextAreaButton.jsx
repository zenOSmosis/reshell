import ContentButton from "@components/ContentButton";

export default function ReadOnlyTextAreaButton({ title, value, onClick }) {
  return (
    <ContentButton onClick={onClick}>
      <label>{title}</label>
      <textarea
        readOnly
        value={value}
        style={{ backgroundColor: "rgba(0,0,0,.2)" }}
      />
    </ContentButton>
  );
}
