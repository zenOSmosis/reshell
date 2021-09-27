import { useState } from "react";
import Layout, { Header, Content, Footer } from "@components/Layout";
import Full from "@components/Full";
import styles from "./Notes.module.css";

// https://csslayout.io/patterns/lined-paper/

// TODO: [English syntax parsing [server-side; when feature is included to build out SEO for applications / portal]; maybe for different text-processing app] See https://github.com/retextjs/retext/tree/main/packages/retext-english

const Notes = {
  id: "notes",
  title: "Notes",
  style: {
    width: 640,
    height: 480,
  },
  view: function View() {
    const [content, setContent] = useState("");

    // TODO: Implement ability to change rendering engine (i.e. code view, etc.)

    return (
      <Layout>
        <Header>Known issue: Background doesn't scroll w/ Firefox</Header>
        <Content>
          <Full>
            <textarea
              onChange={evt => setContent(evt.target.value)}
              className={styles["notes"]}
              value={content}
              style={{ width: "100%", height: "100%", border: 0 }}
            />
          </Full>
        </Content>
        <Footer style={{ textAlign: "right" }}>
          Character count: {content.length}
        </Footer>
      </Layout>
    );
  },
};

export default Notes;
