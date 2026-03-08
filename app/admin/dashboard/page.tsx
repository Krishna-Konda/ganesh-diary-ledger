import { ProductsList } from "@/components/ProductsList";

export default function AdminDashboard() {
  return (
    <div className="container mx-auto p-6 space-y-8">
      <h1 className="text-3xl font-bold">Admin Dashboard</h1>
      <section>
        <ProductsList />
      </section>
    </div>
  );
}
