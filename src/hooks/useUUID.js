import { useRef } from "react";
import { v4 as uuidv4 } from "uuid";

/**
 * Creates a stable UUID for usage in React components and hooks.
 *
 * @return {string} i.e. '1b9d6bcd-bbfd-4b2d-9b5d-ab8dfbbd4bed'
 */
export default function useUUID() {
  const refUUID = useRef(uuidv4());

  return refUUID.current;
}
