import React from 'react';
import { Button } from './ui/button';
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar';
import { Badge } from './ui/badge';
import { 
  Home, 
  User, 
  Search, 
  MessageSquare, 
  Shield, 
  LogOut,
  Sparkles,
  Zap,
  Globe
} from 'lucide-react';
import { useApp } from '../context/AppContext';

interface HeaderProps {
  currentView: string;
  setCurrentView: (view: string) => void;
}

export function Header({ currentView, setCurrentView }: HeaderProps) {
  const { state, dispatch } = useApp();
  const { currentUser } = state;

  const handleLogout = () => {
    dispatch({ type: 'SET_CURRENT_USER', payload: null });
  };

  if (!currentUser) return null;

  const navItems = [
    { 
      id: 'dashboard', 
      label: 'Dashboard', 
      icon: Home, 
      color: 'from-blue-500 to-purple-600',
      bgColor: 'bg-blue-50 dark:bg-blue-900/20',
      textColor: 'text-blue-600 dark:text-blue-400'
    },
    { 
      id: 'browse', 
      label: 'Browse Skills', 
      icon: Search, 
      color: 'from-green-500 to-emerald-600',
      bgColor: 'bg-green-50 dark:bg-green-900/20',
      textColor: 'text-green-600 dark:text-green-400'
    },
    { 
      id: 'swaps', 
      label: 'My Swaps', 
      icon: MessageSquare, 
      color: 'from-orange-500 to-red-600',
      bgColor: 'bg-orange-50 dark:bg-orange-900/20',
      textColor: 'text-orange-600 dark:text-orange-400'
    },
    { 
      id: 'profile', 
      label: 'Profile', 
      icon: User, 
      color: 'from-purple-500 to-pink-600',
      bgColor: 'bg-purple-50 dark:bg-purple-900/20',
      textColor: 'text-purple-600 dark:text-purple-400'
    },
  ];

  if (currentUser.isAdmin) {
    navItems.push({ 
      id: 'admin', 
      label: 'Admin', 
      icon: Shield, 
      color: 'from-red-500 to-pink-600',
      bgColor: 'bg-red-50 dark:bg-red-900/20',
      textColor: 'text-red-600 dark:text-red-400'
    });
  }

  return (
    <header className="sticky top-0 z-50 w-full backdrop-blur-xl bg-white/80 dark:bg-gray-900/80 border-b border-border/40 shadow-colorful">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          {/* Logo/Brand */}
          <div className="flex items-center space-x-3">
            <div className="flex items-center justify-center w-10 h-10 rounded-xl bg-gradient-to-br from-blue-500 to-purple-600 shadow-lg">
              <Sparkles className="h-5 w-5 text-white" />
            </div>
            <div className="hidden sm:block">
              <h1 className="text-xl font-bold text-gradient">SkillSwap</h1>
              <p className="text-xs text-muted-foreground">Connect & Learn</p>
            </div>
          </div>

          {/* Navigation */}
          <nav className="hidden md:flex items-center space-x-1">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = currentView === item.id;
              
              return (
                <Button
                  key={item.id}
                  variant={isActive ? "default" : "ghost"}
                  size="sm"
                  onClick={() => setCurrentView(item.id)}
                  className={`
                    relative overflow-hidden transition-all duration-200 hover:scale-105
                    ${isActive 
                      ? `bg-gradient-to-r ${item.color} text-white shadow-lg` 
                      : `hover:${item.bgColor} ${item.textColor} hover:shadow-md`
                    }
                  `}
                >
                  <Icon size={16} className="mr-2" />
                  {item.label}
                  {isActive && (
                    <div className="absolute inset-0 bg-white/20 animate-pulse rounded-md"></div>
                  )}
                </Button>
              );
            })}
          </nav>

          {/* Mobile Navigation */}
          <nav className="flex md:hidden items-center space-x-1">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = currentView === item.id;
              
              return (
                <Button
                  key={item.id}
                  variant={isActive ? "default" : "ghost"}
                  size="icon"
                  onClick={() => setCurrentView(item.id)}
                  className={`
                    relative transition-all duration-200
                    ${isActive 
                      ? `bg-gradient-to-r ${item.color} text-white shadow-lg` 
                      : `${item.textColor} hover:${item.bgColor}`
                    }
                  `}
                >
                  <Icon size={18} />
                  {isActive && (
                    <div className="absolute inset-0 bg-white/20 animate-pulse rounded-md"></div>
                  )}
                </Button>
              );
            })}
          </nav>

          {/* User Profile */}
          <div className="flex items-center space-x-3">
            <div className="hidden sm:flex items-center space-x-3">
              <div className="text-right">
                <p className="text-sm font-medium">{currentUser.name}</p>
                <div className="flex items-center space-x-1">
                  {currentUser.isAdmin && (
                    <Badge variant="secondary" className="text-xs bg-gradient-to-r from-red-500 to-pink-600 text-white border-0">
                      <Shield size={10} className="mr-1" />
                      Admin
                    </Badge>
                  )}
                  <Badge variant="outline" className="text-xs border-green-200 text-green-700 bg-green-50">
                    <Globe size={10} className="mr-1" />
                    {currentUser.isPublic ? 'Public' : 'Private'}
                  </Badge>
                </div>
              </div>
            </div>

            <div className="relative">
              <Avatar className="h-10 w-10 ring-2 ring-gradient-to-r ring-blue-500/30 ring-offset-2 ring-offset-background">
                <AvatarImage src={currentUser.profilePhoto} alt={currentUser.name} />
                <AvatarFallback className="bg-gradient-to-br from-blue-500 to-purple-600 text-white">
                  {currentUser.name.split(' ').map(n => n[0]).join('').toUpperCase()}
                </AvatarFallback>
              </Avatar>
              <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-gradient-to-r from-green-400 to-emerald-500 rounded-full border-2 border-background shadow-sm">
                <Zap size={8} className="text-white m-auto mt-0.5" />
              </div>
            </div>

            <Button
              variant="ghost"
              size="icon"
              onClick={handleLogout}
              className="text-gray-600 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors"
            >
              <LogOut size={18} />
            </Button>
          </div>
        </div>
      </div>
    </header>
  );
}