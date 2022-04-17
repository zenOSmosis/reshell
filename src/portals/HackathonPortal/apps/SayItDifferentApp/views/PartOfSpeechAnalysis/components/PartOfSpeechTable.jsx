import StickyTable from "@components/StickyTable";

export default function PartOfSpeechTable({ partsOfSpeech }) {
  return (
    <StickyTable>
      <thead>
        <tr>
          <td>Word</td>
          <td>Tag</td>
          <td>Description</td>
        </tr>
      </thead>
      <tbody>
        {partsOfSpeech.map(({ word, partOfSpeech }) => (
          <tr>
            <td>{word}</td>
            <td>{partOfSpeech.tag}</td>
            <td>{partOfSpeech.description}</td>
          </tr>
        ))}
      </tbody>
    </StickyTable>
  );
}
