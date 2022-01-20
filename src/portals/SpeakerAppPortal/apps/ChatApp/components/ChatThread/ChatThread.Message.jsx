import { Row, Column } from "@components/Layout";
import Avatar from "@components/Avatar";
import Linkify from "@components/Linkify";
import dayjs from "dayjs";

// TODO: Move CSS styling to CSS module
// TODO: Add prop-types
// TODO: Document
export default function ChatThreadMessage({ avatarSrc, name, dateSent, body }) {
  return (
    <Row disableVerticalFill>
      <Column
        style={{
          maxWidth: 75,
          textAlign: "center",
        }}
      >
        {avatarSrc ? (
          <Avatar
            size={50}
            src={avatarSrc}
            name={name}
            style={{ margin: "0px auto" }}
          />
        ) : (
          <span>?</span>
        )}
      </Column>
      <Column>
        {
          // TODO: Remove hardcoding
        }
        <div style={{ fontSize: "1.2em" }}>
          <span style={{ fontWeight: "bold" }}>
            {name || <span style={{ fontStyle: "italic" }}>[ Unknown ]</span>}
          </span>{" "}
          <span style={{ opacity: ".5" }}>
            {dateSent && dayjs(dateSent).fromNow()}
          </span>
        </div>
        <div>
          <Linkify string={body} />
        </div>
      </Column>
    </Row>
  );
}
