import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface ThemeStore {
  isDark: boolean;
  toggleTheme: () => void;
}

export const useThemeStore = create<ThemeStore>()(
  persist(
    (set, get) => ({
      isDark: true,
      toggleTheme: () => {
        const next = !get().isDark;
        set({ isDark: next });
        if (next) {
          document.documentElement.classList.remove('light');
        } else {
          document.documentElement.classList.add('light');
        }
      },
    }),
    { name: 'cravebite-theme' }
  )
);

// Apply theme on initial load from persisted state
const stored = JSON.parse(localStorage.getItem('cravebite-theme') || '{}');
if (stored?.state?.isDark === false) {
  document.documentElement.classList.add('light');
}
