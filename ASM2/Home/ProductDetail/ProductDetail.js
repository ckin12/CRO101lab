import React, { useEffect, useState } from 'react';
import { View, Text, Image, TouchableOpacity, StyleSheet, ScrollView, Modal } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { DeviceEventEmitter } from 'react-native';

const ProductDetail = ({ route }) => {
    const { product } = route.params;
    const navigation = useNavigation();
    const [modalVisible, setModalVisible] = useState(false);
    const [quantity, setQuantity] = useState(1);
    const [isFavorite, setIsFavorite] = useState(false);
    const totalPrice = product.price * quantity;
    const [actionType, setActionType] = useState(null);

    useEffect(() => {
        navigation.getParent()?.setOptions({ tabBarStyle: { display: 'none' } });
        return () => navigation.getParent()?.setOptions({ tabBarStyle: { backgroundColor: '#fff', height: 60 } });
    }, [navigation]);

    useEffect(() => {
        checkFavoriteStatus();
    }, []);

    const checkFavoriteStatus = async () => {
        try {
            const favorites = JSON.parse(await AsyncStorage.getItem('favorites')) || [];
            setIsFavorite(favorites.some(item => item.id === product.id));
        } catch (error) {
            console.error('Error loading favorites', error);
        }
    };

    const toggleFavorite = async () => {
        try {
            let favorites = JSON.parse(await AsyncStorage.getItem('favorites')) || [];
            let updatedFavorites;

            if (isFavorite) {
                updatedFavorites = favorites.filter(item => item.id !== product.id);
            } else {
                updatedFavorites = [...favorites, product];
            }

            await AsyncStorage.setItem('favorites', JSON.stringify(updatedFavorites));
            setIsFavorite(!isFavorite);
            DeviceEventEmitter.emit('updateFavorites'); // Cập nhật tab bar ngay
        } catch (error) {
            console.error('Error updating favorites', error);
        }
    };

    const handleAddToCart = async () => {
        if (actionType === 'buy') {
            setModalVisible(false);
            navigation.navigate("Checkout", { product, quantity });
        } else {
            addToCart(); // Nếu là thêm giỏ hàng thì thực hiện như cũ
        }
    };

    // Hàm thêm sản phẩm vào giỏ hàng
    const addToCart = async () => {
        try {
            // Tạo đối tượng sản phẩm từ dữ liệu hiện có
            const cartItem = {
                id: product.id,
                name: product.name,
                price: product.price,
                quantity: quantity,
                image: product.image
            };

            // Lấy dữ liệu giỏ hàng hiện tại từ AsyncStorage
            let cartData = await AsyncStorage.getItem('cart');
            cartData = cartData ? JSON.parse(cartData) : [];

            // Kiểm tra xem sản phẩm đã tồn tại chưa
            const existingProductIndex = cartData.findIndex(item => item.id === cartItem.id);
            if (existingProductIndex !== -1) {
                // Nếu có, tăng số lượng
                cartData[existingProductIndex].quantity += quantity;
            } else {
                // Nếu chưa có, thêm mới
                cartData.push(cartItem);
            }

            // Lưu lại giỏ hàng vào AsyncStorage
            await AsyncStorage.setItem('cart', JSON.stringify(cartData));

            // Đóng modal và chuyển đến giỏ hàng
            setModalVisible(false);
            navigation.navigate("Home", { screen: "Cart" });
            alert('Sản phẩm đã được thêm vào giỏ hàng!');
            DeviceEventEmitter.emit('updateCart'); // Cập nhật tab bar ngay
        } catch (error) {
            console.error("Lỗi khi thêm vào giỏ hàng:", error);
        }
    };

    return (
        <View style={styles.container}>
            <ScrollView contentContainerStyle={styles.scrollContainer}>
                <Image source={{ uri: product.image }} style={styles.productImage} />
                <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
                    <Ionicons name="chevron-back" size={24} color="white" />
                </TouchableOpacity>
                <TouchableOpacity style={styles.favoriteButton} onPress={toggleFavorite}>
                    <Ionicons name={isFavorite ? "heart" : "heart-outline"} size={24} color={isFavorite ? "red" : "white"} />
                </TouchableOpacity>
                <View style={styles.infoContainer}>
                    <Text style={styles.productName}>{product.name}</Text>
                    <Text style={styles.productOrigin}>From {product.origin || 'Unknown'}</Text>
                    <View style={styles.ratingContainer}>
                        <Ionicons name="star" size={16} color="gold" />
                        <Text style={styles.ratingText}>{product.rating || '4.5'} (6,879)</Text>
                    </View>
                    <View style={styles.tagsContainer}>
                        <View style={styles.tag}><Text style={styles.tagText}>Bean</Text></View>
                        <View style={styles.tag}><Text style={styles.tagText}>Africa</Text></View>
                        <View style={styles.tag}><Text style={styles.tagText}>Medium Roasted</Text></View>
                    </View>
                    <Text style={styles.sectionTitle}>Description</Text>
                    <Text style={styles.productDescription}>{product.description || "No description available."}</Text>
                    <Text style={styles.sectionTitle}>Size</Text>
                    <View style={styles.sizeContainer}>
                        <TouchableOpacity style={styles.sizeButton}><Text>250gm</Text></TouchableOpacity>
                        <TouchableOpacity style={styles.sizeButton}><Text>500gm</Text></TouchableOpacity>
                        <TouchableOpacity style={styles.sizeButton}><Text>1000gm</Text></TouchableOpacity>
                    </View>
                    <Text style={styles.price}>{totalPrice.toLocaleString('vi-VN')} VND</Text>
                </View>
            </ScrollView>

            <View style={styles.bottomBar}>
                <TouchableOpacity style={styles.chatButton}>
                    <Ionicons name="chatbubble-outline" size={20} color="white" />
                    <Text style={styles.bottomBarText}>Chat ngay</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.cartButton} onPress={() => setModalVisible(true)}>
                    <Ionicons name="cart-outline" size={20} color="white" />
                    <Text style={styles.bottomBarText}>Thêm vào giỏ </Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.buyButton} onPress={() => {
                    setActionType('buy');
                    setModalVisible(true);
                }}>
                    <Ionicons name="cart-outline" size={20} color="white" />
                    <Text style={styles.bottomBarText}>Mua ngay</Text>
                </TouchableOpacity>

            </View>

            <Modal transparent={true} visible={modalVisible} animationType="slide">
                <View style={styles.modalContainer}>
                    <View style={styles.modalContent}>
                        <Text style={styles.modalTitle}>Chọn số lượng</Text>
                        <View style={styles.quantityContainer}>
                            <TouchableOpacity onPress={() => setQuantity(Math.max(1, quantity - 1))}>
                                <Ionicons name="remove-circle-outline" size={30} color="red" />
                            </TouchableOpacity>
                            <Text style={styles.quantityText}>{quantity}</Text>
                            <TouchableOpacity onPress={() => setQuantity(quantity + 1)}>
                                <Ionicons name="add-circle-outline" size={30} color="green" />
                            </TouchableOpacity>
                        </View>
                        <Text style={styles.totalPrice}>Tổng: {totalPrice.toLocaleString('vi-VN')} VND</Text>
                        <View style={styles.modalButtons}>
                            <TouchableOpacity style={styles.cancelButton} onPress={() => setModalVisible(false)}>
                                <Text style={styles.buttonText}>Hủy</Text>
                            </TouchableOpacity>
                            <TouchableOpacity style={styles.okButton} onPress={handleAddToCart}>
                                <Text style={styles.buttonText}>OK</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </View>
            </Modal>
        </View>
    );
};
const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: '#121212' },
    scrollContainer: { paddingBottom: 80 },
    productImage: { width: '100%', height: 250, resizeMode: 'cover' },
    backButton: { position: 'absolute', top: 40, left: 20, backgroundColor: '#00000060', padding: 8, borderRadius: 20 },
    favoriteButton: { position: 'absolute', top: 40, right: 20, backgroundColor: '#00000060', padding: 8, borderRadius: 20 },
    infoContainer: { padding: 20 },
    productName: { fontSize: 22, fontWeight: 'bold', color: 'white' },
    productOrigin: { fontSize: 16, color: '#bbb', marginVertical: 5 },
    ratingContainer: { flexDirection: 'row', alignItems: 'center' },
    ratingText: { color: 'white', marginLeft: 5 },
    tagsContainer: { flexDirection: 'row', marginTop: 10 },
    tag: { backgroundColor: '#333', padding: 6, borderRadius: 5, marginRight: 5 },
    tagText: { color: 'white' },
    sectionTitle: { fontSize: 18, fontWeight: 'bold', color: 'white', marginTop: 20 },
    productDescription: { color: '#ccc', marginTop: 10, fontSize: 14 },
    sizeContainer: { flexDirection: 'row', marginTop: 10 },
    sizeButton: { backgroundColor: '#444', padding: 10, borderRadius: 5, marginRight: 10 },
    price: { fontSize: 22, fontWeight: 'bold', color: '#f0a500', marginTop: 20 },
    bottomBar: { position: 'absolute', bottom: 0, left: 0, right: 0, flexDirection: 'row', justifyContent: 'space-between', backgroundColor: '#333', padding: 1 },
    chatButton: { flex: 1, alignItems: 'center', backgroundColor: '#008080', padding: 10, borderRadius: 5, marginRight: 5 },
    cartButton: { flex: 1, alignItems: 'center', backgroundColor: '#006400', padding: 10, borderRadius: 5, marginRight: 5 },
    buyButton: { flex: 1, alignItems: 'center', backgroundColor: '#d32f2f', padding: 10, borderRadius: 5 },
    bottomBarText: { color: 'white', fontWeight: 'bold' },
    bottomBarPrice: { color: 'white', fontSize: 16, fontWeight: 'bold' },

    // Style cho modal chọn số lượng
    modalContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(0,0,0,0.5)' // Làm mờ nền khi mở modal
    },
    modalContent: {
        width: '80%',
        backgroundColor: '#fff',
        padding: 20,
        borderRadius: 15,
        alignItems: 'center'
    },
    modalTitle: {
        fontSize: 20,
        fontWeight: 'bold',
        marginBottom: 10,
        color: '#333'
    },
    quantityContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        marginVertical: 15
    },
    quantityText: {
        fontSize: 22,
        fontWeight: 'bold',
        marginHorizontal: 15
    },
    totalPrice: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#d32f2f',
        marginTop: 10
    },
    modalButtons: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        width: '100%',
        marginTop: 20
    },
    cancelButton: {
        flex: 1,
        backgroundColor: '#bbb',
        padding: 10,
        borderRadius: 10,
        alignItems: 'center',
        marginRight: 10
    },
    okButton: {
        flex: 1,
        backgroundColor: '#008080',
        padding: 10,
        borderRadius: 10,
        alignItems: 'center'
    },
    buttonText: {
        fontSize: 16,
        fontWeight: 'bold',
        color: 'white'
    }
});

export default ProductDetail;
