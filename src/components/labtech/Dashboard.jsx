import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { 
  ClockIcon,
  CheckIcon,
  ArrowRightIcon,
  UserIcon,
  DocumentTextIcon,
  ChartBarIcon,
  BeakerIcon,
  ClipboardDocumentListIcon,
  HomeIcon,
  CalendarDaysIcon
} from '@heroicons/react/24/outline';
import { labtechService } from '../../services/api'; 
import { toast } from 'react-toastify';

const Dashboard = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [labCounts, setLabCounts] = useState({
    pending: 0,
    inProgress: 0,
    completed: 0,
    total: 0
  });
  const [techInfo, setTechInfo] = useState({
    name: '',
    role: 'Lab Technician',
    lab: 'Central Diagnostics Lab'
  });
  const [recentTests, setRecentTests] = useState([]);
  const [recentReports, setRecentReports] = useState([]);
  
  useEffect(() => {
    const init = async () => {
      try {
        setLoading(true);
        setError(null);

        const userStr = localStorage.getItem('user');
        if (!userStr) {
          throw new Error('User data not found. Please log in again.');
        }

        const userData = JSON.parse(userStr);
        // Use a static ID for mock data if user ID is missing
        const labtechId = userData.id || 'mock_labtech_id';

        // Set basic tech info from user data
        setTechInfo({
          name: userData.name || 'LabTech',
          role: userData.role || 'Lab Technician',
          lab: userData.lab || 'Central Diagnostics Lab'
        });

        // Fetch active tests (Pending/In Progress)
        const testsRes = await labtechService.getLabTestsByLabtech(labtechId);
        const tests = testsRes.data || [];
        
        // Fetch completed reports
        const reportsRes = await labtechService.getCompletedLabReports(labtechId);
        const reports = reportsRes.data || [];

        // Calculate counts
        const pendingCount = tests.filter(t => t.status === 'Pending').length;
        const inProgressCount = tests.filter(t => t.status === 'In Progress').length;
        const completedCount = reports.length;

        setLabCounts({
          pending: pendingCount,
          inProgress: inProgressCount,
          completed: completedCount,
          total: pendingCount + inProgressCount + completedCount
        });

        // Set top 3 lists
        setRecentTests(tests.slice(0, 3));
        setRecentReports(reports.slice(0, 3));

      } catch (err) {
        console.error('Error initializing lab dashboard:', err);
        setError(err.message || 'Failed to load dashboard data');
        toast.error(`Dashboard Error: ${err.message || 'Failed to load data'}`);
        // Fallback to mock data display if API call fails
        setLabCounts({ pending: 3, inProgress: 1, completed: 5, total: 9 });
        setRecentTests([
          { id: 101, patientName: 'John Doe', testName: 'CBC', status: 'Pending', date: '2025-10-25' },
          { id: 102, patientName: 'Jane Smith', testName: 'Glucose', status: 'In Progress', date: '2025-10-24' },
        ]);
        setRecentReports([
          { id: 201, patientName: 'R. Brown', testName: 'Thyroid', dateCompleted: '2025-10-23', resultSummary: 'Normal.' },
        ]);
      } finally {
        setLoading(false);
      }
    };

    init();
  }, []);

  const handleCardClick = (cardId) => {
    if (cardId === 'pending' || cardId === 'inProgress') navigate('/labtech/lab-tests');
    else if (cardId === 'completed') navigate('/labtech/lab-reports');
    else navigate('/labtech/dashboard');
  };

  const labCards = [
    {
      id: 'pending',
      title: 'Pending Tests',
      count: labCounts.pending,
      icon: <ClockIcon className="h-8 w-8 text-yellow-500" />,
      color: 'bg-yellow-50 border-yellow-100',
      textColor: 'text-yellow-900'
    },
    {
      id: 'inProgress',
      title: 'In-Progress Tests',
      count: labCounts.inProgress,
      icon: <ChartBarIcon className="h-8 w-8 text-blue-500" />,
      color: 'bg-blue-50 border-blue-100',
      textColor: 'text-blue-900'
    },
    {
      id: 'completed',
      title: 'Completed Reports',
      count: labCounts.completed,
      icon: <CheckIcon className="h-8 w-8 text-green-500" />,
      color: 'bg-green-50 border-green-100',
      textColor: 'text-green-900'
    }
  ];

  const quickActions = [
    {
      title: 'View Active Tests',
      icon: <ClipboardDocumentListIcon className="h-6 w-6 text-blue-500" />,
      path: '/labtech/lab-tests',
      description: 'Review and start tests'
    },
    {
      title: 'Manage Reports',
      icon: <DocumentTextIcon className="h-6 w-6 text-green-500" />,
      path: '/labtech/lab-reports',
      description: 'Upload or view final reports'
    },
    {
      title: 'My Profile',
      icon: <UserIcon className="h-6 w-6 text-purple-500" />,
      path: '/labtech/profile',
      description: 'Update your details'
    }
  ];
  
  const getStatusColor = (status) => {
    switch ((status || '').toLowerCase()) {
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'in progress':
        return 'bg-blue-100 text-blue-800';
      case 'completed':
        return 'bg-green-100 text-green-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };


  return (
    <div className="flex flex-col p-6">
      {/* Welcome Banner */}
      <div className="bg-gradient-to-r from-teal-600 to-teal-500 rounded-xl shadow-md mb-8 text-white p-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold flex items-center">
                <HomeIcon className="h-7 w-7 mr-2" /> Welcome, {techInfo.name.split(' ')[0]}
            </h1>
            <p className="mt-1 text-teal-100">{techInfo.role} • {techInfo.lab}</p>
          </div>
          <div className="text-right">
            <p className="text-teal-100">{new Date().toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</p>
            <p className="mt-1 text-white font-medium">Have a productive day!</p>
          </div>
        </div>
      </div>
      
      {loading ? (
        <div className="flex items-center justify-center h-40">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-teal-500"></div>
        </div>
      ) : error ? (
        <div className="p-4 bg-red-50 rounded-lg text-red-500 border border-red-200 mb-6">
          <p>{error}</p>
        </div>
      ) : (
        <>
          {/* Lab Cards */}
          <div className="grid md:grid-cols-3 gap-6 mb-8">
            {labCards.map((card) => (
              <div
                key={card.id}
                onClick={() => handleCardClick(card.id)}
                className={`cursor-pointer rounded-xl border p-6 transition-all duration-200 ${card.color} hover:shadow-xl`}
              >
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="text-xl font-semibold mb-2">{card.title}</h3>
                    <p className={`text-5xl font-bold ${card.textColor}`}>{card.count}</p>
                  </div>
                  <div className="p-2">
                    {card.icon}
                  </div>
                </div>
                <div className="mt-6 flex items-center text-gray-700">
                  <span className="text-sm">View details</span>
                  <ArrowRightIcon className="ml-2 h-4 w-4" />
                </div>
              </div>
            ))}
          </div>
          
          {/* Quick Actions and Recent Tests (2 columns) */}
          <div className="grid md:grid-cols-2 gap-6 mb-8">
            {/* Quick Actions */}
            <div className="bg-white rounded-xl shadow p-6 border border-gray-100">
              <h2 className="text-xl font-semibold mb-6">Quick Actions</h2>
              <div className="grid grid-cols-3 gap-4">
                {quickActions.map((action, index) => (
                  <Link
                    key={index}
                    to={action.path}
                    className="flex flex-col items-center p-4 border border-gray-200 rounded-lg hover:bg-teal-50 transition-colors"
                  >
                    <div className="p-3 rounded-full bg-gray-100 mb-2">
                      {action.icon}
                    </div>
                    <h3 className="text-sm font-medium text-gray-900 text-center">{action.title}</h3>
                    <p className="text-xs text-gray-500 text-center mt-1 hidden sm:block">{action.description}</p>
                  </Link>
                ))}
                {/* Placeholder for future actions */}
                <div className="flex flex-col items-center p-4 border border-gray-200 rounded-lg bg-gray-50 text-gray-400">
                    <div className="p-3 rounded-full bg-gray-100 mb-2">
                      <CalendarDaysIcon className="h-6 w-6" />
                    </div>
                    <h3 className="text-sm font-medium text-center">Schedule Follow-up</h3>
                </div>
              </div>
            </div>
            
            {/* Recent Tests (Pending/In Progress) */}
            <div className="bg-white rounded-xl shadow p-6 border border-gray-100">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-semibold">Recent Tests (Active)</h2>
                <Link to="/labtech/lab-tests" className="text-sm text-teal-600 hover:text-teal-700">View All</Link>
              </div>
              <div className="space-y-4">
                {recentTests.length === 0 ? (
                  <div className="p-4 text-center text-gray-500 bg-gray-50 rounded-lg">No pending or in-progress tests.</div>
                ) : (
                  recentTests.map(test => (
                    <div key={test.id} className="flex p-3 border border-gray-100 rounded-lg hover:bg-gray-50">
                      <div className="h-10 w-10 rounded-full bg-gray-200 flex items-center justify-center mr-3">
                        <BeakerIcon className="h-6 w-6 text-teal-500" />
                      </div>
                      <div className="flex-grow">
                        <div className="flex justify-between">
                          <p className="text-sm font-medium text-gray-900">{test.testName}</p>
                          <span className="text-xs text-gray-500">Req: {test.date || 'N/A'}</span>
                        </div>
                        <div className="flex justify-between items-center mt-1">
                           <span className="text-xs text-gray-600">Patient: {test.patientName}</span>
                           <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${getStatusColor(test.status)}`}>
                             {test.status}
                           </span>
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>
          
          {/* Recent Reports (Completed) */}
          <div className="bg-white rounded-xl shadow p-6 mt-8 border border-gray-100">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-semibold">Recent Reports (Completed)</h2>
              <Link to="/labtech/lab-reports" className="text-sm text-teal-600 hover:text-teal-700">View All</Link>
            </div>
            <div className="space-y-4">
              {recentReports.length === 0 ? (
                <div className="p-4 text-center text-gray-500 bg-gray-50 rounded-lg">No recent reports generated.</div>
              ) : (
                recentReports.map(report => (
                  <div key={report.id} className="flex flex-col md:flex-row border-l-4 border-indigo-400 bg-indigo-50/50 p-4 rounded-lg shadow-sm hover:shadow-md transition-all duration-200">
                    <div className="flex-shrink-0 flex flex-col items-center justify-center mr-4">
                      <div className="bg-indigo-100 p-2 rounded-full mb-2">
                        <DocumentTextIcon className="h-8 w-8 text-indigo-600" />
                      </div>
                      <span className="text-xs text-gray-400 font-mono">#{report.id}</span>
                    </div>
                    <div className="flex-grow">
                      <div className="flex flex-col md:flex-row md:justify-between items-start md:items-center mb-2">
                        <div>
                          <span className="font-semibold text-gray-900 text-base">
                            {report.testName} for {report.patientName}
                          </span>
                          <span className="ml-2 text-xs text-gray-400">Date: {report.dateCompleted || 'N/A'}</span>
                        </div>
                        <div className="mt-2 md:mt-0">
                          <span className="inline-block bg-green-100 text-green-700 px-2 py-1 rounded text-xs font-medium">
                            Completed
                          </span>
                        </div>
                      </div>
                      <div className="mt-2 text-sm text-gray-600">
                        <p className="font-medium line-clamp-2">{report.resultSummary}</p>
                        {report.reportUrl && (
                          <a href={report.reportUrl} target="_blank" rel="noreferrer" className="text-sm text-indigo-600 hover:underline">Download Report</a>
                        )}
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
          
        </>
      )}
    </div>
  );
};

export default Dashboard;