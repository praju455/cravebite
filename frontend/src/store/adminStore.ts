import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface AdminState {
  admin: { id: number; name: string; email: string } | null;
  token: string | null;
  setAdmin: (admin: any, token: string) => void;
  logoutAdmin: () => void;
}

export const useAdminStore = create<AdminState>()(
  persist(
    (set) => ({
      admin: null,
      token: null,
      setAdmin: (admin, token) => set({ admin, token }),
      logoutAdmin: () => set({ admin: null, token: null }),
    }),
    { name: 'cravebite-admin' }
  )
);
