import Center from "@components/Center";
import LoadingSpinner from "@components/LoadingSpinner";

export default function PortalLoadingIndicator() {
  return (
    <Center style={{ fontWeight: "bold" }}>
      <div>
        <LoadingSpinner />
      </div>
      <div>Loading portal</div>
    </Center>
  );
}
