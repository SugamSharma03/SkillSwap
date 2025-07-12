import React, { useState, useEffect } from 'react';
import { AppProvider, useApp } from './context/AppContext';
import { Auth } from './components/Auth';
import { Header } from './components/Header';
import { Dashboard } from './components/Dashboard';
import { UserProfile } from './components/UserProfile';
import { SkillBrowser } from './components/SkillBrowser';
import { SwapManager } from './components/SwapManager';
import { AdminDashboard } from './components/AdminDashboard';
import { Card, CardContent } from './components/ui/card';
import { Alert, AlertDescription } from './components/ui/alert';
import { Toaster } from './components/ui/sonner';
import { Ban, Shield, Sparkles, AlertTriangle } from 'lucide-react';

function BannedUserView() {
  const { dispatch } = useApp();

  const handleLogout = () => {
    dispatch({ type: 'SET_CURRENT_USER', payload: null });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-red-50 via-pink-50 to-rose-50 flex items-center justify-center p-6">
      <div className="absolute inset-0 bg-gradient-to-r from-red-500/5 to-pink-500/5"></div>
      <Card className="w-full max-w-md border-destructive/20 shadow-colorful-lg backdrop-blur-sm bg-white/90 relative z-10">
        <CardContent className="p-8 text-center space-y-6">
          <div className="flex justify-center">
            <div className="p-4 rounded-full bg-red-100 dark:bg-red-900/30">
              <Ban size={48} className="text-destructive" />
            </div>
          </div>
          
          <div className="space-y-3">
            <h1 className="text-2xl font-bold text-destructive">Account Suspended</h1>
            <p className="text-muted-foreground leading-relaxed">
              Your account has been suspended from the Skill Swap Platform. Access to all platform features has been permanently restricted.
            </p>
          </div>

          <Alert className="border-destructive/20 bg-destructive/5 backdrop-blur-sm">
            <AlertTriangle className="h-4 w-4 text-destructive" />
            <AlertDescription className="text-destructive">
              <strong>Important:</strong> If you believe this action was taken in error, please contact our platform administrators immediately for account review and assistance.
            </AlertDescription>
          </Alert>

          <div className="space-y-3">
            <button
              onClick={handleLogout}
              className="w-full px-6 py-3 bg-gradient-to-r from-gray-600 to-gray-700 text-white hover:from-gray-700 hover:to-gray-800 rounded-lg transition-all duration-200 hover:shadow-lg transform hover:scale-[1.02] active:scale-[0.98]"
            >
              Sign Out
            </button>
            
            <p className="text-xs text-gray-500">
              You will be automatically signed out and redirected to the login page.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

function AppContent() {
  const { state, dispatch } = useApp();
  const [currentView, setCurrentView] = useState('dashboard');

  // Check if current user has been banned while logged in
  useEffect(() => {
    if (state.currentUser) {
      const currentUserData = state.users.find(u => u.id === state.currentUser!.id);
      if (currentUserData?.isBanned && !state.currentUser.isBanned) {
        // User was banned while logged in, force logout
        dispatch({ type: 'SET_CURRENT_USER', payload: null });
      }
    }
  }, [state.users, state.currentUser, dispatch]);

  // Real-time ban check - check every 2 seconds
  useEffect(() => {
    const checkBannedStatus = () => {
      if (state.currentUser) {
        const currentUserData = state.users.find(u => u.id === state.currentUser!.id);
        if (currentUserData?.isBanned) {
          // Force immediate logout
          dispatch({ type: 'SET_CURRENT_USER', payload: null });
        }
      }
    };

    const interval = setInterval(checkBannedStatus, 2000);
    return () => clearInterval(interval);
  }, [state.currentUser, state.users, dispatch]);

  if (!state.currentUser) {
    return <Auth />;
  }

  // If user is banned, show banned user view
  if (state.currentUser.isBanned) {
    return <BannedUserView />;
  }

  const renderCurrentView = () => {
    switch (currentView) {
      case 'dashboard':
        return <Dashboard setCurrentView={setCurrentView} />;
      case 'profile':
      case 'settings':
        return <UserProfile />;
      case 'browse':
        return <SkillBrowser />;
      case 'swaps':
        return <SwapManager />;
      case 'admin':
        return <AdminDashboard />;
      default:
        return <Dashboard setCurrentView={setCurrentView} />;
    }
  };

  return (
    <div className="min-h-screen">
      {/* Decorative background elements */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-gradient-to-br from-blue-400/20 to-purple-600/20 rounded-full blur-3xl"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-gradient-to-tr from-green-400/20 to-blue-500/20 rounded-full blur-3xl"></div>
      </div>
      
      <Header currentView={currentView} setCurrentView={setCurrentView} />
      <main className="relative z-10 py-6">
        {renderCurrentView()}
      </main>
      <Toaster />
    </div>
  );
}

export default function App() {
  return (
    <AppProvider>
      <AppContent />
    </AppProvider>
  );
}