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
  PieChart,
  Pie,
  Cell,
} from "recharts";
import {
  LayoutDashboard,
  Briefcase,
  Users,
  Calendar,
  BarChart3,
  Settings,
  Search,
  Bell,
  ChevronDown,
  Menu,
  X,
  FileText,
  TrendingUp,
  UserCheck,
  Award,
  Plus,
  Filter,
  Download,
  Eye,
  Clock,
  AlertCircle,
  Star,
} from "lucide-react";

// Add your mock data and helper components here
const summaryData = [
  // ... your summary data
];

const performanceData = [
  // ... your performance data
];

const notificationsData = [
  // ... your notifications data
];

const applicationsData = [
  // ... your applications data
];

// Helper components
const NotificationIcon = ({ type }) => {
  // ... your NotificationIcon component
};

const StatusBadge = ({ status }) => {
  // ... your StatusBadge component
};

function Dashboard() {
  return (
    <div className="space-y-6">
     <p>this is dashboard</p>
    </div>
  );
}

export default Dashboard;