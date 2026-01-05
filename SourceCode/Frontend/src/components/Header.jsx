import { useState } from 'react';
import {
  AppBar,
  Container,
  Toolbar,
  Box,
  Typography,
  Button,
  IconButton,
  Badge
} from '@mui/material';
import DiamondIcon from '@mui/icons-material/Diamond';
import PersonIcon from '@mui/icons-material/Person';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import LoginModal from './LoginModal';
import RegisterModal from './RegisterModal';
import CartDrawer from './CartDrawer';
import AdminPanel from './AdminPanel';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';

const Header = () => {
  const { cartCount } = useCart();
  const { user, isAdmin, logout } = useAuth();
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isLoginOpen, setIsLoginOpen] = useState(false);
  const [isRegisterOpen, setIsRegisterOpen] = useState(false);
  const [isAdminPanelOpen, setIsAdminPanelOpen] = useState(false);
  
  const handleLoginSuccess = () => {
    setIsLoginOpen(false);
    if (isAdmin) {
      console.log('Admin logged in');
    }
  };
  
  const handleRegisterSuccess = () => {
    setIsRegisterOpen(false);
  };
  
  const handleLogout = () => {
    logout();
  };

  return (
    <>
      <AppBar position="sticky" sx={{ backgroundColor: '#0a1f44' }}>
        <Container maxWidth="xl">
          <Toolbar sx={{ justifyContent: 'space-between' }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
              <DiamondIcon sx={{ fontSize: 32, color: '#1e90ff' }} />
              <Typography variant="h5" sx={{ fontWeight: 'bold' }}>
                Dream Accessory
              </Typography>
            </Box>

            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
              {user ? (
                <>
                  <Button 
                    color="inherit" 
                    startIcon={<PersonIcon />}
                    onClick={() => {
                      if (isAdmin) {
                        setIsAdminPanelOpen(true);
                      } else {
                        console.log('Go to user account');
                      }
                    }}
                  >
                    {isAdmin ? 'Admin Panel' : 'My Account'}
                  </Button>
                  <Button 
                    color="inherit"
                    onClick={handleLogout}
                  >
                    Logout
                  </Button>
                </>
              ) : (
                <>
                  <Button 
                    variant="contained" 
                    sx={{ borderRadius: '20px' }}
                    onClick={() => setIsLoginOpen(true)}
                  >
                    Login
                  </Button>
                  
                  <Button 
                    variant="outlined" 
                    sx={{ 
                      borderRadius: '20px',
                      color: 'white',
                      borderColor: 'white',
                      '&:hover': {
                        borderColor: '#1e90ff',
                        backgroundColor: 'rgba(30, 144, 255, 0.1)'
                      }
                    }}
                    onClick={() => setIsRegisterOpen(true)}
                  >
                    Register
                  </Button>
                </>
              )}
              
              <IconButton 
                color="inherit" 
                onClick={() => setIsCartOpen(true)}
              >
                <Badge badgeContent={cartCount} color="error">
                  <ShoppingCartIcon />
                </Badge>
              </IconButton>
            </Box>
          </Toolbar>
        </Container>
      </AppBar>

      <CartDrawer open={isCartOpen} onClose={() => setIsCartOpen(false)} />
      
      <LoginModal 
        open={isLoginOpen} 
        onClose={() => setIsLoginOpen(false)}
        onLoginSuccess={handleLoginSuccess}
      />
      
      <RegisterModal 
        open={isRegisterOpen} 
        onClose={() => setIsRegisterOpen(false)}
        onRegisterSuccess={handleRegisterSuccess}
      />
      
      <AdminPanel 
        open={isAdminPanelOpen}
        onClose={() => setIsAdminPanelOpen(false)}
      />
    </>
  );
};

export default Header;