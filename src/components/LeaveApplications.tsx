import { useEffect, useState } from 'react';
import {
  Box,
  Button,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
  Chip,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  CircularProgress,
  Alert,
  Skeleton,
} from '@mui/material';
import { Edit as EditIcon, Info as InfoIcon } from '@mui/icons-material';
import { format } from 'date-fns';
import { LeaveApplication, leaveService } from '../services/leave';
import LeaveApplicationForm from './LeaveApplicationForm';

// Check if we're using mock data
const useMockData = process.env.NEXT_PUBLIC_SKIP_MSAL === 'true' || 
                    process.env.NODE_ENV === 'development' && !process.env.NEXT_PUBLIC_API_URL;

interface LeaveApplicationsProps {
  employeeId: number;
  isAdmin?: boolean;
}

export default function LeaveApplications({ employeeId, isAdmin = false }: LeaveApplicationsProps) {
  const [applications, setApplications] = useState<LeaveApplication[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [openForm, setOpenForm] = useState(false);
  const [openApproval, setOpenApproval] = useState(false);
  const [selectedApplication, setSelectedApplication] = useState<LeaveApplication | null>(null);
  const [approvalData, setApprovalData] = useState({
    status: '',
    comment: '',
  });

  useEffect(() => {
    loadApplications();
  }, [employeeId, isAdmin]);

  const loadApplications = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = isAdmin
        ? await leaveService.getAllApplications()
        : await leaveService.getEmployeeApplications(employeeId);
      setApplications(data);
    } catch (error) {
      console.error('Error loading leave applications:', error);
      setError('Failed to load leave applications. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleApprovalSubmit = async () => {
    if (!selectedApplication) return;

    try {
      await leaveService.updateApplicationStatus(selectedApplication.id, approvalData);
      setOpenApproval(false);
      setApprovalData({ status: '', comment: '' });
      loadApplications();
    } catch (error) {
      console.error('Error updating leave application:', error);
      setError('Failed to update application status. Please try again.');
    }
  };

  const getStatusChipColor = (status: string) => {
    switch (status) {
      case 'APPROVED':
        return 'success';
      case 'REJECTED':
        return 'error';
      default:
        return 'warning';
    }
  };

  return (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
        <Typography variant="h6">Leave Applications</Typography>
        {!isAdmin && (
          <Button variant="contained" color="primary" onClick={() => setOpenForm(true)}>
            Apply for Leave
          </Button>
        )}
      </Box>

      {/* Mock Data Info Banner */}
      {useMockData && (
        <Alert 
          severity="info" 
          icon={<InfoIcon />}
          sx={{ mb: 2 }}
        >
          <strong>Development Mode:</strong> Displaying mock leave application data. 
          In production, this would connect to the real API.
        </Alert>
      )}

      {/* Error Alert */}
      {error && (
        <Alert severity="error" sx={{ mb: 2 }} onClose={() => setError(null)}>
          {error}
        </Alert>
      )}

      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              {isAdmin && <TableCell>Employee</TableCell>}
              <TableCell>From Date</TableCell>
              <TableCell>To Date</TableCell>
              <TableCell>Applied Date</TableCell>
              <TableCell>Status</TableCell>
              <TableCell>Comments</TableCell>
              {isAdmin && <TableCell>Actions</TableCell>}
            </TableRow>
          </TableHead>
          <TableBody>
            {loading ? (
              // Loading skeleton rows
              Array.from(new Array(3)).map((_, index) => (
                <TableRow key={index}>
                  {isAdmin && (
                    <TableCell>
                      <Skeleton variant="text" width="150px" />
                    </TableCell>
                  )}
                  <TableCell><Skeleton variant="text" width="100px" /></TableCell>
                  <TableCell><Skeleton variant="text" width="100px" /></TableCell>
                  <TableCell><Skeleton variant="text" width="100px" /></TableCell>
                  <TableCell>
                    <Skeleton variant="rounded" width="80px" height="24px" />
                  </TableCell>
                  <TableCell><Skeleton variant="text" width="200px" /></TableCell>
                  {isAdmin && (
                    <TableCell>
                      <Skeleton variant="circular" width="40px" height="40px" />
                    </TableCell>
                  )}
                </TableRow>
              ))
            ) : applications.length === 0 ? (
              <TableRow>
                <TableCell 
                  colSpan={isAdmin ? 7 : 6} 
                  align="center"
                  sx={{ py: 4 }}
                >
                  <Typography variant="body1" color="text.secondary">
                    No leave applications found
                  </Typography>
                </TableCell>
              </TableRow>
            ) : (
              applications.map((application) => (
                <TableRow key={application.id} hover>
                  {isAdmin && (
                    <TableCell>
                      <Box>
                        <Typography variant="body2" fontWeight="medium">
                          {`${application.employee.first_name} ${application.employee.last_name}`}
                        </Typography>
                        <Typography variant="caption" color="text.secondary">
                          {application.employee.email_id}
                        </Typography>
                      </Box>
                    </TableCell>
                  )}
                  <TableCell>
                    <Typography variant="body2">
                      {format(new Date(application.from_date), 'MMM dd, yyyy')}
                    </Typography>
                  </TableCell>
                  <TableCell>
                    <Typography variant="body2">
                      {format(new Date(application.to_date), 'MMM dd, yyyy')}
                    </Typography>
                  </TableCell>
                  <TableCell>
                    <Typography variant="body2">
                      {format(new Date(application.applied_date), 'MMM dd, yyyy')}
                    </Typography>
                  </TableCell>
                  <TableCell>
                    <Chip
                      label={application.status}
                      color={getStatusChipColor(application.status)}
                      size="small"
                      variant="filled"
                    />
                  </TableCell>
                  <TableCell>
                    <Typography 
                      variant="body2" 
                      sx={{ 
                        maxWidth: '200px', 
                        overflow: 'hidden', 
                        textOverflow: 'ellipsis',
                        whiteSpace: 'nowrap'
                      }}
                      title={application.comment}
                    >
                      {application.comment}
                    </Typography>
                  </TableCell>
                  {isAdmin && (
                    <TableCell>
                      {application.status === 'PENDING' && (
                        <IconButton
                          onClick={() => {
                            setSelectedApplication(application);
                            setApprovalData({
                              status: '',
                              comment: application.comment || '',
                            });
                            setOpenApproval(true);
                          }}
                          size="small"
                          color="primary"
                        >
                          <EditIcon />
                        </IconButton>
                      )}
                    </TableCell>
                  )}
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </TableContainer>

      <LeaveApplicationForm
        open={openForm}
        onClose={() => setOpenForm(false)}
        employeeId={employeeId}
        onSubmit={loadApplications}
      />

      <Dialog open={openApproval} onClose={() => setOpenApproval(false)}>
        <DialogTitle>Update Leave Application Status</DialogTitle>
        <DialogContent>
          <Box sx={{ mt: 2 }}>
            <FormControl fullWidth sx={{ mb: 2 }}>
              <InputLabel>Status</InputLabel>
              <Select
                value={approvalData.status}
                onChange={(e) =>
                  setApprovalData((prev) => ({ ...prev, status: e.target.value }))
                }
                label="Status"
              >
                <MenuItem value="APPROVED">Approve</MenuItem>
                <MenuItem value="REJECTED">Reject</MenuItem>
              </Select>
            </FormControl>
            <TextField
              fullWidth
              label="Comments"
              multiline
              rows={4}
              value={approvalData.comment}
              onChange={(e) =>
                setApprovalData((prev) => ({ ...prev, comment: e.target.value }))
              }
            />
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenApproval(false)}>Cancel</Button>
          <Button onClick={handleApprovalSubmit} variant="contained" color="primary">
            Submit
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}