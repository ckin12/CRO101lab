import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, Alert, ImageBackground } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import DateTimePicker from '@react-native-community/datetimepicker';
import styles from './styles';

const RegisterScreen = ({ navigation }) => {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [gender, setGender] = useState('');
    const [birthDate, setBirthDate] = useState(new Date());
    const [showDatePicker, setShowDatePicker] = useState(false);

    const validateEmail = (email) => {
        const emailRegex = /^[a-zA-Z0-9._%+-]+@gmail\.com$/;
        return emailRegex.test(email);
    };

    const validatePassword = (password) => {
        return password.length >= 8;
    };

    const calculateAge = (dob) => {
        const today = new Date();
        const birthDate = new Date(dob);
        let age = today.getFullYear() - birthDate.getFullYear();
        const monthDiff = today.getMonth() - birthDate.getMonth();
        if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
            age--;
        }
        return age;
    };

    const handleRegister = async () => {
        if (!name || !email || !password || !confirmPassword || !gender) {
            Alert.alert('Error', 'All fields are required.');
            return;
        }

        if (!validateEmail(email)) {
            Alert.alert('Error', 'Only Gmail accounts are allowed.');
            return;
        }

        if (!validatePassword(password)) {
            Alert.alert('Error', 'Password must be at least 8 characters.');
            return;
        }

        if (password !== confirmPassword) {
            Alert.alert('Error', 'Passwords do not match.');
            return;
        }

        if (calculateAge(birthDate) < 18) {
            Alert.alert('Error', 'You must be at least 18 years old to register.');
            return;
        }

        try {
            const existingUsers = JSON.parse(await AsyncStorage.getItem('users')) || [];
            if (existingUsers.some(user => user.email === email)) {
                Alert.alert('Error', 'Email is already registered.');
                return;
            }

            const newUser = { name, email, password, gender, birthDate };
            const updatedUsers = [...existingUsers, newUser];

            await AsyncStorage.setItem('users', JSON.stringify(updatedUsers));
            Alert.alert('Success', 'Registration successful!');
            navigation.navigate('Login');
        } catch (error) {
            console.log(error);
            Alert.alert('Error', 'Something went wrong.');
        }
    };

    return (
        <ImageBackground source={require('../../assets/background1.jpg')} style={styles.background}>
            <View style={styles.container}>
                <Text style={styles.title}>Chào mừng đến ILivaShop</Text>
                <Text style={styles.subtitle}>Đăng ký để tiếp tục</Text>

                <TextInput
                    placeholder="Họ và tên"
                    placeholderTextColor="#bbb"
                    style={styles.input}
                    value={name}
                    onChangeText={setName}
                />
                <TextInput
                    placeholder="Email"
                    placeholderTextColor="#bbb"
                    style={styles.input}
                    value={email}
                    onChangeText={setEmail}
                    keyboardType="email-address"
                />
                <TextInput
                    placeholder="Mật khẩu"
                    placeholderTextColor="#bbb"
                    style={styles.input}
                    value={password}
                    onChangeText={setPassword}
                    secureTextEntry
                />
                <TextInput
                    placeholder="Nhập lại mật khẩu"
                    placeholderTextColor="#bbb"
                    style={styles.input}
                    value={confirmPassword}
                    onChangeText={setConfirmPassword}
                    secureTextEntry
                />

                <Text style={styles.label}>Ngày sinh</Text>
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

                <Text style={styles.label}>Giới tính</Text>
                <View style={styles.genderContainer}>
                    <TouchableOpacity onPress={() => setGender('Nam')} style={styles.genderButton}>
                        <Text style={[styles.genderText, gender === 'Nam' && styles.selectedGender]}>♂ Nam</Text>
                    </TouchableOpacity>
                    <TouchableOpacity onPress={() => setGender('Nữ')} style={styles.genderButton}>
                        <Text style={[styles.genderText, gender === 'Nữ' && styles.selectedGender]}>♀ Nữ</Text>
                    </TouchableOpacity>
                    <TouchableOpacity onPress={() => setGender('Khác')} style={styles.genderButton}>
                        <Text style={[styles.genderText, gender === 'Khác' && styles.selectedGender]}>Khác</Text>
                    </TouchableOpacity>
                </View>

                <TouchableOpacity onPress={handleRegister} style={styles.button}>
                    <Text style={styles.buttonText}>Đăng ký</Text>
                </TouchableOpacity>

                <TouchableOpacity onPress={() => navigation.navigate('Login')}>
                    <Text style={styles.linkText}>
                        You have an account? <Text style={styles.linkHighlight}>Đăng nhập</Text>
                    </Text>
                </TouchableOpacity>
            </View>
        </ImageBackground>
    );
};

export default RegisterScreen;
