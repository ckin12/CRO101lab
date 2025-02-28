import { StyleSheet } from 'react-native';

export default StyleSheet.create({
    container: {
        flex: 1,
        padding: 16,
    },
    buttonWrapper: {
        marginBottom: 16,
    },
    card: {
        flexDirection: 'row', // Hiển thị avatar và nội dung cùng hàng
        alignItems: 'center',
        backgroundColor: '#b6ddf5',
        padding: 16,
        borderRadius: 10,
        marginBottom: 10,
        shadowColor: '#000',
        shadowOpacity: 0.1,
        shadowRadius: 5,
    },
    avatar: {
        width: 50,
        height: 50,
        borderRadius: 25, // Làm tròn hình ảnh
        marginRight: 16, // Tạo khoảng cách giữa avatar và nội dung
    },
    userInfo: {
        flex: 1, // Để phần nội dung chiếm hết phần còn lại
    },
    name: {
        fontSize: 18,
        fontWeight: 'bold',
    },
    date: {
        fontSize: 14,
        color: 'gray',
    },
    buttonContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginTop: 10,
    },
});
