import { InventorySkeleton } from "./components/InventorySkeleton";

export default function InventoryLoading() {
  return (
    <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
      <InventorySkeleton />
    </div>
  );
}
