import React, { useState, useEffect } from 'react';
import {
  Modal,
  Box,
  Typography,
  TextField,
  Button,
  Alert,
  IconButton,
  Radio,
  RadioGroup,
  FormControlLabel,
  FormControl,
  FormLabel,
  MenuItem,
  Select,
  InputAdornment,
  Chip
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import CreditCardIcon from '@mui/icons-material/CreditCard';
import AddIcon from '@mui/icons-material/Add';
import { useAuth } from '../context/AuthContext';

const PaymentModal = ({ open, onClose, cartTotal, onPaymentSuccess }) => {
  const { user } = useAuth();
  const [paymentMethod, setPaymentMethod] = useState('savedCard');
  const [selectedCard, setSelectedCard] = useState('');
  const [useNewCard, setUseNewCard] = useState(false);
  const [cardName, setCardName] = useState('');
  const [cardNumber, setCardNumber] = useState('');
  const [cardExpiry, setCardExpiry] = useState('');
  const [cardCVC, setCardCVC] = useState('');
  const [isSuccess, setIsSuccess] = useState(false);
  const [error, setError] = useState('');

  const savedCards = user?.savedCards || [];

  useEffect(() => {
    if (savedCards.length > 0 && !selectedCard) {
      setSelectedCard(savedCards[0].id);
    }
  }, [savedCards, selectedCard]);

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (paymentMethod === 'savedCard' && !useNewCard) {
      if (!selectedCard) {
        setError('Please select a saved card or use new card');
        return;
      }
    } else {
      if (!cardNumber || !cardExpiry || !cardCVC) {
        setError('Please fill in all card details');
        return;
      }
      
      if (cardNumber.replace(/\s/g, '').length !== 16) {
        setError('Card number must be 16 digits');
        return;
      }
      
      if (!cardName) {
        setCardName('My Card');
      }
    }
    
    setTimeout(() => {
      setIsSuccess(true);
      setTimeout(() => {
        onPaymentSuccess();
        onClose();
        resetForm();
      }, 2000);
    }, 1500);
  };

  const resetForm = () => {
    setIsSuccess(false);
    setCardName('');
    setCardNumber('');
    setCardExpiry('');
    setCardCVC('');
    setError('');
    setUseNewCard(false);
  };

  const formatCardNumber = (value) => {
    return value.replace(/\s/g, '').replace(/(\d{4})/g, '$1 ').trim();
  };

  const maskCardNumber = (cardNumber) => {
    if (!cardNumber) return '';
    const cleaned = cardNumber.replace(/\s/g, '');
    return `**** **** **** ${cleaned.slice(-4)}`;
  };

  const getSelectedCardDetails = () => {
    return savedCards.find(card => card.id === selectedCard);
  };

  if (isSuccess) {
    return (
      <Modal open={open} onClose={onClose}>
        <Box
          sx={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            width: { xs: '90%', sm: 400 },
            bgcolor: 'background.paper',
            borderRadius: 2,
            boxShadow: 24,
            p: 4,
            textAlign: 'center'
          }}
        >
          <CheckCircleIcon sx={{ fontSize: 80, color: 'success.main', mb: 2 }} />
          <Typography variant="h5" fontWeight="bold" gutterBottom>
            Payment Successful!
          </Typography>
          <Typography variant="body1" color="text.secondary" gutterBottom>
            Your order has been confirmed.
          </Typography>
          <Typography variant="h6" color="primary" sx={{ mt: 2 }}>
            Total: {cartTotal.toFixed(2)} ₺
          </Typography>
          <Button 
            variant="contained" 
            sx={{ mt: 3 }}
            onClick={onClose}
          >
            Continue Shopping
          </Button>
        </Box>
      </Modal>
    );
  }

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
            Payment
          </Typography>
          <IconButton onClick={onClose}>
            <CloseIcon />
          </IconButton>
        </Box>

        <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 3 }}>
          <Typography variant="h6">Total Amount:</Typography>
          <Typography variant="h5" fontWeight="bold" color="primary">
            {cartTotal.toFixed(2)} ₺
          </Typography>
        </Box>

        <FormControl component="fieldset" sx={{ mb: 3 }}>
          <FormLabel component="legend">Payment Method</FormLabel>
          <RadioGroup
            value={paymentMethod}
            onChange={(e) => setPaymentMethod(e.target.value)}
          >
            <FormControlLabel 
              value="savedCard" 
              control={<Radio />} 
              label="Saved Credit Card" 
              disabled={savedCards.length === 0}
            />
            <FormControlLabel value="newCard" control={<Radio />} label="New Credit Card" />
          </RadioGroup>
        </FormControl>

        {paymentMethod === 'savedCard' && savedCards.length > 0 && (
          <Box sx={{ mb: 3 }}>
            <Typography variant="subtitle1" sx={{ mb: 1, fontWeight: 'bold' }}>
              Select a Saved Card
            </Typography>
            
            <Select
              fullWidth
              value={selectedCard}
              onChange={(e) => setSelectedCard(e.target.value)}
              sx={{ mb: 2 }}
              disabled={useNewCard}
            >
              {savedCards.map((card) => (
                <MenuItem key={card.id} value={card.id}>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <CreditCardIcon />
                    <Box>
                      <Typography variant="body1">{card.cardName}</Typography>
                      <Typography variant="body2" color="text.secondary">
                        {maskCardNumber(card.cardNumber)} • Exp: {card.cardExpiry}
                      </Typography>
                    </Box>
                  </Box>
                </MenuItem>
              ))}
            </Select>
            
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
              <Button
                variant="outlined"
                size="small"
                startIcon={<AddIcon />}
                onClick={() => setUseNewCard(!useNewCard)}
              >
                {useNewCard ? 'Use Saved Card' : 'Use New Card Instead'}
              </Button>
            </Box>
          </Box>
        )}

        {(paymentMethod === 'newCard' || (paymentMethod === 'savedCard' && useNewCard)) && (
          <form onSubmit={handleSubmit}>
            <TextField
              fullWidth
              label="Card Nickname (Optional)"
              value={cardName}
              onChange={(e) => setCardName(e.target.value)}
              sx={{ mb: 2 }}
              placeholder="My Personal Card"
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <CreditCardIcon color="action" />
                  </InputAdornment>
                )
              }}
            />
            
            <TextField
              fullWidth
              label="Card Number"
              value={formatCardNumber(cardNumber)}
              onChange={(e) => {
                const value = e.target.value.replace(/\D/g, '').slice(0, 16);
                setCardNumber(value);
              }}
              sx={{ mb: 2 }}
              placeholder="1234 5678 9012 3456"
            />
            <Box sx={{ display: 'flex', gap: 2, mb: 3 }}>
              <TextField
                fullWidth
                label="Expiry Date (MM/YY)"
                value={cardExpiry}
                onChange={(e) => {
                  let value = e.target.value.replace(/\D/g, '');
                  if (value.length >= 2) {
                    value = value.slice(0, 2) + '/' + value.slice(2, 4);
                  }
                  setCardExpiry(value);
                }}
                placeholder="MM/YY"
              />
              <TextField
                fullWidth
                label="CVC"
                value={cardCVC}
                onChange={(e) => {
                  const value = e.target.value.replace(/\D/g, '').slice(0, 3);
                  setCardCVC(value);
                }}
                placeholder="123"
              />
            </Box>
          </form>
        )}

        {paymentMethod === 'savedCard' && !useNewCard && selectedCard && (
          <Box sx={{ mb: 3, p: 2, bgcolor: 'grey.50', borderRadius: 1 }}>
            <Typography variant="subtitle2" sx={{ mb: 1 }}>
              Selected Card:
            </Typography>
            {(() => {
              const card = getSelectedCardDetails();
              return (
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <CreditCardIcon color="primary" />
                  <Box>
                    <Typography variant="body1" fontWeight="medium">
                      {card?.cardName}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      {maskCardNumber(card?.cardNumber)} • Exp: {card?.cardExpiry}
                    </Typography>
                  </Box>
                  <Chip label="Saved" size="small" color="success" sx={{ ml: 'auto' }} />
                </Box>
              );
            })()}
          </Box>
        )}

        {error && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {error}
          </Alert>
        )}

        <Button
          fullWidth
          variant="contained"
          size="large"
          onClick={handleSubmit}
        >
          Complete Payment
        </Button>
      </Box>
    </Modal>
  );
};

export default PaymentModal;