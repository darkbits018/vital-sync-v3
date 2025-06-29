import { useModeContext } from '../contexts/ModeContext';
import { UserMode } from '../types';

interface UseUserModeReturn {
  userMode: UserMode;
  toggleMode: () => void;
  isPremium: boolean;
  isFreeTier: boolean;
}

export function useUserMode(): UseUserModeReturn {
  const { userMode, toggleMode, isPremium } = useModeContext();
  
  return {
    userMode,
    toggleMode,
    isPremium,
    isFreeTier: !isPremium,
  };
}