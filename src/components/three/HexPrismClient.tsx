'use client'

import dynamic from "next/dynamic";
import HexPrismFallback from "./HexPrismFallback";

// Load Three.js only on client, never on server
const HexPrism = dynamic(() => import("./HexPrism"), {
  ssr: false,
  loading: () => <HexPrismFallback />,
});

export default function HexPrismClient() {
  return <HexPrism />;
}
