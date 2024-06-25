import { useLocalStorage } from "usehooks-ts";
import { Dispatch, ReactNode, SetStateAction, createContext, useContext } from "react";

export type ModifyState<T> = Dispatch<SetStateAction<T>>
export type Dir = 'rtl' | 'ltr'

interface PreferenceContextType {
  displayLanguage: string;
  setDisplayLanguage: ModifyState<string>;
  dstLanguage: string;
  setDstLanguage: ModifyState<string>;
  srcDir: Dir;
  setSrcDir: ModifyState<Dir>
  dstDir: Dir
  setDstDir: ModifyState<Dir>
}

const PreferenceContext = createContext<PreferenceContextType | undefined>(undefined);

export function usePreferenceProvider() {
  const context = useContext(PreferenceContext);
  if (context === undefined) {
    throw new Error("usePreferenceProvider must be used within a PreferenceProvider");
  }
  return context;
}

interface PreferenceProviderProps {
  children: ReactNode;
}

export default function PreferenceProvider({ children }: PreferenceProviderProps) {
  const [displayLanguage, setDisplayLanguage] = useLocalStorage('prefs_display_language', 'en-US');
  const [dstLanguage, setDstLanguage] = useLocalStorage('prefs_dst_language', 'english');
  const [srcDir, setSrcDir] = useLocalStorage<Dir>('prefs_dst_dir', 'ltr');
  const [dstDir, setDstDir] = useLocalStorage<Dir>('prefs_src_dir', 'ltr');
  

  const value = {
    displayLanguage,
    setDisplayLanguage,
    dstLanguage,
    setDstLanguage,
    srcDir,
    setSrcDir,
    dstDir,
    setDstDir
  };

  return (
    <PreferenceContext.Provider value={value}>
      {children}
    </PreferenceContext.Provider>
  );
}