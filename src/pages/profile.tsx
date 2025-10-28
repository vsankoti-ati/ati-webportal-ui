import React, { useState, useEffect } from 'react';
import {
  Box,
  Card,
  CardContent,
  Container,
  Grid,
  TextField,
  Typography,
  Button,
  Avatar,
  Divider,
  Alert,
  Paper,
  Chip,
  CircularProgress,
} from '@mui/material';
import {
  Person as PersonIcon,
  Edit as EditIcon,
  Save as SaveIcon,
  Cancel as CancelIcon,
  Email as EmailIcon,
  Phone as PhoneIcon,
  Work as WorkIcon,
  LocationOn as LocationIcon,
} from '@mui/icons-material';
import { useAuth } from '@/hooks/useAuth';
import Layout from '@/components/Layout';
import { ProtectedRoute } from '@/components/ProtectedRoute';

interface EmployeeProfile {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  department: string;
  position: string;
  manager: string;
  hireDate: string;
  employeeId: string;
  address: string;
  city: string;
  state: string;
  zipCode: string;
  emergencyContact: string;
  emergencyPhone: string;
  skills: string[];
}

// Mock API service
const profileService = {
  getProfile: async (userId: string): Promise<EmployeeProfile> => {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // Mock profile data based on user
    const mockProfiles: Record<string, EmployeeProfile> = {
      'admin-user-001': {
        id: 'admin-user-001',
        firstName: 'Admin',
        lastName: 'User',
        email: 'admin@atiwebportal.com',
        phone: '+1 (555) 123-4567',
        department: 'IT Administration',
        position: 'System Administrator',
        manager: 'CEO',
        hireDate: '2023-01-15',
        employeeId: 'ATI001',
        address: '123 Tech Street',
        city: 'San Francisco',
        state: 'CA',
        zipCode: '94105',
        emergencyContact: 'Jane Admin',
        emergencyPhone: '+1 (555) 987-6543',
        skills: ['System Administration', 'Cloud Computing', 'Security', 'Network Management']
      },
      'employee-user-001': {
        id: 'employee-user-001',
        firstName: 'John',
        lastName: 'Employee',
        email: 'employee@atiwebportal.com',
        phone: '+1 (555) 234-5678',
        department: 'Software Development',
        position: 'Senior Developer',
        manager: 'Tech Lead',
        hireDate: '2023-03-10',
        employeeId: 'ATI002',
        address: '456 Code Avenue',
        city: 'Austin',
        state: 'TX',
        zipCode: '78701',
        emergencyContact: 'Mary Employee',
        emergencyPhone: '+1 (555) 876-5432',
        skills: ['React', 'TypeScript', 'Node.js', 'AWS', 'MongoDB']
      }
    };

    const profile = mockProfiles[userId];
    if (!profile) {
      throw new Error('Profile not found');
    }
    return profile;
  },

  updateProfile: async (userId: string, profileData: Partial<EmployeeProfile>): Promise<EmployeeProfile> => {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    // Simulate random success/failure for demo
    if (Math.random() > 0.8) {
      throw new Error('Update failed: Server error occurred');
    }
    
    console.log('Profile updated successfully:', profileData);
    
    // Return updated profile (in real app, this would come from the server)
    const currentProfile = await profileService.getProfile(userId);
    return { ...currentProfile, ...profileData };
  }
};

