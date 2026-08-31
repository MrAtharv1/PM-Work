"use client";

import { useState } from "react";
import { Download, X } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { getReportData } from "@/lib/actions";
import { format } from "date-fns";

type Client = {
  id: string;
  name: string;
  client_code: string;
};

interface ReportModalProps {
  clients: Client[];
}

export default function ReportModal({ clients }: ReportModalProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedClientId, setSelectedClientId] = useState<string>("ALL");
  const [isGenerating, setIsGenerating] = useState(false);

  const escapeCSV = (str: string | undefined | null) => {
    if (!str) return "";
    const stringified = String(str);
    if (stringified.includes(",") || stringified.includes('"') || stringified.includes("\n")) {
      return `"${stringified.replace(/"/g, '""')}"`;
    }
    return stringified;
  };

  const generateCSV = async () => {
    setIsGenerating(true);
    try {
      const data = await getReportData(selectedClientId === "ALL" ? undefined : selectedClientId);
      
      const isAll = selectedClientId === "ALL";
      const clientName = isAll ? "All Clients" : clients.find(c => c.id === selectedClientId)?.name || "Client";
      
      let totalWork = 0;
      let totalPaid = 0;

      const workRows = data.work.map((w: Record<string, unknown>) => {
        totalWork += Number(w.amount);
        const base = [
          format(new Date((w.work_date || w.created_at) as string), "dd MMM yyyy"),
          isAll ? escapeCSV((w.clients as { name: string })?.name) : null,
          escapeCSV(w.work_description as string),
          w.plates || 0,
          w.quantity || 0,
          w.amount
        ].filter(v => v !== null);
        return base.join(",");
      });

      const financeRows = [...data.work, ...data.payments].sort((a: Record<string, unknown>, b: Record<string, unknown>) => {
        const dateA = new Date((a.work_date || a.payment_date || a.created_at) as string).getTime();
        const dateB = new Date((b.work_date || b.payment_date || b.created_at) as string).getTime();
        if (dateB !== dateA) return dateB - dateA;
        return new Date(b.created_at as string).getTime() - new Date(a.created_at as string).getTime();
      }).map((t: Record<string, unknown>) => {
        const isWork = !!t.work_description;
        if (!isWork) totalPaid += Number(t.amount);
        
        const date = format(new Date((t.work_date || t.payment_date || t.created_at) as string), "dd MMM yyyy");
        const type = isWork ? "WORK" : "PAYMENT";
        const desc = isWork ? t.work_description as string : (t.note as string || "Payment Received");
        
        const base = [
          date,
          isAll ? escapeCSV((t.clients as { name: string })?.name) : null,
          type,
          escapeCSV(desc),
          t.amount
        ].filter(v => v !== null);
        return base.join(",");
      });

      const balance = totalWork - totalPaid;

      const lines = [];
      lines.push("PRINTING PRESS REPORT");
      lines.push(`Client: ${clientName}`);
      lines.push(`Generated: ${format(new Date(), "dd MMM yyyy")}`);
      lines.push("");
      
      lines.push("SUMMARY");
      lines.push(`,Total Work,${totalWork}`);
      lines.push(`,Total Paid,${totalPaid}`);
      lines.push(`,Outstanding Balance,${balance}`);
      lines.push("");

      lines.push("WORK");
      const workHeaders = ["Date"];
      if (isAll) workHeaders.push("Client");
      workHeaders.push("Work", "Plates", "Quantity", "Amount");
      lines.push(workHeaders.join(","));
      lines.push(...workRows);
      lines.push("");

      lines.push("FINANCE");
      const finHeaders = ["Date"];
      if (isAll) finHeaders.push("Client");
      finHeaders.push("Type", "Description", "Amount");
      lines.push(finHeaders.join(","));
      lines.push(...financeRows);

      const csvContent = lines.join("\n");
      const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
      
      const safeName = clientName.replace(/[^a-z0-9]/gi, '_').toLowerCase();
      const filename = `${safeName}_report_${format(new Date(), "yyyy-MM-dd")}.csv`;

      // Try Web Share API first
      const file = new File([blob], filename, { type: 'text/csv' });
      if (navigator.canShare && navigator.canShare({ files: [file] })) {
        try {
          await navigator.share({
            files: [file],
            title: 'Printing Press Report',
            text: `Report for ${clientName}`,
          });
          setIsOpen(false);
          return;
        } catch (err: unknown) {
          if ((err as Error).name !== 'AbortError') {
            console.error("Error sharing:", err);
            // Fallback to download
          } else {
            return; // User cancelled
          }
        }
      }

      // Fallback to Download
      const link = document.createElement("a");
      const url = URL.createObjectURL(blob);
      link.setAttribute("href", url);
      link.setAttribute("download", filename);
      link.style.visibility = 'hidden';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      
      setIsOpen(false);

    } catch (error) {
      console.error(error);
      alert("Failed to generate report.");
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <>
      <Button 
        variant="outline" 
        size="sm" 
        onClick={() => setIsOpen(true)}
        className="rounded-full px-4 text-sm font-medium border-border"
      >
        <Download className="mr-2 h-4 w-4" />
        Reports
      </Button>

      {isOpen && (
        <div className="fixed inset-0 z-[100] flex items-end md:items-center justify-center bg-black/40 backdrop-blur-sm p-0 md:p-4 animate-in fade-in">
          <div 
            className="bg-white w-full max-w-md rounded-t-3xl md:rounded-3xl p-6 md:p-8 animate-in slide-in-from-bottom-full md:slide-in-from-bottom-0 md:zoom-in-95 shadow-2xl relative"
            onClick={(e) => e.stopPropagation()}
          >
            <button 
              onClick={() => setIsOpen(false)}
              className="absolute right-6 top-6 p-2 text-muted hover:text-foreground rounded-full hover:bg-gray-100 transition-colors"
            >
              <X className="h-5 w-5" />
            </button>

            <h2 className="text-xl font-semibold mb-6">Report</h2>

            <div className="space-y-6">
              <div className="space-y-2">
                <label className="text-sm font-medium text-muted pl-1">Client</label>
                <div className="relative">
                  <select
                    value={selectedClientId}
                    onChange={(e) => setSelectedClientId(e.target.value)}
                    className="w-full h-14 rounded-xl border border-border bg-white px-4 py-2 text-base ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent appearance-none"
                  >
                    <option value="ALL">All Clients</option>
                    {clients.map(c => (
                      <option key={c.id} value={c.id}>{c.name}</option>
                    ))}
                  </select>
                  <div className="pointer-events-none absolute inset-y-0 right-4 flex items-center">
                    <svg className="h-4 w-4 text-muted" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path></svg>
                  </div>
                </div>
              </div>

              <div className="p-4 bg-gray-50 rounded-xl border border-gray-100 text-sm">
                <div className="font-medium mb-2">Report includes:</div>
                <div className="text-muted space-y-1">
                  <div className="flex items-center"><svg className="h-4 w-4 text-green-500 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"/></svg> Work</div>
                  <div className="flex items-center"><svg className="h-4 w-4 text-green-500 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"/></svg> Finance</div>
                </div>
              </div>

              <div className="pt-2">
                <Button 
                  onClick={generateCSV}
                  className="w-full h-14 bg-foreground text-white hover:bg-foreground/90 text-lg rounded-2xl"
                  disabled={isGenerating}
                >
                  <Download className="mr-2 h-5 w-5" />
                  <span className="hidden md:inline">{isGenerating ? "Generating..." : "Download CSV"}</span>
                  <span className="md:hidden">{isGenerating ? "Generating..." : "Download & Share"}</span>
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
