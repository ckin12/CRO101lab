import React, { useState, useCallback } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, Alert } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Ionicons } from '@expo/vector-icons';
import { useFocusEffect } from '@react-navigation/native';

export default function CartScreen({ navigation }) {
    const [cartItems, setCartItems] = useState([]);
    const [selectedItems, setSelectedItems] = useState([]);
    const [totalPrice, setTotalPrice] = useState(0);

    useFocusEffect(
        useCallback(() => {
            loadCart();
        }, [])
    );

    const loadCart = async () => {
        try {
            const cartData = JSON.parse(await AsyncStorage.getItem('cart')) || [];
            setCartItems(cartData);
            updateTotalPrice(cartData);
        } catch (error) {
            console.error('Lỗi tải giỏ hàng:', error);
        }
    };

    const updateTotalPrice = (items) => {
        const total = items.reduce((sum, item) => sum + item.price * item.quantity, 0);
        setTotalPrice(total);
    };

    const toggleSelectItem = (id) => {
        setSelectedItems((prevSelected) =>
            prevSelected.includes(id) ? prevSelected.filter(item => item !== id) : [...prevSelected, id]
        );
    };

    const removeSelectedItems = async () => {
        if (selectedItems.length === 0) {
            Alert.alert("Thông báo", "Bạn chưa chọn sản phẩm nào để xóa.");
            return;
        }

        Alert.alert(
            "Xác nhận",
            "Bạn có chắc muốn xóa các sản phẩm đã chọn khỏi giỏ hàng?",
            [
                { text: "Hủy", style: "cancel" },
                {
                    text: "Xóa",
                    onPress: async () => {
                        try {
                            const newCart = cartItems.filter(item => !selectedItems.includes(item.id));
                            await AsyncStorage.setItem('cart', JSON.stringify(newCart));
                            setCartItems(newCart);
                            setSelectedItems([]);
                            updateTotalPrice(newCart);
                        } catch (error) {
                            console.error("Lỗi khi xóa sản phẩm:", error);
                        }
                    },
                    style: "destructive"
                }
            ]
        );
    };

    const handleQuantityChange = async (id, type) => {
        const updatedCart = cartItems.map(item => {
            if (item.id === id) {
                let newQuantity = type === 'increase' ? item.quantity + 1 : item.quantity - 1;
                if (newQuantity < 1) return item; // Không cho phép số lượng < 1
                return { ...item, quantity: newQuantity };
            }
            return item;
        });

        await AsyncStorage.setItem('cart', JSON.stringify(updatedCart));
        setCartItems(updatedCart);
        updateTotalPrice(updatedCart);
    };

    const handleCheckout = () => {
        if (cartItems.length === 0) {
            Alert.alert("Thông báo", "Giỏ hàng trống. Không thể thanh toán.");
            return;
        }
        navigation.navigate('CheckoutScreen', { cartItems, totalPrice });
    };

    return (
        <View style={styles.container}>
            <View style={styles.header}>
                <Text style={styles.title}>Giỏ hàng</Text>
                {selectedItems.length > 0 && (
                    <TouchableOpacity onPress={removeSelectedItems} style={styles.deleteIcon}>
                        <Ionicons name="trash-outline" size={24} color="red" />
                    </TouchableOpacity>
                )}
            </View>

            {cartItems.length === 0 ? (
                <Text style={styles.emptyText}>Giỏ hàng của bạn đang trống</Text>
            ) : (
                <>
                    <FlatList
                        data={cartItems}
                        keyExtractor={(item) => item.id.toString()}
                        renderItem={({ item }) => (
                            <View style={styles.cartItem}>
                                {/* Checkbox chọn xóa */}
                                <TouchableOpacity onPress={() => toggleSelectItem(item.id)}>
                                    <Ionicons
                                        name={selectedItems.includes(item.id) ? "checkmark-circle" : "checkmark-circle-outline"}
                                        size={24}
                                        color={selectedItems.includes(item.id) ? "green" : "gray"}
                                        style={styles.checkbox}
                                    />
                                </TouchableOpacity>

                                {/* Thông tin sản phẩm */}
                                <View style={styles.itemInfo}>
                                    <Text style={styles.itemText}>{item.name}</Text>
                                    <Text style={styles.itemPrice}>{item.price.toLocaleString('vi-VN')} VND</Text>
                                </View>

                                {/* Nút tăng giảm số lượng */}
                                <View style={styles.quantityContainer}>
                                    <TouchableOpacity
                                        onPress={() => handleQuantityChange(item.id, 'decrease')}
                                        style={[styles.quantityButton, item.quantity === 1 && { opacity: 0.5 }]}
                                        disabled={item.quantity === 1}
                                    >
                                        <Ionicons name="remove-circle-outline" size={24} color="black" />
                                    </TouchableOpacity>

                                    <Text style={styles.quantityText}>{item.quantity}</Text>

                                    <TouchableOpacity
                                        onPress={() => handleQuantityChange(item.id, 'increase')}
                                        style={styles.quantityButton}
                                    >
                                        <Ionicons name="add-circle-outline" size={24} color="black" />
                                    </TouchableOpacity>
                                </View>
                            </View>
                        )}
                    />

                    <Text style={styles.totalPrice}>Tổng tiền: {totalPrice.toLocaleString('vi-VN')} VND</Text>

                    <TouchableOpacity style={styles.checkoutButton} onPress={handleCheckout}>
                        <Text style={styles.buttonText}>Thanh toán</Text>
                    </TouchableOpacity>
                </>
            )}
        </View>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, padding: 20, backgroundColor: '#fff' },
    header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 ,marginVertical: 35},
    title: { fontSize: 22, fontWeight: 'bold' },
    deleteIcon: { padding: 5 },
    emptyText: { fontSize: 16, color: 'gray', textAlign: 'center', marginTop: 20 },
    cartItem: { flexDirection: 'row', alignItems: 'center', padding: 15, borderBottomWidth: 1, borderColor: '#ddd' },
    checkbox: { marginRight: 10 },
    itemInfo: { flex: 1 },
    itemText: { fontSize: 16 },
    itemPrice: { fontSize: 14, color: 'gray' },
    quantityContainer: { flexDirection: 'row', alignItems: 'center' },
    quantityButton: { padding: 5 },
    quantityText: { fontSize: 16, marginHorizontal: 10 },
    totalPrice: { fontSize: 18, fontWeight: 'bold', textAlign: 'right', marginTop: 10, color: '#d32f2f' },
    checkoutButton: {
        backgroundColor: '#388e3c',
        padding: 15,
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 5,
        marginTop: 20
    },
    buttonText: { color: 'white', fontSize: 16, fontWeight: 'bold' }
});
