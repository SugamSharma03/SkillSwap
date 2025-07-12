import React, { createContext, useContext, useReducer, useEffect } from 'react';

export interface User {
  id: string;
  name: string;
  email: string;
  location?: string;
  profilePhoto?: string;
  isAdmin: boolean;
  isPublic: boolean;
  skillsOffered: string[];
  skillsWanted: string[];
  availability: string[];
  rating: number;
  totalRatings: number;
  createdAt: Date;
  isBanned: boolean;
}

export interface SwapRequest {
  id: string;
  fromUserId: string;
  toUserId: string;
  offeredSkill: string;
  requestedSkill: string;
  message: string;
  status: 'pending' | 'accepted' | 'rejected' | 'completed' | 'cancelled';
  createdAt: Date;
  updatedAt: Date;
}

export interface Feedback {
  id: string;
  swapRequestId: string;
  fromUserId: string;
  toUserId: string;
  rating: number;
  comment: string;
  createdAt: Date;
}

export interface AdminMessage {
  id: string;
  title: string;
  content: string;
  createdAt: Date;
  adminId: string;
}

interface AppState {
  currentUser: User | null;
  users: User[];
  swapRequests: SwapRequest[];
  feedback: Feedback[];
  adminMessages: AdminMessage[];
  isLoading: boolean;
}

type AppAction =
  | { type: 'SET_CURRENT_USER'; payload: User | null }
  | { type: 'ADD_USER'; payload: User }
  | { type: 'UPDATE_USER'; payload: User }
  | { type: 'BAN_USER'; payload: string }
  | { type: 'UNBAN_USER'; payload: string }
  | { type: 'MAKE_ADMIN'; payload: string }
  | { type: 'REMOVE_ADMIN'; payload: string }
  | { type: 'ADD_SWAP_REQUEST'; payload: SwapRequest }
  | { type: 'UPDATE_SWAP_REQUEST'; payload: SwapRequest }
  | { type: 'DELETE_SWAP_REQUEST'; payload: string }
  | { type: 'ADD_FEEDBACK'; payload: Feedback }
  | { type: 'ADD_ADMIN_MESSAGE'; payload: AdminMessage }
  | { type: 'SET_LOADING'; payload: boolean }
  | { type: 'LOAD_DATA'; payload: Partial<AppState> }
  | { type: 'FORCE_LOGOUT'; payload: string }
  | { type: 'CHECK_BANNED_STATUS' };

const initialState: AppState = {
  currentUser: null,
  users: [],
  swapRequests: [],
  feedback: [],
  adminMessages: [],
  isLoading: false,
};

