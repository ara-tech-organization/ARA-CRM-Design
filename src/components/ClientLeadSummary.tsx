import { useEffect, useState } from "react";
import axios from "axios";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Target } from "lucide-react";
import { motion } from "framer-motion";
import { Tag } from "antd";

interface Client {
  _id: string;
  companyName: string;
}

interface Lead {
  clientId: string;
  metaLeads: number;
  googleLeads: number;
  whatsappLeads: number;
  date: string;
}

interface DailyLead {
  date: string;
  meta: number;
  google: number;
  whatsapp: number;
  total: number;
}

interface ClientSummary {
  id: string;
  name: string;
  totalMeta?: number;
  totalGoogle?: number;
  totalWhatsApp?: number;
  totalLeads: number;
  dailyLeads?: DailyLead[];
  latestDate?: string;
}

export const ClientLeadSummary = () => {
  const [clientSummaries, setClientSummaries] = useState<ClientSummary[]>([]);
  const [fromDate, setFromDate] = useState<string>("");
  const [toDate, setToDate] = useState<string>("");
  const [lastUpdated, setLastUpdated] = useState<string>("");

  useEffect(() => {
    const fetchData = async () => {
      try {
        const clientsRes = await axios.get<Client[]>("http://localhost:5000/api/clients");
        const leadsRes = await axios.get<Lead[]>("http://localhost:5000/api/leads");

        const leads = leadsRes.data;
        let filteredLeads: Lead[] = [];

        if (fromDate && toDate) {
          const from = new Date(fromDate);
          const to = new Date(toDate);
          to.setHours(23, 59, 59, 999);
          filteredLeads = leads.filter((lead) => {
            const leadDate = new Date(lead.date);
            return leadDate >= from && leadDate <= to;
          });
        } else {
          const sortedLeads = [...leads].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
          const latestDate = sortedLeads[0]?.date || "";
          filteredLeads = leads.filter((lead) => lead.date === latestDate);
        }

        const summaries: ClientSummary[] = clientsRes.data
          .map((client) => {
            const clientLeads = filteredLeads.filter((lead) => lead.clientId === client._id);

            if (fromDate && toDate) {
              const dateMap: Record<string, { meta: number; google: number; whatsapp: number }> = {};
              clientLeads.forEach((lead) => {
                const date = new Date(lead.date).toLocaleDateString("en-GB").replace(/\//g, "-");
                if (!dateMap[date]) {
                  dateMap[date] = { meta: 0, google: 0, whatsapp: 0 };
                }
                dateMap[date].meta += lead.metaLeads;
                dateMap[date].google += lead.googleLeads;
                dateMap[date].whatsapp += lead.whatsappLeads;
              });

              const dailyLeads: DailyLead[] = Object.entries(dateMap)
                .map(([date, data]) => ({
                  date,
                  meta: data.meta,
                  google: data.google,
                  whatsapp: data.whatsapp,
                  total: data.meta + data.google + data.whatsapp,
                }))
                .filter((d) => d.total > 0);

              const totalLeads = dailyLeads.reduce((sum, d) => sum + d.total, 0);
              if (totalLeads === 0) return null;

              return {
                id: client._id,
                name: client.companyName,
                dailyLeads,
                totalLeads,
              };
            } else {
              const totalMeta = clientLeads.reduce((sum, lead) => sum + lead.metaLeads, 0);
              const totalGoogle = clientLeads.reduce((sum, lead) => sum + lead.googleLeads, 0);
              const totalWhatsApp = clientLeads.reduce((sum, lead) => sum + lead.whatsappLeads, 0);
              const totalLeads = totalMeta + totalGoogle + totalWhatsApp;
              if (totalLeads === 0) return null;

              const latestDate = clientLeads[0]?.date
                ? new Date(clientLeads[0].date).toLocaleDateString("en-GB")
                : "";

              return {
                id: client._id,
                name: client.companyName,
                totalMeta,
                totalGoogle,
                totalWhatsApp,
                totalLeads,
                latestDate,
              };
            }
          })
          .filter(Boolean) as ClientSummary[];

        setClientSummaries(summaries);
        setLastUpdated(new Date().toLocaleString());
      } catch (err) {
        console.error("Failed to load client lead data", err);
      }
    };

    fetchData();
  }, [fromDate, toDate]);

  const handleReset = () => {
    setFromDate("");
    setToDate("");
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-semibold text-gray-900">Client Lead Summary</h3>
        <div className="flex items-center gap-4">
          <Badge variant="outline" className="bg-blue-50 text-blue-700">
            {clientSummaries.length} Active Clients
          </Badge>
          <span className="text-xs text-gray-500">Updated: {lastUpdated || "Loading..."}</span>
        </div>
      </div>

      {/* Filter Section */}
      <div className="flex flex-wrap gap-4 items-end mb-2">
        <div>
          <label className="block text-sm font-medium text-gray-700">From</label>
          <input
            type="date"
            value={fromDate}
            onChange={(e) => setFromDate(e.target.value)}
            className="border border-gray-300 rounded px-2 py-1 text-sm"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">To</label>
          <input
            type="date"
            value={toDate}
            onChange={(e) => setToDate(e.target.value)}
            className="border border-gray-300 rounded px-2 py-1 text-sm"
          />
        </div>
        {fromDate && toDate && (
          <>
            <Badge variant="outline" className="bg-yellow-100 text-yellow-800">
              Showing leads from {fromDate} to {toDate}
            </Badge>
            <button
              onClick={handleReset}
              className="text-sm px-3 py-1 bg-gray-100 border border-gray-300 rounded hover:bg-gray-200"
            >
              Reset Filters
            </button>
          </>
        )}
      </div>

      {/* Leads Display */}
      {clientSummaries.length === 0 ? (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="text-center text-gray-500 py-10 border rounded bg-gray-50"
        >
          <p className="text-lg font-medium">😕 No leads found</p>
          <p className="text-sm text-gray-400">Try changing the date range or check back later.</p>
        </motion.div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {clientSummaries.map((client) => (
            <Card
              key={client.id}
              className="shadow-md border-0 bg-white/90 backdrop-blur-sm hover:shadow-lg transition-all"
            >
              <CardHeader className="pb-3">
                <CardTitle className="text-base flex items-center justify-between">
                  <span className="flex items-center gap-2">
                    <Target className="h-4 w-4 text-blue-600" />
                    {client.name}
                  </span>
                  <Badge variant="outline" className="text-xs">{client.totalLeads} total</Badge>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4 text-sm">
                {fromDate && toDate && client.dailyLeads ? (
                  <div className="space-y-2">
                    {client.dailyLeads.map((entry) => (
                      <div key={entry.date}>
                        <Tag color="blue" className="text-sm font-semibold mb-2">
                          {entry.date} Leads
                        </Tag>
                        <div className="grid grid-cols-3 gap-2 text-xs">
                          <div className="bg-purple-50 p-2 rounded text-center">
                            <span className="font-semibold text-purple-700">{entry.meta}</span>
                            <p className="text-purple-600">Meta</p>
                          </div>
                          <div className="bg-blue-50 p-2 rounded text-center">
                            <span className="font-semibold text-blue-700">{entry.google}</span>
                            <p className="text-blue-600">Google</p>
                          </div>
                          <div className="bg-green-50 p-2 rounded text-center">
                            <span className="font-semibold text-green-700">{entry.whatsapp}</span>
                            <p className="text-green-600">WhatsApp</p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <>
                    {client.latestDate && (
                      <Tag color="blue" className="text-sm font-semibold mb-2">
                        {client.latestDate} Leads
                      </Tag>
                    )}
                    <div className="grid grid-cols-3 gap-2 text-xs">
                      <div className="bg-purple-50 p-2 rounded text-center">
                        <span className="font-semibold text-purple-700">{client.totalMeta}</span>
                        <p className="text-purple-600">Meta</p>
                      </div>
                      <div className="bg-blue-50 p-2 rounded text-center">
                        <span className="font-semibold text-blue-700">{client.totalGoogle}</span>
                        <p className="text-blue-600">Google</p>
                      </div>
                      <div className="bg-green-50 p-2 rounded text-center">
                        <span className="font-semibold text-green-700">{client.totalWhatsApp}</span>
                        <p className="text-green-600">WhatsApp</p>
                      </div>
                    </div>
                  </>
                )}
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};