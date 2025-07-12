import React, { useState } from 'react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Textarea } from './ui/textarea';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from './ui/dialog';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from './ui/table';
import { Alert, AlertDescription } from './ui/alert';
import { 
  Shield, 
  Ban, 
  MessageSquare, 
  Download, 
  Users, 
  Activity,
  AlertTriangle,
  CheckCircle,
  XCircle,
  Clock,
  Star,
  UserPlus,
  UserMinus,
  ShieldOff,
  AlertCircle
} from 'lucide-react';
import { useApp, AdminMessage } from '../context/AppContext';

export function AdminDashboard() {
  const { state, dispatch } = useApp();
  let { currentUser, users, swapRequests, feedback, adminMessages } = state;

  // Seed a default admin user if there are no users
  if (users.length === 0) {
    const defaultAdmin = {
      id: 'admin-1',
      name: 'Default Admin',
      email: 'sugamsharma003@gmail.com',
      isAdmin: true,
      isPublic: true,
      isBanned: false,
      skillsOffered: [],
      skillsWanted: [],
      availability: [],
      rating: 5,
      totalRatings: 0,
      createdAt: new Date(),
      location: 'N/A',
      profilePhoto: undefined
    };
    users = [defaultAdmin];
    currentUser = defaultAdmin;
  }
  const [messageDialog, setMessageDialog] = useState(false);
  const [messageForm, setMessageForm] = useState({ title: '', content: '' });
  const [confirmDialog, setConfirmDialog] = useState<{
    open: boolean;
    type: 'ban' | 'unban' | 'makeAdmin' | 'removeAdmin';
    userId: string;
    userName: string;
  }>({ open: false, type: 'ban', userId: '', userName: '' });

  if (!currentUser?.isAdmin) {
    return (
      <div className="max-w-4xl mx-auto p-6">
        <Alert>
          <AlertTriangle className="h-4 w-4" />
          <AlertDescription>
            You don't have permission to access the admin dashboard.
          </AlertDescription>
        </Alert>
      </div>
    );
  }

  const handleAction = (type: 'ban' | 'unban' | 'makeAdmin' | 'removeAdmin', userId: string, userName: string) => {
    setConfirmDialog({ open: true, type, userId, userName });
  };

  const executeAction = () => {
    const { type, userId } = confirmDialog;
    
    switch (type) {
      case 'ban':
        dispatch({ type: 'BAN_USER', payload: userId });
        break;
      case 'unban':
        dispatch({ type: 'UNBAN_USER', payload: userId });
        break;
      case 'makeAdmin':
        dispatch({ type: 'MAKE_ADMIN', payload: userId });
        break;
      case 'removeAdmin':
        dispatch({ type: 'REMOVE_ADMIN', payload: userId });
        break;
    }
    
    setConfirmDialog({ open: false, type: 'ban', userId: '', userName: '' });
  };

  const handleSendMessage = () => {
    const newMessage: AdminMessage = {
      id: Date.now().toString(),
      title: messageForm.title,
      content: messageForm.content,
      createdAt: new Date(),
      adminId: currentUser.id
    };

    dispatch({ type: 'ADD_ADMIN_MESSAGE', payload: newMessage });
    setMessageDialog(false);
    setMessageForm({ title: '', content: '' });
  };

  const downloadReport = () => {
    const reportData = {
      users: users.length,
      activeUsers: users.filter(u => !u.isBanned).length,
      bannedUsers: users.filter(u => u.isBanned).length,
      adminUsers: users.filter(u => u.isAdmin && !u.isBanned).length,
      totalSwaps: swapRequests.length,
      pendingSwaps: swapRequests.filter(s => s.status === 'pending').length,
      acceptedSwaps: swapRequests.filter(s => s.status === 'accepted').length,
      completedSwaps: swapRequests.filter(s => s.status === 'completed').length,
      cancelledSwaps: swapRequests.filter(s => s.status === 'cancelled').length,
      totalFeedback: feedback.length,
      averageRating: feedback.length > 0 ? 
        feedback.reduce((sum, f) => sum + f.rating, 0) / feedback.length : 0,
      generatedAt: new Date().toISOString(),
      generatedBy: currentUser.name,
      userDetails: users.map(u => ({
        id: u.id,
        name: u.name,
        email: u.email,
        isAdmin: u.isAdmin,
        isBanned: u.isBanned,
        isPublic: u.isPublic,
        skillsOffered: u.skillsOffered.length,
        skillsWanted: u.skillsWanted.length,
        rating: u.rating,
        totalRatings: u.totalRatings,
        createdAt: u.createdAt
      })),
      swapDetails: swapRequests.map(s => ({
        id: s.id,
        status: s.status,
        createdAt: s.createdAt,
        updatedAt: s.updatedAt,
        fromUser: users.find(u => u.id === s.fromUserId)?.name || 'Unknown',
        toUser: users.find(u => u.id === s.toUserId)?.name || 'Unknown',
        offeredSkill: s.offeredSkill,
        requestedSkill: s.requestedSkill
      }))
    };

    const blob = new Blob([JSON.stringify(reportData, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `skill-swap-report-${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const stats = {
    totalUsers: users.length,
    activeUsers: users.filter(u => !u.isBanned).length,
    bannedUsers: users.filter(u => u.isBanned).length,
    adminUsers: users.filter(u => u.isAdmin && !u.isBanned).length,
    totalSwaps: swapRequests.length,
    pendingSwaps: swapRequests.filter(s => s.status === 'pending').length,
    acceptedSwaps: swapRequests.filter(s => s.status === 'accepted').length,
    completedSwaps: swapRequests.filter(s => s.status === 'completed').length,
    cancelledSwaps: swapRequests.filter(s => s.status === 'cancelled').length,
    rejectedSwaps: swapRequests.filter(s => s.status === 'rejected').length,
    totalFeedback: feedback.length,
    averageRating: feedback.length > 0 ? 
      feedback.reduce((sum, f) => sum + f.rating, 0) / feedback.length : 0
  };

  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    }).format(date);
  };

  const canPerformAction = (targetUser: any, action: 'ban' | 'unban' | 'makeAdmin' | 'removeAdmin') => {
    if (targetUser.id === currentUser.id) return false;
    
    if (action === 'removeAdmin') {
      const adminCount = users.filter(u => u.isAdmin && !u.isBanned).length;
      return adminCount > 1;
    }
    
    return true;
  };

  const getActionText = (type: string) => {
    switch (type) {
      case 'ban': return 'ban';
      case 'unban': return 'unban';
      case 'makeAdmin': return 'grant admin privileges to';
      case 'removeAdmin': return 'remove admin privileges from';
      default: return 'perform action on';
    }
  };

  return (
    <div className="max-w-7xl mx-auto p-6 space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold flex items-center">
            <div className="p-2 bg-gradient-to-br from-red-500 to-pink-600 rounded-xl mr-3">
              <Shield className="h-6 w-6 text-white" />
            </div>
            Admin Dashboard
          </h1>
          <p className="text-muted-foreground">Platform management and monitoring</p>
        </div>
        <div className="flex space-x-2">
          <Dialog open={messageDialog} onOpenChange={setMessageDialog}>
            <DialogTrigger asChild>
              <Button type="button" className="flex items-center space-x-2 bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700">
                <MessageSquare size={16} />
                <span>Send Message</span>
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Send Platform Message</DialogTitle>
                <DialogDescription>
                  Send a message to all platform users
                </DialogDescription>
              </DialogHeader>
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="message-title">Title</Label>
                  <Input
                    id="message-title"
                    value={messageForm.title}
                    onChange={(e) => setMessageForm(prev => ({ ...prev, title: e.target.value }))}
                    placeholder="Message title..."
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="message-content">Content</Label>
                  <Textarea
                    id="message-content"
                    value={messageForm.content}
                    onChange={(e) => setMessageForm(prev => ({ ...prev, content: e.target.value }))}
                    placeholder="Message content..."
                    rows={4}
                  />
                </div>
                <div className="flex justify-end space-x-2">
                  <Button variant="outline" onClick={() => setMessageDialog(false)}>
                    Cancel
                  </Button>
                  <Button 
                    onClick={handleSendMessage}
                    disabled={!messageForm.title || !messageForm.content}
                  >
                    Send Message
                  </Button>
                </div>
              </div>
            </DialogContent>
          </Dialog>
          
          <Button variant="outline" onClick={downloadReport} className="flex items-center space-x-2 hover:bg-green-50 border-green-200">
            <Download size={16} />
            <span>Download Report</span>
          </Button>
        </div>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="hover-lift bg-gradient-to-br from-blue-50 to-indigo-50 border-blue-200/50 shadow-colorful">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-blue-600 font-medium">Total Users</p>
                <p className="text-2xl font-bold text-blue-700">{stats.totalUsers}</p>
                <p className="text-xs text-blue-500 mt-1">
                  {stats.activeUsers} active, {stats.bannedUsers} banned
                </p>
              </div>
              <div className="p-3 bg-blue-100 rounded-xl">
                <Users className="h-6 w-6 text-blue-600" />
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card className="hover-lift bg-gradient-to-br from-purple-50 to-pink-50 border-purple-200/50 shadow-colorful">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-purple-600 font-medium">Admin Users</p>
                <p className="text-2xl font-bold text-purple-700">{stats.adminUsers}</p>
                <p className="text-xs text-purple-500 mt-1">
                  Platform administrators
                </p>
              </div>
              <div className="p-3 bg-purple-100 rounded-xl">
                <Shield className="h-6 w-6 text-purple-600" />
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card className="hover-lift bg-gradient-to-br from-green-50 to-emerald-50 border-green-200/50 shadow-colorful">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-green-600 font-medium">Active Swaps</p>
                <p className="text-2xl font-bold text-green-700">{stats.acceptedSwaps}</p>
                <p className="text-xs text-green-500 mt-1">
                  {stats.pendingSwaps} pending
                </p>
              </div>
              <div className="p-3 bg-green-100 rounded-xl">
                <Activity className="h-6 w-6 text-green-600" />
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card className="hover-lift bg-gradient-to-br from-yellow-50 to-orange-50 border-yellow-200/50 shadow-colorful">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-yellow-600 font-medium">Avg Rating</p>
                <p className="text-2xl font-bold text-yellow-700">{stats.averageRating.toFixed(1)}</p>
                <p className="text-xs text-yellow-500 mt-1">
                  {stats.totalFeedback} reviews
                </p>
              </div>
              <div className="p-3 bg-yellow-100 rounded-xl">
                <Star className="h-6 w-6 text-yellow-600" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="users" className="space-y-4">
        <TabsList>
          <TabsTrigger value="users">User Management</TabsTrigger>
          <TabsTrigger value="swaps">Swap Monitoring</TabsTrigger>
          <TabsTrigger value="feedback">Feedback Review</TabsTrigger>
          <TabsTrigger value="messages">Platform Messages</TabsTrigger>
        </TabsList>

        <TabsContent value="users" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>User Management</CardTitle>
              <CardDescription>Manage platform users, permissions, and access</CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>User</TableHead>
                    <TableHead>Email</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Skills</TableHead>
                    <TableHead>Rating</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {users.map(user => (
                    <TableRow key={user.id} className={user.isBanned ? 'opacity-60 bg-red-50/50' : ''}>
                      <TableCell>
                        <div className="flex items-center space-x-3">
                          <Avatar className="h-8 w-8">
                            <AvatarImage src={user.profilePhoto} alt={user.name} />
                            <AvatarFallback>
                              {user.name.split(' ').map(n => n[0]).join('').toUpperCase()}
                            </AvatarFallback>
                          </Avatar>
                          <div>
                            <p className="font-medium">{user.name}</p>
                            <p className="text-sm text-muted-foreground">{user.location}</p>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>{user.email}</TableCell>
                      <TableCell>
                        <div className="flex flex-wrap gap-1">
                          {user.isAdmin && !user.isBanned && (
                            <Badge className="bg-gradient-to-r from-purple-500 to-pink-600 text-white border-0">
                              <Shield size={12} className="mr-1" />
                              Admin
                            </Badge>
                          )}
                          {user.isBanned && (
                            <Badge variant="destructive">
                              <Ban size={12} className="mr-1" />
                              Banned
                            </Badge>
                          )}
                          {!user.isPublic && (
                            <Badge variant="secondary">Private</Badge>
                          )}
                          {user.id === currentUser.id && (
                            <Badge variant="outline">You</Badge>
                          )}
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="text-sm">
                          <Badge variant="outline" className="text-xs">
                            {user.skillsOffered.length} offered
                          </Badge>
                          <Badge variant="outline" className="text-xs ml-1">
                            {user.skillsWanted.length} wanted
                          </Badge>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center">
                          <Star className="h-4 w-4 fill-yellow-400 text-yellow-400 mr-1" />
                          {user.rating.toFixed(1)} ({user.totalRatings})
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex flex-wrap gap-1">
                          {/* Admin Management */}
                          {!user.isAdmin && canPerformAction(user, 'makeAdmin') && !user.isBanned && (
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => handleAction('makeAdmin', user.id, user.name)}
                              className="flex items-center space-x-1 hover:bg-purple-50 border-purple-200"
                            >
                              <UserPlus size={12} />
                              <span>Make Admin</span>
                            </Button>
                          )}
                          
                          {user.isAdmin && canPerformAction(user, 'removeAdmin') && !user.isBanned && (
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => handleAction('removeAdmin', user.id, user.name)}
                              className="flex items-center space-x-1 hover:bg-gray-50"
                            >
                              <ShieldOff size={12} />
                              <span>Remove Admin</span>
                            </Button>
                          )}
                          
                          {/* Ban Management */}
                          {!user.isBanned && canPerformAction(user, 'ban') && (
                            <Button
                              size="sm"
                              variant="destructive"
                              onClick={() => handleAction('ban', user.id, user.name)}
                              className="flex items-center space-x-1"
                            >
                              <Ban size={12} />
                              <span>Ban</span>
                            </Button>
                          )}
                          
                          {user.isBanned && canPerformAction(user, 'unban') && (
                            <Button
                              size="sm"
                              variant="default"
                              onClick={() => handleAction('unban', user.id, user.name)}
                              className="flex items-center space-x-1 bg-gradient-to-r from-green-500 to-emerald-600"
                            >
                              <CheckCircle size={12} />
                              <span>Unban</span>
                            </Button>
                          )}
                          
                          {user.id === currentUser.id && (
                            <span className="text-sm text-muted-foreground">Current User</span>
                          )}
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Other tabs content remains the same... */}
        <TabsContent value="swaps" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Swap Request Monitoring</CardTitle>
              <CardDescription>Monitor all swap requests and their status</CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>From</TableHead>
                    <TableHead>To</TableHead>
                    <TableHead>Skills</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Date</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {swapRequests.map(request => {
                    const fromUser = users.find(u => u.id === request.fromUserId);
                    const toUser = users.find(u => u.id === request.toUserId);
                    
                    return (
                      <TableRow key={request.id} className={
                        (fromUser?.isBanned || toUser?.isBanned) ? 'opacity-60 bg-red-50/30' : ''
                      }>
                        <TableCell>
                          <div className="flex items-center space-x-2">
                            <span>{fromUser?.name || 'Unknown'}</span>
                            {fromUser?.isBanned && (
                              <Badge variant="destructive" className="text-xs">
                                <Ban size={10} className="mr-1" />
                                Banned
                              </Badge>
                            )}
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center space-x-2">
                            <span>{toUser?.name || 'Unknown'}</span>
                            {toUser?.isBanned && (
                              <Badge variant="destructive" className="text-xs">
                                <Ban size={10} className="mr-1" />
                                Banned
                              </Badge>
                            )}
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="text-sm">
                            <p><strong>Offered:</strong> {request.offeredSkill}</p>
                            <p><strong>Requested:</strong> {request.requestedSkill}</p>
                          </div>
                        </TableCell>
                        <TableCell>
                          <Badge 
                            variant={
                              request.status === 'completed' ? 'default' :
                              request.status === 'accepted' ? 'default' :
                              request.status === 'rejected' ? 'destructive' : 
                              request.status === 'cancelled' ? 'destructive' : 'secondary'
                            }
                            className="flex items-center space-x-1 w-fit"
                          >
                            {request.status === 'pending' && <Clock size={12} />}
                            {request.status === 'accepted' && <CheckCircle size={12} />}
                            {request.status === 'rejected' && <XCircle size={12} />}
                            {request.status === 'cancelled' && <Ban size={12} />}
                            {request.status === 'completed' && <Star size={12} />}
                            <span>{request.status}</span>
                          </Badge>
                        </TableCell>
                        <TableCell>{formatDate(request.createdAt)}</TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="feedback" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Feedback Review</CardTitle>
              <CardDescription>Review user feedback and ratings</CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>From</TableHead>
                    <TableHead>To</TableHead>
                    <TableHead>Rating</TableHead>
                    <TableHead>Comment</TableHead>
                    <TableHead>Date</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {feedback.map(fb => {
                    const fromUser = users.find(u => u.id === fb.fromUserId);
                    const toUser = users.find(u => u.id === fb.toUserId);
                    
                    return (
                      <TableRow key={fb.id}>
                        <TableCell>{fromUser?.name || 'Unknown'}</TableCell>
                        <TableCell>{toUser?.name || 'Unknown'}</TableCell>
                        <TableCell>
                          <div className="flex items-center">
                            <Star className="h-4 w-4 fill-yellow-400 text-yellow-400 mr-1" />
                            {fb.rating}
                          </div>
                        </TableCell>
                        <TableCell className="max-w-md truncate">{fb.comment}</TableCell>
                        <TableCell>{formatDate(fb.createdAt)}</TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="messages" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Platform Messages</CardTitle>
              <CardDescription>Messages sent to platform users</CardDescription>
            </CardHeader>
            <CardContent>
              {adminMessages.length === 0 ? (
                <p className="text-muted-foreground text-center py-8">No messages sent yet</p>
              ) : (
                <div className="space-y-4">
                  {adminMessages.map(message => (
                    <div key={message.id} className="border rounded-lg p-4">
                      <div className="flex justify-between items-start mb-2">
                        <h3 className="font-medium">{message.title}</h3>
                        <span className="text-sm text-muted-foreground">
                          {formatDate(message.createdAt)}
                        </span>
                      </div>
                      <p className="text-sm text-muted-foreground">{message.content}</p>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Confirmation Dialog */}
      <Dialog open={confirmDialog.open} onOpenChange={(open) => 
        setConfirmDialog(prev => ({ ...prev, open }))
      }>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="flex items-center space-x-2">
              <AlertCircle className="h-5 w-5 text-orange-500" />
              <span>Confirm Action</span>
            </DialogTitle>
            <DialogDescription>
              This action will have immediate effects on the user's account and access.
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4">
            <Alert className={
              confirmDialog.type === 'ban' ? 'border-red-200 bg-red-50' : 
              confirmDialog.type === 'unban' ? 'border-green-200 bg-green-50' :
              'border-blue-200 bg-blue-50'
            }>
              <AlertTriangle className="h-4 w-4" />
              <AlertDescription>
                Are you sure you want to <strong>{getActionText(confirmDialog.type)}</strong> user{' '}
                <strong>{confirmDialog.userName}</strong>?
                {confirmDialog.type === 'ban' && (
                  <div className="mt-2 text-sm">
                    <strong>This will:</strong>
                    <ul className="list-disc list-inside mt-1 space-y-1">
                      <li>Immediately log out the user</li>
                      <li>Remove admin privileges (if applicable)</li>
                      <li>Cancel all pending swap requests</li>
                      <li>Block access to all platform features</li>
                    </ul>
                  </div>
                )}
              </AlertDescription>
            </Alert>
            
            <div className="flex justify-end space-x-2">
              <Button 
                variant="outline" 
                onClick={() => setConfirmDialog(prev => ({ ...prev, open: false }))}
              >
                Cancel
              </Button>
              <Button 
                variant={confirmDialog.type === 'ban' ? 'destructive' : 'default'}
                onClick={executeAction}
                className={
                  confirmDialog.type === 'unban' ? 'bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700' : ''
                }
              >
                {confirmDialog.type === 'ban' && 'Ban User'}
                {confirmDialog.type === 'unban' && 'Unban User'}
                {confirmDialog.type === 'makeAdmin' && 'Grant Admin'}
                {confirmDialog.type === 'removeAdmin' && 'Remove Admin'}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}