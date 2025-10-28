import { useEffect, useState } from 'react';
import {
  Box,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
} from '@mui/material';
import { Leave, leaveService } from '../services/leave';

interface LeaveBalanceProps {
  employeeId: number;
}

export default function LeaveBalance({ employeeId }: LeaveBalanceProps) {
  const [leaveBalances, setLeaveBalances] = useState<Leave[]>([]);

  useEffect(() => {
    loadLeaveBalances();
  }, [employeeId]);

  const loadLeaveBalances = async () => {
    try {
      const data = await leaveService.getLeaveBalance(employeeId);
      setLeaveBalances(data);
    } catch (error) {
      console.error('Error loading leave balances:', error);
    }
  };

  return (
    <Box>
      <Typography variant="h6" gutterBottom>
        Leave Balance
      </Typography>
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Leave Type</TableCell>
              <TableCell align="right">Balance</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {leaveBalances.map((leave) => (
              <TableRow key={leave.id}>
                <TableCell>{leave.leave_type}</TableCell>
                <TableCell align="right">{leave.leave_balance}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
}