import StickyTable from "@components/StickyTable";

export default function PartOfSpeechTable({ partsOfSpeech }) {
  return (
    <StickyTable>
      <thead>
        <tr>
          <td>Index</td>
          <td>Word</td>
          <td>Tag</td>
          <td>Description</td>
        </tr>
      </thead>
      <tbody>
        {partsOfSpeech.map(({ word, partOfSpeech }, idx) => (
          <tr key={idx}>
            <td className="center">{idx + 1}</td>
            <td>{word}</td>
            <td>{partOfSpeech.tag}</td>
            <td>{partOfSpeech.description}</td>
          </tr>
        ))}
      </tbody>
    </StickyTable>
  );
}
