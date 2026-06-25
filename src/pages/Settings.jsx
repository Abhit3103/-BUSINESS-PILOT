import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useAuth } from '@/context/AuthContext';
import { useToast } from '@/context/ToastContext';
import { changePassword } from '@/services/authService';
import { Loader2, Eye, EyeOff } from 'lucide-react';

export default function Settings() {
  const { user } = useAuth();
  const toast = useToast();

  // Password change form state
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});

  // Profile form state
  const [profileLoading, setProfileLoading] = useState(false);

  const validatePassword = () => {
    const newErrors = {};

    if (!currentPassword) {
      newErrors.currentPassword = 'Current password is required';
    }

    if (!newPassword) {
      newErrors.newPassword = 'New password is required';
    } else if (newPassword.length < 8) {
      newErrors.newPassword = 'Password must be at least 8 characters long';
    } else if (!/(?=.*[a-z])/.test(newPassword)) {
      newErrors.newPassword = 'Password must contain at least one lowercase letter';
    } else if (!/(?=.*[A-Z])/.test(newPassword)) {
      newErrors.newPassword = 'Password must contain at least one uppercase letter';
    } else if (!/(?=.*\d)/.test(newPassword)) {
      newErrors.newPassword = 'Password must contain at least one number';
    }

    if (newPassword !== confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handlePasswordChange = async (e) => {
    e.preventDefault();

    if (!validatePassword()) {
      return;
    }

    setLoading(true);
    try {
      await changePassword({
        currentPassword,
        newPassword,
      });
      toast.success('Password changed successfully!');
      // Clear form
      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');
      setErrors({});
    } catch (error) {
      const errorMessage = error.response?.data?.message || 'Failed to change password. Please try again.';
      toast.error(errorMessage);
      if (error.response?.status === 401) {
        setErrors({ currentPassword: 'Current password is incorrect' });
      }
    } finally {
      setLoading(false);
    }
  };

  const handleProfileUpdate = async (e) => {
    e.preventDefault();
    setProfileLoading(true);
    // TODO: Implement profile update
    toast.info('Profile update coming soon!');
    setProfileLoading(false);
  };

  return (
    <div className="space-y-6 max-w-4xl">
      <div>
        <h2 className="text-2xl font-bold tracking-tight">Settings</h2>
        <p className="text-muted-foreground">Manage your admin preferences and site settings.</p>
      </div>

      {/* Profile Settings Card */}
      <Card>
        <CardHeader>
          <CardTitle>Profile Settings</CardTitle>
          <CardDescription>Update your personal information.</CardDescription>
        </CardHeader>
        <form onSubmit={handleProfileUpdate}>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="name">Full Name</Label>
              <Input 
                id="name"
                defaultValue={user?.name || ''} 
                placeholder="Enter your name"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="email">Email Address</Label>
              <Input 
                id="email"
                defaultValue={user?.email || 'admin@example.com'} 
                disabled 
              />
            </div>
            <Button type="submit" disabled={profileLoading}>
              {profileLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Saving...
                </>
              ) : (
                'Save Changes'
              )}
            </Button>
          </CardContent>
        </form>
      </Card>

      {/* Password Change Card */}
      <Card>
        <CardHeader>
          <CardTitle>Change Password</CardTitle>
          <CardDescription>Update your password to keep your account secure.</CardDescription>
        </CardHeader>
        <form onSubmit={handlePasswordChange}>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="currentPassword">Current Password</Label>
              <div className="relative">
                <Input
                  id="currentPassword"
                  type={showCurrentPassword ? 'text' : 'password'}
                  placeholder="Enter current password"
                  value={currentPassword}
                  onChange={(e) => setCurrentPassword(e.target.value)}
                  className={`pr-10 ${errors.currentPassword ? 'border-destructive' : ''}`}
                />
                <button
                  type="button"
                  onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                >
                  {showCurrentPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
              {errors.currentPassword && (
                <p className="text-sm text-destructive">{errors.currentPassword}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="newPassword">New Password</Label>
              <div className="relative">
                <Input
                  id="newPassword"
                  type={showNewPassword ? 'text' : 'password'}
                  placeholder="Enter new password"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  className={`pr-10 ${errors.newPassword ? 'border-destructive' : ''}`}
                />
                <button
                  type="button"
                  onClick={() => setShowNewPassword(!showNewPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                >
                  {showNewPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
              {errors.newPassword ? (
                <p className="text-sm text-destructive">{errors.newPassword}</p>
              ) : (
                <p className="text-xs text-muted-foreground">
                  Must be at least 8 characters with uppercase, lowercase, and numbers
                </p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="confirmPassword">Confirm New Password</Label>
              <div className="relative">
                <Input
                  id="confirmPassword"
                  type={showConfirmPassword ? 'text' : 'password'}
                  placeholder="Confirm new password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className={`pr-10 ${errors.confirmPassword ? 'border-destructive' : ''}`}
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                >
                  {showConfirmPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
              {errors.confirmPassword && (
                <p className="text-sm text-destructive">{errors.confirmPassword}</p>
              )}
            </div>

            <Button type="submit" disabled={loading}>
              {loading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Changing Password...
                </>
              ) : (
                'Change Password'
              )}
            </Button>
          </CardContent>
        </form>
      </Card>

      {/* Store Configuration Card */}
      <Card>
        <CardHeader>
          <CardTitle>Store Configuration</CardTitle>
          <CardDescription>Configure general store settings.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="storeName">Store Name</Label>
            <Input id="storeName" defaultValue="Mokshita Enterprises" />
          </div>
          <div className="space-y-2">
            <Label htmlFor="contactEmail">Contact Email</Label>
            <Input id="contactEmail" type="email" defaultValue="support@mokshita.com" />
          </div>
          <Button>Update Configuration</Button>
        </CardContent>
      </Card>
    </div>
  );
}