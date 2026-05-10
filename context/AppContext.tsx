import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import i18n from '@/hooks/useI18n';

// Job type for recently viewed & saved
export interface SavedJob {
  id: string;
  title: string;
  company: string;
  salary: string;
  location: string;
  distance: string;
  type: string;
  urgent: boolean;
  posted: string;
  category?: string;
  savedAt: number;
}

export interface RecentJob {
  id: string;
  title: string;
  company: string;
  salary: string;
  location: string;
  type: string;
  viewedAt: number;
}

export interface PostedJob {
  id: string;
  title: string;
  company: string;
  salary: string;
  location: string;
  type: string;
  category: string;
  urgent: boolean;
  description: string;
  postedAt: number;
}

interface AppState {
  selectedLanguage: string | null;
  isLoggedIn: boolean;
  phoneNumber: string;
  selectedSkills: string[];
  verifiedSkills: string[];
  onboardingComplete: boolean;
  userName: string;
  userRole: 'worker' | 'manager';
  isLoading: boolean;
  recentlyViewedJobs: RecentJob[];
  savedJobs: SavedJob[];
  postedJobs: PostedJob[];
  profilePhoto: string | null;
  address: string;
  experience: string;
}

interface AppContextType extends AppState {
  setSelectedLanguage: (lang: string) => Promise<void>;
  setIsLoggedIn: (val: boolean) => Promise<void>;
  setPhoneNumber: (phone: string) => Promise<void>;
  setSelectedSkills: (skills: string[]) => Promise<void>;
  setOnboardingComplete: (val: boolean) => Promise<void>;
  setUserName: (name: string) => Promise<void>;
  resetState: () => Promise<void>;
  addRecentlyViewedJob: (job: Omit<RecentJob, 'viewedAt'>) => Promise<void>;
  toggleSavedJob: (job: Omit<SavedJob, 'savedAt'>) => Promise<void>;
  isJobSaved: (jobId: string) => boolean;
  setProfilePhoto: (uri: string | null) => Promise<void>;
  setAddress: (addr: string) => Promise<void>;
  setExperience: (exp: string) => Promise<void>;
  setVerifiedSkills: (skills: string[]) => Promise<void>;
  setUserRole: (role: 'worker' | 'manager') => Promise<void>;
  addPostedJob: (job: PostedJob) => Promise<void>;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

const STORAGE_KEYS = {
  LANGUAGE: '@workbandhu_language',
  LOGGED_IN: '@workbandhu_logged_in',
  PHONE: '@workbandhu_phone',
  SKILLS: '@workbandhu_skills',
  ONBOARDING: '@workbandhu_onboarding',
  USER_NAME: '@workbandhu_user_name',
  RECENT_JOBS: '@workbandhu_recent_jobs',
  SAVED_JOBS: '@workbandhu_saved_jobs',
  PROFILE_PHOTO: '@workbandhu_profile_photo',
  ADDRESS: '@workbandhu_address',
  EXPERIENCE: '@workbandhu_experience',
  VERIFIED_SKILLS: '@workbandhu_verified_skills',
  USER_ROLE: '@workbandhu_user_role',
  POSTED_JOBS: '@workbandhu_posted_jobs',
};

export function AppProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<AppState>({
    selectedLanguage: null,
    isLoggedIn: false,
    phoneNumber: '',
    selectedSkills: [],
    verifiedSkills: [],
    onboardingComplete: false,
    userName: 'Worker',
    userRole: 'worker',
    isLoading: true,
    recentlyViewedJobs: [],
    savedJobs: [],
    postedJobs: [],
    profilePhoto: null,
    address: '',
    experience: '',
  });

  useEffect(() => {
    loadPersistedState();
  }, []);

