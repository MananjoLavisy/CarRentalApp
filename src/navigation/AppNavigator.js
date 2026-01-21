import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { useAuth } from '../contexts/AuthContext';

// Auth Screens
import LoginScreen from '../screens/Auth/LoginScreen';
import RegisterScreen from '../screens/Auth/RegisterScreen';

// Home Screens
import HomeScreen from '../screens/Home/HomeScreen';
import CarDetailsScreen from '../screens/Home/CarDetailsScreen';
import FavoritesScreen from '../screens/Home/FavoritesScreen';

// Booking Screens
import BookingFormScreen from '../screens/Booking/BookingFormScreen';
import SummaryScreen from '../screens/Booking/SummaryScreen';
import PaymentScreen from '../screens/Booking/PaymentScreen';
import ConfirmationScreen from '../screens/Booking/ConfirmationScreen';

// Reservation Screens
import ReservationsScreen from '../screens/Reservations/ReservationsScreen';
import ReservationDetailsScreen from '../screens/Reservations/ReservationDetailsScreen';

const Stack = createStackNavigator();
const Tab = createBottomTabNavigator();

// Tab Navigator pour les écrans principaux
const MainTabs = () => {
  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: '#3498db',
        tabBarInactiveTintColor: '#95a5a6',
        tabBarStyle: {
          backgroundColor: '#fff',
          borderTopWidth: 1,
          borderTopColor: '#ecf0f1',
          paddingBottom: 5,
          paddingTop: 5,
          height: 60,
        },
        tabBarLabelStyle: {
          fontSize: 12,
          fontWeight: '600',
        },
      }}
    >
      <Tab.Screen
        name="Home"
        component={HomeScreen}
        options={{
          tabBarLabel: 'Accueil',
          tabBarIcon: ({ color, size }) => (
            <Icon name="home" size={size} color={color} />
          ),
        }}
      />
      <Tab.Screen
        name="Favorites"
        component={FavoritesScreen}
        options={{
          tabBarLabel: 'Favoris',
          tabBarIcon: ({ color, size }) => (
            <Icon name="heart" size={size} color={color} />
          ),
        }}
      />
      <Tab.Screen
        name="Reservations"
        component={ReservationsScreen}
        options={{
          tabBarLabel: 'Réservations',
          tabBarIcon: ({ color, size }) => (
            <Icon name="calendar-check" size={size} color={color} />
          ),
        }}
      />
    </Tab.Navigator>
  );
};

// Stack principal
const AppNavigator = () => {
  const { user, loading } = useAuth();

  if (loading) {
    return null;
  }

  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      {!user ? (
        // Écrans d'authentification
        <Stack.Group>
          <Stack.Screen name="Login" component={LoginScreen} />
          <Stack.Screen name="Register" component={RegisterScreen} />
        </Stack.Group>
      ) : (
        // Écrans principaux
        <Stack.Group>
          <Stack.Screen name="MainTabs" component={MainTabs} />
          <Stack.Screen name="CarDetails" component={CarDetailsScreen} />
          <Stack.Screen name="BookingForm" component={BookingFormScreen} />
          <Stack.Screen name="Summary" component={SummaryScreen} />
          <Stack.Screen name="Payment" component={PaymentScreen} />
          <Stack.Screen name="Confirmation" component={ConfirmationScreen} />
          <Stack.Screen name="ReservationDetails" component={ReservationDetailsScreen} />
        </Stack.Group>
      )}
    </Stack.Navigator>
  );
};

export default AppNavigator;