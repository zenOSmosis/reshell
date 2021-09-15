import requestDataChannelRoute from "./requestDataChannel.route";

// TODO: Document
export default function bindSocketAPIRoutes(socketAPI) {
  requestDataChannelRoute(socketAPI);
}
