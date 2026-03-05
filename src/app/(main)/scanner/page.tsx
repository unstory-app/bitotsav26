import ScannerContent from "./ScannerContent";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Scanner Console | BITOTSAV '26",
  description: "Official Gate Validation Protocol for BITOTSAV '26 Organizers.",
  robots: {
    index: false,
    follow: false,
  },
};

export default function ScannerPage() {
  return <ScannerContent />;
}
