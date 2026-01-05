import { createContext, useState, useContext, useEffect } from 'react';

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    const savedUser = localStorage.getItem('dreamAccessoryUser');
    return savedUser ? JSON.parse(savedUser) : null;
  });
  
  const [isAdmin, setIsAdmin] = useState(() => {
    const savedAdmin = localStorage.getItem('dreamAccessoryAdmin');
    return savedAdmin ? JSON.parse(savedAdmin) : false;
  });

  useEffect(() => {
    if (user) {
      localStorage.setItem('dreamAccessoryUser', JSON.stringify(user));
    } else {
      localStorage.removeItem('dreamAccessoryUser');
    }
  }, [user]);

  useEffect(() => {
    localStorage.setItem('dreamAccessoryAdmin', JSON.stringify(isAdmin));
  }, [isAdmin]);

  const generateUserId = (firstName, lastName) => {
    const timestamp = Date.now();
    const randomNum = Math.floor(Math.random() * 10000);
    
    const firstInitial = firstName ? firstName.charAt(0).toUpperCase() : 'U';
    const lastInitial = lastName ? lastName.charAt(0).toUpperCase() : 'S';
    
    return `${firstInitial}${lastInitial}${timestamp}${randomNum}`;
  };

  const generateCardId = () => {
    return `CARD${Date.now()}${Math.floor(Math.random() * 1000)}`;
  };

  const login = (credentials) => {
    const { phoneOrEmail, password } = credentials;
    
    if ((phoneOrEmail === 'admin' || phoneOrEmail === 'admin@admin.com') && password === '12345') {
      const adminUser = { 
        id: 'ADMIN001', 
        email: 'admin@admin.com', 
        phone: 'admin',
        firstName: 'Admin',
        lastName: 'User',
        isAdmin: true,
        password: '12345',
        createdAt: new Date().toISOString(),
        savedCards: []
      };
      setUser(adminUser);
      setIsAdmin(true);
      return { success: true, isAdmin: true };
    }
    
    const users = JSON.parse(localStorage.getItem('dreamAccessoryUsers') || '[]');
    
    const foundUser = users.find(u => 
      u.email === phoneOrEmail && u.password === password
    );
    
    if (foundUser) {
      setUser(foundUser);
      setIsAdmin(foundUser.isAdmin || false);
      return { success: true, isAdmin: foundUser.isAdmin || false };
    }
    
    return { success: false, error: 'Invalid credentials' };
  };

  const register = (userData) => {
    const users = JSON.parse(localStorage.getItem('dreamAccessoryUsers') || '[]');
    
    if (users.find(u => u.email === userData.email)) {
      return { success: false, error: 'Email already exists' };
    }
    
    const cleanPhone = userData.phone.replace(/\s/g, '');
    if (users.find(u => u.phone === cleanPhone)) {
      return { success: false, error: 'Phone number already exists' };
    }
    
    const cardId = generateCardId();
    
    const newUserId = generateUserId(userData.firstName, userData.lastName);
    
    const newUser = {
      id: newUserId,
      ...userData,
      phone: cleanPhone,
      createdAt: new Date().toISOString(),
      isAdmin: false,
      savedCards: userData.cardNumber ? [
        {
          id: cardId,
          cardName: userData.cardName || 'My Card',
          cardNumber: userData.cardNumber,
          cardExpiry: userData.cardExpiry,
          cardCVC: userData.cardCVC,
          isDefault: true,
          addedDate: new Date().toISOString()
        }
      ] : []
    };
    
    users.push(newUser);
    localStorage.setItem('dreamAccessoryUsers', JSON.stringify(users));
    setUser(newUser);
    
    return { success: true };
  };

  const logout = () => {
    setUser(null);
    setIsAdmin(false);
  };

  const exportUsersToTxt = () => {
    const users = JSON.parse(localStorage.getItem('dreamAccessoryUsers') || '[]');
    
    let textContent = 'DREAM ACCESSORY USERS\n';
    textContent += '=====================\n';
    textContent += `Export Date: ${new Date().toLocaleString('tr-TR')}\n`;
    textContent += `Total Users: ${users.length}\n\n`;
    
    users.forEach((user, index) => {
      textContent += `USER #${index + 1}\n`;
      textContent += `ID: ${user.id}\n`;
      textContent += `Name: ${user.firstName} ${user.lastName}\n`;
      textContent += `Email: ${user.email || 'N/A'}\n`;
      textContent += `Phone: ${user.phone || 'N/A'}\n`;
      textContent += `Password: ${user.password}\n`;
      textContent += `Address: ${user.address || 'N/A'}\n`;
      textContent += `Registered: ${new Date(user.createdAt).toLocaleDateString('tr-TR')}\n`;
      textContent += `Role: ${user.isAdmin ? 'Admin' : 'User'}\n`;
      
      if (user.savedCards && user.savedCards.length > 0) {
        textContent += `Saved Cards: ${user.savedCards.length}\n`;
        user.savedCards.forEach((card, cardIndex) => {
          textContent += `  Card ${cardIndex + 1}: ${card.cardName}\n`;
          textContent += `    Number: **** **** **** ${card.cardNumber.slice(-4)}\n`;
          textContent += `    Expiry: ${card.cardExpiry}\n`;
          textContent += `    Added: ${new Date(card.addedDate).toLocaleDateString('tr-TR')}\n`;
        });
      } else {
        textContent += `Saved Cards: None\n`;
      }
      textContent += '---\n';
    });
    
    return textContent;
  };

  const getAllUsers = () => {
    const users = JSON.parse(localStorage.getItem('dreamAccessoryUsers') || '[]');
    const adminUser = {
      id: 'ADMIN001',
      email: 'admin@admin.com',
      phone: 'admin',
      firstName: 'Admin',
      lastName: 'User',
      password: '12345',
      isAdmin: true,
      createdAt: new Date().toISOString(),
      savedCards: []
    };
    
    return [adminUser, ...users];
  };

  const addCardToUser = (userId, cardData) => {
    const users = JSON.parse(localStorage.getItem('dreamAccessoryUsers') || '[]');
    const userIndex = users.findIndex(u => u.id === userId);
    
    if (userIndex !== -1) {
      const cardId = generateCardId();
      const newCard = {
        id: cardId,
        ...cardData,
        isDefault: users[userIndex].savedCards.length === 0,
        addedDate: new Date().toISOString()
      };
      
      users[userIndex].savedCards = [...(users[userIndex].savedCards || []), newCard];
      localStorage.setItem('dreamAccessoryUsers', JSON.stringify(users));
      
      if (user && user.id === userId) {
        setUser(users[userIndex]);
      }
      
      return { success: true };
    }
    
    return { success: false, error: 'User not found' };
  };

  return (
    <AuthContext.Provider value={{
      user,
      isAdmin,
      login,
      register,
      logout,
      exportUsersToTxt,
      getAllUsers,
      addCardToUser,
      setUser,
      setIsAdmin
    }}>
      {children}
    </AuthContext.Provider>
  );
};