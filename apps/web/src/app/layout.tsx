import type { Metadata, Viewport } from "next";

import "@scoreboard/ui/globals.css";
import BottomNav from "@/components/kinetic-bottom-nav";
import Header from "@/components/kinetic-header";
import Providers from "@/components/providers";

export const metadata: Metadata = {
    title: "Kinetic Terminal | Live Football Scores",
    description:
        "Advanced tactical data and real-time football scores. Live match tracking, league standings, and team analytics.",
};

export const viewport: Viewport = {
    width: "device-width",
    initialScale: 1,
    themeColor: "#0c0e0f",
};

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <html lang="en" className="dark" suppressHydrationWarning>
            <head>
                <link
                    href="https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@300..700&family=Inter:wght@300..700&family=Lexend:wght@300..700&display=swap"
                    rel="stylesheet"
                />
                <link
                    href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:wght,FILL@100..700,0..1&display=swap"
                    rel="stylesheet"
                />
            </head>
            <body className="bg-background text-foreground antialiased">
                <Providers>
                    <Header />
                    <main className="mx-auto max-w-7xl px-4 pt-24 pb-32 md:px-8">
                        {children}
                    </main>
                    <BottomNav />
                </Providers>
            </body>
        </html>
    );
}
