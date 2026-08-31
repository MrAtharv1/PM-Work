"use server";

import { supabase } from "./supabase";
import { revalidatePath } from "next/cache";

export async function getClients() {
  const { data, error } = await supabase
    .from("clients")
    .select("*")
    .order("name", { ascending: true });

  if (error) throw new Error(error.message);
  return data;
}

export async function searchClients(query: string) {
  if (!query) return getClients();
  const { data, error } = await supabase
    .from("clients")
    .select("*")
    .ilike("name", `%${query}%`)
    .order("name", { ascending: true });

  if (error) throw new Error(error.message);
  return data;
}

export async function createClient(name: string, phone?: string) {
  const client_code = `CLT-${Date.now().toString().slice(-6)}`;
  const { data, error } = await supabase
    .from("clients")
    .insert([{ name, phone, client_code }])
    .select()
    .single();

  if (error) throw new Error(error.message);
  revalidatePath("/");
  return data;
}

export async function addWorkTransaction(data: {
  client_id: string;
  work_description: string;
  plates: number;
  quantity: number;
  amount: number;
  work_date: string;
}) {
  const { error } = await supabase
    .from("work_transactions")
    .insert([data]);

  if (error) throw new Error(error.message);
  revalidatePath("/");
  revalidatePath("/finance");
  revalidatePath(`/finance/${data.client_id}`);
}

export async function getClientBalances() {
  const { data, error } = await supabase
    .from("client_balances")
    .select("*")
    .order("client_name", { ascending: true });

  if (error) throw new Error(error.message);
  return data;
}

export async function getClientBalance(clientId: string) {
  const { data, error } = await supabase
    .from("client_balances")
    .select("*")
    .eq("client_id", clientId)
    .single();

  if (error) throw new Error(error.message);
  return data;
}

export async function getClientTransactions(clientId: string) {
  const [workRes, paymentRes] = await Promise.all([
    supabase
      .from("work_transactions")
      .select("*")
      .eq("client_id", clientId),
    supabase
      .from("payment_transactions")
      .select("*")
      .eq("client_id", clientId)
  ]);

  if (workRes.error) throw new Error(workRes.error.message);
  if (paymentRes.error) throw new Error(paymentRes.error.message);

  type DBTransaction = {
    id: string;
    client_id: string;
    amount: number;
    created_at: string;
    work_description?: string;
    plates?: number;
    quantity?: number;
    note?: string;
    work_date?: string;
    payment_date?: string;
  };

  const work = workRes.data.map((t: DBTransaction) => ({ ...t, type: "WORK" as const, sort_date: t.work_date || t.created_at }));
  const payments = paymentRes.data.map((t: DBTransaction) => ({ ...t, type: "PAYMENT" as const, sort_date: t.payment_date || t.created_at }));

  const all = [...work, ...payments].sort((a, b) => {
    // Sort by actual date first, newest first
    const dateDiff = new Date(b.sort_date as string).getTime() - new Date(a.sort_date as string).getTime();
    if (dateDiff !== 0) return dateDiff;
    // Fallback to created_at
    return new Date(b.created_at as string).getTime() - new Date(a.created_at as string).getTime();
  });

  return all;
}

export async function addPaymentTransaction(data: {
  client_id: string;
  amount: number;
  note?: string;
  payment_date: string;
}) {
  const { error } = await supabase
    .from("payment_transactions")
    .insert([data]);

  if (error) throw new Error(error.message);
  revalidatePath("/finance");
  revalidatePath(`/finance/${data.client_id}`);
}

export async function getReportData(clientId?: string) {
  let workQuery = supabase
    .from("work_transactions")
    .select(`
      *,
      clients ( name )
    `);
    
  let paymentQuery = supabase
    .from("payment_transactions")
    .select(`
      *,
      clients ( name )
    `);

  if (clientId) {
    workQuery = workQuery.eq("client_id", clientId);
    paymentQuery = paymentQuery.eq("client_id", clientId);
  }

  const [workRes, paymentRes] = await Promise.all([workQuery, paymentQuery]);

  if (workRes.error) throw new Error(workRes.error.message);
  if (paymentRes.error) throw new Error(paymentRes.error.message);

  return {
    work: workRes.data,
    payments: paymentRes.data,
  };
}
