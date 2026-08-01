import InventoryCard from "./InventoryCard";

export default function InventoryList({
    items,
    getStockLevel,
}) {
    return (
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
            {items.map((item) => (
                <InventoryCard
                    key={item.id || item.reliefItemId}
                    item={item}
                    level={getStockLevel(item)}
                />
            ))}
        </div>
    );
}
