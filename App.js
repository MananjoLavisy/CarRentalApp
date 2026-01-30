import React, { useEffect, useState } from 'react';
import { ActivityIndicator, View } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { AuthProvider } from './src/contexts/AuthContext';
import { createTables } from './src/database/migration';
import { seedDatabase } from './src/database/seed';
import { initNotifications } from './src/services/NotificationService';
import AppNavigator from './src/navigation/AppNavigator';

const App = () => {
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    initializeApp();
  }, []);

  const initializeApp = async () => {
    try {
      // Initialiser la base de données
      await createTables();
      await seedDatabase();
      
      // Initialiser les notifications
      initNotifications();
      
      setIsReady(true);
    } catch (error) {
      console.error('Error initializing app:', error);
    }
  };

  if (!isReady) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size="large" color="#3498db" />
      </View>
    );
  }

  return (
    <AuthProvider>
      <NavigationContainer>
        <AppNavigator />
      </NavigationContainer>
    </AuthProvider>
  );
};

export default App;