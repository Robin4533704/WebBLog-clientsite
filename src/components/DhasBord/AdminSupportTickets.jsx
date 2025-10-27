import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { 
  FaHeadset, FaEnvelope, FaSearch, FaFilter, FaEdit, FaTrash, 
  FaCheckCircle, FaTimes, FaClock, FaExclamationTriangle,
  FaEye, FaReply, FaSort, FaSortUp, FaSortDown
} from "react-icons/fa";
import useAxios from "../../hook/useAxios";
import { toast } from "react-hot-toast";

const AdminSupportTickets = () => {
  const [tickets, setTickets] = useState([]);
  const [filteredTickets, setFilteredTickets] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [priorityFilter, setPriorityFilter] = useState("all");
  const [selectedTicket, setSelectedTicket] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [sortField, setSortField] = useState("createdAt");
  const [sortDirection, setSortDirection] = useState("desc");
  
  const { sendRequest } = useAxios();

  // Status options
  const statusOptions = [
    { value: "all", label: "All Status", color: "gray" },
    { value: "open", label: "Open", color: "green" },
    { value: "in-progress", label: "In Progress", color: "blue" },
    { value: "resolved", label: "Resolved", color: "purple" },
    { value: "closed", label: "Closed", color: "gray" }
  ];

  // Priority options
  const priorityOptions = [
    { value: "all", label: "All Priority" },
    { value: "low", label: "Low" },
    { value: "medium", label: "Medium" },
    { value: "high", label: "High" },
    { value: "urgent", label: "Urgent" }
  ];

  // ✅ Fetch all tickets for admin
  const fetchAllTickets = async () => {
    setIsLoading(true);
    setError("");
    try {
      const response = await sendRequest("/support/tickets", {
        method: "GET"
        // Admin er khetre email filter na diye shob ticket anbe
      });
      
      if (response.success) {
        setTickets(response.tickets || []);
        setFilteredTickets(response.tickets || []);
      } else {
        setError(response.message || "Failed to fetch tickets");
      }
    } catch (error) {
      console.error("❌ Error fetching tickets:", error);
      setError("Unable to load support tickets. Please try again.");
      toast.error("Failed to load tickets");
    } finally {
      setIsLoading(false);
    }
  };

  // ✅ Update ticket status
  const updateTicketStatus = async (ticketId, newStatus) => {
    try {
      const response = await sendRequest(`/support/tickets/${ticketId}`, {
        method: "PUT",
        data: { status: newStatus }
      });

      if (response.success) {
        // Update local state
        setTickets(prev => prev.map(ticket => 
          ticket._id === ticketId 
            ? { ...ticket, status: newStatus, updatedAt: new Date() }
            : ticket
        ));
        
        toast.success(`Ticket status updated to ${newStatus}`);
        fetchAllTickets(); // Refresh data
      }
    } catch (error) {
      console.error("❌ Error updating ticket:", error);
      toast.error("Failed to update ticket status");
    }
  };

  // ✅ Delete ticket
  const deleteTicket = async (ticketId) => {
    if (!window.confirm("Are you sure you want to delete this ticket? This action cannot be undone.")) {
      return;
    }

    try {
      const response = await sendRequest(`/support/tickets/${ticketId}`, {
        method: "DELETE"
      });

      if (response.success) {
        setTickets(prev => prev.filter(ticket => ticket._id !== ticketId));
        toast.success("Ticket deleted successfully");
        fetchAllTickets(); // Refresh data
      }
    } catch (error) {
      console.error("❌ Error deleting ticket:", error);
      toast.error("Failed to delete ticket");
    }
  };

  // ✅ Filter and search tickets
  useEffect(() => {
    let filtered = tickets;

    // Search filter
    if (searchTerm) {
      filtered = filtered.filter(ticket =>
        ticket.subject.toLowerCase().includes(searchTerm.toLowerCase()) ||
        ticket.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        ticket.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        ticket.ticketNumber.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Status filter
    if (statusFilter !== "all") {
      filtered = filtered.filter(ticket => ticket.status === statusFilter);
    }

    // Priority filter
    if (priorityFilter !== "all") {
      filtered = filtered.filter(ticket => ticket.priority === priorityFilter);
    }

    // Sorting
    filtered.sort((a, b) => {
      let aValue = a[sortField];
      let bValue = b[sortField];

      if (sortField === "createdAt" || sortField === "updatedAt") {
        aValue = new Date(aValue);
        bValue = new Date(bValue);
      }

      if (sortDirection === "asc") {
        return aValue > bValue ? 1 : -1;
      } else {
        return aValue < bValue ? 1 : -1;
      }
    });

    setFilteredTickets(filtered);
  }, [tickets, searchTerm, statusFilter, priorityFilter, sortField, sortDirection]);

  // Load tickets on component mount
  useEffect(() => {
    fetchAllTickets();
  }, []);

  // ✅ Handle sort
  const handleSort = (field) => {
    if (sortField === field) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc");
    } else {
      setSortField(field);
      setSortDirection("desc");
    }
  };

  // ✅ Get status color
  const getStatusColor = (status) => {
    switch (status) {
      case "open": return "bg-green-100 text-green-800 border-green-200";
      case "in-progress": return "bg-blue-100 text-blue-800 border-blue-200";
      case "resolved": return "bg-purple-100 text-purple-800 border-purple-200";
      case "closed": return "bg-gray-100 text-gray-800 border-gray-200";
      default: return "bg-gray-100 text-gray-800 border-gray-200";
    }
  };

  // ✅ Get priority color
  const getPriorityColor = (priority) => {
    switch (priority) {
      case "low": return "bg-green-100 text-green-800";
      case "medium": return "bg-yellow-100 text-yellow-800";
      case "high": return "bg-orange-100 text-orange-800";
      case "urgent": return "bg-red-100 text-red-800";
      default: return "bg-gray-100 text-gray-800";
    }
  };

  // ✅ Get priority icon
  const getPriorityIcon = (priority) => {
    switch (priority) {
      case "low": return <FaCheckCircle className="text-green-500" />;
      case "medium": return <FaClock className="text-yellow-500" />;
      case "high": return <FaExclamationTriangle className="text-orange-500" />;
      case "urgent": return <FaExclamationTriangle className="text-red-500" />;
      default: return <FaClock className="text-gray-500" />;
    }
  };

  // ✅ Format date
  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  // ✅ Open ticket details modal
  const openTicketDetails = (ticket) => {
    setSelectedTicket(ticket);
    setIsModalOpen(true);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 pt-20 pb-16">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center py-20">
            <div className="w-16 h-16 border-4 border-amber-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
            <p className="text-gray-600 dark:text-gray-400 text-lg">Loading support tickets...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 pt-20 pb-16">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }} 
          animate={{ opacity: 1, y: 0 }} 
          className="text-center mb-8"
        >
          <motion.div 
            initial={{ scale: 0 }} 
            animate={{ scale: 1 }} 
            className="w-16 h-16 mx-auto mb-4 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-2xl flex items-center justify-center shadow-lg shadow-blue-500/25"
          >
            <FaHeadset className="text-2xl text-white" />
          </motion.div>
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-2">
            Support Tickets Management
          </h1>
          <p className="text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
            Manage all customer support tickets in one place
          </p>
        </motion.div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg border border-gray-200 dark:border-gray-700">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Total Tickets</p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">{tickets.length}</p>
              </div>
              <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900 rounded-xl flex items-center justify-center">
                <FaHeadset className="text-xl text-blue-600 dark:text-blue-400" />
              </div>
            </div>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg border border-gray-200 dark:border-gray-700">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Open Tickets</p>
                <p className="text-2xl font-bold text-green-600 dark:text-green-400">
                  {tickets.filter(t => t.status === 'open').length}
                </p>
              </div>
              <div className="w-12 h-12 bg-green-100 dark:bg-green-900 rounded-xl flex items-center justify-center">
                <FaClock className="text-xl text-green-600 dark:text-green-400" />
              </div>
            </div>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg border border-gray-200 dark:border-gray-700">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">In Progress</p>
                <p className="text-2xl font-bold text-blue-600 dark:text-blue-400">
                  {tickets.filter(t => t.status === 'in-progress').length}
                </p>
              </div>
              <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900 rounded-xl flex items-center justify-center">
                <FaEdit className="text-xl text-blue-600 dark:text-blue-400" />
              </div>
            </div>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg border border-gray-200 dark:border-gray-700">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Resolved</p>
                <p className="text-2xl font-bold text-purple-600 dark:text-purple-400">
                  {tickets.filter(t => t.status === 'resolved').length}
                </p>
              </div>
              <div className="w-12 h-12 bg-purple-100 dark:bg-purple-900 rounded-xl flex items-center justify-center">
                <FaCheckCircle className="text-xl text-purple-600 dark:text-purple-400" />
              </div>
            </div>
          </div>
        </div>

        {/* Filters and Search */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg border border-gray-200 dark:border-gray-700 p-6 mb-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            {/* Search */}
            <div className="relative">
              <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Search tickets..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
              />
            </div>

            {/* Status Filter */}
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
            >
              {statusOptions.map(option => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>

            {/* Priority Filter */}
            <select
              value={priorityFilter}
              onChange={(e) => setPriorityFilter(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
            >
              {priorityOptions.map(option => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>

            {/* Refresh Button */}
            <button
              onClick={fetchAllTickets}
              className="px-4 py-2 bg-blue-500 text-white rounded-xl hover:bg-blue-600 transition-colors duration-300 flex items-center justify-center gap-2"
            >
              <FaFilter className="text-sm" />
              Refresh
            </button>
          </div>
        </div>

        {/* Error Message */}
        {error && (
          <motion.div 
            initial={{ opacity: 0, y: -10 }} 
            animate={{ opacity: 1, y: 0 }} 
            className="mb-6 p-4 bg-red-100 border border-red-400 text-red-700 rounded-xl"
          >
            {error}
          </motion.div>
        )}

        {/* Tickets Table */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg border border-gray-200 dark:border-gray-700 overflow-hidden">
          {/* Table Header */}
          <div className="grid grid-cols-12 gap-4 p-6 border-b border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900 font-semibold text-gray-900 dark:text-white">
            <div className="col-span-2 flex items-center gap-2 cursor-pointer" onClick={() => handleSort("ticketNumber")}>
              <span>Ticket ID</span>
              {sortField === "ticketNumber" && (
                sortDirection === "asc" ? <FaSortUp /> : <FaSortDown />
              )}
            </div>
            <div className="col-span-3 flex items-center gap-2 cursor-pointer" onClick={() => handleSort("subject")}>
              <span>Subject</span>
              {sortField === "subject" && (
                sortDirection === "asc" ? <FaSortUp /> : <FaSortDown />
              )}
            </div>
            <div className="col-span-2 flex items-center gap-2 cursor-pointer" onClick={() => handleSort("name")}>
              <span>Customer</span>
              {sortField === "name" && (
                sortDirection === "asc" ? <FaSortUp /> : <FaSortDown />
              )}
            </div>
            <div className="col-span-1 flex items-center gap-2 cursor-pointer" onClick={() => handleSort("priority")}>
              <span>Priority</span>
              {sortField === "priority" && (
                sortDirection === "asc" ? <FaSortUp /> : <FaSortDown />
              )}
            </div>
            <div className="col-span-2 flex items-center gap-2 cursor-pointer" onClick={() => handleSort("status")}>
              <span>Status</span>
              {sortField === "status" && (
                sortDirection === "asc" ? <FaSortUp /> : <FaSortDown />
              )}
            </div>
            <div className="col-span-2 flex items-center gap-2 cursor-pointer" onClick={() => handleSort("createdAt")}>
              <span>Created</span>
              {sortField === "createdAt" && (
                sortDirection === "asc" ? <FaSortUp /> : <FaSortDown />
              )}
            </div>
          </div>

          {/* Table Body */}
          <div className="divide-y divide-gray-200 dark:divide-gray-700">
            {filteredTickets.length === 0 ? (
              <div className="text-center py-12">
                <FaHeadset className="text-4xl text-gray-400 mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-gray-600 dark:text-gray-400 mb-2">
                  No Tickets Found
                </h3>
                <p className="text-gray-500 dark:text-gray-500">
                  {searchTerm || statusFilter !== "all" || priorityFilter !== "all" 
                    ? "Try adjusting your filters" 
                    : "No support tickets have been created yet"}
                </p>
              </div>
            ) : (
              filteredTickets.map((ticket) => (
                <motion.div
                  key={ticket._id}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="grid grid-cols-12 gap-4 p-6 hover:bg-gray-50 dark:hover:bg-gray-900 transition-colors duration-200"
                >
                  {/* Ticket ID */}
                  <div className="col-span-2">
                    <p className="font-mono text-sm text-blue-600 dark:text-blue-400">
                      {ticket.ticketNumber}
                    </p>
                  </div>

                  {/* Subject */}
                  <div className="col-span-3">
                    <p className="font-medium text-gray-900 dark:text-white line-clamp-2">
                      {ticket.subject}
                    </p>
                    <p className="text-sm text-gray-500 dark:text-gray-400 line-clamp-1">
                      {ticket.message.substring(0, 50)}...
                    </p>
                  </div>

                  {/* Customer */}
                  <div className="col-span-2">
                    <p className="font-medium text-gray-900 dark:text-white">
                      {ticket.name}
                    </p>
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      {ticket.email}
                    </p>
                  </div>

                  {/* Priority */}
                  <div className="col-span-1">
                    <span className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${getPriorityColor(ticket.priority)}`}>
                      {getPriorityIcon(ticket.priority)}
                      {ticket.priority}
                    </span>
                  </div>

                  {/* Status */}
                  <div className="col-span-2">
                    <select
                      value={ticket.status}
                      onChange={(e) => updateTicketStatus(ticket._id, e.target.value)}
                      className={`w-full px-3 py-1 rounded-full text-xs font-medium border ${getStatusColor(ticket.status)} focus:ring-2 focus:ring-blue-500`}
                    >
                      <option value="open">Open</option>
                      <option value="in-progress">In Progress</option>
                      <option value="resolved">Resolved</option>
                      <option value="closed">Closed</option>
                    </select>
                  </div>

                  {/* Created Date */}
                  <div className="col-span-1">
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      {formatDate(ticket.createdAt)}
                    </p>
                  </div>

                  {/* Actions */}
                  <div className="col-span-1 flex items-center gap-2">
                    <button
                      onClick={() => openTicketDetails(ticket)}
                      className="p-2 text-blue-600 hover:bg-blue-100 dark:hover:bg-blue-900 rounded-lg transition-colors duration-200"
                      title="View Details"
                    >
                      <FaEye />
                    </button>
                    <button
                      onClick={() => deleteTicket(ticket._id)}
                      className="p-2 text-red-600 hover:bg-red-100 dark:hover:bg-red-900 rounded-lg transition-colors duration-200"
                      title="Delete Ticket"
                    >
                      <FaTrash />
                    </button>
                  </div>
                </motion.div>
              ))
            )}
          </div>
        </div>

        {/* Ticket Details Modal */}
        {isModalOpen && selectedTicket && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto"
            >
              <div className="p-6 border-b border-gray-200 dark:border-gray-700">
                <div className="flex justify-between items-center">
                  <h3 className="text-xl font-bold text-gray-900 dark:text-white">
                    Ticket Details
                  </h3>
                  <button
                    onClick={() => setIsModalOpen(false)}
                    className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors duration-200"
                  >
                    <FaTimes className="text-gray-500" />
                  </button>
                </div>
              </div>

              <div className="p-6 space-y-6">
                {/* Ticket Header */}
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Ticket ID</p>
                    <p className="font-mono text-blue-600 dark:text-blue-400">{selectedTicket.ticketNumber}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Status</p>
                    <select
                      value={selectedTicket.status}
                      onChange={(e) => {
                        updateTicketStatus(selectedTicket._id, e.target.value);
                        setSelectedTicket({...selectedTicket, status: e.target.value});
                      }}
                      className={`w-full px-3 py-1 rounded-full text-sm font-medium border ${getStatusColor(selectedTicket.status)} focus:ring-2 focus:ring-blue-500`}
                    >
                      <option value="open">Open</option>
                      <option value="in-progress">In Progress</option>
                      <option value="resolved">Resolved</option>
                      <option value="closed">Closed</option>
                    </select>
                  </div>
                </div>

                {/* Customer Info */}
                <div>
                  <p className="text-sm font-medium text-gray-600 dark:text-gray-400 mb-2">Customer Information</p>
                  <div className="bg-gray-50 dark:bg-gray-700 rounded-xl p-4">
                    <p className="font-medium text-gray-900 dark:text-white">{selectedTicket.name}</p>
                    <p className="text-gray-600 dark:text-gray-300">{selectedTicket.email}</p>
                  </div>
                </div>

                {/* Ticket Details */}
                <div className="space-y-4">
                  <div>
                    <p className="text-sm font-medium text-gray-600 dark:text-gray-400 mb-1">Subject</p>
                    <p className="text-gray-900 dark:text-white font-medium">{selectedTicket.subject}</p>
                  </div>

                  <div>
                    <p className="text-sm font-medium text-gray-600 dark:text-gray-400 mb-1">Category</p>
                    <span className="inline-block px-3 py-1 bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-200 rounded-full text-sm">
                      {selectedTicket.category}
                    </span>
                  </div>

                  <div>
                    <p className="text-sm font-medium text-gray-600 dark:text-gray-400 mb-1">Priority</p>
                    <span className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-sm font-medium ${getPriorityColor(selectedTicket.priority)}`}>
                      {getPriorityIcon(selectedTicket.priority)}
                      {selectedTicket.priority}
                    </span>
                  </div>

                  <div>
                    <p className="text-sm font-medium text-gray-600 dark:text-gray-400 mb-1">Message</p>
                    <div className="bg-gray-50 dark:bg-gray-700 rounded-xl p-4">
                      <p className="text-gray-900 dark:text-white whitespace-pre-wrap">
                        {selectedTicket.message}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Timestamps */}
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <p className="text-gray-600 dark:text-gray-400">Created</p>
                    <p className="text-gray-900 dark:text-white">{formatDate(selectedTicket.createdAt)}</p>
                  </div>
                  <div>
                    <p className="text-gray-600 dark:text-gray-400">Last Updated</p>
                    <p className="text-gray-900 dark:text-white">{formatDate(selectedTicket.updatedAt)}</p>
                  </div>
                </div>
              </div>

              <div className="p-6 border-t border-gray-200 dark:border-gray-700 flex justify-end gap-3">
                <button
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-xl hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors duration-300"
                >
                  Close
                </button>
                <button
                  onClick={() => {
                    setIsModalOpen(false);
                    deleteTicket(selectedTicket._id);
                  }}
                  className="px-4 py-2 bg-red-500 text-white rounded-xl hover:bg-red-600 transition-colors duration-300 flex items-center gap-2"
                >
                  <FaTrash className="text-sm" />
                  Delete Ticket
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminSupportTickets;