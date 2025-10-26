import React, { useEffect, useState } from "react";
import useAxios from "../../hook/useAxios";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { FaTrashAlt, FaEnvelope, FaUsers, FaSearch, FaSort, FaSortUp, FaSortDown } from "react-icons/fa";

const SubscribersAdmin = () => {
  const { sendRequest, loading } = useAxios();
  const [subscribers, setSubscribers] = useState([]);
  const [filteredSubscribers, setFilteredSubscribers] = useState([]);
  const [deletingId, setDeletingId] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [sortConfig, setSortConfig] = useState({ key: "createdAt", direction: "desc" });

  // Fetch subscribers
  const fetchSubscribers = async () => {
    try {
      const res = await sendRequest("/subscribers", "GET");
      if (res.success) {
        setSubscribers(res.subscribers);
        setFilteredSubscribers(res.subscribers);
      } else {
        toast.error(res.message || "Failed to fetch subscribers");
      }
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to fetch subscribers");
    }
  };

  useEffect(() => {
    fetchSubscribers();
  }, []);

  // Search functionality
  useEffect(() => {
    const filtered = subscribers.filter(sub =>
      sub.email.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredSubscribers(filtered);
  }, [searchTerm, subscribers]);

  // Sort functionality
  const handleSort = (key) => {
    let direction = "desc";
    if (sortConfig.key === key && sortConfig.direction === "desc") {
      direction = "asc";
    }
    setSortConfig({ key, direction });
  };

  const sortedSubscribers = React.useMemo(() => {
    if (!sortConfig.key) return filteredSubscribers;

    return [...filteredSubscribers].sort((a, b) => {
      if (a[sortConfig.key] < b[sortConfig.key]) {
        return sortConfig.direction === "asc" ? -1 : 1;
      }
      if (a[sortConfig.key] > b[sortConfig.key]) {
        return sortConfig.direction === "asc" ? 1 : -1;
      }
      return 0;
    });
  }, [filteredSubscribers, sortConfig]);

  // Delete subscriber
  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this subscriber?")) return;
    
    try {
      setDeletingId(id);
      const res = await sendRequest(`/subscribers/${id}`, "DELETE");
      if (res.success) {
        toast.success(res.message);
        setSubscribers((prev) => prev.filter((s) => s._id !== id));
      } else {
        toast.error(res.message || "Delete failed");
      }
    } catch (err) {
      toast.error(err.response?.data?.message || "Delete failed");
    } finally {
      setDeletingId(null);
    }
  };

  // Export subscribers
  const handleExport = () => {
    const csvContent = "data:text/csv;charset=utf-8," 
      + "Email,Subscribed At\n" 
      + subscribers.map(sub => `"${sub.email}","${new Date(sub.createdAt).toLocaleString()}"`).join("\n");
    
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", "subscribers.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    
    toast.success("Subscribers exported successfully!");
  };

  const getSortIcon = (key) => {
    if (sortConfig.key !== key) return <FaSort className="text-gray-400" />;
    return sortConfig.direction === "asc" ? 
      <FaSortUp className="text-amber-500" /> : 
      <FaSortDown className="text-amber-500" />;
  };

  return (
    <div className="min-h-screen bg-gray-50 p-4 md:p-6 lg:p-8">
      <ToastContainer 
        position="top-right" 
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="light"
      />
      
      {/* Header Section */}
      <div className="mb-8">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
          <div>
            <h1 className="text-2xl md:text-3xl font-bold text-gray-900 mb-2">
              Subscriber Management
            </h1>
            <p className="text-gray-600">
              Manage your newsletter subscribers and their preferences
            </p>
          </div>
          
          <div className="flex flex-col sm:flex-row gap-3">
            <button
              onClick={handleExport}
              disabled={subscribers.length === 0}
              className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2 justify-center"
            >
              <FaEnvelope className="text-sm" />
              Export CSV
            </button>
          </div>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-blue-100 rounded-lg">
              <FaUsers className="text-blue-600 text-xl" />
            </div>
            <div>
              <p className="text-sm text-gray-600 font-medium">Total Subscribers</p>
              <p className="text-2xl font-bold text-gray-900">{subscribers.length}</p>
            </div>
          </div>
        </div>
        
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-green-100 rounded-lg">
              <FaEnvelope className="text-green-600 text-xl" />
            </div>
            <div>
              <p className="text-sm text-gray-600 font-medium">Active</p>
              <p className="text-2xl font-bold text-gray-900">{subscribers.length}</p>
            </div>
          </div>
        </div>
        
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-amber-100 rounded-lg">
              <FaSearch className="text-amber-600 text-xl" />
            </div>
            <div>
              <p className="text-sm text-gray-600 font-medium">Filtered</p>
              <p className="text-2xl font-bold text-gray-900">{filteredSubscribers.length}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Search and Controls */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-6">
        <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
          <div className="relative flex-1 w-full">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <FaSearch className="text-gray-400" />
            </div>
            <input
              type="text"
              placeholder="Search subscribers by email..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-amber-500 transition-colors duration-200"
            />
          </div>
          
          <div className="text-sm text-gray-600">
            Showing {sortedSubscribers.length} of {subscribers.length} subscribers
          </div>
        </div>
      </div>

      {/* Table Section */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        {loading ? (
          <div className="flex justify-center items-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-amber-500"></div>
          </div>
        ) : sortedSubscribers.length === 0 ? (
          <div className="text-center py-12">
            <FaUsers className="mx-auto text-4xl text-gray-300 mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              {searchTerm ? "No subscribers found" : "No subscribers yet"}
            </h3>
            <p className="text-gray-500 max-w-md mx-auto">
              {searchTerm 
                ? "Try adjusting your search terms to find what you're looking for."
                : "Subscribers will appear here once they sign up for your newsletter."
              }
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th 
                    className="px-4 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                    onClick={() => handleSort("email")}
                  >
                    <div className="flex items-center gap-2">
                      Email
                      {getSortIcon("email")}
                    </div>
                  </th>
                  <th 
                    className="px-4 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hidden md:table-cell"
                    onClick={() => handleSort("createdAt")}
                  >
                    <div className="flex items-center gap-2">
                      Subscribed Date
                      {getSortIcon("createdAt")}
                    </div>
                  </th>
                  <th className="px-4 py-4 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {sortedSubscribers.map((sub, idx) => (
                  <tr 
                    key={sub._id} 
                    className="hover:bg-gray-50 transition-colors duration-150"
                  >
                    <td className="px-4 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="flex-shrink-0 h-10 w-10 bg-gradient-to-r from-amber-500 to-orange-500 rounded-full flex items-center justify-center">
                          <FaEnvelope className="text-white text-sm" />
                        </div>
                        <div className="ml-4">
                          <div className="text-sm font-medium text-gray-900">
                            {sub.email}
                          </div>
                          <div className="text-sm text-gray-500 md:hidden">
                            {new Date(sub.createdAt).toLocaleDateString()}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-500 hidden md:table-cell">
                      {new Date(sub.createdAt).toLocaleString()}
                    </td>
                    <td className="px-4 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <button
                        onClick={() => handleDelete(sub._id)}
                        disabled={deletingId === sub._id}
                        className="inline-flex items-center px-3 py-2 border border-transparent text-sm leading-4 font-medium rounded-lg text-red-600 bg-red-50 hover:bg-red-100 hover:text-red-700 transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                        title="Delete subscriber"
                      >
                        {deletingId === sub._id ? (
                          <>
                            <div className="animate-spin rounded-full h-3 w-3 border-b-2 border-red-600 mr-2"></div>
                            Deleting...
                          </>
                        ) : (
                          <>
                            <FaTrashAlt className="mr-2" />
                            Delete
                          </>
                        )}
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Mobile Card View */}
      {!loading && sortedSubscribers.length > 0 && (
        <div className="md:hidden mt-6 space-y-4">
          {sortedSubscribers.map((sub) => (
            <div key={sub._id} className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center">
                  <div className="h-8 w-8 bg-gradient-to-r from-amber-500 to-orange-500 rounded-full flex items-center justify-center">
                    <FaEnvelope className="text-white text-xs" />
                  </div>
                  <div className="ml-3">
                    <div className="text-sm font-medium text-gray-900 truncate max-w-[200px]">
                      {sub.email}
                    </div>
                  </div>
                </div>
                <button
                  onClick={() => handleDelete(sub._id)}
                  disabled={deletingId === sub._id}
                  className="text-red-500 hover:text-red-700 transition-colors duration-200 disabled:opacity-50"
                >
                  {deletingId === sub._id ? (
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-red-500"></div>
                  ) : (
                    <FaTrashAlt />
                  )}
                </button>
              </div>
              <div className="text-xs text-gray-500">
                Subscribed: {new Date(sub.createdAt).toLocaleString()}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default SubscribersAdmin;