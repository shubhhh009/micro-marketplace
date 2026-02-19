import React, { useState, useEffect } from 'react';
import { View, Text, Image, ScrollView, StyleSheet, TouchableOpacity, ActivityIndicator, Alert } from 'react-native';
import { productService, favoriteService } from '../services/api';
import { useAuth } from '../context/AuthContext';
import { Heart, Share2, ShieldCheck, Truck, Trash2 } from 'lucide-react-native';

const ProductDetailScreen = ({ route, navigation }) => {
    const { id } = route.params;
    const { user } = useAuth();
    const [product, setProduct] = useState(null);
    const [loading, setLoading] = useState(true);
    const [isFavorite, setIsFavorite] = useState(false);

    useEffect(() => {
        fetchProduct();
        checkFavorite();
    }, [id]);

    const fetchProduct = async () => {
        try {
            const { data } = await productService.getProduct(id);
            setProduct(data);
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    const checkFavorite = async () => {
        try {
            const { data } = await favoriteService.getFavorites();
            setIsFavorite(data.some(f => (f.id || f._id) === id));
        } catch (error) {
            console.error(error);
        }
    };

    const toggleFavorite = async () => {
        try {
            let data;
            if (isFavorite) {
                const res = await favoriteService.removeFavorite(id);
                data = res.data;
            } else {
                const res = await favoriteService.addFavorite(id);
                data = res.data;
            }
            const isInFavorites = data.some(f => (f.id || f._id) === id);
            setIsFavorite(isInFavorites);
        } catch (error) {
            console.error(error);
            Alert.alert('Error', 'Could not update favorites');
        }
    };

    const handleDelete = () => {
        Alert.alert(
            'Delete Product',
            'Are you sure you want to delete this product?',
            [
                { text: 'Cancel', style: 'cancel' },
                {
                    text: 'Delete',
                    style: 'destructive',
                    onPress: async () => {
                        try {
                            await productService.deleteProduct(id);
                            Alert.alert('Success', 'Product deleted successfully', [
                                { text: 'OK', onPress: () => navigation.goBack() }
                            ]);
                        } catch (error) {
                            console.error('Delete failed:', error);
                            Alert.alert('Error', 'Failed to delete product');
                        }
                    }
                }
            ]
        );
    };

    if (loading) return <ActivityIndicator size="large" color="#0ea5e9" style={{ flex: 1 }} />;
    if (!product) return <View style={styles.center}><Text>Product not found</Text></View>;

    return (
        <ScrollView style={styles.container}>
            <Image
                source={{ uri: product.image || 'https://via.placeholder.com/800' }}
                style={styles.image}
                onError={() => console.log('Detail image load error')}
            />

            <View style={styles.content}>
                <View style={styles.header}>
                    <Text style={styles.title}>{product.title}</Text>
                    <Text style={styles.price}>${product.price}</Text>
                </View>

                <Text style={styles.description}>{product.description}</Text>

                <View style={styles.actions}>
                    <TouchableOpacity style={styles.buyButton}>
                        <Text style={styles.buyButtonText}>Buy Now</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                        style={[styles.iconButton, isFavorite && styles.favoriteActive]}
                        onPress={toggleFavorite}
                    >
                        <Heart size={24} color={isFavorite ? '#fff' : '#64748b'} fill={isFavorite ? '#fff' : 'transparent'} />
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.iconButton}>
                        <Share2 size={24} color="#64748b" />
                    </TouchableOpacity>
                    {user && user.role === 'admin' && (
                        <TouchableOpacity
                            style={[styles.iconButton, { backgroundColor: '#fee2e2' }]}
                            onPress={handleDelete}
                        >
                            <Trash2 size={24} color="#ef4444" />
                        </TouchableOpacity>
                    )}
                </View>

                <View style={styles.featureList}>
                    <View style={styles.featureItem}>
                        <View style={styles.featureIcon}>
                            <Truck size={20} color="#0ea5e9" />
                        </View>
                        <View>
                            <Text style={styles.featureTitle}>Free Delivery</Text>
                            <Text style={styles.extraText}>On orders over $99</Text>
                        </View>
                    </View>
                    <View style={styles.featureItem}>
                        <View style={styles.featureIcon}>
                            <ShieldCheck size={20} color="#0ea5e9" />
                        </View>
                        <View>
                            <Text style={styles.featureTitle}>Warranty</Text>
                            <Text style={styles.extraText}>2 Year full protection</Text>
                        </View>
                    </View>
                </View>
            </View>
        </ScrollView >
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
    },
    image: {
        width: '100%',
        height: 350,
        resizeMode: 'cover',
    },
    content: {
        padding: 20,
        borderTopLeftRadius: 30,
        borderTopRightRadius: 30,
        backgroundColor: '#fff',
        marginTop: -30,
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 15,
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        color: '#0f172a',
        flex: 1,
    },
    price: {
        fontSize: 24,
        fontWeight: '800',
        color: '#0ea5e9',
        marginLeft: 10,
    },
    description: {
        fontSize: 16,
        color: '#64748b',
        lineHeight: 24,
        marginBottom: 25,
    },
    actions: {
        flexDirection: 'row',
        gap: 12,
        marginBottom: 30,
    },
    buyButton: {
        flex: 1,
        backgroundColor: '#0ea5e9',
        height: 60,
        borderRadius: 15,
        justifyContent: 'center',
        alignItems: 'center',
        shadowColor: '#0ea5e9',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 8,
    },
    buyButtonText: {
        color: '#fff',
        fontSize: 18,
        fontWeight: 'bold',
    },
    iconButton: {
        width: 60,
        height: 60,
        backgroundColor: '#f1f5f9',
        borderRadius: 15,
        justifyContent: 'center',
        alignItems: 'center',
    },
    favoriteActive: {
        backgroundColor: '#ef4444',
    },
    featureList: {
        borderTopWidth: 1,
        borderTopColor: '#f1f5f9',
        paddingTop: 20,
    },
    featureItem: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 20,
    },
    featureIcon: {
        width: 40,
        height: 40,
        backgroundColor: '#f0f9ff',
        borderRadius: 10,
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 15,
    },
    featureTitle: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#1e293b',
    },
    extraText: {
        fontSize: 12,
        color: '#64748b',
    },
    center: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    }
});

export default ProductDetailScreen;
