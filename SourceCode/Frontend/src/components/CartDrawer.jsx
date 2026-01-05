import React, { useState } from 'react';
import {
  Drawer,
  Box,
  Typography,
  IconButton,
  Button,
  Divider,
  List,
  ListItem,
  ListItemText,
  ListItemAvatar,
  Avatar
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import DeleteIcon from '@mui/icons-material/Delete';
import AddIcon from '@mui/icons-material/Add';
import RemoveIcon from '@mui/icons-material/Remove';
import { useCart } from '../context/CartContext';
import PaymentModal from './PaymentModal';

const CartDrawer = ({ open, onClose }) => {
  const { cartItems, removeFromCart, updateQuantity, cartTotal, clearCart } = useCart();
  const [isPaymentOpen, setIsPaymentOpen] = useState(false);

  const handlePaymentSuccess = () => {
    clearCart();
    onClose();
  };

  return (
    <>
      <Drawer
        anchor="right"
        open={open}
        onClose={onClose}
        PaperProps={{ sx: { width: { xs: '100%', sm: 400 } } }}
      >
        <Box sx={{ p: 3, height: '100%', display: 'flex', flexDirection: 'column' }}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
            <Typography variant="h5" fontWeight="bold">
              Shopping Cart
            </Typography>
            <IconButton onClick={onClose}>
              <CloseIcon />
            </IconButton>
          </Box>

          <Divider />

          <Box sx={{ flexGrow: 1, overflowY: 'auto', mt: 2 }}>
            {cartItems.length === 0 ? (
              <Typography textAlign="center" color="text.secondary" sx={{ mt: 4 }}>
                Your cart is empty
              </Typography>
            ) : (
              <List>
                {cartItems.map((item) => (
                  <ListItem
                    key={item.id}
                    secondaryAction={
                      <IconButton edge="end" onClick={() => removeFromCart(item.id)}>
                        <DeleteIcon />
                      </IconButton>
                    }
                  >
                    <ListItemAvatar>
                      <Avatar
                        src={item.imageUrl}
                        variant="rounded"
                        sx={{ width: 60, height: 60 }}
                      />
                    </ListItemAvatar>
                    <ListItemText
                      primary={item.name}
                      secondary={
                        <Box>
                          <Typography variant="body2" color="text.secondary">
                            {item.category} • {item.price} ₺
                          </Typography>
                          <Box sx={{ display: 'flex', alignItems: 'center', mt: 1 }}>
                            <IconButton 
                              size="small" 
                              onClick={() => updateQuantity(item.id, item.quantity - 1)}
                            >
                              <RemoveIcon />
                            </IconButton>
                            <Typography sx={{ mx: 1 }}>{item.quantity}</Typography>
                            <IconButton 
                              size="small" 
                              onClick={() => updateQuantity(item.id, item.quantity + 1)}
                            >
                              <AddIcon />
                            </IconButton>
                          </Box>
                        </Box>
                      }
                    />
                  </ListItem>
                ))}
              </List>
            )}
          </Box>

          <Box sx={{ mt: 'auto', pt: 2 }}>
            <Divider sx={{ mb: 2 }} />
            <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
              <Typography variant="h6">Total:</Typography>
              <Typography variant="h6" fontWeight="bold">
                {cartTotal.toFixed(2)} ₺
              </Typography>
            </Box>
            <Button
              fullWidth
              variant="contained"
              size="large"
              disabled={cartItems.length === 0}
              sx={{ mb: 2 }}
              onClick={() => setIsPaymentOpen(true)}
            >
              Proceed to Checkout
            </Button>
            <Button fullWidth variant="outlined" onClick={onClose}>
              Continue Shopping
            </Button>
          </Box>
        </Box>
      </Drawer>

      <PaymentModal 
        open={isPaymentOpen}
        onClose={() => setIsPaymentOpen(false)}
        cartTotal={cartTotal}
        onPaymentSuccess={handlePaymentSuccess}
      />
    </>
  );
};

export default CartDrawer;