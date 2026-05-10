import "./globals.css";

export const metadata = {
  title: "CZN Save Data Lab",
  description:
    "A fan-made Chaos Zero Nightmare Save Data calculator with lightweight 3D animation."
};

export default function RootLayout({ children }) {
  return (
    <html lang="th">
      <body>{children}</body>
    </html>
  );
}
