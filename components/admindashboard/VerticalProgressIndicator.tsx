// components/admindashboard/VerticalProgressIndicator.tsx
import React from 'react';
import { Loader, ThemeIcon } from '@mantine/core';
import { IconCheck, IconX, IconCircleDashed } from '@tabler/icons-react'; // IconCircleDashed for pending/idle

// Define StepStatus type (can be imported if already defined elsewhere and exported)
export type StepStatus = 'idle' | 'pending' | 'uploading' | 'success' | 'error';

interface StepProps {
  title: string;
  status: StepStatus;
  message?: string;
}

const StepIndicator: React.FC<StepProps> = ({ title, status, message }) => {
  let icon;
  let iconColor = 'gray';
  let statusMessage = message || '';

  switch (status) {
    case 'pending':
      icon = <IconCircleDashed size={20} />;
      statusMessage = message || 'Pending...';
      break;
    case 'uploading':
      icon = <Loader size={20} />; // Mantine Loader for uploading
      statusMessage = message || 'Uploading...';
      break;
    case 'success':
      icon = <IconCheck size={20} />;
      iconColor = 'green';
      statusMessage = message || 'Completed';
      break;
    case 'error':
      icon = <IconX size={20} />;
      iconColor = 'red';
      statusMessage = message || 'Error'; // Detailed error can be passed in message
      break;
    case 'idle':
    default:
      icon = <IconCircleDashed size={20} />; // Or some other neutral icon
      statusMessage = message || 'Waiting...';
      break;
  }

  return (
    <div style={{ display: 'flex', alignItems: 'center', marginBottom: '1rem', padding: '10px', border: '1px solid #e0e0e0', borderRadius: '8px' }}>
      <ThemeIcon color={iconColor} variant="light" radius="xl" size="lg" style={{ marginRight: '1rem' }}>
        {icon}
      </ThemeIcon>
      <div>
        <div style={{ fontWeight: 'bold' }}>{title}</div>
        <div style={{ fontSize: '0.9rem', color: status === 'error' ? 'red' : '#555' }}>
          Status: {statusMessage}
        </div>
      </div>
    </div>
  );
};

interface VerticalProgressIndicatorProps {
  step1Status: StepStatus;
  step1Message?: string;
  step2Status: StepStatus;
  step2Message?: string;
}

const VerticalProgressIndicator: React.FC<VerticalProgressIndicatorProps> = ({
  step1Status,
  step1Message,
  step2Status,
  step2Message,
}) => {
  return (
    <div style={{ padding: '1rem 0' }}>
      <StepIndicator
        title="Step 1: Uploading Audiobook Metadata"
        status={step1Status}
        message={step1Message}
      />
      <StepIndicator
        title="Step 2: Uploading Audiobook Chapters"
        status={step2Status}
        message={step2Message}
      />
    </div>
  );
};

export default VerticalProgressIndicator;
