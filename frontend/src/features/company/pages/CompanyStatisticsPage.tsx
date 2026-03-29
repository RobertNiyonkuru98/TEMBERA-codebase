import { useMemo } from "react";

interface ItineraryWithId {
  id: string;
  title: string;
  location: string;
  date: string;
  price: number;
  companyId: string;
}
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

function CompanyStatisticsPage() {
  // Chart data transformations with hardcoded sample data for demonstration
  const monthlyBookingsData = useMemo(() => {
    // Sample monthly data for the past 6 months
    return [
      { month: 'Oct 2023', bookings: 45 },
      { month: 'Nov 2023', bookings: 52 },
      { month: 'Dec 2023', bookings: 78 },
      { month: 'Jan 2024', bookings: 65 },
      { month: 'Feb 2024', bookings: 89 },
      { month: 'Mar 2024', bookings: 95 },
    ];
  }, []);

  const itineraryPerformanceData = useMemo(() => {
    // Sample performance data for top itineraries
    return [
      { name: 'Gorilla Trekking', attendees: 45, revenue: 45000 },
      { name: 'Volcano Hiking', attendees: 38, revenue: 38000 },
      { name: 'Lake Kivu Tour', attendees: 32, revenue: 32000 },
      { name: 'Nyungwe Safari', attendees: 28, revenue: 28000 },
      { name: 'Cultural Village', attendees: 25, revenue: 25000 },
      { name: 'Mountain Biking', attendees: 22, revenue: 22000 },
      { name: 'Bird Watching', attendees: 18, revenue: 18000 },
      { name: 'Coffee Plantation', attendees: 15, revenue: 15000 },
    ];
  }, []);

  const performanceDistributionData = useMemo(() => {
    // Sample performance distribution
    return [
      { name: 'High Performance (>20)', value: 8, color: '#10b981' },
      { name: 'Medium Performance (10-20)', value: 12, color: '#f59e0b' },
      { name: 'Low Performance (<10)', value: 5, color: '#ef4444' },
    ];
  }, []);

  const locationDistributionData = useMemo(() => {
    // Sample location distribution
    return [
      { location: 'Volcanoes National Park', count: 12 },
      { location: 'Lake Kivu', count: 8 },
      { location: 'Nyungwe Forest', count: 7 },
      { location: 'Kigali City', count: 6 },
      { location: 'Akagera Park', count: 5 },
      { location: 'Musanze District', count: 4 },
    ];
  }, []);

  // Hardcoded sample data for demonstration
  const sampleItineraries: ItineraryWithId[] = [
    { id: '1', title: 'Gorilla Trekking Adventure', location: 'Volcanoes National Park', date: '2024-03-15', price: 1000, companyId: '1' },
    { id: '2', title: 'Volcano Hiking Experience', location: 'Volcanoes National Park', date: '2024-03-20', price: 800, companyId: '1' },
    { id: '3', title: 'Lake Kivu Boat Tour', location: 'Lake Kivu', date: '2024-03-25', price: 600, companyId: '1' },
    { id: '4', title: 'Nyungwe Forest Safari', location: 'Nyungwe Forest', date: '2024-04-01', price: 1200, companyId: '1' },
    { id: '5', title: 'Cultural Village Visit', location: 'Kigali City', date: '2024-04-05', price: 400, companyId: '2' },
    { id: '6', title: 'Mountain Biking Trail', location: 'Musanze District', date: '2024-04-10', price: 500, companyId: '2' },
    { id: '7', title: 'Bird Watching Expedition', location: 'Nyungwe Forest', date: '2024-04-15', price: 700, companyId: '1' },
    { id: '8', title: 'Coffee Plantation Tour', location: 'Kigali City', date: '2024-04-20', price: 300, companyId: '2' },
  ];

  const sampleBookingItems = Array.from({ length: 125 }, (_, i) => ({
    id: `booking-${i}`,
    itineraryId: sampleItineraries[i % sampleItineraries.length].id,
    bookingId: `book-${i}`,
  }));

  const totalAttendees = sampleBookingItems.length;
  const averageAttendees = sampleItineraries.length > 0 ? Math.round(totalAttendees / sampleItineraries.length) : 0;
  const highPerformingItineraries = 8;

  // Since we're using hardcoded data, no loading state needed

  if (sampleItineraries.length === 0) {
    return <p className="text-sm text-slate-300">No sample data available.</p>;
  }

  return (
    <div className="space-y-6">
      <header>
        <h1 className="text-2xl font-semibold tracking-tight text-slate-50">Company Statistics</h1>
        <p className="text-sm text-slate-300">Comprehensive KPI dashboard with charts and performance metrics.</p>
      </header>

      {/* KPI Cards */}
      <section className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardContent className="p-4">
            <p className="text-xs uppercase tracking-wide text-slate-400">Total Itineraries</p>
            <p className="mt-2 text-2xl font-semibold text-emerald-300">{sampleItineraries.length}</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <p className="text-xs uppercase tracking-wide text-slate-400">Total Attendees</p>
            <p className="mt-2 text-2xl font-semibold text-blue-300">{totalAttendees}</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <p className="text-xs uppercase tracking-wide text-slate-400">Avg. Attendees</p>
            <p className="mt-2 text-2xl font-semibold text-purple-300">{averageAttendees}</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <p className="text-xs uppercase tracking-wide text-slate-400">High Performers</p>
            <p className="mt-2 text-2xl font-semibold text-orange-300">{highPerformingItineraries}</p>
          </CardContent>
        </Card>
      </section>

      {/* Charts Grid */}
      <div className="grid gap-6 lg:grid-cols-2">
        {/* Monthly Bookings Trend */}
        <Card>
          <CardHeader>
            <CardTitle>Monthly Bookings Trend</CardTitle>
            <CardDescription>Booking trends over time</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={monthlyBookingsData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                <XAxis 
                  dataKey="month" 
                  tick={{ fill: '#9ca3af' }} 
                  label={{ value: 'Month', position: 'insideBottom', offset: -5, fill: '#9ca3af' }}
                />
                <YAxis 
                  tick={{ fill: '#9ca3af' }} 
                  label={{ value: 'Number of Bookings', angle: -90, position: 'insideLeft', fill: '#9ca3af' }}
                />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: '#1f2937', 
                    border: '1px solid #374151',
                    borderRadius: '6px'
                  }}
                  labelStyle={{ color: '#f3f4f6' }}
                  itemStyle={{ color: '#f3f4f6' }}
                  formatter={(value) => [`${value} bookings`, 'Bookings']}
                />
                <Line 
                  type="monotone" 
                  dataKey="bookings" 
                  stroke="#10b981" 
                  strokeWidth={2}
                  dot={{ fill: '#10b981', r: 4 }}
                  activeDot={{ r: 6 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Performance Distribution */}
        <Card>
          <CardHeader>
            <CardTitle>Performance Distribution</CardTitle>
            <CardDescription>Itinerary performance breakdown</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={performanceDistributionData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, percent, value }) => `${name}: ${value} (${(percent * 100).toFixed(0)}%)`}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {performanceDistributionData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: '#1f2937', 
                    border: '1px solid #374151',
                    borderRadius: '6px'
                  }}
                  labelStyle={{ color: '#f3f4f6' }}
                  itemStyle={{ color: '#f3f4f6' }}
                  formatter={(value) => [`${value} itineraries`, 'Performance']}
                />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Top Performing Itineraries */}
        <Card>
          <CardHeader>
            <CardTitle>Top Performing Itineraries</CardTitle>
            <CardDescription>Attendees per itinerary</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={itineraryPerformanceData} layout="horizontal">
                <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                <XAxis 
                  type="number" 
                  tick={{ fill: '#9ca3af' }} 
                  label={{ value: 'Number of Attendees', position: 'insideBottom', offset: -5, fill: '#9ca3af' }}
                />
                <YAxis 
                  dataKey="name" 
                  type="category" 
                  tick={{ fill: '#9ca3af' }} 
                  width={100}
                  label={{ value: 'Itinerary Name', angle: -90, position: 'insideLeft', fill: '#9ca3af' }}
                />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: '#1f2937', 
                    border: '1px solid #374151',
                    borderRadius: '6px'
                  }}
                  labelStyle={{ color: '#f3f4f6' }}
                  itemStyle={{ color: '#f3f4f6' }}
                  formatter={(value) => [`${value} attendees`, 'Attendees']}
                />
                <Bar dataKey="attendees" fill="#3b82f6" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Location Distribution */}
        <Card>
          <CardHeader>
            <CardTitle>Location Distribution</CardTitle>
            <CardDescription>Itineraries by location</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={locationDistributionData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                <XAxis 
                  dataKey="location" 
                  tick={{ fill: '#9ca3af' }} 
                  angle={-45} 
                  textAnchor="end" 
                  height={80}
                  label={{ value: 'Location', position: 'insideBottom', offset: -5, fill: '#9ca3af' }}
                />
                <YAxis 
                  tick={{ fill: '#9ca3af' }} 
                  label={{ value: 'Number of Itineraries', angle: -90, position: 'insideLeft', fill: '#9ca3af' }}
                />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: '#1f2937', 
                    border: '1px solid #374151',
                    borderRadius: '6px'
                  }}
                  labelStyle={{ color: '#f3f4f6' }}
                  itemStyle={{ color: '#f3f4f6' }}
                  formatter={(value) => [`${value} itineraries`, 'Performance']}
                />
                <Bar dataKey="count" fill="#f59e0b" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Detailed Performance Table */}
      <Card>
        <CardHeader>
          <CardTitle>Detailed Performance</CardTitle>
          <CardDescription>Complete itinerary performance data</CardDescription>
        </CardHeader>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full min-w-[760px] text-left text-sm text-slate-200">
              <thead className="border-b border-slate-800 bg-slate-900/80 text-xs uppercase tracking-wide text-slate-400">
                <tr>
                  <th className="px-4 py-3">Itinerary</th>
                  <th className="px-4 py-3">Date</th>
                  <th className="px-4 py-3">Location</th>
                  <th className="px-4 py-3">Attendees</th>
                  <th className="px-4 py-3">Performance</th>
                </tr>
              </thead>
              <tbody>
                {sampleItineraries.map((itinerary) => {
                  const attendees = Math.floor(Math.random() * 40) + 10; // Random attendees between 10-50
                  const performance =
                    attendees >= 20 ? "High" : attendees >= 10 ? "Medium" : "Low";

                  return (
                    <tr key={itinerary.id} className="border-b border-slate-800/60">
                      <td className="px-4 py-3">{itinerary.title}</td>
                      <td className="px-4 py-3">{new Date(itinerary.date).toLocaleDateString()}</td>
                      <td className="px-4 py-3">{itinerary.location}</td>
                      <td className="px-4 py-3 font-semibold text-emerald-300">{attendees}</td>
                      <td className="px-4 py-3">
                        <span className={`inline-flex items-center rounded-full px-2 py-1 text-xs font-medium ${
                          performance === 'High' 
                            ? 'bg-green-900/50 text-green-300'
                            : performance === 'Medium'
                            ? 'bg-yellow-900/50 text-yellow-300'
                            : 'bg-red-900/50 text-red-300'
                        }`}>
                          {performance}
                        </span>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

export default CompanyStatisticsPage;
