import type { Metadata } from 'next';
import '@/css/styles.css';
import '@/components/keenicons/assets/styles.css';
import { StoreProvider } from '@/providers/store-provider';
import { ThemeProvider } from '@/providers/theme-provider';
import { SettingsProvider } from '@/providers/settings-provider';

export const metadata: Metadata = {
  title: 'Metronic Dashboard',
  description: 'Metronic Admin Dashboard',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className="flex min-h-screen flex-col">
        <StoreProvider>
          <SettingsProvider>
            <ThemeProvider>
              {children}
            </ThemeProvider>
          </SettingsProvider>
        </StoreProvider>
      </body>
    </html>
  );
}
