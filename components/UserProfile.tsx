import React, { useState } from 'react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Textarea } from './ui/textarea';
import { Switch } from './ui/switch';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar';
import { Separator } from './ui/separator';
import { Plus, X, Star, MapPin, Calendar } from 'lucide-react';
import { useApp, User } from '../context/AppContext';

export function UserProfile() {
  const { state, dispatch } = useApp();
  const { currentUser } = state;
  const [isEditing, setIsEditing] = useState(false);
  const [editForm, setEditForm] = useState({
    name: currentUser?.name || '',
    location: currentUser?.location || '',
    isPublic: typeof currentUser?.isPublic === 'boolean' ? currentUser.isPublic : true,
    availability: currentUser?.availability || []
  });
  const [newSkillOffered, setNewSkillOffered] = useState('');
  const [newSkillWanted, setNewSkillWanted] = useState('');

  if (!currentUser) return null;

  const handleSaveProfile = () => {
    const updatedUser: User = {
      ...currentUser,
      name: editForm.name,
      location: editForm.location || undefined,
      isPublic: !!editForm.isPublic,
      availability: editForm.availability
    };
    dispatch({ type: 'UPDATE_USER', payload: updatedUser });
    setIsEditing(false);
  };

  const addSkillOffered = () => {
    if (newSkillOffered.trim() && !currentUser.skillsOffered.includes(newSkillOffered.trim())) {
      const updatedUser = {
        ...currentUser,
        skillsOffered: [...currentUser.skillsOffered, newSkillOffered.trim()]
      };
      dispatch({ type: 'UPDATE_USER', payload: updatedUser });
      setNewSkillOffered('');
    }
  };

  const removeSkillOffered = (skill: string) => {
    const updatedUser = {
      ...currentUser,
      skillsOffered: currentUser.skillsOffered.filter(s => s !== skill)
    };
    dispatch({ type: 'UPDATE_USER', payload: updatedUser });
  };

  const addSkillWanted = () => {
    if (newSkillWanted.trim() && !currentUser.skillsWanted.includes(newSkillWanted.trim())) {
      const updatedUser = {
        ...currentUser,
        skillsWanted: [...currentUser.skillsWanted, newSkillWanted.trim()]
      };
      dispatch({ type: 'UPDATE_USER', payload: updatedUser });
      setNewSkillWanted('');
    }
  };

  const removeSkillWanted = (skill: string) => {
    const updatedUser = {
      ...currentUser,
      skillsWanted: currentUser.skillsWanted.filter(s => s !== skill)
    };
    dispatch({ type: 'UPDATE_USER', payload: updatedUser });
  };

  const toggleAvailability = (day: string) => {
    const newAvailability = editForm.availability.includes(day)
      ? editForm.availability.filter(d => d !== day)
      : [...editForm.availability, day];
    
    setEditForm(prev => ({ ...prev, availability: newAvailability }));
  };

  const availabilityOptions = ['weekends', 'evenings', 'mornings', 'afternoons', 'weekdays'];

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-6">
      <div className="flex justify-between items-start">
        <div className="flex items-center space-x-4">
          <Avatar className="h-20 w-20">
            <AvatarImage src={currentUser.profilePhoto} alt={currentUser.name} />
            <AvatarFallback className="text-lg">
              {currentUser.name.split(' ').map(n => n[0]).join('').toUpperCase()}
            </AvatarFallback>
          </Avatar>
          <div>
            <h1 className="text-2xl font-bold">{currentUser.name}</h1>
            {currentUser.location && (
              <p className="text-muted-foreground flex items-center mt-1">
                <MapPin size={16} className="mr-1" />
                {currentUser.location}
              </p>
            )}
            <div className="flex items-center mt-2 space-x-2">
              <div className="flex items-center">
                <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                <span className="ml-1 text-sm">
                  {currentUser.rating.toFixed(1)} ({currentUser.totalRatings} reviews)
                </span>
              </div>
              <Badge variant={currentUser.isPublic ? 'default' : 'secondary'}>
                {currentUser.isPublic ? 'Public' : 'Private'}
              </Badge>
            </div>
          </div>
        </div>
        <Button 
          onClick={() => isEditing ? handleSaveProfile() : setIsEditing(true)}
          variant={isEditing ? 'default' : 'outline'}
        >
          {isEditing ? 'Save Changes' : 'Edit Profile'}
        </Button>
      </div>

      {isEditing && (
        <Card>
          <CardHeader>
            <CardTitle>Edit Profile</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="name">Name</Label>
                <Input
                  id="name"
                  value={editForm.name}
                  onChange={(e) => setEditForm(prev => ({ ...prev, name: e.target.value }))}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="location">Location</Label>
                <Input
                  id="location"
                  value={editForm.location}
                  onChange={(e) => setEditForm(prev => ({ ...prev, location: e.target.value }))}
                  placeholder="City, Country"
                />
              </div>
            </div>
            
            <div className="flex items-center space-x-2">
              <Switch
                id="isPublic"
                checked={editForm.isPublic}
                onCheckedChange={(checked) => setEditForm(prev => ({ ...prev, isPublic: checked }))}
              />
              <Label htmlFor="isPublic">Make profile public</Label>
            </div>

            <div className="space-y-2">
              <Label>Availability</Label>
              <div className="flex flex-wrap gap-2">
                {availabilityOptions.map(option => (
                  <Button
                    key={option}
                    type="button"
                    variant={editForm.availability.includes(option) ? 'default' : 'outline'}
                    size="sm"
                    onClick={() => toggleAvailability(option)}
                  >
                    {option}
                  </Button>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <span>Skills I Offer</span>
              <Badge variant="secondary" className="ml-2">
                {currentUser.skillsOffered.length}
              </Badge>
            </CardTitle>
            <CardDescription>Skills you can teach others</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex space-x-2">
              <Input
                placeholder="Add a skill you can teach"
                value={newSkillOffered}
                onChange={(e) => setNewSkillOffered(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && addSkillOffered()}
              />
              <Button onClick={addSkillOffered} size="sm">
                <Plus size={16} />
              </Button>
            </div>
            
            <div className="flex flex-wrap gap-2">
              {currentUser.skillsOffered.map(skill => (
                <Badge key={skill} variant="default" className="flex items-center space-x-1">
                  <span>{skill}</span>
                  <button onClick={() => removeSkillOffered(skill)}>
                    <X size={12} />
                  </button>
                </Badge>
              ))}
            </div>
            
            {currentUser.skillsOffered.length === 0 && (
              <p className="text-muted-foreground text-sm">No skills added yet</p>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <span>Skills I Want</span>
              <Badge variant="secondary" className="ml-2">
                {currentUser.skillsWanted.length}
              </Badge>
            </CardTitle>
            <CardDescription>Skills you want to learn</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex space-x-2">
              <Input
                placeholder="Add a skill you want to learn"
                value={newSkillWanted}
                onChange={(e) => setNewSkillWanted(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && addSkillWanted()}
              />
              <Button onClick={addSkillWanted} size="sm">
                <Plus size={16} />
              </Button>
            </div>
            
            <div className="flex flex-wrap gap-2">
              {currentUser.skillsWanted.map(skill => (
                <Badge key={skill} variant="outline" className="flex items-center space-x-1">
                  <span>{skill}</span>
                  <button onClick={() => removeSkillWanted(skill)}>
                    <X size={12} />
                  </button>
                </Badge>
              ))}
            </div>
            
            {currentUser.skillsWanted.length === 0 && (
              <p className="text-muted-foreground text-sm">No skills added yet</p>
            )}
          </CardContent>
        </Card>
      </div>

      {currentUser.availability.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Calendar size={20} className="mr-2" />
              Availability
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-2">
              {currentUser.availability.map(time => (
                <Badge key={time} variant="secondary">
                  {time}
                </Badge>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}