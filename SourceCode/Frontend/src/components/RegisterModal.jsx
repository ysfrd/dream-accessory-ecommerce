import React, { useState } from 'react';
import {
  Modal,
  Box,
  Typography,
  TextField,
  Button,
  Alert,
  IconButton,
  Stepper,
  Step,
  StepLabel,
  FormControlLabel,
  Checkbox
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import { useAuth } from '../context/AuthContext';

const RegisterModal = ({ open, onClose, onRegisterSuccess }) => {
  const { register } = useAuth();
  const [activeStep, setActiveStep] = useState(0);
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: '',
    address: '',
    cardName: '',
    cardNumber: '',
    cardExpiry: '',
    cardCVC: ''
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [error, setError] = useState('');

  const steps = ['Personal Info', 'Address', 'Payment'];

  const handleNext = () => {
    if (activeStep === 0) {
      if (!formData.firstName || !formData.lastName || !formData.email || !formData.phone || !formData.password || !formData.confirmPassword) {
        setError('Please fill in all fields');
        return;
      }
      
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(formData.email)) {
        setError('Please enter a valid email address');
        return;
      }
      
      const cleanPhone = formData.phone.replace(/\s/g, '');
      if (cleanPhone.length !== 10) {
        setError('Please enter a valid 10-digit phone number (511 511 55 55)');
        return;
      }
      
      if (formData.password.length < 6) {
        setError('Password must be at least 6 characters');
        return;
      }
      
      if (formData.password !== formData.confirmPassword) {
        setError('Passwords do not match');
        return;
      }
    }
    if (activeStep === 1 && !formData.address) {
      setError('Please enter your address');
      return;
    }
    if (activeStep === 2) {
      if (!formData.cardName || !formData.cardNumber || !formData.cardExpiry || !formData.cardCVC) {
        setError('Please fill in all payment details');
        return;
      }
      if (formData.cardNumber.replace(/\s/g, '').length !== 16) {
        setError('Card number must be 16 digits');
        return;
      }
    }
    
    setError('');
    if (activeStep === steps.length - 1) {
      handleSubmit();
    } else {
      setActiveStep(activeStep + 1);
    }
  };

  const handleBack = () => {
    setActiveStep(activeStep - 1);
    setError('');
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = () => {
    const { confirmPassword, ...userData } = formData;
    
    const result = register(userData);
    
    if (result.success) {
      onRegisterSuccess();
      onClose();
      setFormData({
        firstName: '',
        lastName: '',
        email: '',
        phone: '',
        password: '',
        confirmPassword: '',
        address: '',
        cardName: '',
        cardNumber: '',
        cardExpiry: '',
        cardCVC: ''
      });
      setActiveStep(0);
      setShowPassword(false);
      setShowConfirmPassword(false);
    } else {
      setError(result.error);
    }
  };

  const formatCardNumber = (value) => {
    return value.replace(/\s/g, '').replace(/(\d{4})/g, '$1 ').trim();
  };

  const handleTogglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const handleToggleConfirmPasswordVisibility = () => {
    setShowConfirmPassword(!showConfirmPassword);
  };

  return (
    <Modal open={open} onClose={onClose}>
      <Box
        sx={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          width: { xs: '90%', sm: 500 },
          maxHeight: '90vh',
          overflow: 'auto',
          bgcolor: 'background.paper',
          borderRadius: 2,
          boxShadow: 24,
          p: 4
        }}
      >
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
          <Typography variant="h5" fontWeight="bold">
            Register
          </Typography>
          <IconButton onClick={onClose}>
            <CloseIcon />
          </IconButton>
        </Box>

        <Stepper activeStep={activeStep} sx={{ mb: 4 }}>
          {steps.map((label) => (
            <Step key={label}>
              <StepLabel>{label}</StepLabel>
            </Step>
          ))}
        </Stepper>

        <form>
          {activeStep === 0 && (
            <Box>
              <TextField
                fullWidth
                name="firstName"
                label="First Name"
                value={formData.firstName}
                onChange={handleChange}
                sx={{ mb: 2 }}
              />
              <TextField
                fullWidth
                name="lastName"
                label="Last Name"
                value={formData.lastName}
                onChange={handleChange}
                sx={{ mb: 2 }}
              />
              
              <TextField
                fullWidth
                name="email"
                label="Email"
                type="email"
                value={formData.email}
                onChange={handleChange}
                sx={{ mb: 2 }}
                placeholder="user@example.com"
              />
              
              <TextField
                fullWidth
                name="phone"
                label="Phone Number"
                value={formData.phone}
                onChange={(e) => {
                  let value = e.target.value.replace(/\D/g, '');
                  
                  if (value.length > 10) value = value.slice(0, 10);
                  
                  let formattedValue = '';
                  if (value.length > 0) formattedValue = value.slice(0, 3);
                  if (value.length > 3) formattedValue += ' ' + value.slice(3, 6);
                  if (value.length > 6) formattedValue += ' ' + value.slice(6, 8);
                  if (value.length > 8) formattedValue += ' ' + value.slice(8, 10);
                  
                  handleChange({ target: { name: 'phone', value: formattedValue } });
                }}
                sx={{ mb: 2 }}
                placeholder="511 511 55 55"
              />
              
              <TextField
                fullWidth
                name="password"
                label="Password"
                type={showPassword ? 'text' : 'password'}
                value={formData.password}
                onChange={handleChange}
                sx={{ mb: 1 }}
              />

              <FormControlLabel
                control={
                  <Checkbox
                    checked={showPassword}
                    onChange={handleTogglePasswordVisibility}
                    size="small"
                  />
                }
                label="Show Password"
                sx={{ mb: 2, display: 'block' }}
              />
              
              <TextField
                fullWidth
                name="confirmPassword"
                label="Confirm Password"
                type={showConfirmPassword ? 'text' : 'password'}
                value={formData.confirmPassword}
                onChange={handleChange}
                sx={{ mb: 1 }}
              />

              <FormControlLabel
                control={
                  <Checkbox
                    checked={showConfirmPassword}
                    onChange={handleToggleConfirmPasswordVisibility}
                    size="small"
                  />
                }
                label="Show Confirm Password"
                sx={{ mb: 2, display: 'block' }}
              />
            </Box>
          )}

          {activeStep === 1 && (
            <Box>
              <TextField
                fullWidth
                name="address"
                label="Address"
                multiline
                rows={3}
                value={formData.address}
                onChange={handleChange}
                sx={{ mb: 2 }}
                placeholder="Street, City, Country"
              />
            </Box>
          )}

          {activeStep === 2 && (
            <Box>
              <TextField
                fullWidth
                name="cardName"
                label="Card Nickname (e.g., My Card, Personal Card)"
                value={formData.cardName}
                onChange={handleChange}
                sx={{ mb: 2 }}
                placeholder="My Personal Card"
              />
              
              <TextField
                fullWidth
                name="cardNumber"
                label="Card Number"
                value={formatCardNumber(formData.cardNumber)}
                onChange={(e) => {
                  const value = e.target.value.replace(/\D/g, '').slice(0, 16);
                  handleChange({ target: { name: 'cardNumber', value } });
                }}
                sx={{ mb: 2 }}
                placeholder="1234 5678 9012 3456"
              />
              <Box sx={{ display: 'flex', gap: 2, mb: 2 }}>
                <TextField
                  fullWidth
                  name="cardExpiry"
                  label="Expiry Date (MM/YY)"
                  value={formData.cardExpiry}
                  onChange={(e) => {
                    let value = e.target.value.replace(/\D/g, '');
                    if (value.length >= 2) {
                      value = value.slice(0, 2) + '/' + value.slice(2, 4);
                    }
                    handleChange({ target: { name: 'cardExpiry', value } });
                  }}
                  placeholder="MM/YY"
                />
                <TextField
                  fullWidth
                  name="cardCVC"
                  label="CVC"
                  value={formData.cardCVC}
                  onChange={(e) => {
                    const value = e.target.value.replace(/\D/g, '').slice(0, 3);
                    handleChange({ target: { name: 'cardCVC', value } });
                  }}
                  placeholder="123"
                />
              </Box>
            </Box>
          )}

          {error && (
            <Alert severity="error" sx={{ mb: 2 }}>
              {error}
            </Alert>
          )}

          <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 3 }}>
            <Button
              onClick={handleBack}
              disabled={activeStep === 0}
            >
              Back
            </Button>
            <Button
              variant="contained"
              onClick={handleNext}
            >
              {activeStep === steps.length - 1 ? 'Complete Registration' : 'Next'}
            </Button>
          </Box>
        </form>
      </Box>
    </Modal>
  );
};

export default RegisterModal;