import React, { useState, useCallback } from 'react';
import { View, Text, FlatList, Image, TouchableOpacity, StyleSheet, ActivityIndicator, Alert } from 'react-native';
import { favoriteService } from '../services/api';
import { Heart, ArrowLeft } from 'lucide-react-native';
import { useFocusEffect } from '@react-navigation/native';

const FavoritesScreen = ({ navigation }) => {
    const [favorites, setFavorites] = useState([]);
    const [loading, setLoading] = useState(true);

    useFocusEffect(
        useCallback(() => {
            fetchFavorites();
        }, [])
    );

    const fetchFavorites = async () => {
        try {
            setLoading(true);
            const { data } = await favoriteService.getFavorites();
            setFavorites(data);
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    const removeFavorite = async (productId) => {
        try {
            const { data } = await favoriteService.removeFavorite(productId);
            // The backend returns the updated list of favorites (populated objects)
            setFavorites(data.filter(f => f !== null));
        } catch (error) {
            console.error(error);
            Alert.alert('Error', 'Could not remove favorite');
        }
    };

    const renderProduct = ({ item }) => {
        return (
            <TouchableOpacity
                style={styles.card}
                onPress={() => navigation.navigate('ProductDetail', { id: item.id || item._id })}
            >
                <Image
                    source={{ uri: item.image || 'https://via.placeholder.com/400' }}
                    style={styles.image}
                    onError={(e) => console.log('Image load error:', item.title)}
                />
                <TouchableOpacity
                    style={styles.favoriteBadge}
                    onPress={() => removeFavorite(item.id || item._id)}
                >
                    <Heart size={20} color="#ef4444" fill="#ef4444" />
                </TouchableOpacity>
                <View style={styles.cardContent}>
                    <Text style={styles.productTitle} numberOfLines={1}>{item.title}</Text>
                    <Text style={styles.productPrice}>${item.price}</Text>
                </View>
            </TouchableOpacity>
        );
    };

    return (
        <View style={styles.container}>
            {loading ? (
                <ActivityIndicator size="large" color="#0ea5e9" style={{ flex: 1 }} />
            ) : favorites.length === 0 ? (
                <View style={styles.emptyContainer}>
                    <Heart size={64} color="#cbd5e1" />
                    <Text style={styles.emptyText}>No favorites yet</Text>
                    <TouchableOpacity
                        style={styles.exploreButton}
                        onPress={() => navigation.navigate('Products')}
                    >
                        <Text style={styles.exploreButtonText}>Explore Products</Text>
                    </TouchableOpacity>
                </View>
            ) : (
                <FlatList
                    data={favorites}
                    renderItem={renderProduct}
                    keyExtractor={item => item.id || item._id}
                    numColumns={2}
                    contentContainerStyle={styles.list}
                    columnWrapperStyle={styles.row}
                />
            )}
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#f8fafc',
    },
    list: {
        padding: 10,
    },
    row: {
        justifyContent: 'space-between',
    },
    card: {
        backgroundColor: '#fff',
        borderRadius: 15,
        marginBottom: 15,
        width: '48%',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.05,
        shadowRadius: 5,
        elevation: 2,
        overflow: 'hidden',
    },
    image: {
        width: '100%',
        height: 150,
        resizeMode: 'cover',
    },
    favoriteBadge: {
        position: 'absolute',
        top: 10,
        right: 10,
        backgroundColor: 'rgba(255,255,255,0.8)',
        borderRadius: 20,
        padding: 6,
    },
    cardContent: {
        padding: 12,
    },
    productTitle: {
        fontSize: 14,
        fontWeight: 'bold',
        color: '#1e293b',
    },
    productPrice: {
        fontSize: 16,
        fontWeight: '800',
        color: '#0ea5e9',
        marginTop: 4,
    },
    emptyContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    emptyText: {
        fontSize: 18,
        color: '#64748b',
        fontWeight: 'bold',
        marginTop: 16,
    },
    exploreButton: {
        marginTop: 20,
        backgroundColor: '#0ea5e9',
        paddingVertical: 12,
        paddingHorizontal: 24,
        borderRadius: 25,
    },
    exploreButtonText: {
        color: '#fff',
        fontSize: 16,
        fontWeight: 'bold',
    },
});

export default FavoritesScreen;
