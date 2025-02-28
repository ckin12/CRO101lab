import { StyleSheet } from 'react-native';

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 16,
        backgroundColor: '#fff',
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 10,
        color: '#333',
    },
    info: {
        fontSize: 18,
        marginBottom: 10,
        color: '#555',
    },
    avatar: {
        width: 100,
        height: 100,
        borderRadius: 50,
        marginVertical: 10,
    }
});

export default styles;
