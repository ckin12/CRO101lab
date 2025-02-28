import React, { useState } from 'react';
import { View, Text, TextInput, Button, Alert, Image, TouchableOpacity } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import axios from 'axios';
import styles from './styles';

const EditUserScreen = ({ route, navigation }) => {
    const { user } = route.params;
    const [name, setName] = useState(user.name);
    const [date, setDate] = useState(user.date);
    const [avatar, setAvatar] = useState(user.avatar || 'https://i.pravatar.cc/150');

    // Hàm chọn ảnh từ thư viện
    const pickImage = async () => {
        const permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync();
        if (!permissionResult.granted) {
            Alert.alert("Quyền bị từ chối", "Bạn cần cấp quyền để chọn ảnh.");
            return;
        }

        const result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.Images,
            allowsEditing: true,
            aspect: [1, 1],
            quality: 1,
        });

        if (!result.canceled) {
            setAvatar(result.assets[0].uri);
        }
    };

    // Hàm gọi API để cập nhật thông tin người dùng
    const updateUser = async () => {
        try {
            await axios.put(`http://192.168.88.120:5000/users/${user.id}`, {
                name,
                date,
                avatar,
            });
            Alert.alert('Thành công', 'Cập nhật thông tin người dùng thành công!');
            navigation.goBack(); // Quay lại màn hình trước
        } catch (error) {
            console.error('Lỗi khi cập nhật thông tin người dùng:', error);
            Alert.alert('Lỗi', 'Không thể cập nhật thông tin người dùng.');
        }
    };

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Chỉnh sửa tài khoản {user.name}</Text>
            <TouchableOpacity onPress={pickImage}>
                <Image source={{ uri: avatar }} style={styles.avatar} />
            </TouchableOpacity>
            <TextInput
                style={styles.input}
                value={name}
                onChangeText={setName}
                placeholder="Tên người dùng"
            />
            <TextInput
                style={styles.input}
                value={date}
                onChangeText={setDate}
                placeholder="Ngày sinh (YYYY-MM-DD)"
                keyboardType="default"
            />
            <Button title="Cập nhật thông tin" color="orange" onPress={updateUser} />
        </View>
    );
};

export default EditUserScreen;
