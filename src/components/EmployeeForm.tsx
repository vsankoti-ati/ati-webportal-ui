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
    first_name: '',
    last_name: '',
    role: '',
    email_id: '',
    address_line_1: '',
    address_line_2: '',
    city: '',
    state: '',
    zip_code: '',
    phone_number: '',
    hire_date: new Date().toISOString().split('T')[0],
    is_active: true,
    comment: '',
  });

  const [errors, setErrors] = useState<Partial<Record<keyof CreateEmployeeDto, string>>>({});

  useEffect(() => {
    if (employee) {
      setFormData({
        ...employee,
        hire_date: new Date(employee.hire_date).toISOString().split('T')[0],
      });
    }
  }, [employee]);

  const validateForm = () => {
    const newErrors: Partial<Record<keyof CreateEmployeeDto, string>> = {};
    
    if (!formData.first_name) newErrors.first_name = 'First name is required';
    if (!formData.last_name) newErrors.last_name = 'Last name is required';
    if (!formData.role) newErrors.role = 'Role is required';
    if (!formData.email_id) newErrors.email_id = 'Email is required';
    if (!formData.address_line_1) newErrors.address_line_1 = 'Address is required';
    if (!formData.city) newErrors.city = 'City is required';
    if (!formData.state) newErrors.state = 'State is required';
    if (!formData.zip_code) newErrors.zip_code = 'ZIP code is required';
    if (!formData.phone_number) newErrors.phone_number = 'Phone number is required';
    if (!formData.hire_date) newErrors.hire_date = 'Hire date is required';

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
              name="first_name"
              value={formData.first_name}
              onChange={handleChange}
              error={!!errors.first_name}
              helperText={errors.first_name}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              label="Last Name"
              name="last_name"
              value={formData.last_name}
              onChange={handleChange}
              error={!!errors.last_name}
              helperText={errors.last_name}
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
              name="email_id"
              type="email"
              value={formData.email_id}
              onChange={handleChange}
              error={!!errors.email_id}
              helperText={errors.email_id}
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              fullWidth
              label="Address Line 1"
              name="address_line_1"
              value={formData.address_line_1}
              onChange={handleChange}
              error={!!errors.address_line_1}
              helperText={errors.address_line_1}
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              fullWidth
              label="Address Line 2"
              name="address_line_2"
              value={formData.address_line_2}
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
              name="zip_code"
              value={formData.zip_code}
              onChange={handleChange}
              error={!!errors.zip_code}
              helperText={errors.zip_code}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              label="Phone Number"
              name="phone_number"
              value={formData.phone_number}
              onChange={handleChange}
              error={!!errors.phone_number}
              helperText={errors.phone_number}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              label="Hire Date"
              name="hire_date"
              type="date"
              value={formData.hire_date}
              onChange={handleChange}
              error={!!errors.hire_date}
              helperText={errors.hire_date}
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