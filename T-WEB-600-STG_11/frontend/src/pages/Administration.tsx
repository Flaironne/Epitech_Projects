import { FC, useState } from "react";
import { Product, fetchAllProducts } from "../api/product/productAPI";
import { useQuery } from "react-query";
import ProductModal from "../components/ProductModal";
import UserModal from "../components/UserModal";
import { deleteProduct, deleteUser, fetchAllUsers } from "../api/admin/adminAPI";
import { User } from "../api/auth/authApi";
import { useUser } from "../contexts/UserContext";

const Administration: FC = () => {
    const [isProductManagement, setIsProductManagement] = useState(true);
    const { token } = useUser();

    const { data: products, isLoading, error } = useQuery<Product[]>("products", fetchAllProducts);

    const {
        data: users,
    } = useQuery<User[]>(["users", token], () => fetchAllUsers(token as string));

    const [showEditProductModal, setShowEditProductModal] = useState(false);
    const [showEditUserModal, setShowEditUserModal] = useState(false);

    const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
    const [selectedUser, setSelectedUser] = useState<any | null>(null);



    const onCloseModal = () => {
        setShowEditProductModal(false);
        setShowEditUserModal(false);
    }

    const handleEditProduct = (product: Product) => {
        setShowEditProductModal(true);
        setSelectedProduct(product);
    }

    const handleDeleteProduct = async (id: number) => {
        await deleteProduct(String(id), token as string);
        location.reload();
    }

    const handleEditUser = (user: any) => {
        setShowEditUserModal(true);
        setSelectedUser(user);
    }

    const handleDeleteUser = async (id: number) => {
        await deleteUser(String(id), token as string);
        location.reload();
    }

    if (isLoading) {
        return <div>Loading...</div>;
    }

    return (
        <div>
            <div className="container mx-auto bg-brown-02 min-h-screen p-5 w-full">
                <div className="mb-5 flex gap-5">
                    <button onClick={() => setIsProductManagement(true)} className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">
                        {"Switch to Product Management"}
                    </button>
                    <button onClick={() => setIsProductManagement(false)} className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">
                        {"Switch to User Management"}
                    </button>
                </div>
                <h1 className="text-2xl text-black mb-5">{isProductManagement ? "Product Management" : "Users Management"}</h1>

                {isProductManagement ? (<div className="overflow-x-auto">
                    <button className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded mb-5"
                        onClick={() => setShowEditProductModal(true)}
                    >Add Product</button>
                    <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-50">
                            <tr>
                                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">ID</th>
                                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
                                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Price</th>
                                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                            {products && products.map((product) => (
                                <tr key={product.id} className="hover:bg-gray-100 cursor-pointer">
                                    <td className="px-6 py-4 whitespace-nowrap">{product.id}</td>
                                    <td className="px-6 py-4 whitespace-nowrap">{product.name}</td>
                                    <td className="px-6 py-4 whitespace-nowrap">{product.price}</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                                        <button className="text-indigo-600 hover:text-indigo-900" onClick={() => handleEditProduct(product)}>Edit</button>
                                        <button className="text-red-600 hover:text-red-900 ml-2" onClick={() => handleDeleteProduct(product.id)}>Delete</button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>) : (
                    <div>
                        <button className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded mb-5"
                            onClick={() => setShowEditUserModal(true)}
                        >
                            Add User</button>

                        <table className="min-w-full divide-y divide-gray-200">
                            <thead className="bg-gray-50">
                                <tr>
                                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">ID</th>
                                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">FirstName</th>
                                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">LastName</th>
                                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Email</th>
                                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="bg-white divide-y divide-gray-200">
                                {users && users.map((user) => (
                                    <tr key={user.id} className="hover:bg-gray-100 cursor-pointer" >
                                        <td className="px-6 py-4 whitespace-nowrap">{user.id}</td>
                                        <td className="px-6 py-4 whitespace-nowrap">{user.firstname}</td>
                                        <td className="px-6 py-4 whitespace-nowrap">{user.lastname}</td>
                                        <td className="px-6 py-4 whitespace-nowrap">{user.email}</td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                                            <button className="text-indigo-600 hover:text-indigo-900" onClick={() => handleEditUser(user)}>Edit</button>
                                            <button className="text-red-600 hover:text-red-900 ml-2" onClick={() => handleDeleteUser(user.id)}>Delete</button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )
                }

                {showEditProductModal && (
                    <ProductModal onPress={onCloseModal} product={selectedProduct} />
                )}

                {showEditUserModal && (
                    <UserModal onPress={onCloseModal} user={selectedUser} />
                )}


            </div>
        </div>
    );
};

export default Administration;
