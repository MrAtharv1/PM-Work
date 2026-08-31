"use client";

import { useState } from "react";
import Link from "next/link";
import { Search } from "lucide-react";
import { Input } from "@/components/ui/Input";
import { formatCurrency } from "@/lib/utils";

type ClientBalance = {
  client_id: string;
  client_name: string;
  balance: number;
};

export default function ClientList({ initialClients }: { initialClients: ClientBalance[] }) {
  const [search, setSearch] = useState("");

  const filtered = initialClients.filter(c => 
    c.client_name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div className="relative">
        <Search className="absolute left-4 top-4 h-5 w-5 text-muted" />
        <Input
          placeholder="Search clients..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="pl-12 h-14"
        />
      </div>

      <div className="space-y-3 pb-20">
        {filtered.length === 0 ? (
          <div className="text-center py-10 text-muted">
            {search ? "No clients found." : "No clients yet."}
          </div>
        ) : (
          filtered.map((client) => (
            <Link 
              key={client.client_id} 
              href={`/finance/${client.client_id}`}
              className="block bg-white border border-border rounded-2xl p-5 transition-shadow hover:shadow-sm hover:border-gray-300"
            >
              <div className="flex justify-between items-center">
                <h3 className="font-medium text-lg text-foreground truncate pr-4">{client.client_name}</h3>
                <div className="text-right flex-shrink-0">
                  <div className={`font-semibold text-lg ${client.balance > 0 ? "text-red-600" : client.balance < 0 ? "text-green-600" : "text-foreground"}`}>
                    {formatCurrency(client.balance)}
                  </div>
                  <div className="text-xs text-muted font-medium uppercase tracking-wider mt-0.5">
                    {client.balance > 0 ? "Due" : client.balance < 0 ? "Advance" : "Settled"}
                  </div>
                </div>
              </div>
            </Link>
          ))
        )}
      </div>
    </div>
  );
}
