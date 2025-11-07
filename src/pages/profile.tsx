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
import { employeeService, Employee } from '@/services/employee';

interface EmployeeProfile {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  department: string;
  position: string;
  manager?: string;
  hireDate: string;
  employeeId: string;
  address: string;
  addressLine2?: string;
  city: string;
  state: string;
  zipCode: string;
  emergencyContact?: string;
  emergencyPhone?: string;
  skills?: string[];
  comment?: string;
}

// Helper function to convert API Employee to EmployeeProfile format
const mapEmployeeToProfile = (employee: Employee): EmployeeProfile => {
  return {
    id: employee.id,
    firstName: employee.firstName,
    lastName: employee.lastName,
    email: employee.emailId,
    phone: employee.phoneNumber,
    department: '', // Not in API model, could be derived from role
    position: employee.role,
    manager: undefined, // Not in current API model
    hireDate: employee.hireDate,
    employeeId: `ATI${employee.id.padStart(3, '0')}`,
    address: employee.addressLine1,
    addressLine2: employee.addressLine2,
    city: employee.city,
    state: employee.state,
    zipCode: employee.zipCode,
    emergencyContact: undefined, // Not in current API model
    emergencyPhone: undefined, // Not in current API model
    skills: [], // Not in current API model
    comment: employee.comment,
  };
};

// Helper function to convert EmployeeProfile updates to API format
const mapProfileToEmployee = (profile: Partial<EmployeeProfile>) => {
  const updates: any = {};
  
  if (profile.firstName !== undefined) updates.firstName = profile.firstName;
  if (profile.lastName !== undefined) updates.lastName = profile.lastName;
  if (profile.email !== undefined) updates.emailId = profile.email;
  if (profile.phone !== undefined) updates.phoneNumber = profile.phone;
  if (profile.position !== undefined) updates.role = profile.position;
  if (profile.hireDate !== undefined) updates.hireDate = profile.hireDate;
  if (profile.address !== undefined) updates.addressLine1 = profile.address;
  if (profile.addressLine2 !== undefined) updates.addressLine2 = profile.addressLine2;
  if (profile.city !== undefined) updates.city = profile.city;
  if (profile.state !== undefined) updates.state = profile.state;
  if (profile.zipCode !== undefined) updates.zipCode = profile.zipCode;
  if (profile.comment !== undefined) updates.comment = profile.comment;
  if (profile.id !== undefined) updates.id = profile.id;
  //if(profile.employeeId !== undefined) updates.employeeId = profile.employeeId;
  // --- IGNORE ---

  return updates;
};

// Profile service using actual API
const profileService = {
  getProfileByEmail: async (email: string): Promise<EmployeeProfile> => {
    const employee = await employeeService.getByEmail(email);
    return mapEmployeeToProfile(employee);
  },

  updateProfile: async (profileId: string, profileData: Partial<EmployeeProfile>): Promise<EmployeeProfile> => {
    const updates = mapProfileToEmployee(profileData);
    //const employeeId = parseInt(profileId);
    const updatedEmployee = await employeeService.update(profileId, updates);
    return mapEmployeeToProfile(updatedEmployee);
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
    if (!user || !user.email) {
      console.error('User or user email not found:', user);
      setMessage({ 
        type: 'error', 
        text: 'User email not found. Please log in again.' 
      });
      setLoading(false);
      return;
    }
    
    try {
      setLoading(true);
      console.log('Loading profile for email:', user.email);
      const profileData = await profileService.getProfileByEmail(user.email);
      console.log('Profile loaded successfully:', profileData);
      setProfile(profileData);
      setEditedProfile(profileData);
      setMessage(null); // Clear any previous error messages
    } catch (error: any) {
      console.error('Failed to load profile:', error);
      setMessage({ 
        type: 'error', 
        text: error.message || error.response?.data?.message || 'Failed to load profile data' 
      });
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
      
      const updatedProfile = await profileService.updateProfile(editedProfile.id, editedProfile);
      setProfile(updatedProfile);
      setEditedProfile(updatedProfile);
      setIsEditing(false);
      setMessage({ type: 'success', text: 'Profile updated successfully!' });
    } catch (error: any) {
      console.error('Failed to update profile:', error);
      setMessage({ 
        type: 'error', 
        text: error.response?.data?.message || error.message || 'Failed to update profile' 
      });
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
                    {currentProfile.position}{currentProfile.department ? ` • ${currentProfile.department}` : ''}
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
                          value={currentProfile.department || ''}
                          onChange={(e) => handleInputChange('department', e.target.value)}
                          disabled={!isEditing}
                          margin="dense"
                          placeholder="Not specified"
                        />
                      </Grid>
                      <Grid item xs={12}>
                        <TextField
                          fullWidth
                          label="Manager"
                          value={currentProfile.manager || ''}
                          onChange={(e) => handleInputChange('manager', e.target.value)}
                          disabled={!isEditing}
                          margin="dense"
                          placeholder="Not specified"
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
                          label="Address Line 1"
                          value={currentProfile.address}
                          onChange={(e) => handleInputChange('address', e.target.value)}
                          disabled={!isEditing}
                          margin="dense"
                        />
                      </Grid>
                      <Grid item xs={12}>
                        <TextField
                          fullWidth
                          label="Address Line 2 (Optional)"
                          value={currentProfile.addressLine2 || ''}
                          onChange={(e) => handleInputChange('addressLine2', e.target.value)}
                          disabled={!isEditing}
                          margin="dense"
                          placeholder="Apt, Suite, etc."
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
                          value={currentProfile.emergencyContact || ''}
                          onChange={(e) => handleInputChange('emergencyContact', e.target.value)}
                          disabled={!isEditing}
                          margin="dense"
                          placeholder="Not specified"
                        />
                      </Grid>
                      <Grid item xs={12}>
                        <TextField
                          fullWidth
                          label="Emergency Contact Phone"
                          value={currentProfile.emergencyPhone || ''}
                          onChange={(e) => handleInputChange('emergencyPhone', e.target.value)}
                          disabled={!isEditing}
                          margin="dense"
                          placeholder="Not specified"
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
                        value={(currentProfile.skills || []).join(', ')}
                        onChange={(e) => handleSkillsChange(e.target.value)}
                        margin="dense"
                        multiline
                        rows={3}
                        helperText="Enter skills separated by commas"
                      />
                    ) : (
                      <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                        {(currentProfile.skills && currentProfile.skills.length > 0) ? (
                          currentProfile.skills.map((skill, index) => (
                            <Chip key={index} label={skill} variant="outlined" />
                          ))
                        ) : (
                          <Typography variant="body2" color="text.secondary">
                            No skills specified
                          </Typography>
                        )}
                      </Box>
                    )}
                  </CardContent>
                </Card>

                <Card sx={{ mt: 2 }}>
                  <CardContent>
                    <Typography variant="h6" gutterBottom>
                      Additional Notes
                    </Typography>
                    <Divider sx={{ mb: 2 }} />
                    
                    <TextField
                      fullWidth
                      label="Comments/Notes"
                      value={currentProfile.comment || ''}
                      onChange={(e) => handleInputChange('comment', e.target.value)}
                      disabled={!isEditing}
                      margin="dense"
                      multiline
                      rows={4}
                      placeholder="Additional information or notes"
                    />
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