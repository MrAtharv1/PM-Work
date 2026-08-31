"use client";

import { useState } from "react";
import { Plus } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { addPaymentTransaction } from "@/lib/actions";

interface PaymentButtonProps {
  clientId: string;
  clientName: string;
  outstandingBalance: number;
}

export default function PaymentButton({ clientId, clientName, outstandingBalance }: PaymentButtonProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [amount, setAmount] = useState("");
  const [note, setNote] = useState("");
  const [paymentDate, setPaymentDate] = useState(new Date().toISOString().split('T')[0]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const paymentAmount = parseFloat(amount);
    
    if (!paymentAmount || paymentAmount <= 0) {
      alert("Please enter a valid amount.");
      return;
    }

    if (paymentAmount > outstandingBalance && outstandingBalance > 0) {
      const confirm = window.confirm(`This payment (₹${paymentAmount}) is greater than the outstanding balance (₹${outstandingBalance}). Continue?`);
      if (!confirm) return;
    }

    setIsSubmitting(true);
    try {
      await addPaymentTransaction({
        client_id: clientId,
        amount: paymentAmount,
        note: note.trim() || undefined,
        payment_date: paymentDate,
      });
      setIsOpen(false);
      setAmount("");
      setNote("");
      setPaymentDate(new Date().toISOString().split('T')[0]);
    } catch (error) {
      console.error(error);
      alert("Failed to record payment. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      <Button 
        onClick={() => setIsOpen(true)} 
        size="lg" 
        className="w-full h-14 md:h-16 text-lg rounded-2xl shadow-sm bg-accent text-white hover:bg-accent/90"
      >
        <Plus className="mr-2 h-5 w-5" />
        Payment Received
      </Button>

      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-end md:items-center justify-center bg-black/40 backdrop-blur-sm p-0 md:p-4 animate-in fade-in">
          <div 
            className="bg-white w-full max-w-md rounded-t-3xl md:rounded-3xl p-6 md:p-8 animate-in slide-in-from-bottom-full md:slide-in-from-bottom-0 md:zoom-in-95 shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-semibold">Receive Payment</h2>
              <button 
                onClick={() => setIsOpen(false)}
                className="p-2 text-muted hover:text-foreground rounded-full hover:bg-gray-100 transition-colors"
              >
                Close
              </button>
            </div>

            <div className="mb-6 text-sm text-muted">
              Client: <span className="font-medium text-foreground">{clientName}</span>
            </div>

            <form onSubmit={handleSubmit} className="space-y-5">
              <div className="space-y-2">
                <label className="text-sm font-medium text-muted pl-1">Amount Received (₹)</label>
                <div className="relative">
                  <span className="absolute left-4 top-4 text-foreground font-medium">₹</span>
                  <Input
                    type="number"
                    placeholder="0.00"
                    min="0"
                    step="0.01"
                    required
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                    className="pl-8 h-16 text-xl font-semibold"
                    autoFocus
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-muted pl-1">Payment Date</label>
                <Input
                  type="date"
                  required
                  value={paymentDate}
                  onChange={(e) => setPaymentDate(e.target.value)}
                  className="h-14"
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-muted pl-1">Note (Optional)</label>
                <Input
                  placeholder="e.g. Cash, UPI, Cheque #..."
                  value={note}
                  onChange={(e) => setNote(e.target.value)}
                  className="h-14"
                />
              </div>

              <div className="pt-4 flex space-x-3">
                <Button 
                  type="button" 
                  variant="outline" 
                  className="flex-1 h-14"
                  onClick={() => setIsOpen(false)}
                  disabled={isSubmitting}
                >
                  Cancel
                </Button>
                <Button 
                  type="submit" 
                  className="flex-1 h-14 bg-accent text-white hover:bg-accent/90"
                  disabled={isSubmitting || !amount}
                >
                  {isSubmitting ? "Saving..." : "Confirm"}
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
}
