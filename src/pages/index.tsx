import React, { useState, useEffect } from 'react';
import {
  Box,
  Card,
  CardContent,
  Container,
  Grid,
  Typography,
  Paper,
  Button,
  Avatar,
  Chip,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  CircularProgress,
} from '@mui/material';
import {
  Person as PersonIcon,
  Edit as EditIcon,
  Work as WorkIcon,
  Email as EmailIcon,
  EventNote as LeaveIcon,
  CalendarToday as CalendarIcon,
  CheckCircle as ApprovedIcon,
  Pending as PendingIcon,
  Cancel as RejectedIcon,
} from '@mui/icons-material';
import { useRouter } from 'next/router';
import { ProtectedRoute } from '../components/ProtectedRoute';
import Layout from '../components/Layout';
import { useAuth } from '../hooks/useAuth';
import { mockLeaveApplications, mockLeaveService } from '../services/mockLeaveData';

// This would typically come from an API
const companyDetails = {
  name: 'Adaptive Technology Insights',
  description: 'A leading IT consulting company providing innovative solutions',
  mission: 'To empower businesses through cutting-edge technology solutions',
  vision: 'To be the global leader in technological innovation and digital transformation',
};

// This would typically come from an API
const latestHappenings = [
  {
    id: 1,
    title: 'New Project Win',
    description: 'Successfully secured a major digital transformation project with a Fortune 500 client',
    date: '2025-10-10',
  },
  {
    id: 2,
    title: 'Technology Workshop',
    description: 'Upcoming workshop on AI and Machine Learning fundamentals',
    date: '2025-10-20',
  },
  {
    id: 3,
    title: 'Employee Recognition',
    description: 'Congratulations to our team for achieving AWS certification',
    date: '2025-10-15',
  },
];

