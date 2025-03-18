// app/layout.tsx
import './globals.css';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Homepage | Borrowlogy',
  description: 'Borrowing your Biology Lab Materials made easier!',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head>
        {/* Google Fonts */}
        <link
          href="https://fonts.googleapis.com/css2?family=Kumbh+Sans:wght@100..900&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="bg-white">{children}</body>
    </html>
  );
}
