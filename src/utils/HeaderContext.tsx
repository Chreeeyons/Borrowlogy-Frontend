import { createContext, useContext, useState, ReactNode } from 'react';


type HeaderContextType = {
    headerTitle: string;
    setHeaderTitle: (title: string) => void;
};

const HeaderContext = createContext<HeaderContextType | undefined>(undefined);

export function HeaderProvider({ children }: { children: ReactNode }) {
    const [headerTitle, setHeaderTitle] = useState("Default Title");

    return (
        <HeaderContext.Provider value={{ headerTitle, setHeaderTitle }}>
            {children}
        </HeaderContext.Provider>
    );
}

export function useHeader() {
    const context = useContext(HeaderContext);
    if (!context) throw new Error("useHeader must be used within a HeaderProvider");
    return context;
}

