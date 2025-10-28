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
  IconButton,
  Typography,
  Chip,
  Alert,
  Skeleton,
  Avatar,
} from '@mui/material';
import { 
  Edit as EditIcon, 
  Delete as DeleteIcon, 
  Add as AddIcon,
  Info as InfoIcon,
  Person as PersonIcon 
} from '@mui/icons-material';
import { Employee, employeeService } from '../services/employee';
import { useRouter } from 'next/router';
import { format } from 'date-fns';

// Check if we're using mock data
const useMockData = process.env.NEXT_PUBLIC_SKIP_MSAL === 'true' || 
                    process.env.NODE_ENV === 'development' && !process.env.NEXT_PUBLIC_API_URL;

export default function EmployeeList() {
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  useEffect(() => {
    loadEmployees();
  }, []);

  const loadEmployees = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await employeeService.getAll();
      setEmployees(data);
    } catch (error) {
      console.error('Error loading employees:', error);
      setError('Failed to load employees. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (id: number) => {
    router.push(`/employee/edit/${id}`);
  };

  const handleDelete = async (id: number) => {
    if (confirm('Are you sure you want to delete this employee?')) {
      try {
        await employeeService.delete(id);
        loadEmployees();
      } catch (error) {
        console.error('Error deleting employee:', error);
        setError('Failed to delete employee. Please try again.');
      }
    }
  };

  const getInitials = (firstName: string, lastName: string) => {
    return `${firstName.charAt(0)}${lastName.charAt(0)}`.toUpperCase();
  };

  return (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h4" component="h1">
          Employee Management
        </Typography>
        <Button
          variant="contained"
          color="primary"
          startIcon={<AddIcon />}
          onClick={() => router.push('/employee/create')}
        >
          Add Employee
        </Button>
      </Box>

      {/* Mock Data Info Banner */}
      {useMockData && (
        <Alert 
          severity="info" 
          icon={<InfoIcon />}
          sx={{ mb: 3 }}
        >
          <strong>Development Mode:</strong> Displaying mock employee data with {employees.length} employees. 
          In production, this would connect to the real API.
        </Alert>
      )}

      {/* Error Alert */}
      {error && (
        <Alert severity="error" sx={{ mb: 3 }} onClose={() => setError(null)}>
          {error}
        </Alert>
      )}

      <TableContainer component={Paper} elevation={2}>
        <Table>
          <TableHead>
            <TableRow sx={{ backgroundColor: '#f5f5f5' }}>
              <TableCell>Employee</TableCell>
              <TableCell>Contact</TableCell>
              <TableCell>Role</TableCell>
              <TableCell>Location</TableCell>
              <TableCell>Hire Date</TableCell>
              <TableCell>Status</TableCell>
              <TableCell align="center">Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {loading ? (
              // Loading skeleton rows
              Array.from(new Array(5)).map((_, index) => (
                <TableRow key={index}>
                  <TableCell>
                    <Box display="flex" alignItems="center" gap={2}>
                      <Skeleton variant="circular" width="40px" height="40px" />
                      <Box>
                        <Skeleton variant="text" width="120px" height="20px" />
                        <Skeleton variant="text" width="80px" height="16px" />
                      </Box>
                    </Box>
                  </TableCell>
                  <TableCell>
                    <Skeleton variant="text" width="150px" height="16px" />
                    <Skeleton variant="text" width="120px" height="16px" />
                  </TableCell>
                  <TableCell><Skeleton variant="text" width="100px" /></TableCell>
                  <TableCell><Skeleton variant="text" width="80px" /></TableCell>
                  <TableCell><Skeleton variant="text" width="90px" /></TableCell>
                  <TableCell><Skeleton variant="rounded" width="60px" height="24px" /></TableCell>
                  <TableCell align="center">
                    <Skeleton variant="circular" width="32px" height="32px" sx={{ display: 'inline-block', mr: 1 }} />
                    <Skeleton variant="circular" width="32px" height="32px" sx={{ display: 'inline-block' }} />
                  </TableCell>
                </TableRow>
              ))
            ) : employees.length === 0 ? (
              <TableRow>
                <TableCell colSpan={7} align="center" sx={{ py: 6 }}>
                  <PersonIcon sx={{ fontSize: 48, color: 'text.secondary', mb: 2 }} />
                  <Typography variant="h6" color="text.secondary">
                    No employees found
                  </Typography>
                  <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                    Start by adding your first employee
                  </Typography>
                </TableCell>
              </TableRow>
            ) : (
              employees.map((employee) => (
                <TableRow key={employee.id} hover>
                  <TableCell>
                    <Box display="flex" alignItems="center" gap={2}>
                      <Avatar sx={{ bgcolor: 'primary.main' }}>
                        {getInitials(employee.first_name, employee.last_name)}
                      </Avatar>
                      <Box>
                        <Typography variant="body1" fontWeight="medium">
                          {`${employee.first_name} ${employee.last_name}`}
                        </Typography>
                        <Typography variant="caption" color="text.secondary">
                          ID: {employee.id}
                        </Typography>
                      </Box>
                    </Box>
                  </TableCell>
                  <TableCell>
                    <Typography variant="body2">
                      {employee.email_id}
                    </Typography>
                    <Typography variant="caption" color="text.secondary">
                      {employee.phone_number}
                    </Typography>
                  </TableCell>
                  <TableCell>
                    <Typography variant="body2" fontWeight="medium">
                      {employee.role}
                    </Typography>
                  </TableCell>
                  <TableCell>
                    <Typography variant="body2">
                      {employee.city}, {employee.state}
                    </Typography>
                  </TableCell>
                  <TableCell>
                    <Typography variant="body2">
                      {format(new Date(employee.hire_date), 'MMM dd, yyyy')}
                    </Typography>
                  </TableCell>
                  <TableCell>
                    <Chip
                      label={employee.is_active ? 'Active' : 'Inactive'}
                      color={employee.is_active ? 'success' : 'default'}
                      size="small"
                      variant="filled"
                    />
                  </TableCell>
                  <TableCell align="center">
                    <IconButton 
                      onClick={() => handleEdit(employee.id)} 
                      color="primary"
                      size="small"
                      title="Edit Employee"
                    >
                      <EditIcon />
                    </IconButton>
                    <IconButton 
                      onClick={() => handleDelete(employee.id)} 
                      color="error"
                      size="small"
                      title="Delete Employee"
                    >
                      <DeleteIcon />
                    </IconButton>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
}