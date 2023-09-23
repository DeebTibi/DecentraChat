import "./globals.css";
export const metadata = {
  title: "DecentraChat",
  description: "An app where no user is in control of a group",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
