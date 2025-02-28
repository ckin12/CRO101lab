import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, Alert, Image, ImageBackground } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import AsyncStorage from '@react-native-async-storage/async-storage';
import DateTimePicker from '@react-native-community/datetimepicker';
import styles from './styles';

const EditProfileScreen = ({ navigation }) => {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [gender, setGender] = useState('');
    const [birthDate, setBirthDate] = useState(new Date());
    const [avatar, setAvatar] = useState(null);
    const [showDatePicker, setShowDatePicker] = useState(false);

    // Load dữ liệu từ AsyncStorage
    useEffect(() => {
        const loadUserData = async () => {
            try {
                const storedUsername = await AsyncStorage.getItem('username');
                const storedEmail = await AsyncStorage.getItem('email');
                const storedGender = await AsyncStorage.getItem('gender');
                const storedBirthDate = await AsyncStorage.getItem('birthDate');
                const storedAvatar = await AsyncStorage.getItem('avatar');

                console.log('Loaded data:', { storedUsername, storedEmail, storedGender, storedBirthDate, storedAvatar });

                setName(storedUsername || '');
                setEmail(storedEmail || '');
                setGender(storedGender || '');
                setBirthDate(storedBirthDate ? new Date(storedBirthDate) : new Date());
                setAvatar(storedAvatar || null);
            } catch (error) {
                console.log('Error loading user data:', error);
            }
        };
        loadUserData();
    }, []);

    // Chọn ảnh từ thư viện
    const pickImage = async () => {
        // Yêu cầu quyền truy cập thư viện ảnh
        const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
        if (status !== 'granted') {
            Alert.alert('Permission Denied', 'You need to grant permission to access the photo library.');
            return;
        }

        let result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.Images,
            allowsEditing: true,
            aspect: [1, 1],
            quality: 1,
        });

        console.log('Image pick result:', result);

        if (!result.canceled && result.assets && result.assets.length > 0) {
            setAvatar(result.assets[0].uri);
        }
    };

    // Lưu thông tin người dùng
    const handleSave = async () => {
        if (!name || !email) {
            Alert.alert('Error', 'Name and Email cannot be empty.');
            return;
        }

        try {
            await AsyncStorage.setItem('username', name);
            await AsyncStorage.setItem('email', email);
            await AsyncStorage.setItem('gender', gender);
            await AsyncStorage.setItem('birthDate', birthDate.toISOString());
            if (avatar) {
                await AsyncStorage.setItem('avatar', avatar);
            }

            Alert.alert('Success', 'Profile updated successfully.');
            navigation.goBack();
        } catch (error) {
            console.log(error);
            Alert.alert('Error', 'Something went wrong.');
        }
    };

    return (
        <ImageBackground source={require('../assets/background1.jpg')} style={styles.background}>
            <View style={styles.container}>
                <Text style={styles.title}>Edit Profile</Text>

                {/* Avatar */}
                <TouchableOpacity onPress={pickImage} style={styles.avatarContainer}>
                    <Image source={avatar ? { uri: avatar } : require('../assets/icon.png')} style={styles.avatar} />
                    <Text style={styles.changeAvatarText}>Change Avatar</Text>
                </TouchableOpacity>

                {/* Name */}
                <TextInput placeholder="Name" style={styles.input} value={name} onChangeText={setName} />

                {/* Email */}
                <TextInput placeholder="Email" style={styles.input} value={email} onChangeText={setEmail} keyboardType="email-address" />

                {/* Date of Birth */}
                <Text style={styles.label}>Date of Birth</Text>
                <TouchableOpacity onPress={() => setShowDatePicker(true)} style={styles.datePickerButton}>
                    <Text style={styles.datePickerText}>{birthDate.toDateString()}</Text>
                </TouchableOpacity>
                {showDatePicker && (
                    <DateTimePicker
                        value={birthDate}
                        mode="date"
                        maximumDate={new Date()}
                        display="default"
                        onChange={(event, selectedDate) => {
                            setShowDatePicker(false);
                            if (selectedDate) setBirthDate(selectedDate);
                        }}
                    />
                )}

                {/* Gender Selection */}
                <Text style={styles.label}>Gender</Text>
                <View style={styles.genderContainer}>
                    <TouchableOpacity onPress={() => setGender('Male')} style={styles.genderButton}>
                        <Text style={[styles.genderText, gender === 'Male' && styles.selectedGender]}>♂ Male</Text>
                    </TouchableOpacity>
                    <TouchableOpacity onPress={() => setGender('Female')} style={styles.genderButton}>
                        <Text style={[styles.genderText, gender === 'Female' && styles.selectedGender]}>♀ Female</Text>
                    </TouchableOpacity>
                    <TouchableOpacity onPress={() => setGender('Prefer not to say')} style={styles.genderButton}>
                        <Text style={[styles.genderText, gender === 'Prefer not to say' && styles.selectedGender]}>
                            Prefer not to say
                        </Text>
                    </TouchableOpacity>
                </View>

                {/* Save Button */}
                <TouchableOpacity onPress={handleSave} style={styles.button}>
                    <Text style={styles.buttonText}>Save Changes</Text>
                </TouchableOpacity>

                {/* Cancel Button */}
                <TouchableOpacity onPress={() => navigation.goBack()}>
                    <Text style={styles.linkText}>Cancel</Text>
                </TouchableOpacity>
            </View>
        </ImageBackground>
    );
};

export default EditProfileScreen;
