import { getClientBalances } from "@/lib/actions";
import ClientList from "./ClientList";
import ReportModal from "@/components/ReportModal";

export const dynamic = "force-dynamic";

export default async function FinancePage() {
  const clients = await getClientBalances().catch(() => []);

  return (
    <div className="flex flex-col min-h-screen p-4 md:p-8 max-w-2xl mx-auto w-full">
      <header className="mb-6 mt-4 md:mt-0 flex justify-between items-center">
        <h1 className="text-3xl font-semibold tracking-tight text-foreground">Select Client</h1>
        <ReportModal clients={clients.map((c: Record<string, unknown>) => ({ id: c.client_id as string, name: c.client_name as string, client_code: c.client_code as string }))} />
      </header>
      
      <main className="flex-1">
        <ClientList initialClients={clients} />
      </main>
    </div>
  );
}
