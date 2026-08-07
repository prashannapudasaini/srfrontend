import React, { useState, useEffect } from 'react';
import api from '../services/api';

export default function DeliveryManagement() {
  // Default selected date to Today in YYYY-MM-DD format (e.g., '2026-08-07')
  const getTodayString = () => {
    const today = new Date();
    return today.toISOString().split('T')[0];
  };

  const [activeTab, setActiveTab] = useState('orders'); // 'orders' | 'subscriptions'
  const [selectedDate, setSelectedDate] = useState(getTodayString());
  const [orders, setOrders] = useState([]);
  const [subscriptions, setSubscriptions] = useState([]);
  const [drivers, setDrivers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState(null);
  
  const [selectedAssignments, setSelectedAssignments] = useState({});

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    setErrorMsg(null);
    try {
      const delRes = await api.get('admin/get_all_deliveries.php');
      if (delRes.data.status === 'success') {
        const payload = delRes.data.data || {};
        setOrders(payload.orders || []);
        setSubscriptions(payload.subscriptions || []);
      } else {
        setErrorMsg(delRes.data.message || "Failed to load delivery records.");
      }

      const driverRes = await api.get('admin/get_drivers.php');
      if (driverRes.data.status === 'success') {
        setDrivers(driverRes.data.data || []);
      }
    } catch (error) {
      console.error("Error fetching delivery data:", error);
      setErrorMsg(error.message || "Network error while reaching backend.");
    } finally {
      setLoading(false);
    }
  };

  const handleDropdownChange = (taskId, driverId) => {
    setSelectedAssignments(prev => ({
      ...prev,
      [taskId]: driverId
    }));
  };

  const handleAssignDriver = async (taskId) => {
    const driverId = selectedAssignments[taskId];
    if (!driverId) {
      alert("Please select a driver from the dropdown first.");
      return;
    }

    try {
      const res = await api.post('admin/assign_driver.php', {
        task_id: taskId,
        driver_id: driverId
      });

      if (res.data.status === 'success') {
        alert("Driver assigned successfully!");
        fetchData();
      } else {
        alert(res.data.message || "Failed to assign driver.");
      }
    } catch (error) {
      console.error("Assignment error:", error);
      alert("Network error. Could not assign driver.");
    }
  };

  // Helper to change date by X days (e.g., -1 for Yesterday, -2 for 2 Days Ago)
  const setRelativeDate = (daysOffset) => {
    const d = new Date();
    d.setDate(d.getDate() + daysOffset);
    setSelectedDate(d.toISOString().split('T')[0]);
  };

  // Filter Normal Orders by exact created_at Calendar Date (YYYY-MM-DD)
  const filteredOrders = orders.filter(o => o.order_date === selectedDate);

  // Filter Subscriptions based on whether the selected date's Day Name is in their schedule
  const getDayNameFromDate = (dateStr) => {
    const d = new Date(dateStr + 'T00:00:00');
    return d.toLocaleDateString('en-US', { weekday: 'long' });
  };
  const selectedDayName = getDayNameFromDate(selectedDate);
  
  const filteredSubscriptions = subscriptions.filter(s => {
    const days = s.scheduled_days || [];
    return days.includes(selectedDayName);
  });

  if (loading) {
    return (
      <div className="p-8 flex justify-center items-center h-full">
        <div className="text-gray-600 font-semibold animate-pulse">Loading Delivery Data...</div>
      </div>
    );
  }

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Delivery & Routing Management</h1>
        <button 
          onClick={fetchData} 
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-medium transition-colors shadow-sm"
        >
          Refresh Data
        </button>
      </div>

      {errorMsg && (
        <div className="mb-6 p-4 bg-red-100 border-l-4 border-red-500 text-red-700 rounded shadow-sm">
          <p className="font-bold">Backend Database Message:</p>
          <p className="text-sm mt-1">{errorMsg}</p>
        </div>
      )}

      {/* TOP CATEGORY TAB BAR */}
      <div className="flex border-b border-gray-200 bg-white rounded-t-xl px-4 pt-4">
        <button
          onClick={() => setActiveTab('orders')}
          className={`py-3 px-6 font-bold text-sm border-b-2 transition-colors ${
            activeTab === 'orders'
              ? 'border-blue-600 text-blue-600'
              : 'border-transparent text-gray-500 hover:text-gray-700'
          }`}
        >
          Normal Orders ({filteredOrders.length})
        </button>
        <button
          onClick={() => setActiveTab('subscriptions')}
          className={`py-3 px-6 font-bold text-sm border-b-2 transition-colors ${
            activeTab === 'subscriptions'
              ? 'border-purple-600 text-purple-600'
              : 'border-transparent text-gray-500 hover:text-gray-700'
          }`}
        >
          Routine Subscriptions ({filteredSubscriptions.length})
        </button>
      </div>

      {/* 🔥 EXACT CALENDAR DATE FILTER BAR */}
      <div className="bg-white px-6 py-4 border-b border-gray-200 flex flex-wrap gap-3 items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="text-xs font-bold uppercase text-gray-400">Showing Deliveries For:</span>
          <input
            type="date"
            value={selectedDate}
            onChange={(e) => setSelectedDate(e.target.value)}
            className="border border-gray-300 rounded-lg px-3 py-1.5 text-sm font-bold text-gray-800 bg-gray-50 focus:outline-none focus:border-blue-600"
          />
          <span className="text-xs font-semibold text-gray-500">({selectedDayName})</span>
        </div>

        {/* Quick Date Shortcuts */}
        <div className="flex gap-2">
          <button
            onClick={() => setRelativeDate(0)}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-colors ${
              selectedDate === getTodayString()
                ? 'bg-blue-600 text-white shadow-sm'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            Today
          </button>
          <button
            onClick={() => setRelativeDate(-1)}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-colors ${
              selectedDate === (() => { const d = new Date(); d.setDate(d.getDate() - 1); return d.toISOString().split('T')[0]; })()
                ? 'bg-blue-600 text-white shadow-sm'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            Yesterday
          </button>
          <button
            onClick={() => setRelativeDate(-2)}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-colors ${
              selectedDate === (() => { const d = new Date(); d.setDate(d.getDate() - 2); return d.toISOString().split('T')[0]; })()
                ? 'bg-blue-600 text-white shadow-sm'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            2 Days Ago
          </button>
        </div>
      </div>

      {/* NORMAL ORDERS TABLE */}
      {activeTab === 'orders' && (
        <div className="bg-white rounded-b-xl shadow-sm border border-t-0 border-gray-200 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-gray-100 text-gray-600 uppercase text-xs font-bold tracking-wider">
                  <th className="p-4 border-b">Order ID</th>
                  <th className="p-4 border-b">Customer & Contact</th>
                  <th className="p-4 border-b">Date Placed</th>
                  <th className="p-4 border-b">Amount</th>
                  <th className="p-4 border-b">Status</th>
                  <th className="p-4 border-b">Assigned Driver</th>
                  <th className="p-4 border-b text-center">Action</th>
                </tr>
              </thead>
              <tbody className="text-sm">
                {filteredOrders.map((task) => (
                  <tr key={task.task_id} className="border-b hover:bg-gray-50 transition-colors">
                    <td className="p-4 font-bold text-gray-800">{task.task_id}</td>
                    <td className="p-4">
                      <div className="font-semibold text-gray-800">{task.customer}</div>
                      <div className="text-gray-500 text-xs mt-1">{task.address}</div>
                      <div className="text-gray-500 text-xs">{task.phone}</div>
                    </td>
                    <td className="p-4 font-semibold text-gray-600">
                      {task.order_date} ({task.day_name})
                    </td>
                    <td className="p-4 font-bold text-gray-800">NPR {task.amount}</td>
                    <td className="p-4">
                      <span className="px-2 py-1 rounded-full text-xs font-bold bg-blue-100 text-blue-800">
                        {task.status}
                      </span>
                    </td>
                    <td className="p-4">
                      {task.driver_id ? (
                        <div className="font-semibold text-green-700 mb-2">✓ {task.driver_name}</div>
                      ) : (
                        <div className="text-red-500 font-semibold mb-2">Unassigned</div>
                      )}
                      <select 
                        className="w-full border border-gray-300 rounded-md p-1.5 text-xs text-gray-700 bg-white"
                        value={selectedAssignments[task.task_id] || ""}
                        onChange={(e) => handleDropdownChange(task.task_id, e.target.value)}
                      >
                        <option value="" disabled>Select Driver...</option>
                        {drivers.map(driver => (
                          <option key={driver.id} value={driver.id}>{driver.name} (ID: {driver.id})</option>
                        ))}
                      </select>
                    </td>
                    <td className="p-4 text-center">
                      <button
                        onClick={() => handleAssignDriver(task.task_id)}
                        disabled={!selectedAssignments[task.task_id]}
                        className={`px-4 py-2 rounded-lg text-xs font-bold text-white transition-colors w-full ${
                          selectedAssignments[task.task_id] 
                            ? 'bg-blue-600 hover:bg-blue-700 shadow-sm' 
                            : 'bg-gray-300 cursor-not-allowed'
                        }`}
                      >
                        {task.driver_id ? 'Re-Assign' : 'Assign'}
                      </button>
                    </td>
                  </tr>
                ))}
                {filteredOrders.length === 0 && (
                  <tr>
                    <td colSpan="7" className="p-8 text-center text-gray-500">
                      No normal orders found for date: <span className="font-bold text-gray-700">{selectedDate}</span>.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* ROUTINE SUBSCRIPTIONS TABLE */}
      {activeTab === 'subscriptions' && (
        <div className="bg-white rounded-b-xl shadow-sm border border-t-0 border-gray-200 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-gray-100 text-gray-600 uppercase text-xs font-bold tracking-wider">
                  <th className="p-4 border-b">Subscription ID</th>
                  <th className="p-4 border-b">Customer & Location</th>
                  <th className="p-4 border-b">Delivery Days</th>
                  <th className="p-4 border-b">Plan Details</th>
                  <th className="p-4 border-b">Status</th>
                  <th className="p-4 border-b">Assigned Driver</th>
                  <th className="p-4 border-b text-center">Action</th>
                </tr>
              </thead>
              <tbody className="text-sm">
                {filteredSubscriptions.map((task) => (
                  <tr key={task.task_id} className="border-b hover:bg-gray-50 transition-colors">
                    <td className="p-4 font-bold text-purple-700">{task.task_id}</td>
                    <td className="p-4">
                      <div className="font-semibold text-gray-800">{task.customer}</div>
                      <div className="text-gray-500 text-xs mt-1">{task.address}</div>
                      <div className="text-gray-500 text-xs">{task.phone}</div>
                    </td>
                    <td className="p-4">
                      <div className="flex flex-wrap gap-1">
                        {(task.scheduled_days || []).map(d => (
                          <span key={d} className="px-1.5 py-0.5 rounded text-xs font-semibold bg-purple-50 text-purple-700 border border-purple-100">
                            {d.substring(0, 3)}
                          </span>
                        ))}
                      </div>
                    </td>
                    <td className="p-4">
                      <div className="font-semibold text-gray-700">{task.plan_type} Plan</div>
                      <div className="text-xs text-gray-500 mt-0.5">Time: {task.delivery_time}</div>
                    </td>
                    <td className="p-4">
                      <span className="px-2 py-1 rounded-full text-xs font-bold bg-green-100 text-green-800">
                        {task.status}
                      </span>
                    </td>
                    <td className="p-4">
                      {task.driver_id ? (
                        <div className="font-semibold text-green-700 mb-2">✓ {task.driver_name}</div>
                      ) : (
                        <div className="text-red-500 font-semibold mb-2">Unassigned</div>
                      )}
                      <select 
                        className="w-full border border-gray-300 rounded-md p-1.5 text-xs text-gray-700 bg-white"
                        value={selectedAssignments[task.task_id] || ""}
                        onChange={(e) => handleDropdownChange(task.task_id, e.target.value)}
                      >
                        <option value="" disabled>Select Driver...</option>
                        {drivers.map(driver => (
                          <option key={driver.id} value={driver.id}>{driver.name} (ID: {driver.id})</option>
                        ))}
                      </select>
                    </td>
                    <td className="p-4 text-center">
                      <button
                        onClick={() => handleAssignDriver(task.task_id)}
                        disabled={!selectedAssignments[task.task_id]}
                        className={`px-4 py-2 rounded-lg text-xs font-bold text-white transition-colors w-full ${
                          selectedAssignments[task.task_id] 
                            ? 'bg-purple-600 hover:bg-purple-700 shadow-sm' 
                            : 'bg-gray-300 cursor-not-allowed'
                        }`}
                      >
                        {task.driver_id ? 'Re-Assign' : 'Assign'}
                      </button>
                    </td>
                  </tr>
                ))}
                {filteredSubscriptions.length === 0 && (
                  <tr>
                    <td colSpan="7" className="p-8 text-center text-gray-500">
                      No active subscriptions scheduled to deliver on <span className="font-bold text-gray-700">{selectedDayName}</span> ({selectedDate}).
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}