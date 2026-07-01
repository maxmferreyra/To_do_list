import "./globals.css";

export const metadata = {
  title: "Task Tracker",
  description: "Control de tareas de trabajo",
};

export default function RootLayout({ children }) {
  return (
    <html lang="es">
      <body>{children}</body>
    </html>
  );
}
