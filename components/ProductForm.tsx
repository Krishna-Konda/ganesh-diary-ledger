"use client";

import { useState } from "react";
import { createProduct, updateProduct } from "@/actions/products";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";

interface ProductFormProps {
  product?: {
    id: string;
    name: string;
    category: string;
    unit_price: number;
    unit: string;
  };
  onSuccess: () => void;
}

export function ProductForm({ product, onSuccess }: ProductFormProps) {
  const [name, setName] = useState(product?.name || "");
  const [category, setCategory] = useState(product?.category || "");
  const [unitPrice, setUnitPrice] = useState(
    product ? product.unit_price.toString() : "",
  );
  const [unit, setUnit] = useState(product?.unit || "liter");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      if (product) {
        await updateProduct(product.id, {
          name,
          category,
          unit_price: parseFloat(unitPrice),
          unit,
        });
      } else {
        await createProduct(name, category, parseFloat(unitPrice), unit);
      }
      onSuccess();
    } catch (err) {
      console.error(err);
      alert("Failed to save product");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="space-y-2">
        <Label>Product name</Label>
        <Input
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
        />
      </div>

      <div className="space-y-2">
        <Label>Category</Label>
        <Select value={category} onValueChange={setCategory}>
          <SelectTrigger>
            <SelectValue placeholder="Select category" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="milk">Milk</SelectItem>
            <SelectItem value="bread">Bread</SelectItem>
            <SelectItem value="butter">Butter</SelectItem>
            <SelectItem value="biscuits">Biscuits</SelectItem>
            <SelectItem value="maggi">Maggi</SelectItem>
            <SelectItem value="curry">Curry</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-2">
        <Label>Unit price (₹)</Label>
        <Input
          type="number"
          step="0.01"
          value={unitPrice}
          onChange={(e) => setUnitPrice(e.target.value)}
          required
        />
      </div>

      <div className="space-y-2">
        <Label>Unit</Label>
        <Select value={unit} onValueChange={setUnit}>
          <SelectTrigger>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="liter">Liter</SelectItem>
            <SelectItem value="kg">Kg</SelectItem>
            <SelectItem value="piece">Piece</SelectItem>
            <SelectItem value="pack">Pack</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <Button type="submit" disabled={loading}>
        {loading ? "Saving…" : product ? "Update product" : "Add product"}
      </Button>
    </form>
  );
}
