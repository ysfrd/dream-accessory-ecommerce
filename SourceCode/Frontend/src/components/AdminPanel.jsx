import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Paper,
  Button,
  IconButton,
  TextField,
  Alert,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Chip,
  Tooltip,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  FormControlLabel,
  Checkbox
} from '@mui/material';
import DownloadIcon from '@mui/icons-material/Download';
import RefreshIcon from '@mui/icons-material/Refresh';
import SearchIcon from '@mui/icons-material/Search';
import DeleteIcon from '@mui/icons-material/Delete';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import CreditCardIcon from '@mui/icons-material/CreditCard';
import AdminPanelSettingsIcon from '@mui/icons-material/AdminPanelSettings';
import CloseIcon from '@mui/icons-material/Close';
import { useAuth } from '../context/AuthContext';

const AdminPanel = ({ open, onClose }) => {
  const { exportUsersToTxt, getAllUsers, setUser: setAuthUser, setIsAdmin } = useAuth();
  const [users, setUsers] = useState([]);
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [exportDialog, setExportDialog] = useState(false);
  const [exportContent, setExportContent] = useState('');
  const [deleteDialog, setDeleteDialog] = useState(false);
  const [userToDelete, setUserToDelete] = useState(null);
  const [expandedUser, setExpandedUser] = useState(null);
  const [showPasswords, setShowPasswords] = useState({});
  const [showCardNumbers, setShowCardNumbers] = useState({});
  const [message, setMessage] = useState('');
  const [messageType, setMessageType] = useState('');

  useEffect(() => {
    loadUsers();
  }, []);

  useEffect(() => {
    if (searchTerm) {
      const filtered = users.filter(user => 
        user.firstName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.lastName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.phone.includes(searchTerm)
      );
      setFilteredUsers(filtered);
    } else {
      setFilteredUsers(users);
    }
  }, [searchTerm, users]);

  const loadUsers = () => {
    const allUsers = getAllUsers();
    setUsers(allUsers);
    setFilteredUsers(allUsers);
  };

  const handleExport = () => {
    const content = exportUsersToTxt();
    setExportContent(content);
    setExportDialog(true);
  };

  const downloadTxtFile = () => {
    const element = document.createElement("a");
    const file = new Blob([exportContent], {type: 'text/plain'});
    element.href = URL.createObjectURL(file);
    element.download = `dream_accessory_users_${new Date().toISOString().split('T')[0]}.txt`;
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
    setExportDialog(false);
  };

  const handleDeleteClick = (user) => {
    setUserToDelete(user);
    setDeleteDialog(true);
  };

  const confirmDeleteUser = () => {
    if (!userToDelete) return;

    const users = JSON.parse(localStorage.getItem('dreamAccessoryUsers') || '[]');
    const updatedUsers = users.filter(u => u.id !== userToDelete.id);
    localStorage.setItem('dreamAccessoryUsers', JSON.stringify(updatedUsers));

    const currentUser = JSON.parse(localStorage.getItem('dreamAccessoryUser') || 'null');
    if (currentUser && currentUser.id === userToDelete.id) {
      setAuthUser(null);
      setIsAdmin(false);
      localStorage.removeItem('dreamAccessoryUser');
      localStorage.setItem('dreamAccessoryAdmin', JSON.stringify(false));
    }

    loadUsers();
    
    setMessage(`${userToDelete.firstName} ${userToDelete.lastName} başarıyla silindi!`);
    setMessageType('success');
    
    setTimeout(() => {
      setMessage('');
      setMessageType('');
    }, 3000);

    setDeleteDialog(false);
    setUserToDelete(null);
  };

  const handleTogglePasswordVisibility = (userId) => {
    setShowPasswords(prev => ({
      ...prev,
      [userId]: !prev[userId]
    }));
  };

  const handleToggleCardNumberVisibility = (userId, cardId) => {
    setShowCardNumbers(prev => ({
      ...prev,
      [`${userId}-${cardId}`]: !prev[`${userId}-${cardId}`]
    }));
  };

  const formatPassword = (password, userId) => {
    if (showPasswords[userId]) {
      return password;
    }
    return '•'.repeat(password.length);
  };

  const formatCardNumber = (cardNumber, userId, cardId) => {
    if (showCardNumbers[`${userId}-${cardId}`]) {
      return cardNumber.replace(/(\d{4})/g, '$1 ').trim();
    }
    const cleaned = cardNumber.replace(/\s/g, '');
    return `**** **** **** ${cleaned.slice(-4)}`;
  };

  const formatPhone = (phone) => {
    if (!phone) return 'N/A';
    if (phone === 'admin') return 'Admin';
    
    const clean = phone.replace(/\D/g, '');
    if (clean.length === 10) {
      return `${clean.slice(0, 3)} ${clean.slice(3, 6)} ${clean.slice(6, 8)} ${clean.slice(8, 10)}`;
    }
    return phone;
  };

  const getUserIdInfo = (user) => {
    if (user.id === 'ADMIN001') return 'ADMIN001';
    return user.id;
  };

  const handleAccordionChange = (userId) => (event, isExpanded) => {
    setExpandedUser(isExpanded ? userId : null);
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="lg" fullWidth>
      <DialogTitle>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <AdminPanelSettingsIcon />
            <Typography variant="h5" fontWeight="bold">
              Admin Panel - User Management
            </Typography>
          </Box>
          <IconButton onClick={onClose} size="small">
            <CloseIcon />
          </IconButton>
        </Box>
      </DialogTitle>
      
      <DialogContent>
        {message && (
          <Alert severity={messageType} sx={{ mb: 2 }}>
            {message}
          </Alert>
        )}

        <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 3, gap: 2 }}>
          <Box sx={{ display: 'flex', gap: 2, flexGrow: 1 }}>
            <TextField
              placeholder="Search users..."
              variant="outlined"
              size="small"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              sx={{ width: 300 }}
              InputProps={{
                startAdornment: <SearchIcon sx={{ mr: 1, color: 'text.secondary' }} />
              }}
            />
            <Button 
              variant="outlined" 
              startIcon={<RefreshIcon />}
              onClick={loadUsers}
            >
              Refresh
            </Button>
          </Box>
          
          <Button 
            variant="contained" 
            color="primary" 
            startIcon={<DownloadIcon />}
            onClick={handleExport}
          >
            Export Users
          </Button>
        </Box>

        <Box sx={{ mb: 3, display: 'flex', gap: 3 }}>
          <Paper sx={{ p: 2, flex: 1, textAlign: 'center' }}>
            <Typography variant="h6" color="primary">{users.length}</Typography>
            <Typography variant="body2">Total Users</Typography>
          </Paper>
          <Paper sx={{ p: 2, flex: 1, textAlign: 'center' }}>
            <Typography variant="h6" color="secondary">
              {new Date().toLocaleDateString('tr-TR')}
            </Typography>
            <Typography variant="body2">Today</Typography>
          </Paper>
          <Paper sx={{ p: 2, flex: 1, textAlign: 'center' }}>
            <Typography variant="h6" color="success.main">
              {users.reduce((total, user) => total + (user.savedCards?.length || 0), 0)}
            </Typography>
            <Typography variant="body2">Saved Cards</Typography>
          </Paper>
        </Box>

        {filteredUsers.length === 0 ? (
          <Alert severity="info" sx={{ mt: 2 }}>
            No users found.
          </Alert>
        ) : (
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
            {filteredUsers.map((user) => (
              <Accordion 
                key={user.id}
                expanded={expandedUser === user.id}
                onChange={handleAccordionChange(user.id)}
              >
                <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, width: '100%' }}>
                    <Box sx={{ flex: 1 }}>
                      <Typography variant="subtitle1" fontWeight="medium">
                        {user.firstName} {user.lastName}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        {user.email} • {formatPhone(user.phone)}
                      </Typography>
                    </Box>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      {user.isAdmin ? (
                        <Chip label="Admin" color="error" size="small" />
                      ) : (
                        <Chip label="User" color="primary" size="small" variant="outlined" />
                      )}
                      {user.savedCards && user.savedCards.length > 0 && (
                        <Chip 
                          label={`${user.savedCards.length} Card${user.savedCards.length > 1 ? 's' : ''}`} 
                          size="small" 
                          color="success" 
                          variant="outlined"
                        />
                      )}
                      {!user.isAdmin && (
                        <Tooltip title="Delete User">
                          <IconButton 
                            color="error" 
                            size="small"
                            onClick={(e) => {
                              e.stopPropagation();
                              handleDeleteClick(user);
                            }}
                          >
                            <DeleteIcon fontSize="small" />
                          </IconButton>
                        </Tooltip>
                      )}
                    </Box>
                  </Box>
                </AccordionSummary>
                <AccordionDetails>
                  <Box sx={{ pl: 2 }}>
                    <Typography variant="body2" sx={{ mb: 2 }}>
                      <strong>ID:</strong> {getUserIdInfo(user)} • 
                      <strong> Registered:</strong> {new Date(user.createdAt).toLocaleDateString('tr-TR')} • 
                      <strong> Address:</strong> {user.address || 'N/A'}
                    </Typography>
                    
                    <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                      <Typography variant="body2">
                        <strong>Password:</strong> 
                        <Box component="span" sx={{ fontFamily: 'monospace', ml: 1 }}>
                          {formatPassword(user.password, user.id)}
                        </Box>
                      </Typography>
                      <FormControlLabel
                        control={
                          <Checkbox
                            checked={showPasswords[user.id] || false}
                            onChange={() => handleTogglePasswordVisibility(user.id)}
                            size="small"
                          />
                        }
                        label="Show"
                        sx={{ ml: 1 }}
                      />
                    </Box>

                    {user.savedCards && user.savedCards.length > 0 ? (
                      <Box sx={{ mt: 3 }}>
                        <Typography variant="subtitle2" sx={{ mb: 2, fontWeight: 'bold' }}>
                          Saved Cards ({user.savedCards.length})
                        </Typography>
                        <List dense>
                          {user.savedCards.map((card) => (
                            <ListItem 
                              key={card.id}
                              sx={{ 
                                border: '1px solid',
                                borderColor: 'divider',
                                borderRadius: 1,
                                mb: 1,
                                bgcolor: card.isDefault ? 'action.hover' : 'transparent'
                              }}
                            >
                              <ListItemIcon>
                                <CreditCardIcon color={card.isDefault ? "primary" : "action"} />
                              </ListItemIcon>
                              <ListItemText
                                primary={
                                  <Box sx={{ display: 'flex', alignItems: 'center' }}>
                                    <Typography variant="body1">
                                      {card.cardName}
                                      {card.isDefault && (
                                        <Chip label="Default" size="small" sx={{ ml: 1 }} />
                                      )}
                                    </Typography>
                                  </Box>
                                }
                                secondary={
                                  <Box>
                                    <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                                      <Typography variant="body2">
                                        <Box component="span" sx={{ fontFamily: 'monospace' }}>
                                          {formatCardNumber(card.cardNumber, user.id, card.id)}
                                        </Box>
                                      </Typography>
                                      <FormControlLabel
                                        control={
                                          <Checkbox
                                            checked={showCardNumbers[`${user.id}-${card.id}`] || false}
                                            onChange={() => handleToggleCardNumberVisibility(user.id, card.id)}
                                            size="small"
                                          />
                                        }
                                        label="Show"
                                        sx={{ ml: 1 }}
                                      />
                                    </Box>
                                    <Typography variant="body2">
                                      Exp: {card.cardExpiry} • CVC: {card.cardCVC}
                                    </Typography>
                                    <Typography variant="caption" color="text.secondary">
                                      Added: {new Date(card.addedDate).toLocaleDateString('tr-TR')}
                                    </Typography>
                                  </Box>
                                }
                              />
                            </ListItem>
                          ))}
                        </List>
                      </Box>
                    ) : (
                      <Typography variant="body2" color="text.secondary" sx={{ mt: 2 }}>
                        No saved cards
                      </Typography>
                    )}
                  </Box>
                </AccordionDetails>
              </Accordion>
            ))}
          </Box>
        )}
      </DialogContent>

      <DialogActions sx={{ p: 3 }}>
        <Button onClick={onClose}>Close</Button>
      </DialogActions>

      <Dialog open={exportDialog} onClose={() => setExportDialog(false)} maxWidth="md" fullWidth>
        <DialogTitle>Export Users Data</DialogTitle>
        <DialogContent>
          <TextField
            multiline
            fullWidth
            rows={10}
            value={exportContent}
            InputProps={{ readOnly: true }}
            sx={{ mt: 2, fontFamily: 'monospace' }}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setExportDialog(false)}>Cancel</Button>
          <Button onClick={downloadTxtFile} variant="contained" color="primary">
            Download .txt File
          </Button>
        </DialogActions>
      </Dialog>

      <Dialog open={deleteDialog} onClose={() => setDeleteDialog(false)}>
        <DialogTitle>Confirm Delete</DialogTitle>
        <DialogContent>
          <Typography>
            Are you sure you want to delete user <strong>{userToDelete?.firstName} {userToDelete?.lastName}</strong>?
          </Typography>
          <Typography variant="body2" color="error" sx={{ mt: 2 }}>
            ⚠️ This action cannot be undone! User will be permanently removed.
          </Typography>
          <Typography variant="body2" sx={{ mt: 1 }}>
            All saved cards and data will be deleted.
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDeleteDialog(false)}>Cancel</Button>
          <Button onClick={confirmDeleteUser} variant="contained" color="error">
            Delete Permanently
          </Button>
        </DialogActions>
      </Dialog>
    </Dialog>
  );
};

export default AdminPanel;