  const loadPersistedState = async () => {
    try {
      const [language, loggedIn, phone, skills, onboarding, userName, recentJobs, savedJobs, photo, address, experience, verifiedSkills, userRole, postedJobs] = await Promise.all([
        AsyncStorage.getItem(STORAGE_KEYS.LANGUAGE),
        AsyncStorage.getItem(STORAGE_KEYS.LOGGED_IN),
        AsyncStorage.getItem(STORAGE_KEYS.PHONE),
        AsyncStorage.getItem(STORAGE_KEYS.SKILLS),
        AsyncStorage.getItem(STORAGE_KEYS.ONBOARDING),
        AsyncStorage.getItem(STORAGE_KEYS.USER_NAME),
        AsyncStorage.getItem(STORAGE_KEYS.RECENT_JOBS),
        AsyncStorage.getItem(STORAGE_KEYS.SAVED_JOBS),
        AsyncStorage.getItem(STORAGE_KEYS.PROFILE_PHOTO),
        AsyncStorage.getItem(STORAGE_KEYS.ADDRESS),
        AsyncStorage.getItem(STORAGE_KEYS.EXPERIENCE),
        AsyncStorage.getItem(STORAGE_KEYS.VERIFIED_SKILLS),
        AsyncStorage.getItem(STORAGE_KEYS.USER_ROLE),
        AsyncStorage.getItem(STORAGE_KEYS.POSTED_JOBS),
      ]);

      if (language) {
        const langCode = language === 'english' ? 'en' :
          language === 'hindi' ? 'hi' :
          language === 'marathi' ? 'mr' :
          language === 'kannada' ? 'kn' :
          language === 'telugu' ? 'te' :
          language === 'malayalam' ? 'ml' : 'en';
        i18n.changeLanguage(langCode);
      }

      let parsedSkills: string[] = [];
      if (skills) {
        try {
          const parsed = JSON.parse(skills);
          parsedSkills = Array.isArray(parsed) ? parsed : [parsed];
        } catch {
          parsedSkills = [skills];
        }
      }

      setState({
        selectedLanguage: language,
        isLoggedIn: loggedIn === 'true',
        phoneNumber: phone || '',
        selectedSkills: parsedSkills,
        verifiedSkills: verifiedSkills ? JSON.parse(verifiedSkills) : [],
        onboardingComplete: onboarding === 'true',
        userName: userName || 'Worker',
        userRole: (userRole as 'worker' | 'manager') || 'worker',
        isLoading: false,
        recentlyViewedJobs: recentJobs ? JSON.parse(recentJobs) : [],
        savedJobs: savedJobs ? JSON.parse(savedJobs) : [],
        postedJobs: postedJobs ? JSON.parse(postedJobs) : [],
        profilePhoto: photo,
        address: address || '',
        experience: experience || '',
      });
    } catch (e) {
      console.error('Failed to load persisted state:', e);
      setState(prev => ({ ...prev, isLoading: false }));
    }
  };

  const getLangCode = (langId: string) => {
    const map: Record<string, string> = {
      english: 'en', hindi: 'hi', marathi: 'mr',
      kannada: 'kn', telugu: 'te', malayalam: 'ml',
    };
    return map[langId] || 'en';
  };

  const setSelectedLanguage = async (lang: string) => {
    await AsyncStorage.setItem(STORAGE_KEYS.LANGUAGE, lang);
    i18n.changeLanguage(getLangCode(lang));
    setState(prev => ({ ...prev, selectedLanguage: lang }));
  };

  const setIsLoggedIn = async (val: boolean) => {
    await AsyncStorage.setItem(STORAGE_KEYS.LOGGED_IN, String(val));
    setState(prev => ({ ...prev, isLoggedIn: val }));
  };

  const setPhoneNumber = async (phone: string) => {
    await AsyncStorage.setItem(STORAGE_KEYS.PHONE, phone);
    setState(prev => ({ ...prev, phoneNumber: phone }));
  };

  const setSelectedSkills = async (skills: string[]) => {
    await AsyncStorage.setItem(STORAGE_KEYS.SKILLS, JSON.stringify(skills));
    setState(prev => ({ ...prev, selectedSkills: skills }));
  };

  const setOnboardingComplete = async (val: boolean) => {
    await AsyncStorage.setItem(STORAGE_KEYS.ONBOARDING, String(val));
    setState(prev => ({ ...prev, onboardingComplete: val }));
  };

