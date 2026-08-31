"use client";

import { useState } from "react";
import ClientSelector from "@/components/ClientSelector";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import { createClient, addWorkTransaction } from "@/lib/actions";

type Client = {
  id: string;
  name: string;
  client_code: string;
};

export default function WorkForm({ initialClients }: { initialClients: Client[] }) {
  const [clients, setClients] = useState<Client[]>(initialClients);
  const [selectedClientId, setSelectedClientId] = useState<string | null>(null);
  
  const [description, setDescription] = useState("");
  const [plates, setPlates] = useState("");
  const [quantity, setQuantity] = useState("");
  const [amount, setAmount] = useState("");
  const [workDate, setWorkDate] = useState(new Date().toISOString().split('T')[0]);
  
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleCreateClient = async (name: string) => {
    const newClient = await createClient(name);
    setClients((prev) => [...prev, newClient].sort((a, b) => a.name.localeCompare(b.name)));
    return newClient;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedClientId) {
      alert("Please select a client.");
      return;
    }
    if (!description || !amount) {
      alert("Description and Amount are required.");
      return;
    }

    setIsSubmitting(true);
    setSuccess(false);
    
    try {
      await addWorkTransaction({
        client_id: selectedClientId,
        work_description: description,
        plates: parseInt(plates) || 0,
        quantity: parseInt(quantity) || 0,
        amount: parseFloat(amount),
        work_date: workDate,
      });
      
      // Reset form
      setDescription("");
      setPlates("");
      setQuantity("");
      setAmount("");
      setWorkDate(new Date().toISOString().split('T')[0]);
      setSuccess(true);
      
      setTimeout(() => setSuccess(false), 3000);
    } catch (error) {
      console.error(error);
      alert("Failed to save work. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="space-y-4">
        <ClientSelector
          clients={clients}
          selectedClientId={selectedClientId}
          onSelect={setSelectedClientId}
          onCreateClient={handleCreateClient}
        />

        <div className="space-y-2">
          <label className="text-sm font-medium text-muted pl-1">Work Description</label>
          <Input
            placeholder="e.g. Wedding Cards, Pamphlets..."
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            required
            className="h-14"
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <label className="text-sm font-medium text-muted pl-1">Plates Used</label>
            <Input
              type="number"
              placeholder="0"
              min="0"
              value={plates}
              onChange={(e) => setPlates(e.target.value)}
              className="h-14"
            />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium text-muted pl-1">Quantity</label>
            <Input
              type="number"
              placeholder="0"
              min="0"
              value={quantity}
              onChange={(e) => setQuantity(e.target.value)}
              className="h-14"
            />
          </div>
        </div>

        <div className="space-y-2 pt-2">
          <label className="text-sm font-medium text-muted pl-1">Work Date</label>
          <Input
            type="date"
            required
            value={workDate}
            onChange={(e) => setWorkDate(e.target.value)}
            className="h-14"
          />
        </div>

        <div className="space-y-2 pt-2">
          <label className="text-sm font-medium text-muted pl-1">Total Amount (₹)</label>
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
              className="pl-8 h-16 text-lg font-semibold"
            />
          </div>
        </div>
      </div>

      <div className="pt-6">
        <Button 
          type="submit" 
          size="lg" 
          className="w-full h-16 text-lg rounded-2xl shadow-sm"
          disabled={isSubmitting || !selectedClientId}
        >
          {isSubmitting ? "Saving..." : "Save Work"}
        </Button>
        
        {success && (
          <div className="mt-4 p-4 bg-green-50 text-green-700 rounded-xl text-center font-medium animate-in fade-in">
            Work saved successfully!
          </div>
        )}
      </div>
    </form>
  );
}
