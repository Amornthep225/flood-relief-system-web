import "./globals.css";

export const metadata = {
  title: "Water Management Dashboard",
  description: "ระบบติดตามโครงการบริหารจัดการน้ำ"
};

export default function RootLayout({children}) {
  return (
    <html lang="th">
      <body>{children}</body>
    </html>
  );
}
