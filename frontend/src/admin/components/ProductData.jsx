/* import React, { useEffect, useState } from 'react';
import axios from 'axios';

const ProductData = () => {
    const [products, setProducts] = useState([]);

    useEffect(() => {
        axios.get('/api/products/top-selling')
            .then(response => {
                setProducts(response.data);
            })
            .catch(error => {
                console.error('There was an error fetching the products!', error);
            });
    }, []);

    return (
        <div className="p-4">
            <h2 className="text-2xl font-bold mb-4">Top Selling Products</h2>
            <table className="min-w-full bg-white border border-gray-200">
                <thead>
                    <tr>
                        <th className="py-2 px-4 border-b">Product Name</th>
                        <th className="py-2 px-4 border-b">Units Sold</th>
                        <th className="py-2 px-4 border-b">Revenue</th>
                    </tr>
                </thead>
                <tbody>
                    {products.map(product => (
                        <tr key={product.id} className="hover:bg-gray-100">
                            <td className="py-2 px-4 border-b">{product.name}</td>
                            <td className="py-2 px-4 border-b">{product.unitsSold}</td>
                            <td className="py-2 px-4 border-b">{product.revenue}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default ProductData; */