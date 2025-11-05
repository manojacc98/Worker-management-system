'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import { workerApi, updateApi, Worker, Update } from '@/lib/api';
import { format } from 'date-fns';

export default function WorkerDetails() {
  const params = useParams();
  const router = useRouter();
  const workerId = params.id as string;

  const [worker, setWorker] = useState<Worker | null>(null);
  const [updates, setUpdates] = useState<Update[]>([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  // Form state
  const [comment, setComment] = useState('');
  const [hasPendingWork, setHasPendingWork] = useState(false);
  const [images, setImages] = useState<File[]>([]);

  useEffect(() => {
    if (workerId) {
      fetchWorker();
      fetchUpdates();
    }
  }, [workerId]);

  const fetchWorker = async () => {
    try {
      const response = await workerApi.getById(workerId);
      setWorker(response.data);
    } catch (error) {
      console.error('Error fetching worker:', error);
      router.push('/workers');
    }
  };

  const fetchUpdates = async () => {
    try {
      const response = await updateApi.getByWorkerId(workerId, 20);
      setUpdates(response.data);
    } catch (error) {
      console.error('Error fetching updates:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!comment.trim()) {
      alert('Please enter a comment');
      return;
    }

    setSubmitting(true);
    try {
      const formData = new FormData();
      formData.append('workerId', workerId);
      formData.append('comment', comment);
      formData.append('hasPendingWork', hasPendingWork.toString());
      images.forEach((image) => {
        formData.append('images', image);
      });

      await updateApi.create(formData);
      setComment('');
      setHasPendingWork(false);
      setImages([]);
      fetchUpdates();
      alert('Update submitted successfully!');
    } catch (error: any) {
      console.error('Error submitting update:', error);
      alert(error.response?.data?.error || 'Failed to submit update');
    } finally {
      setSubmitting(false);
    }
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setImages(Array.from(e.target.files));
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <p className="text-gray-600">Loading...</p>
      </div>
    );
  }

  if (!worker) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <Link href="/workers" className="text-primary-600 hover:text-primary-700 font-medium">
          ← Back to Directory
        </Link>

        <div className="bg-white rounded-lg shadow-md p-6 mt-6">
          <div className="flex items-center space-x-6">
            <div className="relative w-32 h-32 rounded-full overflow-hidden bg-gray-200 flex-shrink-0">
              {worker.photo ? (
                <Image
                  src={`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000'}${worker.photo}`}
                  alt={worker.name}
                  fill
                  className="object-cover"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-5xl text-gray-400">
                  👤
                </div>
              )}
            </div>
            <div>
              <h1 className="text-3xl font-bold text-gray-900">{worker.name}</h1>
              <p className="text-lg text-gray-600 mt-2">
                Work Hours: {worker.startTime} - {worker.endTime}
              </p>
              <p className="text-sm text-gray-500 mt-1">
                Hourly Rate: ₹{worker.hourlyRate}
              </p>
            </div>
          </div>
        </div>

        {/* Update Form */}
        <div className="bg-white rounded-lg shadow-md p-6 mt-6">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Submit Daily Update</h2>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Comment *
              </label>
              <textarea
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                rows={4}
                required
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                placeholder="Describe the work completed today..."
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Upload Images (optional)
              </label>
              <input
                type="file"
                multiple
                accept="image/*"
                onChange={handleImageChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              />
              {images.length > 0 && (
                <p className="text-sm text-gray-600 mt-1">{images.length} file(s) selected</p>
              )}
            </div>

            <div className="flex items-center">
              <input
                type="checkbox"
                id="pendingWork"
                checked={hasPendingWork}
                onChange={(e) => setHasPendingWork(e.target.checked)}
                className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
              />
              <label htmlFor="pendingWork" className="ml-2 block text-sm text-gray-700">
                Mark as pending work
              </label>
            </div>

            <button
              type="submit"
              disabled={submitting}
              className="w-full bg-primary-600 hover:bg-primary-700 text-white font-semibold py-3 px-6 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {submitting ? 'Submitting...' : 'Submit Update'}
            </button>
          </form>
        </div>

        {/* Updates History */}
        <div className="bg-white rounded-lg shadow-md p-6 mt-6">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Recent Updates</h2>
          {updates.length === 0 ? (
            <p className="text-gray-600">No updates yet</p>
          ) : (
            <div className="space-y-4">
              {updates.map((update) => (
                <div key={update._id} className="border-b border-gray-200 pb-4 last:border-0">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm text-gray-500">
                      {format(new Date(update.date), 'MMM dd, yyyy')}
                    </span>
                    {update.hasPendingWork && (
                      <span className="px-2 py-1 bg-yellow-100 text-yellow-800 text-xs rounded-full">
                        Pending Work
                      </span>
                    )}
                  </div>
                  <p className="text-gray-900 mb-2">{update.comment}</p>
                  {update.images.length > 0 && (
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-2 mt-3">
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
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