  const setUserName = async (name: string) => {
    await AsyncStorage.setItem(STORAGE_KEYS.USER_NAME, name);
    setState(prev => ({ ...prev, userName: name }));
  };

  const setProfilePhoto = async (uri: string | null) => {
    if (uri) {
      await AsyncStorage.setItem(STORAGE_KEYS.PROFILE_PHOTO, uri);
    } else {
      await AsyncStorage.removeItem(STORAGE_KEYS.PROFILE_PHOTO);
    }
    setState(prev => ({ ...prev, profilePhoto: uri }));
  };

  const setAddress = async (addr: string) => {
    await AsyncStorage.setItem(STORAGE_KEYS.ADDRESS, addr);
    setState(prev => ({ ...prev, address: addr }));
  };

  const setExperience = async (exp: string) => {
    await AsyncStorage.setItem(STORAGE_KEYS.EXPERIENCE, exp);
    setState(prev => ({ ...prev, experience: exp }));
  };

  const addRecentlyViewedJob = async (job: Omit<RecentJob, 'viewedAt'>) => {
    setState(prev => {
      const filtered = prev.recentlyViewedJobs.filter(j => j.id !== job.id);
      const updated: RecentJob[] = [
        { ...job, viewedAt: Date.now() },
        ...filtered,
      ].slice(0, 10);
      AsyncStorage.setItem(STORAGE_KEYS.RECENT_JOBS, JSON.stringify(updated));
      return { ...prev, recentlyViewedJobs: updated };
    });
  };

  const toggleSavedJob = async (job: Omit<SavedJob, 'savedAt'>) => {
    setState(prev => {
      const exists = prev.savedJobs.some(j => j.id === job.id);
      let updated: SavedJob[];
      if (exists) {
        updated = prev.savedJobs.filter(j => j.id !== job.id);
      } else {
        updated = [{ ...job, savedAt: Date.now() }, ...prev.savedJobs];
      }
      AsyncStorage.setItem(STORAGE_KEYS.SAVED_JOBS, JSON.stringify(updated));
      return { ...prev, savedJobs: updated };
    });
  };

  const isJobSaved = (jobId: string) => {
    return state.savedJobs.some(j => j.id === jobId);
  };

  const resetState = async () => {
    await AsyncStorage.clear();
    setState({
      selectedLanguage: null,
      isLoggedIn: false,
      phoneNumber: '',
      selectedSkills: [],
      verifiedSkills: [],
      onboardingComplete: false,
      userName: 'Worker',
      userRole: 'worker',
      isLoading: false,
      recentlyViewedJobs: [],
      savedJobs: [],
      postedJobs: [],
      profilePhoto: null,
      address: '',
      experience: '',
    });
  };

  const setVerifiedSkills = async (skills: string[]) => {
    await AsyncStorage.setItem(STORAGE_KEYS.VERIFIED_SKILLS, JSON.stringify(skills));
    setState(prev => ({ ...prev, verifiedSkills: skills }));
  };

  const setUserRole = async (role: 'worker' | 'manager') => {
    await AsyncStorage.setItem(STORAGE_KEYS.USER_ROLE, role);
    setState(prev => ({ ...prev, userRole: role }));
  };

  const addPostedJob = async (job: PostedJob) => {
    setState(prev => {
      const updated = [job, ...prev.postedJobs];
      AsyncStorage.setItem(STORAGE_KEYS.POSTED_JOBS, JSON.stringify(updated));
      return { ...prev, postedJobs: updated };
    });
  };

  return (
    <AppContext.Provider
      value={{
        ...state,
        setSelectedLanguage,
        setIsLoggedIn,
        setPhoneNumber,
        setSelectedSkills,
        setOnboardingComplete,
        setUserName,
        resetState,
        addRecentlyViewedJob,
        toggleSavedJob,
        isJobSaved,
        setProfilePhoto,
        setAddress,
        setExperience,
        setVerifiedSkills,
        setUserRole,
        addPostedJob,
      }}
    >
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within AppProvider');
  }
  return context;
}
