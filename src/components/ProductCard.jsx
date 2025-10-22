import { Link } from "react-router-dom";

const ProductCard = ({ product }) => {
    return (
        <div className="rounded-lg overflow-hidden hover:shadow-xl transition max-w-xs mx-auto relative shadow-lg w-60 h-64">
            <img
                src={product.images[0]}
                alt={product.name}
                className="w-full h-full object-cover absolute inset-0"
            />
            <div className="absolute inset-0 bg-gradient-to-b from-black/20 to-black/60" />

            <div className="relative h-full flex flex-col justify-between p-4">
                <p className="self-end bg-red-500 text-white px-3 py-1 rounded-md text-sm font-medium">
                    {product.category}
                </p>

                <div>
                    <h2 className="text-lg font-semibold text-white mb-3">
                        Fresh {product.name}
                    </h2>
                    <Link
                        to={`/products/${product.id}`}
                        className="block text-center bg-green-600 text-white py-2 px-4 rounded hover:bg-green-700 transition"
                    >
                        View Details
                    </Link>
                </div>
            </div>
        </div>
    );
};

export default ProductCard;