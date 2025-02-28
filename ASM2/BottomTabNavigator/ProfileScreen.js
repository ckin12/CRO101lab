import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, FlatList, Image, Alert } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';

const settingsOptions = [
    { icon: 'person-outline', label: 'Profile' },
    { icon: 'time-outline', label: 'History' },
    { icon: 'person-outline', label: 'Personal Details' },
    { icon: 'location-outline', label: 'Address' },
    { icon: 'card-outline', label: 'Payment Method' },
    { icon: 'information-circle-outline', label: 'About' },
    { icon: 'help-circle-outline', label: 'Help' },
    { icon: 'log-out-outline', label: 'Log out', action: 'logout' },
];

export default function SettingsScreen() {
    const [username, setUsername] = useState('');
    const [avatar, setAvatar] = useState(null);
    const navigation = useNavigation();

    useEffect(() => {
        const loadUserData = async () => {
            try {
                const storedUsername = await AsyncStorage.getItem('username');
                const storedAvatar = await AsyncStorage.getItem('avatar');

                setUsername(storedUsername || 'username');
                setAvatar(storedAvatar || null);
            } catch (error) {
                console.log('Error loading user data:', error);
            }
        };

        const unsubscribe = navigation.addListener('focus', loadUserData);
        return unsubscribe;
    }, [navigation]);


    const handleOptionPress = (item) => {
        if (item.action === 'logout') {
            Alert.alert(
                "Log Out",
                "Are you sure you want to log out?",
                [
                    { text: "Cancel", style: "cancel" },
                    { text: "OK", onPress: () => navigation.replace('Login') } // Đổi từ 'LoginScreen' thành 'Login'
                ]
            );
        }
    };

    return (
        <View style={styles.container}>
            <Text style={styles.header}>Cài đặt</Text>
            <TouchableOpacity style={styles.userInfo} onPress={() => navigation.navigate('EditProfile')}>
                <Image source={avatar ? { uri: avatar } : require('../assets/icon.png')} style={styles.avatar} />
                <Text style={styles.username}>{username}</Text>
            </TouchableOpacity>
            <FlatList
                data={settingsOptions}
                keyExtractor={(item) => item.label}
                renderItem={({ item }) => (
                    <TouchableOpacity style={styles.optionContainer} onPress={() => handleOptionPress(item)}>
                        <Ionicons name={item.icon} size={24} color="#E07A5F" style={styles.icon} />
                        <Text style={styles.optionText}>{item.label}</Text>
                        <Ionicons name="chevron-forward-outline" size={20} color="#ccc" />
                    </TouchableOpacity>
                )}
            />
        </View>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: '#161616', paddingHorizontal: 20 },
    header: { fontSize: 22, fontWeight: 'bold', color: '#fff', alignSelf: 'center', marginVertical: 50 },
    profileContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: 15,
        borderBottomWidth: 1,
        borderBottomColor: '#2E2E2E',
    },
    avatar: { width: 40, height: 40, borderRadius: 20, marginRight: 10, backgroundColor: '#555' },
    username: { flex: 1, fontSize: 16, color: '#fff' },
    optionContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: 15,
        borderBottomWidth: 1,
        borderBottomColor: '#2E2E2E',
    },
    icon: { marginRight: 15 },
    optionText: { flex: 1, fontSize: 16, color: '#fff' },
});
