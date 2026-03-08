"use server";

import { createClient } from "@/lib/supabase/server";
import { getCurrentUser, checkRoleAdmin } from "./auth";

export async function recordPurchase(
  customerid: string,
  productid: string,
  quantity: number,
  unitprice: number,
  purchasedate: string,
) {
  const admin = await checkRoleAdmin();
  if (!admin) throw new Error("Not authorized to perfrom this tasks!!");

  const supabase = await createClient();
  const { data, error } = await supabase
    .from("purchases")
    .insert({
      customer_id: customerid,
      product_id: productid,
      quantity,
      unit_price: unitprice,
      purchase_date: purchasedate,
    })
    .select()
    .single();

  if (error) throw error;
  return data;
}

export async function getCustomerBills(month?: string) {
  const user = await getCurrentUser();
  if (!user) throw new Error("Not authenticated");

  const supabase = await createClient();
  let query = supabase.from("purchases").select(`
       id,
      quantity,
      unit_price,
      total_amount,
      purchase_date,
      products:product_id (id, name, category, unit)`);

  if (user.role == "customer") {
    query = query.eq("customer_id", user.id);
  }

  if (month) {
    const [year, monthNum] = month.split("-");
    query = query
      .gte("purchase_date", `${year}-${monthNum}-01`)
      .lt(
        "purchase_date",
        `${year}-${monthNum === "12" ? "01" : String(parseInt(monthNum) + 1)}`,
      );
  }

  const { data, error } = await query.order("purchase_date", {
    ascending: false,
  });

  if (error) throw error;

  return data;
}
