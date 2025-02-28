import React from 'react';
import { View, Text, Image, TouchableOpacity, StyleSheet } from 'react-native';
import { useNavigation } from '@react-navigation/native';

const CheckoutScreen = ({ route }) => {
    const navigation = useNavigation();
    const { product, quantity } = route.params;
    const totalPrice = product.price * quantity;

    return (
        <View style={styles.container}>
            <Text style={styles.header}>Xác nhận đơn hàng</Text>
            <View style={styles.productContainer}>
                <Image source={{ uri: product.image }} style={styles.image} />
                <View style={styles.details}>
                    <Text style={styles.name}>{product.name}</Text>
                    <Text style={styles.quantity}>Số lượng: {quantity}</Text>
                    <Text style={styles.price}>{totalPrice.toLocaleString('vi-VN')} VND</Text>
                </View>
            </View>

            <TouchableOpacity style={styles.orderButton} onPress={() => alert('Đặt hàng thành công!')}>
                <Text style={styles.buttonText}>Xác nhận đặt hàng</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
                <Text style={styles.buttonText}>Quay lại</Text>
            </TouchableOpacity>
        </View>
    );
};

const styles = StyleSheet.create({
    container: { flex: 1, padding: 20, backgroundColor: 'white', justifyContent: 'center', alignItems: 'center' },
    header: { fontSize: 22, fontWeight: 'bold', marginBottom: 20 },
    productContainer: { flexDirection: 'row', alignItems: 'center', marginBottom: 20 },
    image: { width: 80, height: 80, borderRadius: 10 },
    details: { marginLeft: 15 },
    name: { fontSize: 18, fontWeight: 'bold' },
    quantity: { fontSize: 16, color: 'gray' },
    price: { fontSize: 18, fontWeight: 'bold', color: 'green' },
    orderButton: { backgroundColor: 'green', padding: 15, borderRadius: 10, width: '100%', alignItems: 'center', marginBottom: 10 },
    backButton: { backgroundColor: 'gray', padding: 15, borderRadius: 10, width: '100%', alignItems: 'center' },
    buttonText: { color: 'white', fontSize: 16, fontWeight: 'bold' }
});

export default CheckoutScreen;