export default function Home() {
  const { user } = useAuth();
  const router = useRouter();
  const [userLeaves, setUserLeaves] = useState<any[]>([]);
  const [leavesLoading, setLeavesLoading] = useState(true);
  const [leaveBalance, setLeaveBalance] = useState({ total: 0, used: 0, pending: 0 });

  useEffect(() => {
    loadUserLeaves();
  }, [user]);

  const loadUserLeaves = async () => {
    if (!user) return;
    
    try {
      setLeavesLoading(true);
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 800));
      
      // Create user-specific mock leave data
      let userSpecificLeaves: any[] = [];
      
      if (user.email === 'admin@atiwebportal.com') {
        // Admin user leaves
        userSpecificLeaves = [
          {
            id: 101,
            from_date: '2025-11-15',
            to_date: '2025-11-17',
            applied_date: '2025-10-20',
            status: 'APPROVED',
            comment: 'Team building event and strategic planning'
          },
          {
            id: 102,
            from_date: '2025-12-23',
            to_date: '2025-12-30',
            applied_date: '2025-10-15',
            status: 'PENDING',
            comment: 'Christmas holidays with family'
          },
          {
            id: 103,
            from_date: '2025-10-28',
            to_date: '2025-10-28',
            applied_date: '2025-10-25',
            status: 'APPROVED',
            comment: 'Medical checkup appointment'
          }
        ];
      } else if (user.email === 'employee@atiwebportal.com') {
        // Employee user leaves
        userSpecificLeaves = [
          {
            id: 201,
            from_date: '2025-11-08',
            to_date: '2025-11-10',
            applied_date: '2025-10-18',
            status: 'PENDING',
            comment: 'Weekend trip with friends'
          },
          {
            id: 202,
            from_date: '2025-10-22',
            to_date: '2025-10-22',
            applied_date: '2025-10-20',
            status: 'APPROVED',
            comment: 'Personal work - bank visits'
          },
          {
            id: 203,
            from_date: '2025-12-25',
            to_date: '2025-01-02',
            applied_date: '2025-10-10',
            status: 'APPROVED',
            comment: 'Year-end vacation and New Year celebration'
          }
        ];
      } else {
        // Default user leaves
        userSpecificLeaves = mockLeaveApplications.slice(0, 3);
      }
      
      setUserLeaves(userSpecificLeaves);
      
      // Calculate leave balance based on user leaves
      const approvedLeaves = userSpecificLeaves.filter(leave => leave.status === 'APPROVED');
      const pendingLeaves = userSpecificLeaves.filter(leave => leave.status === 'PENDING');
      
      const usedDays = approvedLeaves.reduce((total, leave) => {
        const from = new Date(leave.from_date);
        const to = new Date(leave.to_date);
        const days = Math.ceil((to.getTime() - from.getTime()) / (1000 * 3600 * 24)) + 1;
        return total + days;
      }, 0);
      
      const pendingDays = pendingLeaves.reduce((total, leave) => {
        const from = new Date(leave.from_date);
        const to = new Date(leave.to_date);
        const days = Math.ceil((to.getTime() - from.getTime()) / (1000 * 3600 * 24)) + 1;
        return total + days;
      }, 0);
      
      setLeaveBalance({
        total: 25, // Annual leave entitlement
        used: usedDays,
        pending: pendingDays
      });
      
    } catch (error) {
      console.error('Error loading user leaves:', error);
    } finally {
      setLeavesLoading(false);
    }
  };

  const handleViewProfile = () => {
    router.push('/profile');
  };

  const handleViewAllLeaves = () => {
    router.push('/leave');
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'APPROVED':
        return 'success';
      case 'PENDING':
        return 'warning';
      case 'REJECTED':
        return 'error';
      default:
        return 'default';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'APPROVED':
        return <ApprovedIcon fontSize="small" />;
      case 'PENDING':
        return <PendingIcon fontSize="small" />;
      case 'REJECTED':
        return <RejectedIcon fontSize="small" />;
      default:
        return <CalendarIcon fontSize="small" />;
    }
  };

  return (
    <ProtectedRoute>
      <Layout>
        <Container maxWidth="lg">
          <Box sx={{ mt: 4, mb: 4 }}>
            {/* Company Details Section */}
            <Card sx={{ mb: 4 }}>
              <CardContent>
                <Typography variant="h4" component="h1" gutterBottom>
                  {companyDetails.name}
                </Typography>
                <Typography variant="body1" paragraph>
                  {companyDetails.description}
                </Typography>
                <Grid container spacing={3}>
                  <Grid item xs={12} md={6}>
                    <Paper sx={{ p: 2 }}>
                      <Typography variant="h6" gutterBottom>
                        Our Mission
                      </Typography>
                      <Typography variant="body2">
                        {companyDetails.mission}
                      </Typography>
                    </Paper>
                  </Grid>
                  <Grid item xs={12} md={6}>
                    <Paper sx={{ p: 2 }}>
                      <Typography variant="h6" gutterBottom>
                        Our Vision
                      </Typography>
                      <Typography variant="body2">
                        {companyDetails.vision}
                      </Typography>
                    </Paper>
                  </Grid>
                </Grid>
              </CardContent>
            </Card>

            {/* Profile Section */}
            <Card sx={{ mb: 4 }}>
              <CardContent>
                <Typography variant="h5" gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <PersonIcon />
                  My Profile
                </Typography>
                
                <Grid container spacing={3} alignItems="center">
                  <Grid item>
                    <Avatar sx={{ width: 64, height: 64, bgcolor: 'primary.main', fontSize: '1.5rem' }}>
                      {user?.name?.split(' ').map(n => n.charAt(0)).join('')}
                    </Avatar>
                  </Grid>
                  <Grid item xs>
                    <Typography variant="h6" gutterBottom>
                      {user?.name}
                    </Typography>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                      <EmailIcon fontSize="small" color="action" />
                      <Typography variant="body2" color="text.secondary">
                        {user?.email}
                      </Typography>
                    </Box>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
                      <WorkIcon fontSize="small" color="action" />
                      <Typography variant="body2" color="text.secondary">
                        {user?.department || 'Department'} • Employee
                      </Typography>
                    </Box>
                    <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
                      {user?.roles?.map((role, index) => (
                        <Chip key={index} label={role} size="small" variant="outlined" />
                      ))}
                    </Box>
                  </Grid>
                  <Grid item>
                    <Button
                      variant="contained"
                      startIcon={<EditIcon />}
                      onClick={handleViewProfile}
                      size="large"
                    >
                      View & Edit Profile
                    </Button>
                  </Grid>
                </Grid>

                <Paper sx={{ p: 2, mt: 3, bgcolor: 'background.default' }}>
                  <Typography variant="body2" color="text.secondary">
                    Keep your profile information up to date to ensure accurate records and communication. 
                    Click "View & Edit Profile" to update your personal details, contact information, and emergency contacts.
                  </Typography>
                </Paper>
              </CardContent>
            </Card>

            {/* My Leaves Section */}
            <Card sx={{ mb: 4 }}>
              <CardContent>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                  <Typography variant="h5" gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 0 }}>
                    <LeaveIcon />
                    My Leaves
                  </Typography>
                  <Button
                    variant="outlined"
                    onClick={handleViewAllLeaves}
                    size="small"
                  >
                    View All Leaves
                  </Button>
                </Box>

                {/* Leave Balance Summary */}
                {!leavesLoading && (
                  <Grid container spacing={2} sx={{ mb: 3 }}>
                    <Grid item xs={6} sm={3}>
                      <Paper sx={{ p: 2, textAlign: 'center', bgcolor: 'primary.50' }}>
                        <Typography variant="h6" color="primary.main" fontWeight="bold">
                          {leaveBalance.total}
                        </Typography>
                        <Typography variant="caption" color="text.secondary">
                          Total Entitlement
                        </Typography>
                      </Paper>
                    </Grid>
                    <Grid item xs={6} sm={3}>
                      <Paper sx={{ p: 2, textAlign: 'center', bgcolor: 'success.50' }}>
                        <Typography variant="h6" color="success.main" fontWeight="bold">
                          {leaveBalance.used}
                        </Typography>
                        <Typography variant="caption" color="text.secondary">
                          Days Used
                        </Typography>
                      </Paper>
                    </Grid>
                    <Grid item xs={6} sm={3}>
                      <Paper sx={{ p: 2, textAlign: 'center', bgcolor: 'warning.50' }}>
                        <Typography variant="h6" color="warning.main" fontWeight="bold">
                          {leaveBalance.pending}
                        </Typography>
                        <Typography variant="caption" color="text.secondary">
                          Days Pending
                        </Typography>
                      </Paper>
                    </Grid>
                    <Grid item xs={6} sm={3}>
                      <Paper sx={{ p: 2, textAlign: 'center', bgcolor: 'info.50' }}>
                        <Typography variant="h6" color="info.main" fontWeight="bold">
                          {leaveBalance.total - leaveBalance.used}
                        </Typography>
                        <Typography variant="caption" color="text.secondary">
                          Days Remaining
                        </Typography>
                      </Paper>
                    </Grid>
                  </Grid>
                )}

                {leavesLoading ? (
                  <Box sx={{ display: 'flex', justifyContent: 'center', py: 3 }}>
                    <CircularProgress />
                  </Box>
                ) : userLeaves.length > 0 ? (
                  <TableContainer component={Paper} variant="outlined">
                    <Table size="small">
                      <TableHead>
                        <TableRow>
                          <TableCell>Leave Period</TableCell>
                          <TableCell>Days</TableCell>
                          <TableCell>Applied Date</TableCell>
                          <TableCell align="center">Status</TableCell>
                          <TableCell>Reason</TableCell>
                        </TableRow>
                      </TableHead>
                      <TableBody>
                        {userLeaves.map((leave) => {
                          const fromDate = new Date(leave.from_date);
                          const toDate = new Date(leave.to_date);
                          const daysDiff = Math.ceil((toDate.getTime() - fromDate.getTime()) / (1000 * 3600 * 24)) + 1;
                          
                          return (
                            <TableRow key={leave.id} hover>
                              <TableCell>
                                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                  <CalendarIcon fontSize="small" color="action" />
                                  <Box>
                                    <Typography variant="body2" fontWeight="medium">
                                      {fromDate.toLocaleDateString()} - {toDate.toLocaleDateString()}
                                    </Typography>
                                  </Box>
                                </Box>
                              </TableCell>
                              <TableCell>
                                <Typography variant="body2" fontWeight="medium">
                                  {daysDiff} day{daysDiff > 1 ? 's' : ''}
                                </Typography>
                              </TableCell>
                              <TableCell>
                                <Typography variant="body2" color="text.secondary">
                                  {new Date(leave.applied_date).toLocaleDateString()}
                                </Typography>
                              </TableCell>
                              <TableCell align="center">
                                <Chip
                                  icon={getStatusIcon(leave.status)}
                                  label={leave.status}
                                  color={getStatusColor(leave.status) as any}
                                  size="small"
                                  variant="outlined"
                                />
                              </TableCell>
                              <TableCell>
                                <Typography 
                                  variant="body2" 
                                  color="text.secondary"
                                  sx={{ 
                                    maxWidth: 200,
                                    overflow: 'hidden',
                                    textOverflow: 'ellipsis',
                                    whiteSpace: 'nowrap'
                                  }}
                                  title={leave.comment}
                                >
                                  {leave.comment}
                                </Typography>
                              </TableCell>
                            </TableRow>
                          );
                        })}
                      </TableBody>
                    </Table>
                  </TableContainer>
                ) : (
                  <Paper sx={{ p: 3, textAlign: 'center', bgcolor: 'background.default' }}>
                    <LeaveIcon sx={{ fontSize: 48, color: 'text.secondary', mb: 1 }} />
                    <Typography variant="h6" color="text.secondary" gutterBottom>
                      No Leave Applications
                    </Typography>
                    <Typography variant="body2" color="text.secondary" paragraph>
                      You haven't applied for any leaves yet.
                    </Typography>
                    <Button
                      variant="contained"
                      onClick={handleViewAllLeaves}
                      startIcon={<LeaveIcon />}
                    >
                      Apply for Leave
                    </Button>
                  </Paper>
                )}

                <Paper sx={{ p: 2, mt: 2, bgcolor: 'background.default' }}>
                  <Typography variant="body2" color="text.secondary">
                    Quick overview of your recent leave applications. View all leaves to see complete history and apply for new leaves.
                  </Typography>
                </Paper>
              </CardContent>
            </Card>

            {/* Latest Happenings Section */}
            <Typography variant="h5" gutterBottom>
              Latest Happenings
            </Typography>
            <Grid container spacing={3}>
              {latestHappenings.map((happening) => (
                <Grid item xs={12} md={4} key={happening.id}>
                  <Card>
                    <CardContent>
                      <Typography variant="h6" gutterBottom>
                        {happening.title}
                      </Typography>
                      <Typography variant="body2" paragraph>
                        {happening.description}
                      </Typography>
                      <Typography variant="caption" color="text.secondary">
                        {new Date(happening.date).toLocaleDateString()}
                      </Typography>
                    </CardContent>
                  </Card>
                </Grid>
              ))}
            </Grid>
          </Box>
        </Container>
      </Layout>
    </ProtectedRoute>
  );
}