import { getClientBalance, getClientTransactions } from "@/lib/actions";
import { formatCurrency } from "@/lib/utils";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import PaymentButton from "./PaymentButton";
import { format } from "date-fns";

export const dynamic = "force-dynamic";

export default async function ClientFinancePage({ params }: { params: { clientId: string } }) {
  const [balanceData, transactions] = await Promise.all([
    getClientBalance(params.clientId).catch(() => null),
    getClientTransactions(params.clientId).catch(() => []),
  ]);

  if (!balanceData) {
    return (
      <div className="p-8 text-center text-muted">
        Client not found or database error.
      </div>
    );
  }

  return (
    <div className="flex flex-col min-h-screen p-4 md:p-8 max-w-2xl mx-auto w-full pb-32">
      <header className="mb-6 mt-2 md:mt-0 flex items-center space-x-4">
        <Link href="/finance" className="p-2 -ml-2 rounded-full hover:bg-gray-100 text-foreground transition-colors">
          <ArrowLeft className="w-6 h-6" />
        </Link>
        <h1 className="text-2xl font-semibold tracking-tight text-foreground truncate">
          {balanceData.client_name}
        </h1>
      </header>

      <div className="bg-white rounded-3xl p-6 border border-border shadow-sm mb-8 text-center">
        <h2 className="text-sm font-medium text-muted uppercase tracking-wider mb-2">Outstanding</h2>
        <div className={`text-5xl font-bold tracking-tight mb-8 ${balanceData.balance > 0 ? "text-red-600" : "text-foreground"}`}>
          {formatCurrency(balanceData.balance)}
        </div>

        <div className="flex justify-between border-t border-border pt-6">
          <div className="text-left">
            <div className="text-xs font-medium text-muted uppercase tracking-wider mb-1">Total Work</div>
            <div className="text-lg font-semibold">{formatCurrency(balanceData.total_work)}</div>
          </div>
          <div className="text-right">
            <div className="text-xs font-medium text-muted uppercase tracking-wider mb-1">Paid</div>
            <div className="text-lg font-semibold">{formatCurrency(balanceData.total_paid)}</div>
          </div>
        </div>
      </div>

      <div className="mb-6">
        <h3 className="text-lg font-semibold text-foreground mb-4 pl-1">History</h3>
        
        {transactions.length === 0 ? (
          <div className="text-center py-8 text-muted bg-gray-50 rounded-2xl border border-dashed border-gray-300">
            No financial activity yet.
          </div>
        ) : (
          <div className="space-y-3">
            {transactions.map((tx: {
              id: string;
              type: "WORK" | "PAYMENT";
              created_at: string;
              amount: number;
              work_description?: string;
              quantity?: number;
              plates?: number;
              note?: string;
            }) => {
              const date = new Date(tx.created_at);
              const isWork = tx.type === "WORK";
              
              return (
                <div key={`${tx.type}-${tx.id}`} className="flex justify-between items-start p-4 bg-white border border-border rounded-2xl">
                  <div>
                    <div className="font-medium text-foreground mb-1">
                      {isWork ? tx.work_description : "Payment Received"}
                    </div>
                    {isWork && ((tx.quantity && tx.quantity > 0) || (tx.plates && tx.plates > 0)) && (
                      <div className="text-sm text-muted mb-1">
                        {[
                          (tx.quantity && tx.quantity > 0) ? `${tx.quantity} pcs` : null,
                          (tx.plates && tx.plates > 0) ? `${tx.plates} plates` : null
                        ].filter(Boolean).join(" · ")}
                      </div>
                    )}
                    {!isWork && tx.note && (
                      <div className="text-sm text-muted mb-1">{tx.note}</div>
                    )}
                    <div className="text-xs text-gray-400">
                      {format(date, "MMM d, yyyy · h:mm a")}
                    </div>
                  </div>
                  <div className={`font-semibold text-lg flex-shrink-0 pl-4 ${isWork ? "text-foreground" : "text-green-600"}`}>
                    {isWork ? "" : "-"}{formatCurrency(tx.amount)}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Fixed bottom action area for mobile */}
      <div className="fixed bottom-16 md:bottom-0 left-0 right-0 p-4 bg-white/80 backdrop-blur-md border-t border-border md:relative md:bg-transparent md:border-0 md:p-0 md:mt-8 z-40">
        <PaymentButton 
          clientId={params.clientId} 
          clientName={balanceData.client_name}
          outstandingBalance={balanceData.balance}
        />
      </div>
    </div>
  );
}
