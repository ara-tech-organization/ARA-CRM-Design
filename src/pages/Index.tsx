import { useState, useEffect } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import axios from "axios";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Legend,
  LineChart,
  Line,
  Area,
  AreaChart,
} from "recharts";
import {
  Users,
  TrendingUp,
  Target,
  Calendar,
  Phone,
  Mail,
  MapPin,
  DollarSign,
  Plus,
  Filter,
  Download,
  Eye,
} from "lucide-react";
import { Header } from "@/components/Header";
import { LeadCard } from "@/components/LeadCard";
import { ClientCard } from "@/components/ClientCard";
import { DailyLeadEntry } from "@/components/DailyLeadEntry";
import { ClientLeadSummary } from "@/components/ClientLeadSummary";
import AddClientModal from "@/components/AddClientModal";
import ClientList from "@/components/ClientList";
import ClientSection from "@/components/ClientList";

interface DashboardStats {
  totalClients: number;
  totalLeads: number;
  todaysLeads: {
    total: number;
    meta: number;
    google: number;
    whatsapp: number;
  };
  activeChannels: string[];
}

const Index = () => {
  const [activeTab, setActiveTab] = useState("dashboard");

  const [leadSourceData, setLeadSourceData] = useState([]);
  useEffect(() => {
    const fetchLeadSourceSummary = async () => {
      try {
        const res = await axios.get(
          "http://localhost:5000/api/leads/source-summary"
        );
        const { meta, google, whatsapp } = res.data;
        const total = meta + google + whatsapp;

        const formattedData = [
          {
            name: "Meta Ads",
            value: meta,
            color: "#8B5CF6",
            percentage: total ? ((meta / total) * 100).toFixed(1) : 0,
          },
          {
            name: "Google Ads",
            value: google,
            color: "#3B82F6",
            percentage: total ? ((google / total) * 100).toFixed(1) : 0,
          },
          {
            name: "WhatsApp",
            value: whatsapp,
            color: "#10B981",
            percentage: total ? ((whatsapp / total) * 100).toFixed(1) : 0,
          },
        ];

        setLeadSourceData(formattedData);
      } catch (error) {
        console.error("Failed to fetch lead source summary", error);
      }
    };

    fetchLeadSourceSummary();
  }, []);

  const [clientLeadData, setClientLeadData] = useState([]);

  const transformClientLeadData = (data) => {
    const monthlyMap: { [month: string]: any } = {};

    data.forEach(({ month, clientName, totalLeads }) => {
      if (!monthlyMap[month]) monthlyMap[month] = { month };
      monthlyMap[month][clientName] = totalLeads;
    });

    return Object.values(monthlyMap);
  };

  // Example usage inside useEffect
  useEffect(() => {
    const fetchClientLeads = async () => {
      try {
        const res = await axios.get(
          "http://localhost:5000/api/leads/monthly-client-summary"
        );
        const transformedData = transformClientLeadData(res.data);
        setClientLeadData(transformedData);
      } catch (err) {
        console.error("Failed to fetch client leads summary", err);
      }
    };

    fetchClientLeads();
  }, []);

  // Channel performance data
  const channelPerformanceData = [
    { channel: "Meta Ads", leads: 163, clients: 3 },
    { channel: "Google Ads", leads: 124, clients: 3 },
    { channel: "WhatsApp", leads: 85, clients: 2 },
  ];

  const recentLeads = [
    {
      id: 1,
      name: "John Smith",
      company: "Tech Solutions Inc",
      email: "john@techsolutions.com",
      phone: "+1 (555) 123-4567",
      status: "qualified",
      source: "Website",
      value: 15000,
      lastContact: "2 hours ago",
    },
    {
      id: 2,
      name: "Sarah Johnson",
      company: "Marketing Pro",
      email: "sarah@marketingpro.com",
      phone: "+1 (555) 987-6543",
      status: "proposal",
      source: "Referral",
      value: 8500,
      lastContact: "4 hours ago",
    },
    {
      id: 3,
      name: "Mike Davis",
      company: "Global Enterprises",
      email: "mike@globalent.com",
      phone: "+1 (555) 456-7890",
      status: "negotiation",
      source: "Social Media",
      value: 22000,
      lastContact: "1 day ago",
    },
  ];

  const [stats, setStats] = useState({
    totalClients: 0,
    totalLeads: 0,
    todaysLeads: { total: 0, meta: 0, google: 0, whatsapp: 0 },
    activeChannels: [],
  });

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const res = await axios.get(
          "http://localhost:5000/api/stats/dashboard-stats"
        );
        setStats(res.data);
      } catch (err) {
        console.error("Failed to fetch dashboard stats", err);
      }
    };

    // Fetch initially
    fetchStats();

    // Poll every 15 seconds
    const interval = setInterval(fetchStats, 15000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
      <Header />

      <main className="container mx-auto px-6 py-8">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">
            ARA Discoveries CRM
          </h1>
          <p className="text-xl text-gray-600">
            Digital Marketing Lead Management Dashboard
          </p>
        </div>

        <Tabs
          value={activeTab}
          onValueChange={setActiveTab}
          className="space-y-6"
        >
          <TabsList className="grid w-full grid-cols-4 bg-white/60 backdrop-blur-sm">
            <TabsTrigger
              value="dashboard"
              className="data-[state=active]:bg-blue-600 data-[state=active]:text-white"
            >
              Dashboard
            </TabsTrigger>
            <TabsTrigger
              value="daily-entry"
              className="data-[state=active]:bg-blue-600 data-[state=active]:text-white"
            >
              Daily Entry
            </TabsTrigger>
            <TabsTrigger
              value="clients"
              className="data-[state=active]:bg-blue-600 data-[state=active]:text-white"
            >
              Clients
            </TabsTrigger>
            <TabsTrigger
              value="reports"
              className="data-[state=active]:bg-blue-600 data-[state=active]:text-white"
            >
              Reports
            </TabsTrigger>
          </TabsList>

          <TabsContent value="dashboard" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {/* Total Clients */}
              <Card className="bg-gradient-to-r from-purple-600 to-purple-700 text-white border-0 shadow-lg">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">
                    Total Clients
                  </CardTitle>
                  <Users className="h-4 w-4" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{stats.totalClients}</div>
                  <p className="text-xs text-purple-100">
                    Active digital marketing clients
                  </p>
                </CardContent>
              </Card>

              {/* Total Leads */}
              <Card className="bg-gradient-to-r from-blue-600 to-blue-700 text-white border-0 shadow-lg">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">
                    Total Leads
                  </CardTitle>
                  <Target className="h-4 w-4" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{stats.totalLeads}</div>
                  <p className="text-xs text-blue-100">Across all channels</p>
                </CardContent>
              </Card>

              {/* Today's Leads */}
              <Card className="bg-gradient-to-r from-green-600 to-green-700 text-white border-0 shadow-lg">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">
                    Today's Leads
                  </CardTitle>
                  <TrendingUp className="h-4 w-4" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">
                    {stats.todaysLeads.total}
                  </div>
                  <p className="text-xs text-green-100">
                    Meta: {stats.todaysLeads.meta} | Google:{" "}
                    {stats.todaysLeads.google} | WhatsApp:{" "}
                    {stats.todaysLeads.whatsapp}
                  </p>
                </CardContent>
              </Card>

              {/* Active Channels */}
              <Card className="bg-gradient-to-r from-orange-600 to-orange-700 text-white border-0 shadow-lg">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">
                    Active Channels
                  </CardTitle>
                  <DollarSign className="h-4 w-4" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">
                    {stats.activeChannels.length}
                  </div>
                  <p className="text-xs text-orange-100">
                    {stats.activeChannels.join(", ")}
                  </p>
                </CardContent>
              </Card>
            </div>

            {/* Client Lead Summary */}
            <ClientLeadSummary />

            {/* Charts Row */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card className="shadow-lg border-0 bg-white/80 backdrop-blur-sm">
                <CardHeader>
                  <CardTitle>Lead Sources Distribution</CardTitle>
                  <CardDescription>Lead generation by channel</CardDescription>
                </CardHeader>

                <CardContent>
                  <ResponsiveContainer width="100%" height={300}>
                    <PieChart>
                      <Pie
                        data={leadSourceData}
                        cx="50%"
                        cy="50%"
                        innerRadius={60}
                        outerRadius={100}
                        paddingAngle={5}
                        dataKey="value"
                      >
                        {leadSourceData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Pie>
                      <Tooltip />
                    </PieChart>
                  </ResponsiveContainer>

                  <div className="flex flex-wrap gap-2 mt-4">
                    {leadSourceData.map((item, index) => (
                      <div key={index} className="flex items-center gap-2">
                        <div
                          className="w-3 h-3 rounded-full"
                          style={{ backgroundColor: item.color }}
                        ></div>
                        <span className="text-sm text-gray-600">
                          {item.name}: {item.percentage}%
                        </span>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              <Card className="shadow-lg border-0 bg-white/80 backdrop-blur-sm">
                <CardHeader>
                  <CardTitle>Client Performance</CardTitle>
                  <CardDescription>
                    Monthly lead comparison by client
                  </CardDescription>
                </CardHeader>

                <CardContent>
                  <ResponsiveContainer width="100%" height={300}>
                    <BarChart data={clientLeadData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="month" />
                      <YAxis />
                      <Tooltip />
                      {clientLeadData.length > 0 &&
                        Object.keys(clientLeadData[0])
                          .filter((key) => key !== "month")
                          .map((clientKey, index) => (
                            <Bar
                              key={clientKey}
                              dataKey={clientKey}
                              fill={
                                [
                                  "#8B5CF6",
                                  "#3B82F6",
                                  "#10B981",
                                  "#F59E0B",
                                  "#EF4444",
                                ][index % 5]
                              }
                              name={clientKey}
                            />
                          ))}
                    </BarChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="daily-entry" className="space-y-6">
            <DailyLeadEntry />
          </TabsContent>

          <TabsContent value="leads" className="space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-2xl font-bold text-gray-900">
                Lead Management
              </h2>
              <div className="flex gap-3">
                <Button variant="outline" size="sm">
                  <Filter className="h-4 w-4 mr-2" />
                  Filter
                </Button>
                <Button className="bg-blue-600 hover:bg-blue-700">
                  <Plus className="h-4 w-4 mr-2" />
                  Add Lead
                </Button>
              </div>
            </div>

            <div className="grid gap-4">
              {recentLeads.map((lead) => (
                <LeadCard key={lead.id} lead={lead} />
              ))}
            </div>
          </TabsContent>

          <TabsContent value="clients" className="space-y-6">
            <div className="flex justify-between items-center">
              {/* <h2 className="text-2xl font-bold text-gray-900">Client Portfolio</h2> */}
              {/* <Button className="bg-blue-600 hover:bg-blue-700"> */}
              {/* <AddClientModal onClientAdded={(newClient) => console.log('New client added:', newClient)} /> */}

              {/* </Button> */}
            </div>
            <ClientSection />
          </TabsContent>

          <TabsContent value="reports" className="space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-2xl font-bold text-gray-900">
                Reports & Analytics
              </h2>
              <Button className="bg-blue-600 hover:bg-blue-700">
                <Download className="h-4 w-4 mr-2" />
                Generate Report
              </Button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <Card className="shadow-lg border-0 bg-white/80 backdrop-blur-sm hover:shadow-xl transition-shadow">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Calendar className="h-5 w-5 text-blue-600" />
                    Daily Lead Updates
                  </CardTitle>
                  <CardDescription>
                    Real-time lead status for each client
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-gray-600 mb-4">
                    Automated daily reports sent to client managers
                  </p>
                  <Button variant="outline" className="w-full">
                    <Eye className="h-4 w-4 mr-2" />
                    View Sample
                  </Button>
                </CardContent>
              </Card>

              <Card className="shadow-lg border-0 bg-white/80 backdrop-blur-sm hover:shadow-xl transition-shadow">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <TrendingUp className="h-5 w-5 text-green-600" />
                    Daily Summary Reports
                  </CardTitle>
                  <CardDescription>Team performance overview</CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-gray-600 mb-4">
                    Comprehensive daily summaries for internal teams
                  </p>
                  <Button variant="outline" className="w-full">
                    <Eye className="h-4 w-4 mr-2" />
                    View Sample
                  </Button>
                </CardContent>
              </Card>

              <Card className="shadow-lg border-0 bg-white/80 backdrop-blur-sm hover:shadow-xl transition-shadow">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <BarChart className="h-5 w-5 text-purple-600" />
                    Monthly Reports
                  </CardTitle>
                  <CardDescription>
                    Performance & lead comparison
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-gray-600 mb-4">
                    Detailed monthly analysis across all clients
                  </p>
                  <Button variant="outline" className="w-full">
                    <Eye className="h-4 w-4 mr-2" />
                    View Sample
                  </Button>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
};

export default Index;
