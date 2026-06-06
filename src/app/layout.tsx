import type { Metadata } from "next";
import "@/styles/globals.css";
import { Providers } from "@/providers/providers";
import { Toaster } from "@/components/ui/sonner";

export const metadata: Metadata = {
  title: "Syngate Senac",
  description: "Sistema de Controle de Acesso",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-BR" suppressHydrationWarning>
      <body className="antialiased">
        <Providers>
          {children}
          <Toaster richColors position="top-right" />
        </Providers>
      </body>
    </html>
  );
}