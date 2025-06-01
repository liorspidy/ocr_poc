// store/AppContext.tsx
import React, {
    createContext,
    useContext,
    useState,
    type ReactNode,
} from "react";

// 1. Define state shape
type AppState = {
    loading: boolean;
    setLoading: React.Dispatch<React.SetStateAction<boolean>>;
    results: JSON | null;
    setResults: React.Dispatch<React.SetStateAction<JSON | null>>;
    parsedResults: string | null;
    setParsedResults: React.Dispatch<React.SetStateAction<string | null>>;
    error: Error | null;
    setError: React.Dispatch<React.SetStateAction<Error | null>>;
};

// 2. Create the context
const AppContext = createContext<AppState | undefined>(undefined);

// 3. Create the provider
export const AppProvider = ({ children }: { children: ReactNode }) => {
    const [loading, setLoading] = useState<boolean>(false);
    const [results, setResults] = useState<JSON | null>(null);
    const [parsedResults, setParsedResults] = useState<string | null>(null);
    const [error, setError] = useState<Error | null>(null);

    return (
        <AppContext.Provider
            value={{
                loading,
                setLoading,
                results,
                setResults,
                parsedResults,
                setParsedResults,
                error,
                setError,
            }}
        >
            {children}
        </AppContext.Provider>
    );
};

// 4. Custom hook for using context
export const useAppContext = () => {
    const context = useContext(AppContext);
    if (!context) {
        throw new Error("useAppContext must be used within AppProvider");
    }
    return context;
};
