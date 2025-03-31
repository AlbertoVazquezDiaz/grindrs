import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

const ProductView = () => {
    const [product, setProduct] = useState(null);
    const [relatedProducts, setRelatedProducts] = useState([]);
    const { productId } = useParams(); // Obtener el ID del producto desde los parámetros de la URL

    useEffect(() => {
        // Fetch product data
        fetch(`/api/products/${productId}`) // Usar el ID del producto en la solicitud
            .then((response) => response.json())
            .then((data) => {
                setProduct(data);
            })
            .catch((error) => {
                console.error("Error fetching product data:", error);
            });

        // Fetch related products
        fetch(`/api/products/related/${productId}`) // Usar el ID del producto en la solicitud
            .then((response) => response.json())
            .then((data) => {
                setRelatedProducts(data);
            })
            .catch((error) => {
                console.error("Error fetching related products:", error);
            });
    }, [productId]);

    if (!product) {
        return <div>Loading...</div>;
    }

    return (
        <div>
            <h1>{product.name}</h1>
            <img src={product.image} alt={product.name} />
            <p>{product.description}</p>
            <p>Price: ${product.price}</p>
            <p>Available payment methods: {product.paymentMethods.join(", ")}</p>
            <p>Estimated delivery date: {product.deliveryDate}</p>

            <h2>You might also be interested in:</h2>
            <div>
                {relatedProducts.map((relatedProduct) => (
                    <div key={relatedProduct.id}>
                        <h3>{relatedProduct.name}</h3>
                        <img src={relatedProduct.image} alt={relatedProduct.name} />
                        <p>Price: ${relatedProduct.price}</p>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default ProductView;