function appReducer(state: AppState, action: AppAction): AppState {
  switch (action.type) {
    case 'SET_CURRENT_USER':
      return { ...state, currentUser: action.payload };
    case 'ADD_USER':
      return { ...state, users: [...state.users, action.payload] };
    case 'UPDATE_USER':
      return {
        ...state,
        users: state.users.map(user => 
          user.id === action.payload.id ? action.payload : user
        ),
        currentUser: state.currentUser?.id === action.payload.id ? action.payload : state.currentUser
      };
    case 'BAN_USER':
      const updatedUsers = state.users.map(user => 
        user.id === action.payload 
          ? { ...user, isBanned: true, isAdmin: false } // Remove admin privileges when banning
          : user
      );
      
      // If the banned user is the current user, log them out immediately
      const shouldLogout = state.currentUser?.id === action.payload;
      
      return {
        ...state,
        users: updatedUsers,
        currentUser: shouldLogout ? null : state.currentUser,
        // Cancel all pending swap requests involving the banned user
        swapRequests: state.swapRequests.map(request => 
          (request.fromUserId === action.payload || request.toUserId === action.payload) && 
          request.status === 'pending'
            ? { ...request, status: 'cancelled' as const, updatedAt: new Date() }
            : request
        )
      };
    case 'UNBAN_USER':
      return {
        ...state,
        users: state.users.map(user => 
          user.id === action.payload ? { ...user, isBanned: false } : user
        ),
        currentUser: state.currentUser?.id === action.payload ? { ...state.currentUser, isBanned: false } : state.currentUser
      };
    case 'MAKE_ADMIN':
      return {
        ...state,
        users: state.users.map(user => 
          user.id === action.payload ? { ...user, isAdmin: true } : user
        ),
        currentUser: state.currentUser?.id === action.payload ? { ...state.currentUser, isAdmin: true } : state.currentUser
      };
    case 'REMOVE_ADMIN':
      return {
        ...state,
        users: state.users.map(user => 
          user.id === action.payload ? { ...user, isAdmin: false } : user
        ),
        currentUser: state.currentUser?.id === action.payload ? { ...state.currentUser, isAdmin: false } : state.currentUser
      };
    case 'ADD_SWAP_REQUEST':
      // Prevent banned users from creating swap requests
      if (state.currentUser?.isBanned) {
        return state;
      }
      return { ...state, swapRequests: [...state.swapRequests, action.payload] };
    case 'UPDATE_SWAP_REQUEST':
      // Prevent banned users from updating swap requests
      if (state.currentUser?.isBanned) {
        return state;
      }
      return {
        ...state,
        swapRequests: state.swapRequests.map(request => 
          request.id === action.payload.id ? action.payload : request
        )
      };
    case 'DELETE_SWAP_REQUEST':
      // Prevent banned users from deleting swap requests
      if (state.currentUser?.isBanned) {
        return state;
      }
      return {
        ...state,
        swapRequests: state.swapRequests.filter(request => request.id !== action.payload)
      };
    case 'ADD_FEEDBACK':
      // Prevent banned users from adding feedback
      if (state.currentUser?.isBanned) {
        return state;
      }
      return { ...state, feedback: [...state.feedback, action.payload] };
    case 'ADD_ADMIN_MESSAGE':
      // Only admins can add messages, and banned users can't be admins
      if (!state.currentUser?.isAdmin || state.currentUser?.isBanned) {
        return state;
      }
      return { ...state, adminMessages: [...state.adminMessages, action.payload] };
    case 'FORCE_LOGOUT':
      if (state.currentUser?.id === action.payload) {
        return { ...state, currentUser: null };
      }
      return state;
    case 'CHECK_BANNED_STATUS':
      // Check if current user has been banned and log them out if so
      if (state.currentUser) {
        const currentUserData = state.users.find(u => u.id === state.currentUser!.id);
        if (currentUserData?.isBanned && !state.currentUser.isBanned) {
          return { ...state, currentUser: null };
        }
        if (currentUserData && currentUserData.isBanned !== state.currentUser.isBanned) {
          return { ...state, currentUser: currentUserData };
        }
      }
      return state;
    case 'SET_LOADING':
      return { ...state, isLoading: action.payload };
    case 'LOAD_DATA':
      return { ...state, ...action.payload };
    default:
      return state;
  }
}

const AppContext = createContext<{
  state: AppState;
  dispatch: React.Dispatch<AppAction>;
} | null>(null);

export function AppProvider({ children }: { children: React.ReactNode }) {
  const [state, dispatch] = useReducer(appReducer, initialState);

  useEffect(() => {
    // Load data from localStorage on mount
    const savedData = localStorage.getItem('skillSwapData');
    if (savedData) {
      try {
        const parsedData = JSON.parse(savedData);
        // Convert date strings back to Date objects
        const processedData = {
          ...parsedData,
          users: parsedData.users?.map((user: any) => ({
            ...user,
            createdAt: new Date(user.createdAt)
          })) || [],
          swapRequests: parsedData.swapRequests?.map((request: any) => ({
            ...request,
            createdAt: new Date(request.createdAt),
            updatedAt: new Date(request.updatedAt)
          })) || [],
          feedback: parsedData.feedback?.map((fb: any) => ({
            ...fb,
            createdAt: new Date(fb.createdAt)
          })) || [],
          adminMessages: parsedData.adminMessages?.map((msg: any) => ({
            ...msg,
            createdAt: new Date(msg.createdAt)
          })) || []
        };
        dispatch({ type: 'LOAD_DATA', payload: processedData });
      } catch (error) {
        console.error('Failed to load saved data:', error);
      }
    }
  }, []);

  useEffect(() => {
    // Save data to localStorage whenever state changes
    const dataToSave = {
      users: state.users,
      swapRequests: state.swapRequests,
      feedback: state.feedback,
      adminMessages: state.adminMessages,
      currentUser: state.currentUser
    };
    localStorage.setItem('skillSwapData', JSON.stringify(dataToSave));
    
    // Check banned status periodically
    dispatch({ type: 'CHECK_BANNED_STATUS' });
  }, [state.users, state.swapRequests, state.feedback, state.adminMessages, state.currentUser]);

  // Check banned status every few seconds to ensure real-time enforcement
  useEffect(() => {
    const interval = setInterval(() => {
      dispatch({ type: 'CHECK_BANNED_STATUS' });
    }, 3000); // Check every 3 seconds

    return () => clearInterval(interval);
  }, []);

  return (
    <AppContext.Provider value={{ state, dispatch }}>
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
}