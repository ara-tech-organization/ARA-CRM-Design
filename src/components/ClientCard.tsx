import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { TrendingUp, Users, DollarSign, User, Building } from "lucide-react";

interface Client {
  _id: string;
  companyName: string;
  industry: string;
  manager: string;
  leads?: number;
  converted?: number;
  revenue?: number;
}

export const ClientCard = ({ client }: { client: Client }) => {
  const leads = client.leads ?? 0;
  const converted = client.converted ?? 0;
  const revenue = client.revenue ?? 0;
  const conversionRate = leads > 0 ? ((converted / leads) * 100).toFixed(1) : "0.0";

  const formatCurrency = (amount: number) =>
    new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      minimumFractionDigits: 0,
    }).format(amount);

  const getIndustryColor = (industry: string) => {
    switch (industry.toLowerCase()) {
      case "technology":
        return "bg-blue-100 text-blue-800 border-blue-200";
      case "manufacturing":
        return "bg-orange-100 text-orange-800 border-orange-200";
      case "healthcare":
        return "bg-green-100 text-green-800 border-green-200";
      case "beauty":
        return "bg-pink-100 text-pink-800 border-pink-200";
      case "school":
        return "bg-gray-100 text-gray-800 border-gray-200";
      case "hospital":
        return "bg-slate-100 text-slate-800 border-slate-200";
      default:
        return "bg-gray-100 text-gray-800 border-gray-200";
    }
  };

  return (
    <Card className="flex flex-col justify-between h-full shadow-md border border-gray-100 rounded-xl bg-white hover:shadow-lg transition duration-300">
      <div className="p-5 space-y-4 flex flex-col flex-1">
        {/* Header */}
        <div>
          <CardTitle className="text-lg font-semibold flex items-center gap-2 mb-2">
            <Building className="h-5 w-5 text-blue-600" />
            {client.companyName}
          </CardTitle>
          <Badge className={`capitalize ${getIndustryColor(client.industry)} border`}>
            {client.industry}
          </Badge>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 gap-3 mt-4">
          <div className="text-center bg-blue-50 py-2 rounded-lg">
            <p className="text-sm text-blue-600 flex justify-center items-center gap-1">
              <Users className="w-4 h-4" /> Total Leads
            </p>
            <p className="text-xl font-bold text-blue-700">{leads}</p>
          </div>
          <div className="text-center bg-green-50 py-2 rounded-lg">
            <p className="text-sm text-green-600 flex justify-center items-center gap-1">
              <TrendingUp className="w-4 h-4" /> Converted
            </p>
            <p className="text-xl font-bold text-green-700">{converted}</p>
          </div>
        </div>

        {/* Revenue */}
        <div className="text-center bg-purple-50 py-3 rounded-lg mt-2">
          <p className="text-sm text-purple-600 flex justify-center items-center gap-1">
            <DollarSign className="w-4 h-4" /> Revenue Generated
          </p>
          <p className="text-xl font-bold text-purple-700">{formatCurrency(revenue)}</p>
        </div>

        {/* Manager & Conversion */}
        <div className="flex justify-between items-center text-sm text-gray-600 border-t pt-3 mt-auto">
          <div className="flex items-center gap-2">
            <User className="w-4 h-4" />
            <span>
              Manager: <span className="font-medium text-black">{client.manager}</span>
            </span>
          </div>
          <Badge variant="outline" className="text-xs px-2 py-1">
            {conversionRate}% conversion
          </Badge>
        </div>

        {/* CTA Button */}
        <Button className="w-full mt-4 bg-blue-600 hover:bg-blue-700 text-white">
          View Campaign Details
        </Button>
      </div>
    </Card>
  );
};
