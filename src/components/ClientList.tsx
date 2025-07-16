import React, { useEffect, useState } from "react";
import axios from "axios";
import { ClientCard } from "./ClientCard";
import AddClientModal from "./AddClientModal";

interface Client {
  _id: string;
  companyName: string;
  industry: string;
  manager: string;
  leads?: number;
  converted?: number;
  revenue?: number;
}

const ClientSection = () => {
  const [clients, setClients] = useState<Client[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchClients = async () => {
    try {
      const res = await axios.get("http://localhost:5000/api/clients");
      setClients(res.data);
    } catch (err) {
      console.error("Error fetching clients", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchClients();
  }, []);

const handleClientAdded = (newClient) => {
  console.log("Adding to state:", newClient); // ✅ You should see this
  setClients((prev) => [newClient, ...prev]);
};


  return (
  <div className="space-y-6">
    <div className="flex justify-between items-center">
      <h2 className="text-2xl font-bold text-gray-900">Client Portfolio</h2>

      {/* 👇 FIX: Add the modal with callback */}
      <AddClientModal onClientAdded={handleClientAdded} />
    </div>

    {loading ? (
      <p>Loading clients...</p>
    ) : clients.length === 0 ? (
      <p>No clients found.</p>
    ) : (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {clients.map((client) => (
          <ClientCard key={client._id} client={client} />
        ))}
      </div>
    )}
  </div>
);
};

export default ClientSection;
