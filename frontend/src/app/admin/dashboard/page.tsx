'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import AdminLayout from '@/components/AdminLayout';
import { adminApi, updateApi, Update } from '@/lib/api';
import { format } from 'date-fns';
import Image from 'next/image';

interface DashboardData {
  totalWorkers: number;
  recentUpdates: Update[];
  pendingWorkCount: number;
  pendingSalaries: number;
  pendingSalaryAmount: number;
}

export default function AdminDashboard() {
  const [data, setData] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboard();
  }, []);

  const fetchDashboard = async () => {
    try {
      const response = await adminApi.getDashboard();
      setData(response.data);
    } catch (error) {
      console.error('Error fetching dashboard:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <AdminLayout>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <p className="text-gray-600">Loading dashboard...</p>
        </div>
      </AdminLayout>
    );
  }

  if (!data) {
    return (
      <AdminLayout>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <p className="text-gray-600">Error loading dashboard</p>
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">Dashboard</h1>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Link href="/admin/workers">
            <div className="bg-white rounded-lg shadow p-6 hover:shadow-lg transition-all duration-200 cursor-pointer hover:bg-gray-50 transform hover:-translate-y-1">
              <h3 className="text-sm font-medium text-gray-500">Total Workers</h3>
              <p className="text-3xl font-bold text-gray-900 mt-2">{data.totalWorkers}</p>
            </div>
          </Link>
          <Link href="/admin/updates?pending=true">
            <div className="bg-white rounded-lg shadow p-6 hover:shadow-lg transition-all duration-200 cursor-pointer hover:bg-gray-50 transform hover:-translate-y-1">
              <h3 className="text-sm font-medium text-gray-500">Pending Work</h3>
              <p className="text-3xl font-bold text-yellow-600 mt-2">{data.pendingWorkCount}</p>
            </div>
          </Link>
          <Link href="/admin/salary">
            <div className="bg-white rounded-lg shadow p-6 hover:shadow-lg transition-all duration-200 cursor-pointer hover:bg-gray-50 transform hover:-translate-y-1">
              <h3 className="text-sm font-medium text-gray-500">Pending Salaries</h3>
              <p className="text-3xl font-bold text-blue-600 mt-2">{data.pendingSalaries}</p>
            </div>
          </Link>
          <Link href="/admin/salary">
            <div className="bg-white rounded-lg shadow p-6 hover:shadow-lg transition-all duration-200 cursor-pointer hover:bg-gray-50 transform hover:-translate-y-1">
              <h3 className="text-sm font-medium text-gray-500">Pending Amount</h3>
              <p className="text-3xl font-bold text-green-600 mt-2">
                ₹{data.pendingSalaryAmount.toFixed(2)}
              </p>
            </div>
          </Link>
        </div>

        {/* Recent Updates */}
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Recent Updates</h2>
          {data.recentUpdates.length === 0 ? (
            <p className="text-gray-600">No updates yet</p>
          ) : (
            <div className="space-y-4">
              {data.recentUpdates.map((update) => (
                <div key={update._id} className="border-b border-gray-200 pb-4 last:border-0">
                  <div className="flex items-start space-x-4">
                    <div className="relative w-12 h-12 rounded-full overflow-hidden bg-gray-200 flex-shrink-0">
                      {update.workerId.photo ? (
                        <Image
                          src={`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000'}${update.workerId.photo}`}
                          alt={update.workerId.name}
                          fill
                          className="object-cover"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-xl text-gray-400">
                          👤
                        </div>
                      )}
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center justify-between mb-1">
                        <h3 className="font-semibold text-gray-900">{update.workerId.name}</h3>
                        <span className="text-sm text-gray-500">
                          {format(new Date(update.createdAt), 'MMM dd, yyyy HH:mm')}
                        </span>
                      </div>
                      <p className="text-gray-700 mb-2">{update.comment}</p>
                      {update.hasPendingWork && (
                        <span className="inline-block px-2 py-1 bg-yellow-100 text-yellow-800 text-xs rounded-full">
                          Pending Work
                        </span>
                      )}
                      {update.images.length > 0 && (
                        <div className="grid grid-cols-3 gap-2 mt-2">
                          {update.images.slice(0, 3).map((image, idx) => (
                            <div key={idx} className="relative aspect-square rounded overflow-hidden">
                              <Image
                                src={`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000'}${image}`}
                                alt={`Update ${idx + 1}`}
                                fill
                                className="object-cover"
                              />
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </AdminLayout>
  );
}

