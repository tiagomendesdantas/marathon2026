import type { ReactNode } from 'react';

interface LayoutProps {
  children: ReactNode;
  darkMode: boolean;
  onToggleDark: () => void;
}

export function Layout({ children, darkMode, onToggleDark }: LayoutProps) {
  return (
    <div className={darkMode ? 'dark' : ''}>
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-gray-100">
        <header className="bg-white dark:bg-gray-800 shadow-sm pt-[env(safe-area-inset-top)]">
          <div className="max-w-6xl mx-auto px-[max(1rem,env(safe-area-inset-left))] py-4 flex items-center justify-between">
            <div>
              <h1 className="text-xl font-bold text-gray-900 dark:text-white">Marathon 2026</h1>
              <p className="text-sm text-gray-500 dark:text-gray-400">26 weeks to 42.2 km</p>
            </div>
            <button
              onClick={onToggleDark}
              className="p-2 rounded-lg bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
              aria-label="Toggle dark mode"
            >
              {darkMode ? '☀️' : '🌙'}
            </button>
          </div>
        </header>
        <main className="max-w-6xl mx-auto px-[max(1rem,env(safe-area-inset-left))] py-6 pb-[env(safe-area-inset-bottom)]">{children}</main>
      </div>
    </div>
  );
}
