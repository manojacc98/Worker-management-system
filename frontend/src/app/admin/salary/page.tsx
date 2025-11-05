'use client';

import { useEffect, useState } from 'react';
import AdminLayout from '@/components/AdminLayout';
import { workerApi, salaryApi, adminApi, Worker, Salary, Advance } from '@/lib/api';
import { format } from 'date-fns';

export default function AdminSalary() {
  const [workers, setWorkers] = useState<Worker[]>([]);
  const [selectedWorker, setSelectedWorker] = useState<string>('');
  const [salaries, setSalaries] = useState<Salary[]>([]);
  const [advances, setAdvances] = useState<Advance[]>([]);
  const [loading, setLoading] = useState(true);
  const [showSalaryModal, setShowSalaryModal] = useState(false);
  const [showAdvanceModal, setShowAdvanceModal] = useState(false);
  const [cycleType, setCycleType] = useState<'weekly' | 'monthly'>('monthly');
  const [formData, setFormData] = useState({
    endDate: format(new Date(), 'yyyy-MM-dd'),
    notes: '',
  });
  const [advanceFormData, setAdvanceFormData] = useState({
    amount: '',
    date: format(new Date(), 'yyyy-MM-dd'),
    notes: '',
  });

  useEffect(() => {
    fetchWorkers();
  }, []);

  useEffect(() => {
    if (selectedWorker) {
      fetchSalaries();
      fetchAdvances();
    }
  }, [selectedWorker]);

  const fetchWorkers = async () => {
    try {
      const response = await workerApi.getAll();
      setWorkers(response.data);
      if (response.data.length > 0 && !selectedWorker) {
        setSelectedWorker(response.data[0]._id);
      }
    } catch (error) {
      console.error('Error fetching workers:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchSalaries = async () => {
    if (!selectedWorker) return;
    try {
      const response = await salaryApi.getByWorkerId(selectedWorker);
      setSalaries(response.data);
    } catch (error) {
      console.error('Error fetching salaries:', error);
    }
  };

  const fetchAdvances = async () => {
    if (!selectedWorker) return;
    try {
      const response = await salaryApi.getAdvances(selectedWorker);
      setAdvances(response.data);
    } catch (error) {
      console.error('Error fetching advances:', error);
    }
  };

  const handleCreateSalary = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedWorker) {
      alert('Please select a worker');
      return;
    }
    try {
      await salaryApi.create({
        workerId: selectedWorker,
        cycleType,
        endDate: formData.endDate,
        notes: formData.notes,
      });
      setShowSalaryModal(false);
      setFormData({ endDate: format(new Date(), 'yyyy-MM-dd'), notes: '' });
      fetchSalaries();
    } catch (error: any) {
      alert(error.response?.data?.error || 'Failed to create salary record');
    }
  };

  const handleCreateAdvance = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedWorker) {
      alert('Please select a worker');
      return;
    }
    try {
      await salaryApi.createAdvance({
        workerId: selectedWorker,
        amount: parseFloat(advanceFormData.amount),
        date: advanceFormData.date,
        notes: advanceFormData.notes,
      });
      setShowAdvanceModal(false);
      setAdvanceFormData({ amount: '', date: format(new Date(), 'yyyy-MM-dd'), notes: '' });
      fetchAdvances();
      fetchSalaries();
    } catch (error: any) {
      alert(error.response?.data?.error || 'Failed to create advance');
    }
  };

  const handleMarkPaid = async (id: string) => {
    if (!confirm('Mark this salary as paid?')) return;
    try {
      await salaryApi.markPaid(id);
      fetchSalaries();
    } catch (error: any) {
      alert(error.response?.data?.error || 'Failed to update salary');
    }
  };

  const handleExport = async (type: 'payroll' | 'attendance' | 'pending-work') => {
    try {
      const params: any = {};
      if (selectedWorker) params.workerId = selectedWorker;
      const response = await adminApi.exportReport(type, params);
      
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `${type}-${Date.now()}.csv`);
      document.body.appendChild(link);
      link.click();
      link.remove();
    } catch (error: any) {
      alert(error.response?.data?.error || 'Failed to export report');
    }
  };

  const selectedWorkerData = workers.find((w) => w._id === selectedWorker);

  return (
    <AdminLayout>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Salary Management</h1>
          <div className="flex space-x-4">
            <button
              onClick={() => handleExport('payroll')}
              className="bg-green-600 hover:bg-green-700 text-white font-semibold py-2 px-4 rounded-lg"
            >
              Export Payroll
            </button>
            <button
              onClick={() => handleExport('attendance')}
              className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded-lg"
            >
              Export Attendance
            </button>
            <button
              onClick={() => handleExport('pending-work')}
              className="bg-yellow-600 hover:bg-yellow-700 text-white font-semibold py-2 px-4 rounded-lg"
            >
              Export Pending Work
            </button>
          </div>
        </div>

        {/* Worker Selection */}
        <div className="bg-white rounded-lg shadow p-6 mb-6">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Select Worker
          </label>
          <select
            value={selectedWorker}
            onChange={(e) => setSelectedWorker(e.target.value)}
            className="w-full max-w-md px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
          >
            {workers.map((worker) => (
              <option key={worker._id} value={worker._id}>
                {worker.name} - ₹{worker.hourlyRate}/hour
              </option>
            ))}
          </select>
        </div>

        {selectedWorkerData && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
            {/* Salary Actions */}
            <div className="bg-white rounded-lg shadow p-6">
              <h2 className="text-xl font-bold text-gray-900 mb-4">Salary Actions</h2>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Salary Cycle Type
                  </label>
                  <div className="flex space-x-4">
                    <label className="flex items-center">
                      <input
                        type="radio"
                        value="weekly"
                        checked={cycleType === 'weekly'}
                        onChange={(e) => setCycleType(e.target.value as 'weekly' | 'monthly')}
                        className="mr-2"
                      />
                      Weekly
                    </label>
                    <label className="flex items-center">
                      <input
                        type="radio"
                        value="monthly"
                        checked={cycleType === 'monthly'}
                        onChange={(e) => setCycleType(e.target.value as 'weekly' | 'monthly')}
                        className="mr-2"
                      />
                      Monthly
                    </label>
                  </div>
                </div>
                <button
                  onClick={() => setShowSalaryModal(true)}
                  className="w-full bg-primary-600 hover:bg-primary-700 text-white font-semibold py-2 px-4 rounded-lg"
                >
                  Calculate Salary
                </button>
                <button
                  onClick={() => setShowAdvanceModal(true)}
                  className="w-full bg-yellow-600 hover:bg-yellow-700 text-white font-semibold py-2 px-4 rounded-lg"
                >
                  Add Advance
                </button>
              </div>
            </div>

            {/* Worker Info */}
            <div className="bg-white rounded-lg shadow p-6">
              <h2 className="text-xl font-bold text-gray-900 mb-4">Worker Information</h2>
              <div className="space-y-2">
                <p className="text-gray-700">
                  <span className="font-medium">Name:</span> {selectedWorkerData.name}
                </p>
                <p className="text-gray-700">
                  <span className="font-medium">Hourly Rate:</span> ₹{selectedWorkerData.hourlyRate}
                </p>
                <p className="text-gray-700">
                  <span className="font-medium">Work Hours:</span> {selectedWorkerData.startTime} - {selectedWorkerData.endTime}
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Advances */}
        {advances.length > 0 && (
          <div className="bg-white rounded-lg shadow p-6 mb-6">
            <h2 className="text-xl font-bold text-gray-900 mb-4">Advances</h2>
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Date
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Amount
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Notes
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {advances.map((advance) => (
                    <tr key={advance._id}>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {format(new Date(advance.date), 'MMM dd, yyyy')}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                        ₹{advance.amount.toFixed(2)}
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-500">
                        {advance.notes || '-'}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Salary History */}
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-xl font-bold text-gray-900 mb-4">Salary History</h2>
          {salaries.length === 0 ? (
            <p className="text-gray-600">No salary records yet</p>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Period
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Hours
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Gross
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Advances
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Net
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Status
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {salaries.map((salary) => (
                    <tr key={salary._id}>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {format(new Date(salary.startDate), 'MMM dd')} - {format(new Date(salary.endDate), 'MMM dd, yyyy')}
                        <br />
                        <span className="text-xs text-gray-500">{salary.cycleType}</span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {salary.totalHours.toFixed(2)}h
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                        ₹{salary.grossSalary.toFixed(2)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        ₹{salary.advances.toFixed(2)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-bold text-gray-900">
                        ₹{salary.netSalary.toFixed(2)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span
                          className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                            salary.status === 'paid'
                              ? 'bg-green-100 text-green-800'
                              : 'bg-yellow-100 text-yellow-800'
                          }`}
                        >
                          {salary.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        {salary.status === 'pending' && (
                          <button
                            onClick={() => handleMarkPaid(salary._id)}
                            className="text-green-600 hover:text-green-900"
                          >
                            Mark Paid
                          </button>
                        )}
                        {salary.status === 'paid' && salary.paidAt && (
                          <span className="text-gray-500 text-xs">
                            Paid: {format(new Date(salary.paidAt), 'MMM dd, yyyy')}
                          </span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Salary Modal */}
        {showSalaryModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">Calculate Salary</h2>
              <form onSubmit={handleCreateSalary} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    End Date *
                  </label>
                  <input
                    type="date"
                    required
                    value={formData.endDate}
                    onChange={(e) => setFormData({ ...formData, endDate: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Notes
                  </label>
                  <textarea
                    value={formData.notes}
                    onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                    rows={3}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  />
                </div>
                <div className="flex space-x-4">
                  <button
                    type="button"
                    onClick={() => setShowSalaryModal(false)}
                    className="flex-1 bg-gray-200 hover:bg-gray-300 text-gray-800 font-medium py-2 px-4 rounded-lg"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="flex-1 bg-primary-600 hover:bg-primary-700 text-white font-medium py-2 px-4 rounded-lg"
                  >
                    Calculate
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Advance Modal */}
        {showAdvanceModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">Add Advance</h2>
              <form onSubmit={handleCreateAdvance} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Amount *
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    required
                    value={advanceFormData.amount}
                    onChange={(e) => setAdvanceFormData({ ...advanceFormData, amount: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Date *
                  </label>
                  <input
                    type="date"
                    required
                    value={advanceFormData.date}
                    onChange={(e) => setAdvanceFormData({ ...advanceFormData, date: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Notes
                  </label>
                  <textarea
                    value={advanceFormData.notes}
                    onChange={(e) => setAdvanceFormData({ ...advanceFormData, notes: e.target.value })}
                    rows={3}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  />
                </div>
                <div className="flex space-x-4">
                  <button
                    type="button"
                    onClick={() => setShowAdvanceModal(false)}
                    className="flex-1 bg-gray-200 hover:bg-gray-300 text-gray-800 font-medium py-2 px-4 rounded-lg"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="flex-1 bg-yellow-600 hover:bg-yellow-700 text-white font-medium py-2 px-4 rounded-lg"
                  >
                    Add Advance
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </AdminLayout>
  );
}

