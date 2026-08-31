"use client";

import { useState, useEffect, useRef } from "react";
import { Search, Plus, Check } from "lucide-react";
import { Input } from "./ui/Input";
import { Button } from "./ui/Button";

type Client = {
  id: string;
  name: string;
  client_code: string;
};

interface ClientSelectorProps {
  clients: Client[];
  selectedClientId: string | null;
  onSelect: (clientId: string) => void;
  onCreateClient: (name: string) => Promise<Client>;
}

export default function ClientSelector({
  clients,
  selectedClientId,
  onSelect,
  onCreateClient,
}: ClientSelectorProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [search, setSearch] = useState("");
  const [isCreating, setIsCreating] = useState(false);
  
  const containerRef = useRef<HTMLDivElement>(null);

  const selectedClient = clients.find((c) => c.id === selectedClientId);

  const filteredClients = clients.filter((c) =>
    c.name.toLowerCase().includes(search.toLowerCase())
  );

  // Close when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleCreate = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (!search.trim()) return;
    setIsCreating(true);
    try {
      const newClient = await onCreateClient(search.trim());
      onSelect(newClient.id);
      setIsOpen(false);
      setSearch("");
    } catch (error) {
      console.error("Failed to create client", error);
      alert("Failed to create client. Please try again.");
    } finally {
      setIsCreating(false);
    }
  };

  return (
    <div className="relative w-full" ref={containerRef}>
      <div
        className="flex h-14 w-full cursor-pointer items-center justify-between rounded-xl border border-border bg-white px-4 py-2 transition-colors hover:border-muted"
        onClick={() => setIsOpen(!isOpen)}
      >
        <div className="flex flex-col justify-center">
          <span className="text-xs font-medium text-muted uppercase tracking-wider">Client</span>
          <span className="text-base text-foreground font-medium truncate">
            {selectedClient ? selectedClient.name : "Select a client..."}
          </span>
        </div>
      </div>

      {isOpen && (
        <div className="absolute left-0 right-0 top-[calc(100%+8px)] z-50 overflow-hidden rounded-xl border border-border bg-white shadow-xl max-h-[300px] flex flex-col">
          <div className="p-3 border-b border-border">
            <div className="relative">
              <Search className="absolute left-3 top-3 h-5 w-5 text-muted" />
              <Input
                placeholder="Search clients..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    e.preventDefault();
                    if (filteredClients.length === 0 && search.trim()) {
                      handleCreate(e as unknown as React.MouseEvent);
                    } else if (filteredClients.length > 0) {
                      onSelect(filteredClients[0].id);
                      setIsOpen(false);
                      setSearch("");
                    }
                  }
                }}
                className="pl-10 h-11 bg-gray-50 border-transparent focus-visible:bg-white"
                autoFocus
              />
            </div>
          </div>
          
          <div className="flex-1 overflow-y-auto no-scrollbar">
            {filteredClients.length > 0 ? (
              <ul className="p-2 space-y-1">
                {filteredClients.map((client) => (
                  <li key={client.id}>
                    <button
                      type="button"
                      className="flex w-full items-center justify-between rounded-lg px-3 py-3 text-left hover:bg-gray-50 focus:bg-gray-50 outline-none"
                      onMouseDown={(e) => {
                        e.preventDefault();
                        onSelect(client.id);
                        setIsOpen(false);
                        setSearch("");
                      }}
                    >
                      <span className="font-medium text-foreground">{client.name}</span>
                      {selectedClientId === client.id && (
                        <Check className="h-5 w-5 text-accent" />
                      )}
                    </button>
                  </li>
                ))}
              </ul>
            ) : (
              <div className="p-6 text-center text-muted flex flex-col items-center">
                <p className="mb-4 text-sm">No client found matching &quot;{search}&quot;</p>
                <Button 
                  type="button" 
                  variant="outline" 
                  className="w-full h-11"
                  onMouseDown={handleCreate}
                  disabled={isCreating}
                >
                  <Plus className="mr-2 h-4 w-4" />
                  {isCreating ? "Adding..." : `Add "${search}"`}
                </Button>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
