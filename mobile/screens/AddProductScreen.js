import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, ScrollView, KeyboardAvoidingView, Platform, ActivityIndicator, Alert } from 'react-native';
import { productService } from '../services/api';
import { PackagePlus, Image as ImageIcon, Info, Tag } from 'lucide-react-native';
import { LinearGradient } from 'expo-linear-gradient';

const AddProductScreen = ({ navigation }) => {
    const [formData, setFormData] = useState({
        title: '',
        price: '',
        description: '',
        image: '',
    });
    const [loading, setLoading] = useState(false);

    const handleSubmit = async () => {
        if (!formData.title || !formData.price || !formData.description || !formData.image) {
            Alert.alert('Error', 'Please fill all fields');
            return;
        }

        setLoading(true);
        try {
            await productService.createProduct({
                ...formData,
                price: Number(formData.price),
            });
            Alert.alert('Success', 'Product listed successfully!', [
                { text: 'OK', onPress: () => navigation.replace('Products') }
            ]);
        } catch (error) {
            console.error(error);
            Alert.alert('Error', 'Failed to list product');
        } finally {
            setLoading(false);
        }
    };

    return (
        <KeyboardAvoidingView
            behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
            style={styles.container}
        >
            <ScrollView contentContainerStyle={styles.scroll}>
                <View style={styles.header}>
                    <Text style={styles.headerTitle}>Sell Something New</Text>
                    <Text style={styles.headerSubtitle}>Turn your items into cash</Text>
                </View>

                <View style={styles.form}>
                    <View style={styles.inputContainer}>
                        <View style={styles.labelRow}>
                            <Tag size={16} color="#64748b" />
                            <Text style={styles.label}>Product Title</Text>
                        </View>
                        <TextInput
                            style={styles.input}
                            placeholder="e.g. Vintage Camera"
                            value={formData.title}
                            onChangeText={(text) => setFormData({ ...formData, title: text })}
                        />
                    </View>

                    <View style={styles.inputContainer}>
                        <View style={styles.labelRow}>
                            <Text style={{ fontSize: 16, fontWeight: 'bold', color: '#64748b', marginRight: 4 }}>$</Text>
                            <Text style={styles.label}>Price</Text>
                        </View>
                        <TextInput
                            style={styles.input}
                            placeholder="0.00"
                            keyboardType="numeric"
                            value={formData.price}
                            onChangeText={(text) => setFormData({ ...formData, price: text })}
                        />
                    </View>

                    <View style={styles.inputContainer}>
                        <View style={styles.labelRow}>
                            <ImageIcon size={16} color="#64748b" />
                            <Text style={styles.label}>Image URL</Text>
                        </View>
                        <TextInput
                            style={styles.input}
                            placeholder="Paste link here"
                            value={formData.image}
                            onChangeText={(text) => setFormData({ ...formData, image: text })}
                        />
                    </View>

                    <View style={styles.inputContainer}>
                        <View style={styles.labelRow}>
                            <Info size={16} color="#64748b" />
                            <Text style={styles.label}>Description</Text>
                        </View>
                        <TextInput
                            style={[styles.input, styles.textArea]}
                            placeholder="Write a few lines about your item..."
                            multiline
                            numberOfLines={4}
                            value={formData.description}
                            onChangeText={(text) => setFormData({ ...formData, description: text })}
                        />
                    </View>

                    <TouchableOpacity
                        style={styles.button}
                        onPress={handleSubmit}
                        disabled={loading}
                    >
                        <LinearGradient
                            colors={['#0ea5e9', '#0284c7']}
                            style={styles.gradient}
                        >
                            {loading ? (
                                <ActivityIndicator color="#fff" />
                            ) : (
                                <>
                                    <PackagePlus size={20} color="#fff" style={{ marginRight: 8 }} />
                                    <Text style={styles.buttonText}>List Item</Text>
                                </>
                            )}
                        </LinearGradient>
                    </TouchableOpacity>
                </View>
            </ScrollView>
        </KeyboardAvoidingView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#f8fafc',
    },
    scroll: {
        padding: 20,
    },
    header: {
        marginBottom: 30,
    },
    headerTitle: {
        fontSize: 28,
        fontWeight: 'bold',
        color: '#0f172a',
    },
    headerSubtitle: {
        fontSize: 16,
        color: '#64748b',
        marginTop: 4,
    },
    form: {
        backgroundColor: '#fff',
        borderRadius: 25,
        padding: 24,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.05,
        shadowRadius: 15,
        elevation: 5,
    },
    inputContainer: {
        marginBottom: 20,
    },
    labelRow: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 8,
        marginLeft: 4,
    },
    label: {
        fontSize: 14,
        fontWeight: '700',
        color: '#64748b',
        textTransform: 'uppercase',
        letterSpacing: 0.5,
    },
    input: {
        backgroundColor: '#f1f5f9',
        borderRadius: 12,
        padding: 15,
        fontSize: 16,
        color: '#0f172a',
    },
    textArea: {
        height: 100,
        textAlignVertical: 'top',
    },
    button: {
        marginTop: 10,
        borderRadius: 15,
        overflow: 'hidden',
        shadowColor: '#0ea5e9',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 8,
    },
    gradient: {
        height: 60,
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
    },
    buttonText: {
        color: '#fff',
        fontSize: 18,
        fontWeight: 'bold',
    },
});

export default AddProductScreen;
