import React from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  Cell,
} from "recharts";
import {
  Briefcase,
  Users,
  Calendar,
  Award,
  FileText,
  TrendingUp,
  UserCheck,
  Plus,
  Filter,
  Download,
  Eye,
  Clock,
  AlertCircle,
  Star,
  Bell,
} from "lucide-react";

const Dashboard = () => {
  // Summary cards data
  const summaryData = [
    {
      title: "Total Jobs Posted",
      value: "24",
      icon: Briefcase,
      gradient: "from-blue-500 to-cyan-500",
    },
    {
      title: "Applicants Applied",
      value: "183",
      icon: Users,
      gradient: "from-purple-500 to-pink-500",
    },
    {
      title: "Interviews Completed",
      value: "127",
      icon: Calendar,
      gradient: "from-cyan-500 to-blue-500",
    },
    {
      title: "Shortlisted Candidates",
      value: "42",
      icon: Award,
      gradient: "from-violet-500 to-purple-500",
    },
  ];

  // Performance chart data
  const performanceData = [
    { score: "0-20", applicants: 5 },
    { score: "21-40", applicants: 12 },
    { score: "41-60", applicants: 28 },
    { score: "61-80", applicants: 45 },
    { score: "81-100", applicants: 32 },
  ];

  // Notifications data
  const notificationsData = [
    {
      text: "New applicant for Senior Developer position",
      type: "info",
      time: "10 mins ago",
    },
    {
      text: "Interview violation detected with candidate #237",
      type: "alert",
      time: "30 mins ago",
    },
    {
      text: "Top scorer (98%) detected in current screening",
      type: "success",
      time: "1 hour ago",
    },
    {
      text: "3 new applicants matched your criteria",
      type: "info",
      time: "2 hours ago",
    },
  ];

  // Applications data
  const applicationsData = [
    {
      name: "Sarah Johnson",
      role: "Frontend Developer",
      match: 92,
      score: 88,
      status: "Shortlisted",
    },
    {
      name: "Michael Chen",
      role: "Data Scientist",
      match: 87,
      score: 94,
      status: "Accepted",
    },
    {
      name: "Emma Rodriguez",
      role: "UX Designer",
      match: 79,
      score: 82,
      status: "Shortlisted",
    },
    {
      name: "David Kim",
      role: "Backend Engineer",
      match: 95,
      score: 91,
      status: "Accepted",
    },
    {
      name: "Priya Sharma",
      role: "Product Manager",
      match: 88,
      score: 76,
      status: "Rejected",
    },
  ];

  // Notification icon component
  const NotificationIcon = ({ type }) => {
    switch (type) {
      case "alert":
        return <AlertCircle size={16} className="text-amber-500" />;
      case "success":
        return <Star size={16} className="text-green-500" />;
      default:
        return <Bell size={16} className="text-blue-500" />;
    }
  };

  // Status badge component
  const StatusBadge = ({ status }) => {
    let bgColor = "";
    if (status === "Accepted") bgColor = "bg-green-100 text-green-800";
    else if (status === "Shortlisted") bgColor = "bg-blue-100 text-blue-800";
    else bgColor = "bg-red-100 text-red-800";

    return (
      <span className={`px-2 py-1 text-xs font-medium rounded-full ${bgColor}`}>
        {status}
      </span>
    );
  };

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <div className="max-w-7xl mx-auto">
        <div className="space-y-6">
          {/* Header */}
          <div>
            <h1 className="text-3xl font-bold text-gray-900">
              AI Interview Dashboard
            </h1>
            <p className="text-gray-600">
              Welcome back! Here's what's happening with your candidates today.
            </p>
          </div>

          {/* Summary Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {summaryData.map((item, index) => {
              const Icon = item.icon;
              return (
                <div
                  key={index}
                  className={`bg-gradient-to-r ${item.gradient} rounded-2xl p-6 text-white shadow-lg transition-transform hover:scale-105`}
                >
                  <div className="flex justify-between items-start">
                    <div>
                      <p className="text-sm font-medium opacity-80">
                        {item.title}
                      </p>
                      <p className="text-3xl font-bold mt-2">{item.value}</p>
                    </div>
                    <div className="bg-white bg-opacity-20 p-3 rounded-lg">
                      <Icon size={24} />
                    </div>
                  </div>
                  <div className="mt-4">
                    <div className="w-full bg-white bg-opacity-30 rounded-full h-2">
                      <div
                        className="bg-white h-2 rounded-full"
                        style={{ width: `${Math.min(item.value * 2, 100)}%` }}
                      ></div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Applicant Performance Chart */}
            <div className="lg:col-span-2 bg-white rounded-2xl p-6 shadow-sm">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-bold text-gray-900">
                  Applicant Performance Distribution
                </h2>
                <button className="flex items-center text-sm text-gray-500 hover:text-gray-700">
                  <Filter size={16} className="mr-1" />
                  Filter
                </button>
              </div>
              <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={performanceData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#eee" />
                    <XAxis dataKey="score" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Bar
                      dataKey="applicants"
                      name="Number of Applicants"
                      fill="#8884d8"
                      radius={[4, 4, 0, 0]}
                    >
                      {performanceData.map((entry, index) => (
                        <Cell
                          key={`cell-${index}`}
                          fill={
                            index === 3
                              ? "#6366F1"
                              : index === 4
                              ? "#8B5CF6"
                              : "#93C5FD"
                          }
                        />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Notifications Panel */}
            <div className="bg-white rounded-2xl p-6 shadow-sm">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-bold text-gray-900">
                  Notifications
                </h2>
                <button className="text-sm text-blue-600 hover:text-blue-800">
                  View All
                </button>
              </div>
              <div className="space-y-4">
                {notificationsData.map((notification, index) => (
                  <div
                    key={index}
                    className="p-3 bg-gray-50 rounded-lg hover:bg-blue-50 transition-colors"
                  >
                    <div className="flex items-start">
                      <div className="flex-shrink-0 mt-1">
                        <NotificationIcon type={notification.type} />
                      </div>
                      <div className="ml-3">
                        <p className="text-sm font-medium text-gray-900">
                          {notification.text}
                        </p>
                        <p className="text-xs text-gray-500 mt-1 flex items-center">
                          <Clock size={12} className="mr-1" />
                          {notification.time}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Recent Applications Table */}
            <div className="lg:col-span-2 bg-white rounded-2xl p-6 shadow-sm">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-bold text-gray-900">
                  Recent Applications
                </h2>
                <button className="flex items-center text-sm text-blue-600 hover:text-blue-800">
                  <Download size={16} className="mr-1" />
                  Export
                </button>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="text-left text-gray-500 text-sm border-b">
                      <th className="pb-3 font-medium">Candidate</th>
                      <th className="pb-3 font-medium">Job Role</th>
                      <th className="pb-3 font-medium">CV Match</th>
                      <th className="pb-3 font-medium">AI Score</th>
                      <th className="pb-3 font-medium">Status</th>
                      <th className="pb-3 font-medium">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y">
                    {applicationsData.map((application, index) => (
                      <tr key={index} className="hover:bg-gray-50">
                        <td className="py-4">
                          <div className="flex items-center">
                            <div className="w-10 h-10 bg-gray-200 rounded-full flex-shrink-0"></div>
                            <div className="ml-3">
                              <p className="font-medium text-gray-900">
                                {application.name}
                              </p>
                            </div>
                          </div>
                        </td>
                        <td className="py-4 text-gray-900">
                          {application.role}
                        </td>
                        <td className="py-4">
                          <div className="flex items-center">
                            <div className="w-16 bg-gray-200 rounded-full h-2">
                              <div
                                className="bg-green-500 h-2 rounded-full"
                                style={{ width: `${application.match}%` }}
                              ></div>
                            </div>
                            <span className="ml-2 text-gray-600">
                              {application.match}%
                            </span>
                          </div>
                        </td>
                        <td className="py-4">
                          <div className="flex items-center">
                            <div className="w-16 bg-gray-200 rounded-full h-2">
                              <div
                                className="bg-blue-500 h-2 rounded-full"
                                style={{ width: `${application.score}%` }}
                              ></div>
                            </div>
                            <span className="ml-2 text-gray-600">
                              {application.score}
                            </span>
                          </div>
                        </td>
                        <td className="py-4">
                          <StatusBadge status={application.status} />
                        </td>
                        <td className="py-4">
                          <button className="text-blue-600 hover:text-blue-800">
                            <Eye size={18} />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Quick Actions */}
            <div className="bg-white rounded-2xl p-6 shadow-sm">
              <h2 className="text-xl font-bold text-gray-900 mb-6">
                Quick Actions
              </h2>
              <div className="space-y-4">
                <button className="w-full flex items-center justify-center p-4 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-xl font-medium hover:from-blue-600 hover:to-purple-700 transition-all shadow-md hover:shadow-lg">
                  <Plus size={20} className="mr-2" />
                  Post New Job
                </button>
                <button className="w-full flex items-center justify-center p-4 bg-gradient-to-r from-cyan-500 to-blue-500 text-white rounded-xl font-medium hover:from-cyan-600 hover:to-blue-600 transition-all shadow-md hover:shadow-lg">
                  <Briefcase size={20} className="mr-2" />
                  Manage Jobs
                </button>
                <button className="w-full flex items-center justify-center p-4 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-xl font-medium hover:from-purple-600 hover:to-pink-600 transition-all shadow-md hover:shadow-lg">
                  <UserCheck size={20} className="mr-2" />
                  Shortlist Candidates
                </button>
              </div>

              {/* Additional Stats */}
              <div className="mt-8 pt-6 border-t border-gray-200">
                <h3 className="text-lg font-medium text-gray-900 mb-4">
                  Interview Stats
                </h3>
                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-blue-50 p-3 rounded-lg">
                    <p className="text-xs text-blue-700">Avg. Completion</p>
                    <p className="text-xl font-bold text-blue-900">78%</p>
                  </div>
                  <div className="bg-purple-50 p-3 rounded-lg">
                    <p className="text-xs text-purple-700">Avg. Score</p>
                    <p className="text-xl font-bold text-purple-900">82</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
