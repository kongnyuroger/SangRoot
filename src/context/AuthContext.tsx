import type React from "react";
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
} from "react";
import {
  getAccessToken,
  removeAccessToken,
  removeRefreshToken,
} from "../lib/authStorage";
import { getTokenRole } from "../lib/tokenUtils";
import { logout as authLogout } from "../services/auth.service";
import type { UserProfile } from "../services/user.service";
import { getProfile } from "../services/user.service";

export type UserRole = "HOSPITAL" | "BLOOD_BANK" | "DOCTOR" | null;

interface AuthUser {
  profile: UserProfile;
  role: UserRole;
  isProfileComplete: boolean;
}

interface AuthContextValue {
  user: AuthUser | null;
  role: UserRole;
  isAuthenticated: boolean;
  isProfileComplete: boolean;
  isLoading: boolean;
  refreshUser: () => Promise<void>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextValue>({
  user: null,
  role: null,
  isAuthenticated: false,
  isProfileComplete: false,
  isLoading: true,
  refreshUser: async () => {},
  logout: async () => {},
});

function isProfileComplete(profile: UserProfile, role: UserRole): boolean {
  if (!profile) return false;
  if (role === "DOCTOR") {
    return !!(profile.name && profile.registrationNo);
  }
  // Org roles require name, phone, region, town, address
  return !!(
    profile.name &&
    profile.phone &&
    profile.region &&
    profile.town &&
    profile.address
  );
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const loadUser = useCallback(async () => {
    try {
      const token = await getAccessToken();
      if (!token) {
        setUser(null);
        return;
      }
      const role = getTokenRole(token) as UserRole;
      if (!role) {
        setUser(null);
        return;
      }
      const profile = await getProfile();
      setUser({
        profile,
        role,
        isProfileComplete: isProfileComplete(profile, role),
      });
    } catch {
      // Token invalid or network error — clear user
      setUser(null);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    loadUser();
  }, [loadUser]);

  const refreshUser = useCallback(async () => {
    setIsLoading(true);
    await loadUser();
  }, [loadUser]);

  const logout = useCallback(async () => {
    try {
      await authLogout();
    } finally {
      await removeAccessToken();
      await removeRefreshToken();
      setUser(null);
    }
  }, []);

  const value: AuthContextValue = {
    user,
    role: user?.role ?? null,
    isAuthenticated: user !== null,
    isProfileComplete: user?.isProfileComplete ?? false,
    isLoading,
    refreshUser,
    logout,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth(): AuthContextValue {
  return useContext(AuthContext);
}

export default AuthContext;
