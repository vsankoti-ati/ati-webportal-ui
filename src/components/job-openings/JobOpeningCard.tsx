import React from 'react';
import {
  Card,
  CardContent,
  CardActions,
  Typography,
  Button,
  Chip,
  Box,
} from '@mui/material';
import { JobOpening } from '@/types/jobOpening';
import WorkIcon from '@mui/icons-material/Work';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import CalendarTodayIcon from '@mui/icons-material/CalendarToday';

interface JobOpeningCardProps {
  job: JobOpening;
  onView: () => void;
}

export default function JobOpeningCard({ job, onView }: JobOpeningCardProps) {
  return (
    <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
      <CardContent sx={{ flexGrow: 1 }}>
        <Typography gutterBottom variant="h5" component="h2" sx={{ minHeight: '64px', lineHeight: 1.2 }}>
          {job.title}
        </Typography>
        
        <Box display="flex" alignItems="center" gap={1} mb={1}>
          <WorkIcon fontSize="small" color="action" />
          <Typography variant="body2" color="text.secondary">
            {job.department}
          </Typography>
        </Box>
        
        <Box display="flex" alignItems="center" gap={1} mb={1}>
          <LocationOnIcon fontSize="small" color="action" />
          <Typography variant="body2" color="text.secondary">
            {job.location}
          </Typography>
        </Box>

        <Box display="flex" alignItems="center" gap={1} mb={2}>
          <CalendarTodayIcon fontSize="small" color="action" />
          <Typography variant="body2" color="text.secondary">
            Posted: {new Date(job.created_at).toLocaleDateString()}
          </Typography>
        </Box>

        <Typography variant="body2" color="text.secondary" sx={{ mb: 2, display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
          {job.description}
        </Typography>

        {job.salary_range && (
          <Typography variant="body2" color="primary" fontWeight="medium" sx={{ mb: 2 }}>
            Salary: {job.salary_range}
          </Typography>
        )}

        <Box display="flex" gap={1} flexWrap="wrap">
          <Chip
            size="small"
            label={job.employment_type}
            color="primary"
            variant="outlined"
          />
          <Chip
            size="small"
            label={`Experience: ${job.experience_required}`}
            color="secondary"
            variant="outlined"
          />
          {job.is_active ? (
            <Chip size="small" label="Active" color="success" />
          ) : (
            <Chip size="small" label="Closed" color="error" />
          )}
        </Box>
      </CardContent>
      
      <CardActions>
        <Button size="small" color="primary" onClick={onView}>
          View Details
        </Button>
      </CardActions>
    </Card>
  );
}