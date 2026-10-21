import "./globals.css";

export const metadata = {
  title: "Georgia News Digest",
  description:
    "English-language news on Georgia (the country), collected daily from official and international sources.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className="bg-neutral-50 text-neutral-900 min-h-screen">
        {children}
      </body>
    </html>
  );
}
