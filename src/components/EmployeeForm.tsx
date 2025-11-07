import { useState, useEffect } from 'react';
import {
  Box,
  Button,
  TextField,
  Grid,
  Paper,
  Typography,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  FormHelperText,
  SelectChangeEvent,
} from '@mui/material';
import { useRouter } from 'next/router';
import { Employee, CreateEmployeeDto, employeeService } from '../services/employee';

interface EmployeeFormProps {
  employee?: Employee;
  isEdit?: boolean;
}

export default function EmployeeForm({ employee, isEdit = false }: EmployeeFormProps) {
  const router = useRouter();
  const [formData, setFormData] = useState<CreateEmployeeDto>({
    firstName: '',
    lastName: '',
    role: '',
    emailId: '',
    addressLine1: '',
    addressLine2: '',
    city: '',
    state: '',
    zipCode: '',
    phoneNumber: '',
    hireDate: new Date().toISOString().split('T')[0],
    isActive: true,
    comment: '',
  });

  const [errors, setErrors] = useState<Partial<Record<keyof CreateEmployeeDto, string>>>({});

  useEffect(() => {
    if (employee) {
      setFormData({
        firstName: employee.firstName,
        lastName: employee.lastName,
        role: employee.role,
        emailId: employee.emailId,
        addressLine1: employee.addressLine1,
        addressLine2: employee.addressLine2,
        city: employee.city,
        state: employee.state,
        zipCode: employee.zipCode,
        phoneNumber: employee.phoneNumber,
        hireDate: new Date(employee.hireDate).toISOString().split('T')[0],
        isActive: employee.isActive,
        comment: employee.comment,
      });
    }
  }, [employee]);

  const validateForm = () => {
    const newErrors: Partial<Record<keyof CreateEmployeeDto, string>> = {};
    
    if (!formData.firstName) newErrors.firstName = 'First name is required';
    if (!formData.lastName) newErrors.lastName = 'Last name is required';
    if (!formData.role) newErrors.role = 'Role is required';
    if (!formData.emailId) newErrors.emailId = 'Email is required';
    if (!formData.addressLine1) newErrors.addressLine1 = 'Address is required';
    if (!formData.city) newErrors.city = 'City is required';
    if (!formData.state) newErrors.state = 'State is required';
    if (!formData.zipCode) newErrors.zipCode = 'ZIP code is required';
    if (!formData.phoneNumber) newErrors.phoneNumber = 'Phone number is required';
    if (!formData.hireDate) newErrors.hireDate = 'Hire date is required';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    try {
      if (isEdit && employee) {
        await employeeService.update(employee.id, formData);
      } else {
        await employeeService.create(formData);
      }
      router.push('/employee');
    } catch (error) {
      console.error('Error saving employee:', error);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | { name?: string; value: unknown }>) => {
    const { name, value } = e.target;
    if (name) {
      setFormData((prev) => ({
        ...prev,
        [name]: value,
      }));
    }
  };

  const handleSelectChange = (event: SelectChangeEvent<string>) => {
    const { name, value } = event.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  return (
    <Paper sx={{ p: 4 }}>
      <Typography variant="h6" gutterBottom>
        {isEdit ? 'Edit Employee' : 'Create Employee'}
      </Typography>
      <Box component="form" onSubmit={handleSubmit}>
        <Grid container spacing={3}>
          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              label="First Name"
              name="firstName"
              value={formData.firstName}
              onChange={handleChange}
              error={!!errors.firstName}
              helperText={errors.firstName}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              label="Last Name"
              name="lastName"
              value={formData.lastName}
              onChange={handleChange}
              error={!!errors.lastName}
              helperText={errors.lastName}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <FormControl fullWidth error={!!errors.role}>
              <InputLabel>Role</InputLabel>
              <Select
                name="role"
                value={formData.role}
                onChange={handleSelectChange}
                label="Role"
              >
                <MenuItem value="Admin">Admin</MenuItem>
                <MenuItem value="HR">HR</MenuItem>
                <MenuItem value="Employee">Employee</MenuItem>
              </Select>
              {errors.role && <FormHelperText>{errors.role}</FormHelperText>}
            </FormControl>
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              label="Email"
              name="emailId"
              type="email"
              value={formData.emailId}
              onChange={handleChange}
              error={!!errors.emailId}
              helperText={errors.emailId}
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              fullWidth
              label="Address Line 1"
              name="addressLine1"
              value={formData.addressLine1}
              onChange={handleChange}
              error={!!errors.addressLine1}
              helperText={errors.addressLine1}
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              fullWidth
              label="Address Line 2"
              name="addressLine2"
              value={formData.addressLine2}
              onChange={handleChange}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              label="City"
              name="city"
              value={formData.city}
              onChange={handleChange}
              error={!!errors.city}
              helperText={errors.city}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              label="State"
              name="state"
              value={formData.state}
              onChange={handleChange}
              error={!!errors.state}
              helperText={errors.state}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              label="ZIP Code"
              name="zipCode"
              value={formData.zipCode}
              onChange={handleChange}
              error={!!errors.zipCode}
              helperText={errors.zipCode}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              label="Phone Number"
              name="phoneNumber"
              value={formData.phoneNumber}
              onChange={handleChange}
              error={!!errors.phoneNumber}
              helperText={errors.phoneNumber}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              label="Hire Date"
              name="hireDate"
              type="date"
              value={formData.hireDate}
              onChange={handleChange}
              error={!!errors.hireDate}
              helperText={errors.hireDate}
              InputLabelProps={{ shrink: true }}
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              fullWidth
              label="Comments"
              name="comment"
              multiline
              rows={4}
              value={formData.comment}
              onChange={handleChange}
            />
          </Grid>
        </Grid>
        <Box sx={{ mt: 3, display: 'flex', gap: 2 }}>
          <Button type="submit" variant="contained" color="primary">
            {isEdit ? 'Update' : 'Create'}
          </Button>
          <Button variant="outlined" onClick={() => router.back()}>
            Cancel
          </Button>
        </Box>
      </Box>
    </Paper>
  );
}