'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { workerApi, Worker } from '@/lib/api';

export default function WorkerDirectory() {
  const [workers, setWorkers] = useState<Worker[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');

  useEffect(() => {
    fetchWorkers();
  }, [search]);

  const fetchWorkers = async () => {
    try {
      setLoading(true);
      const response = await workerApi.getAll({ search: search || undefined });
      setWorkers(response.data);
    } catch (error) {
      console.error('Error fetching workers:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <Link href="/" className="text-primary-600 hover:text-primary-700 font-medium">
            ← Back to Home
          </Link>
          <h1 className="text-4xl font-bold text-gray-900 mt-4">Worker Directory</h1>
        </div>

        <div className="mb-6">
          <input
            type="text"
            placeholder="Search workers..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full max-w-md px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
          />
        </div>

        {loading ? (
          <div className="text-center py-12">
            <p className="text-gray-600">Loading workers...</p>
          </div>
        ) : workers.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-600">No workers found</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {workers.map((worker) => (
              <Link
                key={worker._id}
                href={`/workers/${worker._id}`}
                className="bg-white rounded-lg shadow-md hover:shadow-xl transition-shadow overflow-hidden"
              >
                <div className="aspect-square relative bg-gray-200">
                  {worker.photo ? (
                    <Image
                      src={`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000'}${worker.photo}`}
                      alt={worker.name}
                      fill
                      className="object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-4xl text-gray-400">
                      👤
                    </div>
                  )}
                </div>
                <div className="p-4">
                  <h3 className="text-lg font-semibold text-gray-900">{worker.name}</h3>
                  <p className="text-sm text-gray-600 mt-1">
                    {worker.startTime} - {worker.endTime}
                  </p>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

