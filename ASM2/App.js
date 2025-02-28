import React, { useState, useEffect } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import LoginScreen from './Account/Login/index';
import RegisterScreen from './Account/Register/index';
import SplashScreen from './Splash/index';
import ProductDetail from './Home/ProductDetail/ProductDetail';
import BottomTabNavigator from './BottomTabNavigator/BottomTabNavigator';
import CartScreen from './BottomTabNavigator/CartScreen';
import CheckoutScreen from './BottomTabNavigator/Checkout';
import EditProfileScreen from './BottomTabNavigator/EditProfileScreen';
const Stack = createStackNavigator();

export default function App() {
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    setTimeout(() => {
      setIsLoading(false);
    }, 2000); // ⏳ Chờ 2 giây rồi mới chuyển màn hình
  }, []);

  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        {isLoading ? (
          <Stack.Screen name="Splash" component={SplashScreen} />
        ) : (
          <>
            <Stack.Screen name="Login" component={LoginScreen} />
            <Stack.Screen name="Register" component={RegisterScreen} />
            <Stack.Screen name="Home" component={BottomTabNavigator} />
            <Stack.Screen name="ProductDetail" component={ProductDetail} />
            <Stack.Screen name="Cart" component={CartScreen} />
            <Stack.Screen name="Checkout" component={CheckoutScreen} />
            <Stack.Screen name="EditProfile" component={EditProfileScreen} />
          </>
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
}
