import { createContext } from "react";
import { User } from "firebase/auth";

// Define the shape of our Auth Context
export interface AuthContextType {
  user: User | null;
  loading: boolean;
}

// Create the context with a default value
export const AuthContext = createContext<AuthContextType | undefined>(undefined);
