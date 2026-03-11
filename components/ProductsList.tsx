"use client";

import { useEffect, useState } from "react";
import { getProducts } from "@/actions/products";
import { ProductForm } from "./ProductForm";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

interface Product {
  id: string;
  name: string;
  category: string;
  unit_price: number;
  unit: string;
}

export function ProductsList() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState<Product | null>(null);

  const load = async () => {
    setLoading(true);
    try {
      const data = await getProducts();
      setProducts(data);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, []);

  const onSuccess = () => {
    setShowForm(false);
    setEditing(null);
    load();
  };

  if (loading) return <div>Loading…</div>;

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-semibold">Products</h2>
        <Dialog open={showForm} onOpenChange={setShowForm}>
          <DialogTrigger asChild>
            <Button onClick={() => setEditing(null)}>Add product</Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>
                {editing ? "Edit product" : "New product"}
              </DialogTitle>
            </DialogHeader>
            <ProductForm product={editing || undefined} onSuccess={onSuccess} />
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {products.map((p) => (
          <Card key={p.id}>
            <CardHeader>
              <CardTitle>{p.name}</CardTitle>
            </CardHeader>
            <CardContent>
              <p>Category: {p.category}</p>
              <p>
                Price: ₹{p.unit_price} / {p.unit}
              </p>
              <Button
                variant="outline"
                size="sm"
                onClick={() => {
                  setEditing(p);
                  setShowForm(true);
                }}
              >
                Edit price
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}