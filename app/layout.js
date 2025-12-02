import './globals.css'

export const metadata = {
  title: 'E-Commerce Order System',
  description: 'E-Commerce Order Processing System',
}

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  )
}