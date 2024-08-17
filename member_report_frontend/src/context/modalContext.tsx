import { FC, createContext, ReactNode, useState, Dispatch, SetStateAction, useContext } from "react";

// Define the context type
interface ModalContextType {
    isOpenModal: boolean;
    setIsOpenModal: Dispatch<SetStateAction<boolean>>;
}

// Create the context with a default value
const ModalContext = createContext<ModalContextType | undefined>(undefined);

interface ModalProviderProps {
    children: ReactNode;
}

export const ModalContextProvider: FC<ModalProviderProps> = ({ children }) => {
    const [isOpenModal, setIsOpenModal] = useState<boolean>(false);
    return (
        <ModalContext.Provider value={{ isOpenModal, setIsOpenModal }}>
            {children}
        </ModalContext.Provider>
    );
};

// Create a custom hook for consuming the context
export const useModalContext = (): ModalContextType => {
    const context = useContext(ModalContext);
    if (context === undefined) {
        throw new Error('useModalContext must be used within a ModalContextProvider');
    }
    return context;
};
