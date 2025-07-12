import React, { useState } from 'react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { Alert, AlertDescription } from './ui/alert';
import { Ban, Sparkles, Users, Shield } from 'lucide-react';
import { useApp, User } from '../context/AppContext';

export function Auth() {
  const { state, dispatch } = useApp();
  const [isLoading, setIsLoading] = useState(false);
  const [loginForm, setLoginForm] = useState({ email: '', password: '' });
  const [registerForm, setRegisterForm] = useState({ 
    name: '', 
    email: '', 
    password: '', 
    location: '' 
  });

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    // Simulate API call
    setTimeout(() => {
      const user = state.users.find(u => u.email === loginForm.email);
      if (user && !user.isBanned) {
        dispatch({ type: 'SET_CURRENT_USER', payload: user });
      } else if (user?.isBanned) {
        alert('Your account has been suspended. Please contact the administrators for assistance.');
      } else {
        alert('Invalid credentials. Please check your email and password.');
      }
      setIsLoading(false);
    }, 500);
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    // Simulate API call
    setTimeout(() => {
      const existingUser = state.users.find(u => u.email === registerForm.email);
      if (existingUser) {
        alert('An account with this email already exists. Please use a different email.');
        setIsLoading(false);
        return;
      }

      const newUser: User = {
        id: Date.now().toString(),
        name: registerForm.name,
        email: registerForm.email,
        location: registerForm.location || undefined,
        isAdmin: state.users.length === 0, // First user is admin
        isPublic: true,
        skillsOffered: [],
        skillsWanted: [],
        availability: [],
        rating: 0,
        totalRatings: 0,
        createdAt: new Date(),
        isBanned: false
      };

      dispatch({ type: 'ADD_USER', payload: newUser });
      dispatch({ type: 'SET_CURRENT_USER', payload: newUser });
      setIsLoading(false);
    }, 500);
  };

  const handleDemoLogin = (isAdmin: boolean = false) => {
    const demoId = isAdmin ? 'admin-demo' : 'user-demo';
    
    // Check if demo user exists and if they're banned
    const existingDemoUser = state.users.find(u => u.id === demoId);
    if (existingDemoUser?.isBanned) {
      alert('The demo account has been suspended and cannot be accessed.');
      return;
    }

    const demoUser: User = existingDemoUser || {
      id: demoId,
      name: isAdmin ? 'Admin Demo' : 'User Demo',
      email: isAdmin ? 'admin@demo.com' : 'user@demo.com',
      location: 'Demo City',
      isAdmin,
      isPublic: true,
      skillsOffered: isAdmin ? ['Platform Management', 'System Administration'] : ['JavaScript', 'React', 'Node.js'],
      skillsWanted: isAdmin ? [] : ['Python', 'UI/UX Design', 'DevOps'],
      availability: ['weekends', 'evenings'],
      rating: 4.5,
      totalRatings: 10,
      createdAt: new Date(),
      isBanned: false
    };

    // Add demo user if doesn't exist
    if (!existingDemoUser) {
      dispatch({ type: 'ADD_USER', payload: demoUser });
    }
    
    dispatch({ type: 'SET_CURRENT_USER', payload: demoUser });
  };

  return (
    <div className="min-h-screen flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      {/* Background decorations */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-gradient-to-br from-blue-400/10 to-purple-600/10 rounded-full blur-3xl"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-gradient-to-tr from-green-400/10 to-blue-500/10 rounded-full blur-3xl"></div>
      </div>

      <Card className="w-full max-w-md shadow-colorful-lg backdrop-blur-sm bg-white/90 border-0 relative z-10">
        <CardHeader className="text-center space-y-4">
          <div className="flex items-center justify-center space-x-3">
            <div className="p-3 bg-gradient-to-br from-blue-500 to-purple-600 rounded-2xl shadow-lg">
              <Sparkles className="h-8 w-8 text-white" />
            </div>
            <div>
              <CardTitle className="text-2xl text-gradient">SkillSwap</CardTitle>
              <CardDescription className="text-gray-600">Connect, learn, and grow together</CardDescription>
            </div>
          </div>
          
          <div className="flex items-center justify-center space-x-6 text-sm text-muted-foreground">
            <div className="flex items-center space-x-2">
              <Users className="h-4 w-4 text-blue-500" />
              <span>{state.users.filter(u => !u.isBanned).length} Active Members</span>
            </div>
            <div className="flex items-center space-x-2">
              <Shield className="h-4 w-4 text-green-500" />
              <span>Secure Platform</span>
            </div>
          </div>
        </CardHeader>
        
        <CardContent>
          <Tabs defaultValue="login" className="space-y-6">
            <TabsList className="grid w-full grid-cols-2 bg-gray-100">
              <TabsTrigger value="login" className="data-[state=active]:bg-white data-[state=active]:shadow-sm">Login</TabsTrigger>
              <TabsTrigger value="register" className="data-[state=active]:bg-white data-[state=active]:shadow-sm">Register</TabsTrigger>
            </TabsList>
            
            <TabsContent value="login">
              <form onSubmit={handleLogin} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="login-email" className="text-gray-700">Email Address</Label>
                  <Input
                    id="login-email"
                    type="email"
                    placeholder="Enter your email"
                    value={loginForm.email}
                    onChange={(e) => setLoginForm(prev => ({ ...prev, email: e.target.value }))}
                    className="border-gray-200 focus:border-blue-400 bg-white/80"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="login-password" className="text-gray-700">Password</Label>
                  <Input
                    id="login-password"
                    type="password"
                    placeholder="Enter your password"
                    value={loginForm.password}
                    onChange={(e) => setLoginForm(prev => ({ ...prev, password: e.target.value }))}
                    className="border-gray-200 focus:border-blue-400 bg-white/80"
                    required
                  />
                </div>
                <Button 
                  type="submit" 
                  className="w-full bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white shadow-lg transition-all duration-200" 
                  disabled={isLoading}
                >
                  {isLoading ? 'Signing in...' : 'Sign In'}
                </Button>
              </form>
            </TabsContent>
            
            <TabsContent value="register">
              <form onSubmit={handleRegister} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="register-name" className="text-gray-700">Full Name</Label>
                  <Input
                    id="register-name"
                    placeholder="Enter your full name"
                    value={registerForm.name}
                    onChange={(e) => setRegisterForm(prev => ({ ...prev, name: e.target.value }))}
                    className="border-gray-200 focus:border-green-400 bg-white/80"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="register-email" className="text-gray-700">Email Address</Label>
                  <Input
                    id="register-email"
                    type="email"
                    placeholder="Enter your email"
                    value={registerForm.email}
                    onChange={(e) => setRegisterForm(prev => ({ ...prev, email: e.target.value }))}
                    className="border-gray-200 focus:border-green-400 bg-white/80"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="register-location" className="text-gray-700">Location <span className="text-gray-400">(Optional)</span></Label>
                  <Input
                    id="register-location"
                    placeholder="e.g., New York, NY"
                    value={registerForm.location}
                    onChange={(e) => setRegisterForm(prev => ({ ...prev, location: e.target.value }))}
                    className="border-gray-200 focus:border-green-400 bg-white/80"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="register-password" className="text-gray-700">Password</Label>
                  <Input
                    id="register-password"
                    type="password"
                    placeholder="Create a password"
                    value={registerForm.password}
                    onChange={(e) => setRegisterForm(prev => ({ ...prev, password: e.target.value }))}
                    className="border-gray-200 focus:border-green-400 bg-white/80"
                    required
                  />
                </div>
                <Button 
                  type="submit" 
                  className="w-full bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white shadow-lg transition-all duration-200" 
                  disabled={isLoading}
                >
                  {isLoading ? 'Creating account...' : 'Create Account'}
                </Button>
              </form>
            </TabsContent>
          </Tabs>
          
          <div className="mt-8 space-y-3">
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-200"></div>
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-3 bg-white text-gray-500">Quick Demo Access</span>
              </div>
            </div>
            
            <div className="grid grid-cols-2 gap-3">
              <Button 
                variant="outline" 
                className="flex items-center space-x-2 hover:bg-blue-50 hover:border-blue-200 transition-colors" 
                onClick={() => handleDemoLogin(false)}
              >
                <Users className="h-4 w-4 text-blue-500" />
                <span>User Demo</span>
              </Button>
              <Button 
                variant="outline" 
                className="flex items-center space-x-2 hover:bg-purple-50 hover:border-purple-200 transition-colors" 
                onClick={() => handleDemoLogin(true)}
              >
                <Shield className="h-4 w-4 text-purple-500" />
                <span>Admin Demo</span>
              </Button>
            </div>
            
            <Alert className="border-blue-200 bg-blue-50/50">
              <AlertDescription className="text-sm text-blue-700">
                Demo accounts let you explore all features without creating an account. Your demo data won't be saved.
              </AlertDescription>
            </Alert>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}