export default function ProfilePage() {
  const { user } = useAuth();
  const [profile, setProfile] = useState<EmployeeProfile | null>(null);
  const [editedProfile, setEditedProfile] = useState<EmployeeProfile | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  useEffect(() => {
    loadProfile();
  }, [user]);

  const loadProfile = async () => {
    if (!user) return;
    
    try {
      setLoading(true);
      const profileData = await profileService.getProfile(user.id);
      setProfile(profileData);
      setEditedProfile(profileData);
    } catch (error) {
      setMessage({ type: 'error', text: 'Failed to load profile data' });
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = () => {
    setIsEditing(true);
    setMessage(null);
  };

  const handleCancel = () => {
    setIsEditing(false);
    setEditedProfile(profile);
    setMessage(null);
  };

  const handleSave = async () => {
    if (!user || !editedProfile) return;

    try {
      setSaving(true);
      setMessage(null);
      
      const updatedProfile = await profileService.updateProfile(user.id, editedProfile);
      setProfile(updatedProfile);
      setEditedProfile(updatedProfile);
      setIsEditing(false);
      setMessage({ type: 'success', text: 'Profile updated successfully!' });
    } catch (error: any) {
      setMessage({ type: 'error', text: error.message || 'Failed to update profile' });
    } finally {
      setSaving(false);
    }
  };

  const handleInputChange = (field: keyof EmployeeProfile, value: string) => {
    if (!editedProfile) return;
    setEditedProfile({ ...editedProfile, [field]: value });
  };

  const handleSkillsChange = (value: string) => {
    if (!editedProfile) return;
    const skills = value.split(',').map(skill => skill.trim()).filter(skill => skill);
    setEditedProfile({ ...editedProfile, skills });
  };

  if (loading) {
    return (
      <ProtectedRoute>
        <Layout>
          <Container maxWidth="lg">
            <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: 400 }}>
              <CircularProgress />
            </Box>
          </Container>
        </Layout>
      </ProtectedRoute>
    );
  }

  if (!profile) {
    return (
      <ProtectedRoute>
        <Layout>
          <Container maxWidth="lg">
            <Alert severity="error">Profile data not found</Alert>
          </Container>
        </Layout>
      </ProtectedRoute>
    );
  }

  const currentProfile = isEditing ? editedProfile! : profile;

  return (
    <ProtectedRoute>
      <Layout>
        <Container maxWidth="lg">
          <Box sx={{ mt: 4, mb: 4 }}>
            {/* Header */}
            <Paper sx={{ p: 3, mb: 3 }}>
              <Grid container spacing={3} alignItems="center">
                <Grid item>
                  <Avatar sx={{ width: 80, height: 80, bgcolor: 'primary.main', fontSize: '2rem' }}>
                    {currentProfile.firstName.charAt(0)}{currentProfile.lastName.charAt(0)}
                  </Avatar>
                </Grid>
                <Grid item xs>
                  <Typography variant="h4" gutterBottom>
                    {currentProfile.firstName} {currentProfile.lastName}
                  </Typography>
                  <Typography variant="h6" color="text.secondary" gutterBottom>
                    {currentProfile.position} • {currentProfile.department}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Employee ID: {currentProfile.employeeId} • Joined: {new Date(currentProfile.hireDate).toLocaleDateString()}
                  </Typography>
                </Grid>
                <Grid item>
                  {!isEditing ? (
                    <Button
                      variant="contained"
                      startIcon={<EditIcon />}
                      onClick={handleEdit}
                    >
                      Edit Profile
                    </Button>
                  ) : (
                    <Box sx={{ display: 'flex', gap: 1 }}>
                      <Button
                        variant="contained"
                        startIcon={saving ? <CircularProgress size={16} /> : <SaveIcon />}
                        onClick={handleSave}
                        disabled={saving}
                      >
                        {saving ? 'Saving...' : 'Save'}
                      </Button>
                      <Button
                        variant="outlined"
                        startIcon={<CancelIcon />}
                        onClick={handleCancel}
                        disabled={saving}
                      >
                        Cancel
                      </Button>
                    </Box>
                  )}
                </Grid>
              </Grid>
            </Paper>

            {/* Success/Error Message */}
            {message && (
              <Alert severity={message.type} sx={{ mb: 3 }}>
                {message.text}
              </Alert>
            )}

            <Grid container spacing={3}>
              {/* Personal Information */}
              <Grid item xs={12} md={6}>
                <Card>
                  <CardContent>
                    <Typography variant="h6" gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <PersonIcon />
                      Personal Information
                    </Typography>
                    <Divider sx={{ mb: 2 }} />
                    
                    <Grid container spacing={2}>
                      <Grid item xs={6}>
                        <TextField
                          fullWidth
                          label="First Name"
                          value={currentProfile.firstName}
                          onChange={(e) => handleInputChange('firstName', e.target.value)}
                          disabled={!isEditing}
                          margin="dense"
                        />
                      </Grid>
                      <Grid item xs={6}>
                        <TextField
                          fullWidth
                          label="Last Name"
                          value={currentProfile.lastName}
                          onChange={(e) => handleInputChange('lastName', e.target.value)}
                          disabled={!isEditing}
                          margin="dense"
                        />
                      </Grid>
                      <Grid item xs={12}>
                        <TextField
                          fullWidth
                          label="Email"
                          value={currentProfile.email}
                          onChange={(e) => handleInputChange('email', e.target.value)}
                          disabled={!isEditing}
                          margin="dense"
                          InputProps={{ startAdornment: <EmailIcon sx={{ mr: 1, color: 'text.secondary' }} /> }}
                        />
                      </Grid>
                      <Grid item xs={12}>
                        <TextField
                          fullWidth
                          label="Phone"
                          value={currentProfile.phone}
                          onChange={(e) => handleInputChange('phone', e.target.value)}
                          disabled={!isEditing}
                          margin="dense"
                          InputProps={{ startAdornment: <PhoneIcon sx={{ mr: 1, color: 'text.secondary' }} /> }}
                        />
                      </Grid>
                    </Grid>
                  </CardContent>
                </Card>
              </Grid>

              {/* Work Information */}
              <Grid item xs={12} md={6}>
                <Card>
                  <CardContent>
                    <Typography variant="h6" gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <WorkIcon />
                      Work Information
                    </Typography>
                    <Divider sx={{ mb: 2 }} />
                    
                    <Grid container spacing={2}>
                      <Grid item xs={12}>
                        <TextField
                          fullWidth
                          label="Position"
                          value={currentProfile.position}
                          onChange={(e) => handleInputChange('position', e.target.value)}
                          disabled={!isEditing}
                          margin="dense"
                        />
                      </Grid>
                      <Grid item xs={12}>
                        <TextField
                          fullWidth
                          label="Department"
                          value={currentProfile.department}
                          onChange={(e) => handleInputChange('department', e.target.value)}
                          disabled={!isEditing}
                          margin="dense"
                        />
                      </Grid>
                      <Grid item xs={12}>
                        <TextField
                          fullWidth
                          label="Manager"
                          value={currentProfile.manager}
                          onChange={(e) => handleInputChange('manager', e.target.value)}
                          disabled={!isEditing}
                          margin="dense"
                        />
                      </Grid>
                      <Grid item xs={12}>
                        <TextField
                          fullWidth
                          label="Hire Date"
                          type="date"
                          value={currentProfile.hireDate}
                          onChange={(e) => handleInputChange('hireDate', e.target.value)}
                          disabled={!isEditing}
                          margin="dense"
                          InputLabelProps={{ shrink: true }}
                        />
                      </Grid>
                    </Grid>
                  </CardContent>
                </Card>
              </Grid>

              {/* Address Information */}
              <Grid item xs={12} md={6}>
                <Card>
                  <CardContent>
                    <Typography variant="h6" gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <LocationIcon />
                      Address Information
                    </Typography>
                    <Divider sx={{ mb: 2 }} />
                    
                    <Grid container spacing={2}>
                      <Grid item xs={12}>
                        <TextField
                          fullWidth
                          label="Address"
                          value={currentProfile.address}
                          onChange={(e) => handleInputChange('address', e.target.value)}
                          disabled={!isEditing}
                          margin="dense"
                        />
                      </Grid>
                      <Grid item xs={6}>
                        <TextField
                          fullWidth
                          label="City"
                          value={currentProfile.city}
                          onChange={(e) => handleInputChange('city', e.target.value)}
                          disabled={!isEditing}
                          margin="dense"
                        />
                      </Grid>
                      <Grid item xs={3}>
                        <TextField
                          fullWidth
                          label="State"
                          value={currentProfile.state}
                          onChange={(e) => handleInputChange('state', e.target.value)}
                          disabled={!isEditing}
                          margin="dense"
                        />
                      </Grid>
                      <Grid item xs={3}>
                        <TextField
                          fullWidth
                          label="Zip Code"
                          value={currentProfile.zipCode}
                          onChange={(e) => handleInputChange('zipCode', e.target.value)}
                          disabled={!isEditing}
                          margin="dense"
                        />
                      </Grid>
                    </Grid>
                  </CardContent>
                </Card>
              </Grid>

              {/* Emergency Contact & Skills */}
              <Grid item xs={12} md={6}>
                <Card sx={{ mb: 2 }}>
                  <CardContent>
                    <Typography variant="h6" gutterBottom>
                      Emergency Contact
                    </Typography>
                    <Divider sx={{ mb: 2 }} />
                    
                    <Grid container spacing={2}>
                      <Grid item xs={12}>
                        <TextField
                          fullWidth
                          label="Emergency Contact Name"
                          value={currentProfile.emergencyContact}
                          onChange={(e) => handleInputChange('emergencyContact', e.target.value)}
                          disabled={!isEditing}
                          margin="dense"
                        />
                      </Grid>
                      <Grid item xs={12}>
                        <TextField
                          fullWidth
                          label="Emergency Contact Phone"
                          value={currentProfile.emergencyPhone}
                          onChange={(e) => handleInputChange('emergencyPhone', e.target.value)}
                          disabled={!isEditing}
                          margin="dense"
                        />
                      </Grid>
                    </Grid>
                  </CardContent>
                </Card>

                <Card>
                  <CardContent>
                    <Typography variant="h6" gutterBottom>
                      Skills & Expertise
                    </Typography>
                    <Divider sx={{ mb: 2 }} />
                    
                    {isEditing ? (
                      <TextField
                        fullWidth
                        label="Skills (comma-separated)"
                        value={currentProfile.skills.join(', ')}
                        onChange={(e) => handleSkillsChange(e.target.value)}
                        margin="dense"
                        multiline
                        rows={3}
                        helperText="Enter skills separated by commas"
                      />
                    ) : (
                      <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                        {currentProfile.skills.map((skill, index) => (
                          <Chip key={index} label={skill} variant="outlined" />
                        ))}
                      </Box>
                    )}
                  </CardContent>
                </Card>
              </Grid>
            </Grid>
          </Box>
        </Container>
      </Layout>
    </ProtectedRoute>
  );
}

// Force server-side rendering to prevent static generation issues
export async function getServerSideProps() {
  return {
    props: {},
  };
}