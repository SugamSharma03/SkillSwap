import React from 'react';
import { Button } from './ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import { Progress } from './ui/progress';
import { Alert, AlertDescription } from './ui/alert';
import { 
  User, 
  Search, 
  MessageSquare, 
  Star, 
  TrendingUp, 
  Users, 
  BookOpen,
  Zap,
  Target,
  Award,
  Clock,
  ArrowRight,
  Sparkles,
  Globe,
  CheckCircle2
} from 'lucide-react';
import { useApp } from '../context/AppContext';

interface DashboardProps {
  setCurrentView: (view: string) => void;
}

export function Dashboard({ setCurrentView }: DashboardProps) {
  const { state } = useApp();
  const { currentUser, users, swapRequests, feedback, adminMessages } = state;

  if (!currentUser) return null;

  const myRequests = swapRequests.filter(req => req.fromUserId === currentUser.id);
  const requestsToMe = swapRequests.filter(req => req.toUserId === currentUser.id);
  const pendingRequests = requestsToMe.filter(req => req.status === 'pending');
  const completedSwaps = [...myRequests, ...requestsToMe].filter(req => req.status === 'completed');

  const stats = {
    totalUsers: users.filter(u => !u.isBanned && u.isPublic).length,
    mySkills: currentUser.skillsOffered.length,
    wantedSkills: currentUser.skillsWanted.length,
    completedSwaps: completedSwaps.length,
    pendingRequests: pendingRequests.length,
    rating: currentUser.rating,
    totalRatings: currentUser.totalRatings
  };

  const recentMessages = adminMessages.slice(-3).reverse();

  const quickActions = [
    {
      title: 'Browse Skills',
      description: 'Discover new skills and connect with learners',
      icon: Search,
      action: () => setCurrentView('browse'),
      color: 'from-emerald-500 to-teal-600',
      bgColor: 'from-emerald-50 to-teal-50',
      iconBg: 'bg-emerald-100',
      iconColor: 'text-emerald-600'
    },
    {
      title: 'Manage Swaps',
      description: 'Review and manage your skill exchange requests',
      icon: MessageSquare,
      action: () => setCurrentView('swaps'),
      color: 'from-blue-500 to-indigo-600',
      bgColor: 'from-blue-50 to-indigo-50',
      iconBg: 'bg-blue-100',
      iconColor: 'text-blue-600',
      badge: pendingRequests.length > 0 ? pendingRequests.length : undefined
    },
    {
      title: 'Update Profile',
      description: 'Add new skills and update your information',
      icon: User,
      action: () => setCurrentView('profile'),
      color: 'from-purple-500 to-pink-600',
      bgColor: 'from-purple-50 to-pink-50',
      iconBg: 'bg-purple-100',
      iconColor: 'text-purple-600'
    }
  ];

  const skillProgress = currentUser.skillsOffered.length > 0 ? 
    Math.min((currentUser.skillsOffered.length / 10) * 100, 100) : 0;

  return (
    <div className="max-w-7xl mx-auto p-6 space-y-8">
      {/* Welcome Section */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-blue-600 via-purple-600 to-pink-600 text-white shadow-colorful-lg">
        <div className="absolute inset-0 bg-black/10"></div>
        <div className="absolute top-0 right-0 w-40 h-40 bg-white/10 rounded-full -translate-y-20 translate-x-20"></div>
        <div className="absolute bottom-0 left-0 w-32 h-32 bg-white/5 rounded-full translate-y-16 -translate-x-16"></div>
        
        <div className="relative z-10 p-8">
          <div className="flex items-center justify-between">
            <div className="space-y-4">
              <div className="flex items-center space-x-3">
                <div className="p-2 bg-white/20 rounded-lg backdrop-blur-sm">
                  <Sparkles className="h-6 w-6" />
                </div>
                <div>
                  <h1 className="text-3xl font-bold">Welcome back, {currentUser.name}!</h1>
                  <p className="text-blue-100">Ready to learn and share amazing skills?</p>
                </div>
              </div>
              
              <div className="flex items-center space-x-6">
                <div className="flex items-center space-x-2">
                  <Star className="h-5 w-5 text-yellow-300" />
                  <span className="font-medium">{currentUser.rating.toFixed(1)} Rating</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Award className="h-5 w-5 text-green-300" />
                  <span className="font-medium">{stats.completedSwaps} Swaps Completed</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Globe className="h-5 w-5 text-blue-300" />
                  <span className="font-medium">{currentUser.isPublic ? 'Public Profile' : 'Private Profile'}</span>
                </div>
              </div>
            </div>
            
            <div className="hidden lg:block">
              <div className="w-32 h-32 bg-white/10 rounded-full flex items-center justify-center backdrop-blur-sm">
                <BookOpen className="h-16 w-16 text-white/80" />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
        <Card className="hover-lift bg-gradient-to-br from-blue-50 to-indigo-50 border-blue-200/50 shadow-colorful">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-blue-600 font-medium">My Skills</p>
                <p className="text-3xl font-bold text-blue-700">{stats.mySkills}</p>
              </div>
              <div className="p-3 bg-blue-100 rounded-xl">
                <Target className="h-6 w-6 text-blue-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="hover-lift bg-gradient-to-br from-green-50 to-emerald-50 border-green-200/50 shadow-colorful">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-green-600 font-medium">Learning Goals</p>
                <p className="text-3xl font-bold text-green-700">{stats.wantedSkills}</p>
              </div>
              <div className="p-3 bg-green-100 rounded-xl">
                <BookOpen className="h-6 w-6 text-green-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="hover-lift bg-gradient-to-br from-purple-50 to-pink-50 border-purple-200/50 shadow-colorful">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-purple-600 font-medium">Pending Requests</p>
                <p className="text-3xl font-bold text-purple-700">{stats.pendingRequests}</p>
              </div>
              <div className="p-3 bg-purple-100 rounded-xl">
                <Clock className="h-6 w-6 text-purple-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="hover-lift bg-gradient-to-br from-orange-50 to-red-50 border-orange-200/50 shadow-colorful">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-orange-600 font-medium">Community</p>
                <p className="text-3xl font-bold text-orange-700">{stats.totalUsers}</p>
              </div>
              <div className="p-3 bg-orange-100 rounded-xl">
                <Users className="h-6 w-6 text-orange-600" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions */}
      <div className="space-y-4">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Quick Actions</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {quickActions.map((action, index) => {
            const Icon = action.icon;
            return (
              <Card key={index} className={`hover-lift cursor-pointer group bg-gradient-to-br ${action.bgColor} border-0 shadow-colorful`} onClick={action.action}>
                <CardContent className="p-6">
                  <div className="flex items-start justify-between">
                    <div className="space-y-3 flex-1">
                      <div className="flex items-center space-x-3">
                        <div className={`p-3 ${action.iconBg} rounded-xl group-hover:scale-110 transition-transform`}>
                          <Icon className={`h-6 w-6 ${action.iconColor}`} />
                        </div>
                        {action.badge && (
                          <Badge className="bg-red-500 text-white">{action.badge}</Badge>
                        )}
                      </div>
                      <div>
                        <h3 className="font-semibold text-gray-900 dark:text-white">{action.title}</h3>
                        <p className="text-sm text-gray-600 dark:text-gray-300">{action.description}</p>
                      </div>
                    </div>
                    <ArrowRight className="h-5 w-5 text-gray-400 group-hover:text-gray-600 group-hover:translate-x-1 transition-all" />
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </div>

      {/* Progress Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="shadow-colorful bg-gradient-to-br from-indigo-50 to-purple-50 border-indigo-200/50">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2 text-indigo-700">
              <TrendingUp className="h-5 w-5" />
              <span>Skill Development Progress</span>
            </CardTitle>
            <CardDescription className="text-indigo-600">
              Track your journey to becoming a skill sharing expert
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <div className="flex justify-between text-sm mb-2">
                <span className="text-indigo-600">Skills Offered</span>
                <span className="text-indigo-700 font-medium">{stats.mySkills}/10</span>
              </div>
              <Progress value={skillProgress} className="bg-indigo-100" />
              <p className="text-xs text-indigo-600 mt-1">
                {skillProgress < 100 ? `Add ${10 - stats.mySkills} more skills to complete your profile` : 'Profile complete! 🎉'}
              </p>
            </div>
            
            <div className="pt-4 border-t border-indigo-200">
              <div className="flex items-center space-x-4">
                <div className="flex items-center space-x-2">
                  <CheckCircle2 className="h-4 w-4 text-green-500" />
                  <span className="text-sm text-indigo-700">Profile Visibility: {currentUser.isPublic ? 'Public' : 'Private'}</span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Recent Activity */}
        <Card className="shadow-colorful bg-gradient-to-br from-green-50 to-emerald-50 border-green-200/50">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2 text-green-700">
              <Zap className="h-5 w-5" />
              <span>Recent Activity</span>
            </CardTitle>
            <CardDescription className="text-green-600">
              Your latest skill sharing highlights
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {completedSwaps.length > 0 ? (
              <div className="space-y-3">
                {completedSwaps.slice(-3).map((swap, index) => (
                  <div key={index} className="flex items-center space-x-3 p-3 bg-white/60 rounded-lg">
                    <div className="p-2 bg-green-100 rounded-lg">
                      <CheckCircle2 className="h-4 w-4 text-green-600" />
                    </div>
                    <div className="flex-1">
                      <p className="text-sm font-medium text-green-800">Swap Completed</p>
                      <p className="text-xs text-green-600">
                        {swap.fromUserId === currentUser.id ? 
                          `Taught ${swap.offeredSkill}` : 
                          `Learned ${swap.requestedSkill}`
                        }
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8">
                <BookOpen className="h-12 w-12 text-green-300 mx-auto mb-3" />
                <p className="text-green-600">No swaps completed yet</p>
                <p className="text-xs text-green-500">Start browsing skills to begin your journey!</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Admin Messages */}
      {recentMessages.length > 0 && (
        <Card className="shadow-colorful bg-gradient-to-br from-yellow-50 to-orange-50 border-yellow-200/50">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2 text-orange-700">
              <MessageSquare className="h-5 w-5" />
              <span>Platform Updates</span>
            </CardTitle>
            <CardDescription className="text-orange-600">
              Recent announcements from the admin team
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            {recentMessages.map((message, index) => (
              <Alert key={index} className="border-orange-200 bg-white/60">
                <AlertDescription>
                  <div className="space-y-1">
                    <p className="font-medium text-orange-800">{message.title}</p>
                    <p className="text-sm text-orange-700">{message.content}</p>
                    <p className="text-xs text-orange-500">
                      {new Intl.DateTimeFormat('en-US', {
                        month: 'short',
                        day: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit'
                      }).format(message.createdAt)}
                    </p>
                  </div>
                </AlertDescription>
              </Alert>
            ))}
          </CardContent>
        </Card>
      )}
    </div>
  );
}