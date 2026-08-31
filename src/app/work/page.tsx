import { getClients } from "@/lib/actions";
import WorkForm from "./WorkForm";
import ReportModal from "@/components/ReportModal";

export const dynamic = "force-dynamic";

export default async function WorkPage() {
  const clients = await getClients().catch(() => []); // Graceful fallback if no DB connection yet

  return (
    <div className="flex flex-col min-h-screen p-4 md:p-8 max-w-2xl mx-auto w-full">
      <header className="mb-8 mt-4 md:mt-0 flex justify-between items-start">
        <div>
          <h1 className="text-3xl font-semibold tracking-tight text-foreground">Add Work</h1>
          <p className="text-muted mt-1 text-sm">Record a new printing job.</p>
        </div>
        <ReportModal clients={clients} />
      </header>

      <main className="flex-1">
        <WorkForm initialClients={clients} />
      </main>
    </div>
  );
}
