import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Artistik Training & Kurse - Pepe Dome München | Luftakrobatik lernen im Ostpark",
  description: "Lernen Sie Luftakrobatik im Pepe Dome! Profi-Training, Open Training & Workshops für alle Level. 8,50m Kuppelhöhe, professionelle Ausstattung. Jetzt anmelden!",
  keywords: ["Artistik Training München", "Luftakrobatik Kurse", "Pepe Dome Training", "Ostpark", "Workshops", "Profi Training", "Open Training", "8,50m Höhe"],
};

export default function TrainingLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}