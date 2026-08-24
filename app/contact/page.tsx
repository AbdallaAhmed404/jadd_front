import ContactFormView from "@/src/components/sections/ContactFormView";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Contact",
  description: "Initialize communication with the Scarabix technical node.",
};

export default function ContactPage() {
  return (
    <main>
      <ContactFormView />
    </main>
  );
}
