import React, { useState, useMemo } from 'react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from './ui/dialog';
import { Textarea } from './ui/textarea';
import { Label } from './ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Search, MapPin, Star, Calendar, MessageCircle, Users, Sparkles, Filter, Heart } from 'lucide-react';
import { useApp, User, SwapRequest } from '../context/AppContext';

export function SkillBrowser() {
  const { state, dispatch } = useApp();
  const { currentUser, users, swapRequests } = state;
  const [searchTerm, setSearchTerm] = useState('');
  const [locationFilter, setLocationFilter] = useState('all');
  const [swapDialogOpen, setSwapDialogOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [swapRequest, setSwapRequest] = useState({
    offeredSkill: '',
    requestedSkill: '',
    message: ''
  });

  const filteredUsers = useMemo(() => {
    return users.filter(user => {
      if (user.id === currentUser?.id) return false;
      if (!user.isPublic) return false;
      if (user.isBanned) return false;
      
      const matchesSearch = searchTerm === '' || 
        user.skillsOffered.some(skill => 
          skill.toLowerCase().includes(searchTerm.toLowerCase())
        ) ||
        user.name.toLowerCase().includes(searchTerm.toLowerCase());
      
      const matchesLocation = locationFilter === 'all' || 
        (user.location && user.location.toLowerCase().includes(locationFilter.toLowerCase()));
      
      return matchesSearch && matchesLocation;
    });
  }, [users, currentUser, searchTerm, locationFilter]);

  const handleOpenSwapDialog = (user: User, requestedSkill: string) => {
    if (currentUser?.isBanned) {
      alert('Your account has been banned and you cannot create swap requests.');
      return;
    }

    setSelectedUser(user);
    setSwapRequest(prev => ({ ...prev, requestedSkill }));
    setSwapDialogOpen(true);
  };

  const handleSendSwapRequest = () => {
    if (!selectedUser || !currentUser) return;

    if (currentUser.isBanned) {
      alert('Your account has been banned and you cannot create swap requests.');
      setSwapDialogOpen(false);
      return;
    }

    const newSwapRequest: SwapRequest = {
      id: Date.now().toString(),
      fromUserId: currentUser.id,
      toUserId: selectedUser.id,
      offeredSkill: swapRequest.offeredSkill,
      requestedSkill: swapRequest.requestedSkill,
      message: swapRequest.message,
      status: 'pending',
      createdAt: new Date(),
      updatedAt: new Date()
    };

    dispatch({ type: 'ADD_SWAP_REQUEST', payload: newSwapRequest });
    setSwapDialogOpen(false);
    setSwapRequest({ offeredSkill: '', requestedSkill: '', message: '' });
    setSelectedUser(null);
  };

  const hasExistingRequest = (userId: string, skill: string) => {
    return swapRequests.some(request => 
      request.fromUserId === currentUser?.id &&
      request.toUserId === userId &&
      request.requestedSkill === skill &&
      ['pending', 'accepted'].includes(request.status)
    );
  };

  const uniqueLocations = Array.from(new Set(
    users.filter(u => u.location && !u.isBanned).map(u => u.location)
  )).filter(Boolean) as string[];

  if (currentUser?.isBanned) {
    return (
      <div className="max-w-4xl mx-auto p-6">
        <Card className="border-destructive bg-gradient-to-br from-red-50 to-pink-50 shadow-colorful">
          <CardContent className="p-8 text-center">
            <div className="text-destructive text-lg font-medium mb-2">
              Account Restricted
            </div>
            <p className="text-muted-foreground">
              Your account has been banned and you cannot access the skill browser or create swap requests. 
              Please contact the administrators if you believe this is an error.
            </p>
          </CardContent>
        </Card>
      </div>
    );
  }

  const skillColors = [
    'from-blue-500 to-purple-600',
    'from-green-500 to-emerald-600',
    'from-orange-500 to-red-600',
    'from-purple-500 to-pink-600',
    'from-indigo-500 to-blue-600'
  ];

  const getSkillColor = (index: number) => skillColors[index % skillColors.length];

  return (
    <div className="max-w-7xl mx-auto p-6 space-y-8">
      {/* Header Section */}
      <div className="text-center space-y-4">
        <div className="flex items-center justify-center space-x-3">
          <div className="p-3 bg-gradient-to-br from-blue-500 to-purple-600 rounded-2xl shadow-lg">
            <Search className="h-8 w-8 text-white" />
          </div>
          <div>
            <h1 className="text-3xl font-bold text-gradient">Discover Amazing Skills</h1>
            <p className="text-muted-foreground">Connect with talented people and expand your knowledge</p>
          </div>
        </div>
        
        <div className="flex items-center justify-center space-x-6 text-sm text-muted-foreground">
          <div className="flex items-center space-x-2">
            <Users className="h-4 w-4 text-blue-500" />
            <span>{filteredUsers.length} Active Members</span>
          </div>
          <div className="flex items-center space-x-2">
            <Sparkles className="h-4 w-4 text-purple-500" />
            <span>{users.reduce((acc, u) => acc + u.skillsOffered.length, 0)} Skills Available</span>
          </div>
        </div>
      </div>

      {/* Search and Filter Section */}
      <Card className="shadow-colorful bg-gradient-to-r from-white via-blue-50/30 to-purple-50/30 border-blue-200/50">
        <CardContent className="p-6">
          <div className="flex flex-col lg:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-blue-500" size={20} />
                <Input
                  placeholder="Search for skills, people, or expertise..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-12 h-12 border-blue-200 focus:border-blue-400 bg-white/80 backdrop-blur-sm"
                />
              </div>
            </div>
            <div className="flex items-center space-x-3">
              <Filter className="h-5 w-5 text-purple-500" />
              <Select value={locationFilter} onValueChange={setLocationFilter}>
                <SelectTrigger className="w-full lg:w-[200px] h-12 border-purple-200 focus:border-purple-400 bg-white/80 backdrop-blur-sm">
                  <SelectValue placeholder="Filter by location" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All locations</SelectItem>
                  {uniqueLocations.map(location => (
                    <SelectItem key={location} value={location}>{location}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Results Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredUsers.map((user, userIndex) => (
          <Card key={user.id} className="hover-lift shadow-colorful bg-white/80 backdrop-blur-sm border-0 hover:shadow-colorful-lg transition-all duration-300">
            <CardHeader className="pb-4 relative overflow-hidden">
              {/* Decorative gradient background */}
              <div className={`absolute inset-0 bg-gradient-to-br ${getSkillColor(userIndex)} opacity-5`}></div>
              
              <div className="relative z-10 flex items-center space-x-4">
                <div className="relative">
                  <Avatar className="h-16 w-16 ring-4 ring-white shadow-lg">
                    <AvatarImage src={user.profilePhoto} alt={user.name} />
                    <AvatarFallback className={`bg-gradient-to-br ${getSkillColor(userIndex)} text-white text-lg`}>
                      {user.name.split(' ').map(n => n[0]).join('').toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                  <div className="absolute -bottom-1 -right-1 w-6 h-6 bg-gradient-to-r from-green-400 to-emerald-500 rounded-full border-3 border-white flex items-center justify-center">
                    <Sparkles size={12} className="text-white" />
                  </div>
                </div>
                
                <div className="flex-1 min-w-0">
                  <CardTitle className="text-lg truncate text-gray-800">{user.name}</CardTitle>
                  {user.location && (
                    <CardDescription className="flex items-center text-gray-600">
                      <MapPin size={14} className="mr-1 text-blue-500" />
                      {user.location}
                    </CardDescription>
                  )}
                  
                  <div className="flex items-center justify-between mt-2">
                    <div className="flex items-center text-sm">
                      <Star className="h-4 w-4 fill-yellow-400 text-yellow-500 mr-1" />
                      <span className="font-medium text-gray-700">{user.rating.toFixed(1)}</span>
                      <span className="text-gray-500 ml-1">({user.totalRatings})</span>
                    </div>
                    {user.availability.length > 0 && (
                      <div className="flex items-center text-xs text-green-600 bg-green-50 px-2 py-1 rounded-full">
                        <Calendar size={12} className="mr-1" />
                        Available
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </CardHeader>
            
            <CardContent className="space-y-4">
              <div>
                <h4 className="text-sm font-semibold mb-3 text-gray-700 flex items-center">
                  <Heart className="h-4 w-4 mr-2 text-rose-500" />
                  Skills Offered
                </h4>
                <div className="flex flex-wrap gap-2">
                  {user.skillsOffered.slice(0, 3).map((skill, skillIndex) => (
                    <Badge 
                      key={skill} 
                      className={`text-xs bg-gradient-to-r ${getSkillColor(skillIndex)} text-white border-0 shadow-sm hover:shadow-md transition-shadow`}
                    >
                      {skill}
                    </Badge>
                  ))}
                  {user.skillsOffered.length > 3 && (
                    <Badge variant="outline" className="text-xs border-gray-300 text-gray-600">
                      +{user.skillsOffered.length - 3} more
                    </Badge>
                  )}
                </div>
              </div>

              {user.skillsWanted.length > 0 && (
                <div>
                  <h4 className="text-sm font-semibold mb-3 text-gray-700 flex items-center">
                    <Search className="h-4 w-4 mr-2 text-blue-500" />
                    Looking for
                  </h4>
                  <div className="flex flex-wrap gap-2">
                    {user.skillsWanted.slice(0, 3).map(skill => (
                      <Badge key={skill} variant="outline" className="text-xs border-blue-200 text-blue-700 bg-blue-50">
                        {skill}
                      </Badge>
                    ))}
                    {user.skillsWanted.length > 3 && (
                      <Badge variant="outline" className="text-xs border-gray-300 text-gray-600">
                        +{user.skillsWanted.length - 3} more
                      </Badge>
                    )}
                  </div>
                </div>
              )}

              <div className="space-y-2 pt-2 border-t border-gray-100">
                {user.skillsOffered.map((skill, skillIndex) => {
                  const hasRequest = hasExistingRequest(user.id, skill);
                  const canOffer = currentUser?.skillsOffered.some(offered => 
                    user.skillsWanted.includes(offered)
                  );
                  
                  return (
                    <Button
                      key={skill}
                      size="sm"
                      variant={hasRequest ? "secondary" : "outline"}
                      className={`w-full justify-start transition-all duration-200 ${
                        hasRequest 
                          ? 'bg-gray-100 text-gray-600 cursor-not-allowed' 
                          : `hover:bg-gradient-to-r ${getSkillColor(skillIndex)} hover:text-white hover:border-transparent hover:shadow-md`
                      }`}
                      onClick={() => !hasRequest && handleOpenSwapDialog(user, skill)}
                      disabled={hasRequest || currentUser?.isBanned}
                    >
                      <MessageCircle size={14} className="mr-2" />
                      {hasRequest ? `Request sent for ${skill}` : `Request ${skill}`}
                      {canOffer && !hasRequest && (
                        <Badge className="ml-auto text-xs bg-green-500 text-white border-0">
                          Match!
                        </Badge>
                      )}
                    </Button>
                  );
                })}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {filteredUsers.length === 0 && (
        <div className="text-center py-16">
          <div className="max-w-md mx-auto space-y-4">
            <div className="w-24 h-24 bg-gradient-to-br from-blue-100 to-purple-100 rounded-full flex items-center justify-center mx-auto">
              <Search className="h-12 w-12 text-blue-500" />
            </div>
            <h3 className="text-xl font-semibold text-gray-700">No matches found</h3>
            <p className="text-muted-foreground">
              {searchTerm || (locationFilter !== 'all')
                ? "Try adjusting your search terms or filters to find more users" 
                : "No users are currently available for skill swapping"}
            </p>
          </div>
        </div>
      )}

      {/* Swap Request Dialog */}
      <Dialog open={swapDialogOpen} onOpenChange={setSwapDialogOpen}>
        <DialogContent className="bg-gradient-to-br from-white to-blue-50/30 border-blue-200">
          <DialogHeader>
            <DialogTitle className="text-gradient">Request Skill Swap</DialogTitle>
            <DialogDescription>
              Send a personalized swap request to {selectedUser?.name}
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-6">
            <div className="space-y-2">
              <Label className="text-gray-700">You want to learn:</Label>
              <Input 
                value={swapRequest.requestedSkill} 
                disabled 
                className="bg-blue-50 border-blue-200"
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="offered-skill" className="text-gray-700">You offer in return:</Label>
              <Select value={swapRequest.offeredSkill} onValueChange={(value) => 
                setSwapRequest(prev => ({ ...prev, offeredSkill: value }))
              }>
                <SelectTrigger className="border-purple-200 focus:border-purple-400">
                  <SelectValue placeholder="Select a skill you offer" />
                </SelectTrigger>
                <SelectContent>
                  {currentUser?.skillsOffered.map(skill => (
                    <SelectItem key={skill} value={skill}>{skill}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="message" className="text-gray-700">Personal message (optional):</Label>
              <Textarea
                id="message"
                placeholder="Hi! I'd love to learn from you. Here's what I can offer in return..."
                value={swapRequest.message}
                onChange={(e) => setSwapRequest(prev => ({ ...prev, message: e.target.value }))}
                className="border-green-200 focus:border-green-400 min-h-[100px]"
              />
            </div>
            
            <div className="flex justify-end space-x-3 pt-4 border-t border-gray-100">
              <Button variant="outline" onClick={() => setSwapDialogOpen(false)}>
                Cancel
              </Button>
              <Button 
                onClick={handleSendSwapRequest}
                disabled={!swapRequest.offeredSkill}
                className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white shadow-lg"
              >
                Send Request
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}