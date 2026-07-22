import LowProductCard from "./LowProductCard";
import LowProductsEmpty from "./LowProductsEmpty";

export default function LowProductsList({ products }) {
    if (!Array.isArray(products) || products.length === 0) {
        return <LowProductsEmpty />;
    }

    return (
        <section className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {products.map((item) => (
                <LowProductCard key={item.id} item={item} />
            ))}
        </section>
    );
}