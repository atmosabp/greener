
import { createContext, useContext, useState, useEffect } from "react";
import type { ReactNode } from "react";
import Loading from "../components/loading/Loading";

interface LoadingContextType {
    showLoading: () => void;
    hideLoading: () => void;
}

const LoadingContext = createContext<LoadingContextType | undefined>(
    undefined
);

interface LoadingProviderProps {
    children: ReactNode;
}

export function LoadingProvider({ children }: LoadingProviderProps) {
    const [isLoading, setIsLoading] = useState(false);

    useEffect(() => {
    document.body.style.overflow = isLoading ? "hidden" : "";

    return () => {
        document.body.style.overflow = "";
    };
}, [isLoading]);

    const showLoading = () => setIsLoading(true);
    const hideLoading = () => setIsLoading(false);

    return (
        <LoadingContext.Provider value={{ showLoading, hideLoading }}>
            {children}

            {isLoading && <Loading />}
        </LoadingContext.Provider>
    );
}

export function useLoading() {
    const context = useContext(LoadingContext);

    if (!context) {
        throw new Error(
            "useLoading deve ser utilizado dentro de LoadingProvider."
        );
    }

    return context;
}
