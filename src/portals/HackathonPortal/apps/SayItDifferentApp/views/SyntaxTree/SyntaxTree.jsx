import { useEffect, useState } from "react";

export default function SyntaxTree({ posAnalyzer, text }) {
  const [syntaxTree, setSyntaxTree] = useState("");

  useEffect(() => {
    if (!text) {
      setSyntaxTree("");
    } else {
      posAnalyzer.fetchSyntaxTree(text).then(setSyntaxTree);
    }
  }, [posAnalyzer, text]);

  return (
    <textarea
      value={syntaxTree}
      readOnly
      style={{ width: "100%", height: "100%" }}
    />
  );
}
