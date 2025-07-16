import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Plus, Save } from "lucide-react";
import axios from 'axios';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

interface Client {
  _id: string;
  companyName: string;
}

interface LeadEntry {
  clientId: string;
  clientName: string;
  date: string;
  metaLeads: number;
  googleLeads: number;
  whatsappLeads: number;
}

export const DailyLeadEntry = () => {
  const [clients, setClients] = useState<Client[]>([]);
  const [selectedClient, setSelectedClient] = useState('');
  const [metaLeads, setMetaLeads] = useState('');
  const [googleLeads, setGoogleLeads] = useState('');
  const [whatsappLeads, setWhatsappLeads] = useState('');
  const [showSuccessModal, setShowSuccessModal] = useState(false);

  useEffect(() => {
    const fetchClients = async () => {
      try {
        const res = await axios.get('http://localhost:5000/api/clients');
        setClients(res.data);
      } catch (err) {
        console.error('Failed to fetch clients:', err);
      }
    };

    fetchClients();
  }, []);

  const handleSaveEntry = async () => {
    if (!selectedClient || (!metaLeads && !googleLeads && !whatsappLeads)) {
      return;
    }

    const selected = clients.find(c => c._id === selectedClient);

    const entry: LeadEntry = {
      clientId: selectedClient,
      clientName: selected?.companyName || '',
      date: new Date().toISOString().split('T')[0],
      metaLeads: parseInt(metaLeads) || 0,
      googleLeads: parseInt(googleLeads) || 0,
      whatsappLeads: parseInt(whatsappLeads) || 0,
    };

    try {
      await axios.post('http://localhost:5000/api/leads', entry);

      // Reset form
      setMetaLeads('');
      setGoogleLeads('');
      setWhatsappLeads('');
      setSelectedClient('');

      // Show modal
      setShowSuccessModal(true);

      // Auto close modal after 2.5s
      setTimeout(() => setShowSuccessModal(false), 2500);
    } catch (err) {
      console.error('Failed to save lead entry:', err);
    }
  };

  const today = new Date().toLocaleDateString();

  return (
    <>
      <Card className="shadow-lg border-0 bg-white/90 backdrop-blur-sm">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Plus className="h-5 w-5 text-blue-600" />
            Daily Lead Entry - {today}
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="client">Select Client</Label>
            <Select value={selectedClient} onValueChange={setSelectedClient}>
              <SelectTrigger>
                <SelectValue placeholder="Choose client..." />
              </SelectTrigger>
              <SelectContent>
                {clients.map((client) => (
                  <SelectItem key={client._id} value={client._id}>
                    {client.companyName}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label htmlFor="meta-leads">Meta Ads Leads</Label>
              <Input
                id="meta-leads"
                type="number"
                placeholder="0"
                value={metaLeads}
                onChange={(e) => setMetaLeads(e.target.value)}
                className="bg-purple-50 border-purple-200 focus:border-purple-400"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="google-leads">Google Ads Leads</Label>
              <Input
                id="google-leads"
                type="number"
                placeholder="0"
                value={googleLeads}
                onChange={(e) => setGoogleLeads(e.target.value)}
                className="bg-blue-50 border-blue-200 focus:border-blue-400"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="whatsapp-leads">WhatsApp Leads</Label>
              <Input
                id="whatsapp-leads"
                type="number"
                placeholder="0"
                value={whatsappLeads}
                onChange={(e) => setWhatsappLeads(e.target.value)}
                className="bg-green-50 border-green-200 focus:border-green-400"
              />
            </div>
          </div>

          <Button onClick={handleSaveEntry} className="w-full bg-blue-600 hover:bg-blue-700">
            <Save className="h-4 w-4 mr-2" />
            Save Daily Lead Count
          </Button>
        </CardContent>
      </Card>

      {/* ✅ Success Modal */}
      <Dialog open={showSuccessModal} onOpenChange={setShowSuccessModal}>
        <DialogContent className="text-center">
          <DialogHeader>
            <DialogTitle className="text-green-600 text-lg">
              ✅ Lead Entry Saved Successfully!
            </DialogTitle>
          </DialogHeader>
          <p className="text-gray-600">Your lead data has been saved successfully.</p>
        </DialogContent>
      </Dialog>
    </>
  );
};
