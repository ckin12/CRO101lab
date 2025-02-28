import React, { useState } from 'react';
import { View, TextInput, Button, Alert, Image, TouchableOpacity } from 'react-native';
import axios from 'axios';
import moment from 'moment';
import * as ImagePicker from 'expo-image-picker';

const CreateUserScreen = ({ navigation }) => {
    const [name, setName] = useState('');
    const [date, setDate] = useState('');
    const [avatar, setAvatar] = useState(null); // Lưu đường dẫn ảnh

    // Hàm chọn ảnh từ thư viện
    const pickImage = async () => {
        let result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.Images,
            allowsEditing: true,
            aspect: [1, 1],
            quality: 1,
        });

        if (!result.canceled) {
            setAvatar(result.assets[0].uri);
        }
    };
    

    // Hàm tạo tài khoản
    const handleCreateUser = async () => {
        const formattedDate = moment(date, 'YYYY-MM-DD').format('YYYY-MM-DD');

        try {
            const response = await axios.post('http://192.168.88.120:5000/users',
                { name, date: formattedDate, avatar },
                { headers: { 'Content-Type': 'application/json' } }
            );

            Alert.alert('Thành công', 'Tạo tài khoản thành công');
            navigation.navigate('UserCreated', { name, date: formattedDate, avatar });
        } catch (error) {
            console.log('Lỗi API:', error.response?.data || error.message);
            Alert.alert('Lỗi', error.response?.data?.message || 'Không thể tạo tài khoản');
        }
    };

    return (
        <View style={{ padding: 16, alignItems: 'center' }}>
            {/* Chọn ảnh */}
            <TouchableOpacity onPress={pickImage}>
                <View style={{ marginBottom: 10 }}>
                    {avatar ? (
                        <Image source={{ uri: avatar }} style={{ width: 100, height: 100, borderRadius: 50 }} />
                    ) : (
                        <View style={{
                            width: 100, height: 100, borderRadius: 50, backgroundColor: '#ddd',
                            justifyContent: 'center', alignItems: 'center'
                        }}>
                            <Button title="Chọn ảnh" onPress={pickImage} />
                        </View>
                    )}
                </View>
            </TouchableOpacity>

            <TextInput
                placeholder="Tên"
                value={name}
                onChangeText={setName}
                style={{ borderBottomWidth: 1, marginBottom: 10, width: '100%' }}
            />
            <TextInput
                placeholder="Ngày tạo (YYYY-MM-DD)"
                value={date}
                onChangeText={setDate}
                style={{ borderBottomWidth: 1, marginBottom: 10, width: '100%' }}
            />
            <Button title="Tạo tài khoản" onPress={handleCreateUser} />
        </View>
    );
};

export default CreateUserScreen;
