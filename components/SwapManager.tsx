import React, { useState } from 'react';
import { Button } from './ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from './ui/dialog';
import { Textarea } from './ui/textarea';
import { Label } from './ui/label';
import { Alert, AlertDescription } from './ui/alert';
import { 
  Check, 
  X, 
  Clock, 
  MessageCircle, 
  Star, 
  Trash2,
  Calendar,
  User,
  Ban
} from 'lucide-react';
import { useApp, SwapRequest, Feedback } from '../context/AppContext';

export function SwapManager() {
  const { state, dispatch } = useApp();
  const { currentUser, users, swapRequests, feedback } = state;
  const [feedbackDialog, setFeedbackDialog] = useState<{
    open: boolean;
    swapRequest: SwapRequest | null;
  }>({ open: false, swapRequest: null });
  const [feedbackForm, setFeedbackForm] = useState({
    rating: 5,
    comment: ''
  });

  if (!currentUser) return null;

  const getUserById = (id: string) => users.find(u => u.id === id);

  const myRequests = swapRequests.filter(req => req.fromUserId === currentUser.id);
  const requestsToMe = swapRequests.filter(req => req.toUserId === currentUser.id);

  const handleAcceptRequest = (requestId: string) => {
    // Prevent banned users from accepting requests
    if (currentUser.isBanned) {
      alert('Your account has been banned and you cannot accept swap requests.');
      return;
    }

    const request = swapRequests.find(r => r.id === requestId);
    if (request) {
      const updatedRequest = {
        ...request,
        status: 'accepted' as const,
        updatedAt: new Date()
      };
      dispatch({ type: 'UPDATE_SWAP_REQUEST', payload: updatedRequest });
    }
  };

  const handleRejectRequest = (requestId: string) => {
    // Prevent banned users from rejecting requests
    if (currentUser.isBanned) {
      alert('Your account has been banned and you cannot reject swap requests.');
      return;
    }

    const request = swapRequests.find(r => r.id === requestId);
    if (request) {
      const updatedRequest = {
        ...request,
        status: 'rejected' as const,
        updatedAt: new Date()
      };
      dispatch({ type: 'UPDATE_SWAP_REQUEST', payload: updatedRequest });
    }
  };

  const handleDeleteRequest = (requestId: string) => {
    // Prevent banned users from deleting requests
    if (currentUser.isBanned) {
      alert('Your account has been banned and you cannot delete swap requests.');
      return;
    }

    dispatch({ type: 'DELETE_SWAP_REQUEST', payload: requestId });
  };

  const handleCompleteSwap = (swapRequest: SwapRequest) => {
    // Prevent banned users from completing swaps
    if (currentUser.isBanned) {
      alert('Your account has been banned and you cannot complete swap requests.');
      return;
    }

    const updatedRequest = {
      ...swapRequest,
      status: 'completed' as const,
      updatedAt: new Date()
    };
    dispatch({ type: 'UPDATE_SWAP_REQUEST', payload: updatedRequest });
    setFeedbackDialog({ open: true, swapRequest: updatedRequest });
  };

  const handleSubmitFeedback = () => {
    if (!feedbackDialog.swapRequest || currentUser.isBanned) return;

    const swap = feedbackDialog.swapRequest;
    const otherUserId = swap.fromUserId === currentUser.id ? swap.toUserId : swap.fromUserId;
    
    const newFeedback: Feedback = {
      id: Date.now().toString(),
      swapRequestId: swap.id,
      fromUserId: currentUser.id,
      toUserId: otherUserId,
      rating: feedbackForm.rating,
      comment: feedbackForm.comment,
      createdAt: new Date()
    };

    dispatch({ type: 'ADD_FEEDBACK', payload: newFeedback });

    // Update the other user's rating
    const otherUser = getUserById(otherUserId);
    if (otherUser) {
      const userFeedback = feedback.filter(f => f.toUserId === otherUserId);
      const totalRating = userFeedback.reduce((sum, f) => sum + f.rating, 0) + feedbackForm.rating;
      const totalCount = userFeedback.length + 1;
      
      const updatedUser = {
        ...otherUser,
        rating: totalRating / totalCount,
        totalRatings: totalCount
      };
      
      dispatch({ type: 'UPDATE_USER', payload: updatedUser });
    }

    setFeedbackDialog({ open: false, swapRequest: null });
    setFeedbackForm({ rating: 5, comment: '' });
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending': return 'secondary';
      case 'accepted': return 'default';
      case 'rejected': return 'destructive';
      case 'completed': return 'default';
      default: return 'secondary';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'pending': return <Clock size={16} />;
      case 'accepted': return <Check size={16} />;
      case 'rejected': return <X size={16} />;
      case 'completed': return <Star size={16} />;
      default: return <Clock size={16} />;
    }
  };

  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat('en-US', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    }).format(date);
  };

  // If current user is banned, show restricted access message
  if (currentUser.isBanned) {
    return (
      <div className="max-w-4xl mx-auto p-6">
        <Alert className="border-destructive">
          <Ban className="h-4 w-4" />
          <AlertDescription>
            Your account has been banned and you cannot access swap management features. 
            All existing swap requests have been suspended. Please contact the administrators if you believe this is an error.
          </AlertDescription>
        </Alert>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto p-6">
      <Tabs defaultValue="requests-to-me" className="space-y-6">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="requests-to-me">
            Requests to Me ({requestsToMe.length})
          </TabsTrigger>
          <TabsTrigger value="my-requests">
            My Requests ({myRequests.length})
          </TabsTrigger>
        </TabsList>

        <TabsContent value="requests-to-me" className="space-y-4">
          {requestsToMe.length === 0 ? (
            <Card>
              <CardContent className="flex flex-col items-center justify-center py-12">
                <MessageCircle size={48} className="text-muted-foreground mb-4" />
                <p className="text-muted-foreground">No swap requests received yet</p>
              </CardContent>
            </Card>
          ) : (
            requestsToMe.map(request => {
              const otherUser = getUserById(request.fromUserId);
              if (!otherUser) return null;

              return (
                <Card key={request.id} className={otherUser.isBanned ? 'opacity-60' : ''}>
                  <CardContent className="p-6">
                    <div className="flex items-start justify-between">
                      <div className="flex space-x-4 flex-1">
                        <Avatar>
                          <AvatarImage src={otherUser.profilePhoto} alt={otherUser.name} />
                          <AvatarFallback>
                            {otherUser.name.split(' ').map(n => n[0]).join('').toUpperCase()}
                          </AvatarFallback>
                        </Avatar>
                        
                        <div className="flex-1 space-y-2">
                          <div className="flex items-center space-x-2">
                            <h3 className="font-medium">{otherUser.name}</h3>
                            <Badge variant={getStatusColor(request.status)} className="flex items-center space-x-1">
                              {getStatusIcon(request.status)}
                              <span>{request.status}</span>
                            </Badge>
                            {otherUser.isBanned && (
                              <Badge variant="destructive" className="flex items-center space-x-1">
                                <Ban size={12} />
                                <span>User Banned</span>
                              </Badge>
                            )}
                          </div>
                          
                          <div className="text-sm text-muted-foreground">
                            <p>Wants to learn: <strong>{request.requestedSkill}</strong></p>
                            <p>Offers in return: <strong>{request.offeredSkill}</strong></p>
                            <p className="flex items-center mt-1">
                              <Calendar size={12} className="mr-1" />
                              {formatDate(request.createdAt)}
                            </p>
                          </div>
                          
                          {request.message && (
                            <div className="bg-muted p-3 rounded-md">
                              <p className="text-sm">{request.message}</p>
                            </div>
                          )}

                          {otherUser.isBanned && (
                            <div className="text-sm text-destructive bg-destructive/10 p-2 rounded">
                              This user has been banned. Swap requests from banned users are suspended.
                            </div>
                          )}
                        </div>
                      </div>
                      
                      <div className="flex space-x-2 ml-4">
                        {request.status === 'pending' && !otherUser.isBanned && (
                          <>
                            <Button
                              size="sm"
                              onClick={() => handleAcceptRequest(request.id)}
                              className="flex items-center space-x-1"
                            >
                              <Check size={16} />
                              <span>Accept</span>
                            </Button>
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => handleRejectRequest(request.id)}
                              className="flex items-center space-x-1"
                            >
                              <X size={16} />
                              <span>Reject</span>
                            </Button>
                          </>
                        )}
                        
                        {request.status === 'accepted' && !otherUser.isBanned && (
                          <Button
                            size="sm"
                            onClick={() => handleCompleteSwap(request)}
                            className="flex items-center space-x-1"
                          >
                            <Star size={16} />
                            <span>Mark Complete</span>
                          </Button>
                        )}

                        {otherUser.isBanned && request.status === 'pending' && (
                          <span className="text-sm text-muted-foreground">User suspended</span>
                        )}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              );
            })
          )}
        </TabsContent>

        <TabsContent value="my-requests" className="space-y-4">
          {myRequests.length === 0 ? (
            <Card>
              <CardContent className="flex flex-col items-center justify-center py-12">
                <MessageCircle size={48} className="text-muted-foreground mb-4" />
                <p className="text-muted-foreground">No swap requests sent yet</p>
                <p className="text-sm text-muted-foreground mt-2">Browse skills to start connecting!</p>
              </CardContent>
            </Card>
          ) : (
            myRequests.map(request => {
              const otherUser = getUserById(request.toUserId);
              if (!otherUser) return null;

              return (
                <Card key={request.id} className={otherUser.isBanned ? 'opacity-60' : ''}>
                  <CardContent className="p-6">
                    <div className="flex items-start justify-between">
                      <div className="flex space-x-4 flex-1">
                        <Avatar>
                          <AvatarImage src={otherUser.profilePhoto} alt={otherUser.name} />
                          <AvatarFallback>
                            {otherUser.name.split(' ').map(n => n[0]).join('').toUpperCase()}
                          </AvatarFallback>
                        </Avatar>
                        
                        <div className="flex-1 space-y-2">
                          <div className="flex items-center space-x-2">
                            <h3 className="font-medium">Request to {otherUser.name}</h3>
                            <Badge variant={getStatusColor(request.status)} className="flex items-center space-x-1">
                              {getStatusIcon(request.status)}
                              <span>{request.status}</span>
                            </Badge>
                            {otherUser.isBanned && (
                              <Badge variant="destructive" className="flex items-center space-x-1">
                                <Ban size={12} />
                                <span>User Banned</span>
                              </Badge>
                            )}
                          </div>
                          
                          <div className="text-sm text-muted-foreground">
                            <p>You want: <strong>{request.requestedSkill}</strong></p>
                            <p>You offered: <strong>{request.offeredSkill}</strong></p>
                            <p className="flex items-center mt-1">
                              <Calendar size={12} className="mr-1" />
                              {formatDate(request.createdAt)}
                            </p>
                          </div>
                          
                          {request.message && (
                            <div className="bg-muted p-3 rounded-md">
                              <p className="text-sm">{request.message}</p>
                            </div>
                          )}

                          {otherUser.isBanned && (
                            <div className="text-sm text-destructive bg-destructive/10 p-2 rounded">
                              The user you sent this request to has been banned. This request is suspended.
                            </div>
                          )}
                        </div>
                      </div>
                      
                      <div className="flex space-x-2 ml-4">
                        {request.status === 'pending' && !otherUser.isBanned && (
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => handleDeleteRequest(request.id)}
                            className="flex items-center space-x-1"
                          >
                            <Trash2 size={16} />
                            <span>Cancel</span>
                          </Button>
                        )}
                        
                        {request.status === 'accepted' && !otherUser.isBanned && (
                          <Button
                            size="sm"
                            onClick={() => handleCompleteSwap(request)}
                            className="flex items-center space-x-1"
                          >
                            <Star size={16} />
                            <span>Mark Complete</span>
                          </Button>
                        )}

                        {otherUser.isBanned && (
                          <span className="text-sm text-muted-foreground">User suspended</span>
                        )}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              );
            })
          )}
        </TabsContent>
      </Tabs>

      <Dialog open={feedbackDialog.open} onOpenChange={(open) => 
        setFeedbackDialog({ open, swapRequest: null })
      }>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Rate Your Experience</DialogTitle>
            <DialogDescription>
              How was your skill swap experience?
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4">
            <div className="space-y-2">
              <Label>Rating</Label>
              <div className="flex space-x-1">
                {[1, 2, 3, 4, 5].map(rating => (
                  <button
                    key={rating}
                    onClick={() => setFeedbackForm(prev => ({ ...prev, rating }))}
                    className="p-1"
                    disabled={currentUser.isBanned}
                  >
                    <Star
                      size={24}
                      className={
                        rating <= feedbackForm.rating
                          ? 'fill-yellow-400 text-yellow-400'
                          : 'text-gray-300'
                      }
                    />
                  </button>
                ))}
              </div>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="feedback-comment">Comment (optional)</Label>
              <Textarea
                id="feedback-comment"
                placeholder="Share your experience..."
                value={feedbackForm.comment}
                onChange={(e) => setFeedbackForm(prev => ({ ...prev, comment: e.target.value }))}
                disabled={currentUser.isBanned}
              />
            </div>
            
            <div className="flex justify-end space-x-2">
              <Button variant="outline" onClick={() => setFeedbackDialog({ open: false, swapRequest: null })}>
                Skip
              </Button>
              <Button 
                onClick={handleSubmitFeedback}
                disabled={currentUser.isBanned}
              >
                Submit Feedback
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}