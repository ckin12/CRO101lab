import { StyleSheet } from 'react-native';

const styles = StyleSheet.create({
    background: {
        flex: 1,
        resizeMode: 'cover',
        justifyContent: 'center',
    },
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        paddingHorizontal: 20,
        backgroundColor: 'rgba(0, 0, 0, 0.5)', // Làm mờ nền để chữ dễ đọc hơn
        
    },
    title: {
        color: '#fff',
        fontSize: 26,
        fontWeight: 'bold',
        marginBottom: 10,
    },
    subtitle: {
        color: '#aaa',
        fontSize: 14,
        marginBottom: 20,
    },
    inputContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        width: '100%',
        backgroundColor: 'rgba(30, 30, 30, 0.8)',
        borderRadius: 10,
        borderWidth: 1,
        borderColor: '#333',
        marginBottom: 15,
        paddingHorizontal: 10,
    },
    errorBorder: {
        borderColor: 'red',
    },
    input: {
        flex: 1,
        padding: 12,
        color: 'white',
    },
    eyeIcon: {
        padding: 10,
    },
    button: {
        width: '100%',
        backgroundColor: '#efcf42',
        padding: 15,
        borderRadius: 10,
        alignItems: 'center',
        marginTop: 10,
    },
    buttonText: {
        color: '#fff',
        fontSize: 16,
        fontWeight: 'bold',
    },
    googleButton: {
        width: '100%',
        backgroundColor: '#efcf42',
        padding: 15,
        borderRadius: 10,
        alignItems: 'center',
        marginTop: 10,
    },
    googleButtonText: {
        color: '#000',
        fontSize: 16,
        fontWeight: 'bold',
    },
    linkText: {
        color: '#aaa',
        marginTop: 10,
    },
    linkHighlight: {
        color: 'orange',
        fontWeight: 'bold',
    },
    errorText: {
        color: 'red',
        marginBottom: 10,
        fontSize: 14,
    },
});

export default styles;
