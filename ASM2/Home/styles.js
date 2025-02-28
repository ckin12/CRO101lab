import { StyleSheet, StatusBar, Dimensions } from 'react-native';

const screenWidth = Dimensions.get('window').width;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
        padding: 10,
        paddingTop: StatusBar.currentHeight + 10, // Tạo khoảng cách với thanh trạng thái
    },
    searchContainer: {
        marginBottom: 10,
    },
    searchInput: {
        height: 40,
        borderWidth: 1,
        borderColor: '#ddd',
        borderRadius: 5,
        paddingHorizontal: 10,
    },
    bannerContainer: {
        marginTop: -10, // Giảm khoảng cách với thanh tìm kiếm
        alignItems: 'center', // Canh giữa ảnh theo chiều ngang
        justifyContent: 'center', // Canh giữa ảnh theo chiều dọc
        width: Dimensions.get('window').width, // Đảm bảo chỉ 1 ảnh hiển thị trên màn hình
        height: 175, // Bạn có thể thay đổi theo kích thước mong muốn
    },
    bannerImage: {
        width: '100%', // Chiều rộng tối đa
        height: '100%', // Chiều cao tối đa
        resizeMode: 'contain', // Hiển thị ảnh đúng tỷ lệ
    },
    sectionTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        marginVertical: 10,
    },
    // Danh mục (Hiển thị ngang)
    categoryList: {
        paddingVertical: 25,

    },
    categoryItem: {
        alignItems: 'center',
        justifyContent: 'center',
        marginHorizontal: 10,
        width: 80, // Giới hạn chiều rộng danh mục
    },
    categoryImage: {
        width: 60,
        height: 60,
        borderRadius: 30,
    },
    categoryName: {
        fontSize: 14,
        marginTop: 5,
        textAlign: 'center',
    },
    // Sản phẩm (Hiển thị dạng lưới 2 cột)
    productRow: {
        justifyContent: 'space-between', // Căn cách đều 2 cột
        marginBottom: 10, // Tạo khoảng cách giữa các hàng
    },
    productItem: {
        flex: 1,
        margin: 5,
        padding: 10,
        backgroundColor: '#f9f9f9',
        borderRadius: 10,
        alignItems: 'center',
    },
    productImage: {
        width: 100,
        height: 100,
        borderRadius: 10,
    },
    productName: {
        fontSize: 14,
        fontWeight: 'bold',
        marginTop: 5,
        textAlign: 'center',
    },
    priceSoldContainer: {
        flexDirection: 'row', // Căn hàng ngang
        justifyContent: 'space-between', // Tách giá và "đã bán"
        width: '100%',
        paddingHorizontal: 0,
        marginTop: 4,
    },

    productPrice: {
        fontSize: 15,
        fontWeight: 'bold',
        color: 'green',
        textAlign: 'left', // Căn trái
    },

    productSold: {
        fontSize: 14,
        color: 'gray',
        textAlign: 'right', // Căn phải
    },
    productGrid: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'space-between', // Căn đều sản phẩm
        marginBottom: 10,
    },
});

export default styles;
