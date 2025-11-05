'use client';

import { Suspense, useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import AdminLayout from '@/components/AdminLayout';
import { updateApi, Update } from '@/lib/api';
import { format } from 'date-fns';
import Image from 'next/image';

function UpdatesContent() {
  const searchParams = useSearchParams();
  const [updates, setUpdates] = useState<Update[]>([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({
    workerId: '',
    date: '',
    pendingOnly: false,
  });

  useEffect(() => {
    // Check if pending query parameter is present
    const pendingParam = searchParams.get('pending');
    if (pendingParam === 'true') {
      setFilters((prev) => ({ ...prev, pendingOnly: true }));
    }
  }, [searchParams]);

  useEffect(() => {
    fetchUpdates();
  }, [filters]);

  const fetchUpdates = async () => {
    try {
      const params: any = {};
      if (filters.workerId) params.workerId = filters.workerId;
      if (filters.date) params.date = filters.date;

      const response = await updateApi.getAll(params);
      let filteredUpdates = response.data;
      
      // Filter by pending work if enabled
      if (filters.pendingOnly) {
        filteredUpdates = filteredUpdates.filter((update: Update) => update.hasPendingWork);
      }
      
      setUpdates(filteredUpdates);
    } catch (error) {
      console.error('Error fetching updates:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <AdminLayout>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">Worker Updates</h1>

        {/* Filters */}
        <div className="bg-white rounded-lg shadow p-4 mb-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Filter by Worker ID
              </label>
              <input
                type="text"
                value={filters.workerId}
                onChange={(e) => setFilters({ ...filters, workerId: e.target.value })}
                placeholder="Enter worker ID"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Filter by Date
              </label>
              <input
                type="date"
                value={filters.date}
                onChange={(e) => setFilters({ ...filters, date: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              />
            </div>
            <div className="flex items-end">
              <label className="flex items-center space-x-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={filters.pendingOnly}
                  onChange={(e) => setFilters({ ...filters, pendingOnly: e.target.checked })}
                  className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
                />
                <span className="text-sm font-medium text-gray-700">Show Pending Work Only</span>
              </label>
            </div>
          </div>
        </div>

        {loading ? (
          <p className="text-gray-600">Loading updates...</p>
        ) : updates.length === 0 ? (
          <div className="bg-white rounded-lg shadow p-6 text-center">
            <p className="text-gray-600">No updates found</p>
          </div>
        ) : (
          <div className="space-y-4">
            {updates.map((update) => (
              <div key={update._id} className="bg-white rounded-lg shadow p-6">
                <div className="flex items-start space-x-4">
                  <div className="relative w-16 h-16 rounded-full overflow-hidden bg-gray-200 flex-shrink-0">
                    {update.workerId.photo ? (
                      <Image
                        src={`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000'}${update.workerId.photo}`}
                        alt={update.workerId.name}
                        fill
                        className="object-cover"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-2xl text-gray-400">
                        👤
                      </div>
                    )}
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center justify-between mb-2">
                      <h3 className="text-lg font-semibold text-gray-900">
                        {update.workerId.name}
                      </h3>
                      <div className="flex items-center space-x-4">
                        <span className="text-sm text-gray-500">
                          {format(new Date(update.date), 'MMM dd, yyyy')}
                        </span>
                        {update.hasPendingWork && (
                          <span className="px-3 py-1 bg-yellow-100 text-yellow-800 text-sm rounded-full">
                            Pending Work
                          </span>
                        )}
                      </div>
                    </div>
                    <p className="text-gray-700 mb-3">{update.comment}</p>
                    {update.images.length > 0 && (
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-2 mt-4">
                        {update.images.map((image, idx) => (
                          <div key={idx} className="relative aspect-square rounded overflow-hidden">
                            <Image
                              src={`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000'}${image}`}
                              alt={`Update image ${idx + 1}`}
                              fill
                              className="object-cover"
                            />
                          </div>
                        ))}
                      </div>
                    )}
                    <p className="text-xs text-gray-500 mt-3">
                      Submitted: {format(new Date(update.createdAt), 'MMM dd, yyyy HH:mm')}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </AdminLayout>
  );
}

export default function AdminUpdates() {
  return (
    <Suspense fallback={
      <AdminLayout>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <p className="text-gray-600">Loading...</p>
        </div>
      </AdminLayout>
    }>
      <UpdatesContent />
    </Suspense>
  );
}
