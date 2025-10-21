import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Profitraining - Pepe Dome München | Zeitgenössischer Zirkus Training im Ostpark",
  description: "Profitraining im zeitgenössischen Zirkus täglich 10-14 Uhr im Pepe Dome. Künstler:innen treffen sich zum gemeinsamen Training und kreativen Austausch. 8,50m Kuppelhöhe.",
  keywords: ["Profitraining München", "zeitgenössischer Zirkus", "Pepe Dome Training", "Ostpark", "Künstler Training", "Artistik", "8,50m Höhe"],
};

export default function TrainingLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}