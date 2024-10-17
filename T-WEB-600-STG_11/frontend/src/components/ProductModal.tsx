import { FC, useState } from "react";

interface Product {
    id: number;
    name: string;
    price: number;
    description: string;
}

interface ProductModalProps {
    product: Product | null;
    onPress: () => void;
}

const ProductModal: FC<ProductModalProps> = ({ product, onPress }) => {
    const [productState, setProductState] = useState<Product | null>(product);

    const handleChange = (e: any) => {
        const { name, value } = e.target;
        setProductState((prevState) => ({
            ...prevState,
            [name]: value,
        }) as Product | null);
    };

    const handleUpdateProduct = () => {
        if (productState) {
            onPress(); // Close the modal after updating
        }
    };

    return (
        <div className="fixed top-0 left-0 z-50 w-full h-full flex justify-center items-center"

        >
            <div className="absolute inset-0 bg-gray-800 opacity-50" onClick={onPress}></div>
            <div className="relative bg-white p-8 rounded-lg" style={{ width: "500px" }}>
                <h1 className="text-2xl font-patrick mb-4">Modify Product</h1>
                <div className="divide-y divide-brown-02">
                    <div className="py-8 text-base leading-6 space-y-4 text-brown-01 sm:text-lg sm:leading-7">
                        <div className="relative">
                            <input
                                autoComplete="off"
                                id="name"
                                name="name"
                                type="text"
                                value={productState?.name || ''}
                                onChange={handleChange}
                                className="peer placeholder-transparent h-10 w-full border-b-2 border-gray-300 text-brown-01 focus:outline-none focus:border-brown-01 font-patrick"
                                placeholder="Name"
                            />
                            <label
                                htmlFor="name"
                                className="ml-1 absolute left-0 -top-3.5 text-brown-01 text-sm peer-placeholder-shown:text-base peer-placeholder-shown:text-gray-440 peer-placeholder-shown:top-2 transition-all peer-focus:-top-3.5 peer-focus:text-brown-01 peer-focus:text-sm font-patrick"
                            >
                                Name
                            </label>
                        </div>
                        <div className="relative">
                            <input
                                autoComplete="off"
                                id="price"
                                name="price"
                                type="text"
                                value={productState?.price || ''}
                                onChange={handleChange}
                                className="peer placeholder-transparent h-10 w-full border-b-2 border-gray-300 text-brown-01 focus:outline-none focus:border-brown-01 font-patrick"
                                placeholder="Price"
                            />
                            <label
                                htmlFor="price"
                                className="ml-1 absolute left-0 -top-3.5 text-brown-01 text-sm peer-placeholder-shown:text-base peer-placeholder-shown:text-gray-440 peer-placeholder-shown:top-2 transition-all peer-focus:-top-3.5 peer-focus:text-brown-01 peer-focus:text-sm font-patrick"
                            >
                                Price
                            </label>
                        </div>
                        <div className="relative">
                            <textarea
                                autoComplete="off"
                                id="description"
                                name="description"
                                value={productState?.description || ''}
                                onChange={handleChange}
                                className="peer placeholder-transparent h-32 w-full border-b-2 border-gray-300 text-brown-01 focus:outline-none focus:border-brown-01 font-patrick my-3"
                                placeholder="Description"
                                style={{ resize: 'vertical' }}
                            />
                            <label
                                htmlFor="description"
                                className="ml-1 absolute left-0 -top-3.5 text-brown-01 text-sm peer-placeholder-shown:text-base peer-placeholder-shown:text-gray-440 peer-placeholder-shown:top-2 transition-all peer-focus:-top-3.5 peer-focus:text-brown-01 peer-focus:text-sm font-patrick "
                            >
                                Description
                            </label>
                        </div>
                    </div>
                </div>
                <div className="py-1 text-base leading-6 space-y-4 text-brown-01 sm:text-lg sm:leading-7">
                    <div className="relative">
                        <button
                            className="bg-brown-02 text-brown-01 hover:bg-brown-01 hover:text-brown-02 font-patrick rounded-md px-2 py-1"
                            onClick={handleUpdateProduct}
                        >
                            {product ? "Update" : "Add"}
                        </button>
                        <button
                            className="bg-gray-200 text-brown-01 hover:bg-gray-300 hover:text-gray-700 font-patrick rounded-md px-2 py-1 ml-2"
                            onClick={onPress}
                        >
                            Cancel
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ProductModal;
