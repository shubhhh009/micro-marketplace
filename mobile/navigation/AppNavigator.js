import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import { useAuth } from '../context/AuthContext';
import LoginScreen from '../screens/LoginScreen';
import RegisterScreen from '../screens/RegisterScreen';
import ProductListScreen from '../screens/ProductListScreen';
import ProductDetailScreen from '../screens/ProductDetailScreen';
import AddProductScreen from '../screens/AddProductScreen';
import FavoritesScreen from '../screens/FavoritesScreen';
import { TouchableOpacity, Alert, View, ActivityIndicator } from 'react-native';
import { MoreVertical, Plus } from 'lucide-react-native';

const Stack = createStackNavigator();

const AppNavigator = () => {
    const { user, logout, loading } = useAuth();

    if (loading) {
        return (
            <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                <ActivityIndicator size="large" color="#092735ff" />
            </View>
        );
    }

    return (
        <Stack.Navigator
            screenOptions={{
                headerStyle: {
                    backgroundColor: '#0ea5e9',
                },
                headerTintColor: '#fff',
                headerTitleStyle: {
                    fontWeight: 'bold',
                },
            }}
        >
            {user ? (
                <>
                    <Stack.Screen
                        name="Products"
                        component={ProductListScreen}
                        options={({ navigation }) => ({
                            title: 'MicroMarket',
                            headerRight: () => (
                                <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                                    {user.role === 'admin' && (
                                        <TouchableOpacity
                                            onPress={() => navigation.navigate('AddProduct')}
                                            style={{ marginRight: 15 }}
                                        >
                                            <Plus size={24} color="#fff" />
                                        </TouchableOpacity>
                                    )}
                                    <TouchableOpacity
                                        onPress={() => {
                                            Alert.alert(
                                                'Options',
                                                'What would you like to do?',
                                                [
                                                    { text: 'Favorites', onPress: () => navigation.navigate('Favorites') },
                                                    { text: 'Logout', onPress: logout, style: 'destructive' },
                                                    { text: 'Cancel', style: 'cancel' }
                                                ]
                                            );
                                        }}
                                        style={{ marginRight: 15 }}
                                    >
                                        <MoreVertical size={24} color="#fff" />
                                    </TouchableOpacity>
                                </View>
                            )
                        })}
                    />
                    <Stack.Screen
                        name="ProductDetail"
                        component={ProductDetailScreen}
                        options={{ title: 'Product Details' }}
                    />
                    <Stack.Screen
                        name="AddProduct"
                        component={AddProductScreen}
                        options={{ title: 'List Item' }}
                    />
                    <Stack.Screen
                        name="Favorites"
                        component={FavoritesScreen}
                        options={{ title: 'My Favorites' }}
                    />
                </>
            ) : (
                <>
                    <Stack.Screen
                        name="Login"
                        component={LoginScreen}
                        options={{ headerShown: false }}
                    />
                    <Stack.Screen
                        name="Register"
                        component={RegisterScreen}
                        options={{ headerShown: false }}
                    />
                </>
            )}
        </Stack.Navigator>
    );
};

export default AppNavigator;
