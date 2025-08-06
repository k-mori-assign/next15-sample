export default function ProfileLoading() {
  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto">
        <div className="bg-white shadow overflow-hidden sm:rounded-lg">
          <div className="px-4 py-5 sm:px-6">
            <div className="h-6 bg-gray-200 rounded w-1/3 animate-pulse"></div>
            <div className="mt-1 h-4 bg-gray-200 rounded w-1/2 animate-pulse"></div>
          </div>
          <div className="border-t border-gray-200">
            <div className="bg-gray-50 px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
              <div className="h-4 bg-gray-200 rounded w-1/3 animate-pulse"></div>
              <div className="mt-1 h-4 bg-gray-200 rounded w-1/2 animate-pulse sm:mt-0 sm:col-span-2"></div>
            </div>
            <div className="bg-white px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
              <div className="h-4 bg-gray-200 rounded w-1/3 animate-pulse"></div>
              <div className="mt-1 h-4 bg-gray-200 rounded w-1/2 animate-pulse sm:mt-0 sm:col-span-2"></div>
            </div>
            <div className="bg-gray-50 px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
              <div className="h-4 bg-gray-200 rounded w-1/3 animate-pulse"></div>
              <div className="mt-1 h-4 bg-gray-200 rounded w-1/2 animate-pulse sm:mt-0 sm:col-span-2"></div>
            </div>
            <div className="bg-white px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
              <div className="h-4 bg-gray-200 rounded w-1/3 animate-pulse"></div>
              <div className="mt-1 h-4 bg-gray-200 rounded w-1/2 animate-pulse sm:mt-0 sm:col-span-2"></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 
