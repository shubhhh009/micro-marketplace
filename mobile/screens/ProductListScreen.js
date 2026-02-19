import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, Image, TouchableOpacity, StyleSheet, TextInput, ActivityIndicator, Alert } from 'react-native';
import { productService, favoriteService } from '../services/api';
import { Search, Heart } from 'lucide-react-native';
import { useAuth } from '../context/AuthContext';

import { useFocusEffect } from '@react-navigation/native';

const ProductListScreen = ({ navigation }) => {
    const [products, setProducts] = useState([]);
    const [favorites, setFavorites] = useState([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState('');
    const { logout } = useAuth();

    useFocusEffect(
        React.useCallback(() => {
            fetchProducts();
            fetchFavorites();
        }, [search])
    );

    const fetchProducts = async () => {
        try {
            const { data } = await productService.getProducts({ search, limit: 20 });
            setProducts(data.products);
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    const fetchFavorites = async () => {
        try {
            const { data } = await favoriteService.getFavorites();
            setFavorites(data.map(f => f.id));
        } catch (error) {
            console.error(error);
        }
    };

    const toggleFavorite = async (productId) => {
        try {
            let data;
            if (favorites.includes(productId)) {
                const res = await favoriteService.removeFavorite(productId);
                data = res.data;
            } else {
                const res = await favoriteService.addFavorite(productId);
                data = res.data;
            }
            setFavorites(data.map(f => f.id || f._id));
        } catch (error) {
            console.error(error);
            Alert.alert('Error', 'Could not update favorites');
        }
    };

    const renderProduct = ({ item }) => {
        const isFavorite = favorites.includes(item.id);
        return (
            <TouchableOpacity
                style={styles.card}
                onPress={() => navigation.navigate('ProductDetail', { id: item.id })}
            >
                <Image
                    source={{ uri: item.image || 'https://via.placeholder.com/400' }}
                    style={styles.image}
                    onError={(e) => console.log('Image load error:', item.title)}
                />
                <TouchableOpacity
                    style={styles.favoriteBadge}
                    onPress={() => toggleFavorite(item.id)}
                >
                    <Heart size={20} color={isFavorite ? '#ef4444' : '#64748b'} fill={isFavorite ? '#ef4444' : 'transparent'} />
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
            <View style={styles.searchContainer}>
                <Search size={20} color="#94a3b8" />
                <TextInput
                    style={styles.searchInput}
                    placeholder="Search products..."
                    value={search}
                    onChangeText={setSearch}
                />
            </View>

            {loading ? (
                <ActivityIndicator size="large" color="#0ea5e9" style={{ flex: 1 }} />
            ) : (
                <FlatList
                    data={products}
                    renderItem={renderProduct}
                    keyExtractor={item => item.id}
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
    searchContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#fff',
        margin: 15,
        paddingHorizontal: 15,
        borderRadius: 12,
        height: 50,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.05,
        shadowRadius: 5,
        elevation: 2,
    },
    searchInput: {
        flex: 1,
        marginLeft: 10,
        fontSize: 16,
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
});

export default ProductListScreen;
