import Full from "@components/Full";
import styles from "./Notes.module.css";

// https://csslayout.io/patterns/lined-paper/

const Notes = {
  id: "notes",
  title: "Notes",
  style: {
    left: "auto",
    bottom: 0,
    width: 640,
    height: 480,
  },
  view: function View() {
    return (
      <Full className={styles["notes"]}>
        Cascading Style Sheets (CSS) is a style sheet language used for
        describing the presentation of a document written in a markup language
        like HTML. CSS is a cornerstone technology of the World Wide Web,
        alongside HTML and JavaScript.
        <span style={{ float: "right" }}>— Wikipedia</span>
      </Full>
    );
  },
};

export default Notes;
