import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { useWaitlistData } from '../hooks/useWaitlistData';

// Utility to get/set localStorage with JSON parsing
const useLocalStorage = (key, defaultValue) => {
  const [value, setValue] = useState(() => {
    try {
      const item = localStorage.getItem(key);
      return item ? JSON.parse(item) : defaultValue;
    } catch {
      return defaultValue;
    }
  });

  const setStoredValue = (newValue) => {
    try {
      setValue(newValue);
      localStorage.setItem(key, JSON.stringify(newValue));
    } catch (error) {
      console.warn('Failed to save to localStorage:', error);
    }
  };

  return [value, setStoredValue];
};

// Optimized table row component with React.memo
const WaitlistTableRow = React.memo(({ entry, index, formatDate, sanitizeText, shimmerLoading, isNew, onMarkAsSeen }) => {
  useEffect(() => {
    if (isNew) {
      // Auto-mark as seen after 3 seconds
      const timer = setTimeout(() => {
        onMarkAsSeen(entry.id);
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [isNew, entry.id, onMarkAsSeen]);

  return (
    <tr className={`${index % 2 === 0 ? 'bg-white' : 'bg-gray-50'} hover:bg-green-50 transition-colors ${shimmerLoading ? 'animate-pulse' : ''} ${isNew ? 'ring-2 ring-green-200 ring-opacity-50' : ''}`}>
      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 relative">
        {index}
        {isNew && (
          <span className="absolute -top-1 -right-1 bg-green-500 text-white text-xs px-1.5 py-0.5 rounded-full font-semibold animate-pulse">
            NEW
          </span>
        )}
      </td>
      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 font-medium">
        {sanitizeText(entry.name)}
      </td>
      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
        {sanitizeText(entry.email)}
      </td>
      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
        {sanitizeText(entry.country || 'Not specified')}
      </td>
      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
        {formatDate(entry.created_at)}
      </td>
    </tr>
  );
});

const AdminWaitlist = () => {
  const [showExportModal, setShowExportModal] = useState(false);
  const [exportType, setExportType] = useState('');
  const [shimmerLoading, setShimmerLoading] = useState(false);

  // Local storage for pagination memory
  const [storedPage, setStoredPage] = useLocalStorage('waitlist-current-page', 1);
  const [storedSearch, setStoredSearch] = useLocalStorage('waitlist-search-term', '');
  const [storedCountry, setStoredCountry] = useLocalStorage('waitlist-country-filter', '');
  const [lastVisitTime, setLastVisitTime] = useLocalStorage('waitlist-last-visit', Date.now());
  const [seenEntries, setSeenEntries] = useLocalStorage('waitlist-seen-entries', new Set());

  // Handle export with confirmation
  const handleExport = (type) => {
    setExportType(type);
    setShowExportModal(true);
  };

  const confirmExport = () => {
    if (exportType === 'csv') {
      exportToCSV();
    } else if (exportType === 'json') {
      exportToJSON();
    }
    setShowExportModal(false);
    setExportType('');
  };

  // Get time since last update
  const getTimeSinceUpdate = () => {
    if (!lastUpdated) return 'Never';
    const now = new Date();
    const diff = now - lastUpdated;
    const minutes = Math.floor(diff / 60000);
    const hours = Math.floor(diff / 3600000);
    const days = Math.floor(diff / 86400000);

    if (days > 0) return `${days} day${days > 1 ? 's' : ''} ago`;
    if (hours > 0) return `${hours} hour${hours > 1 ? 's' : ''} ago`;
    if (minutes > 0) return `${minutes} minute${minutes > 1 ? 's' : ''} ago`;
    return 'Just now';
  };

  const {
    allEntries,
    paginatedEntries,
    stats,
    uniqueCountries,
    loading,
    error,
    lastUpdated,
    currentPage,
    totalPages,
    searchTerm,
    countryFilter,
    subscriptionStatus,
    fetchWaitlistData,
    setSearchTerm,
    setCountryFilter,
    exportToCSV,
    exportToJSON,
    goToPage,
    nextPage,
    prevPage,
    formatDate,
    sanitizeText
  } = useWaitlistData(storedPage, storedSearch, storedCountry);

  // Update local storage when filters change
  useEffect(() => {
    setStoredPage(currentPage);
  }, [currentPage, setStoredPage]);

  useEffect(() => {
    setStoredSearch(searchTerm);
  }, [searchTerm, setStoredSearch]);

  useEffect(() => {
    setStoredCountry(countryFilter);
  }, [countryFilter, setStoredCountry]);

  // Update last visit time when component mounts
  useEffect(() => {
    setLastVisitTime(Date.now());
  }, [setLastVisitTime]);

  // Track new entries since last visit
  const newEntriesSinceLastVisit = useMemo(() => {
    if (!allEntries.length) return new Set();
    const lastVisit = new Date(lastVisitTime);
    return new Set(
      allEntries
        .filter(entry => new Date(entry.created_at) > lastVisit)
        .map(entry => entry.id)
    );
  }, [allEntries, lastVisitTime]);

  // Mark entries as seen
  const markAsSeen = useCallback((entryId) => {
    setSeenEntries(prev => new Set([...prev, entryId]));
  }, [setSeenEntries]);

  // Check if entry is new and unseen
  const isNewEntry = useCallback((entryId) => {
    return newEntriesSinceLastVisit.has(entryId) && !seenEntries.has(entryId);
  }, [newEntriesSinceLastVisit, seenEntries]);

  if (loading) {
    return (
      <div className="max-w-6xl mx-auto bg-gradient-to-br from-white to-green-50 p-8 rounded-3xl shadow-2xl border border-green-100 mt-10 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-32 h-32 bg-green-200 rounded-full blur-3xl opacity-20"></div>
        <div className="absolute bottom-0 left-0 w-24 h-24 bg-emerald-300 rounded-full blur-2xl opacity-30"></div>

        <div className="relative z-10">
          <h2 className="text-3xl font-bold text-green-900 mb-2 flex items-center">
            <span className="mr-3">📋</span>
            Waitlist Management
          </h2>
          <p className="text-green-700 mb-8 font-medium">Monitor and manage waitlist registrations</p>

          <div className="flex justify-center items-center py-20">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600"></div>
            <span className="ml-3 text-gray-600">Loading waitlist data...</span>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-7xl mx-auto bg-gradient-to-br from-white to-green-50 p-8 rounded-3xl shadow-2xl border border-green-100 mt-10 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-32 h-32 bg-green-200 rounded-full blur-3xl opacity-20"></div>
        <div className="absolute bottom-0 left-0 w-24 h-24 bg-emerald-300 rounded-full blur-2xl opacity-30"></div>

        <div className="relative z-10">
          <h2 className="text-3xl font-bold text-green-900 mb-2 flex items-center">
            <span className="mr-3">📋</span>
            Waitlist Management
          </h2>
          <p className="text-green-700 mb-8 font-medium">Monitor and manage waitlist registrations</p>

          <div className="bg-red-50 border border-red-200 rounded-xl p-6 text-center">
            <p className="text-red-800 font-semibold">Error loading waitlist data</p>
            <p className="text-red-600 text-sm mt-2">{error}</p>
            <button
              onClick={fetchWaitlistData}
              className="mt-4 bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg transition-colors"
            >
              Try Again
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto bg-gradient-to-br from-white to-green-50 p-8 rounded-3xl shadow-2xl border border-green-100 mt-10 relative overflow-hidden">
      <div className="absolute top-0 right-0 w-32 h-32 bg-green-200 rounded-full blur-3xl opacity-20"></div>
      <div className="absolute bottom-0 left-0 w-24 h-24 bg-emerald-300 rounded-full blur-2xl opacity-30"></div>

      <div className="relative z-10">
        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-gradient-to-br from-blue-50 to-blue-100 p-6 rounded-xl border border-blue-200 animate-fade-in">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-blue-700">Total Signups</p>
                <p className="text-3xl font-bold text-blue-900">{stats.totalSignups}</p>
              </div>
              <div className="text-4xl">🧍</div>
            </div>
          </div>

          <div className="bg-gradient-to-br from-green-50 to-green-100 p-6 rounded-xl border border-green-200 animate-fade-in" style={{animationDelay: '0.1s'}}>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-green-700">New Since Visit</p>
                <p className="text-3xl font-bold text-green-900">{newEntriesSinceLastVisit.size}</p>
                {newEntriesSinceLastVisit.size > 0 && (
                  <span className="text-xs bg-green-200 text-green-800 px-2 py-1 rounded-full animate-pulse">
                    🔥 Hot
                  </span>
                )}
              </div>
              <div className="text-4xl">✨</div>
            </div>
          </div>

          <div className="bg-gradient-to-br from-purple-50 to-purple-100 p-6 rounded-xl border border-purple-200 animate-fade-in" style={{animationDelay: '0.2s'}}>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-purple-700">Countries Joined</p>
                <p className="text-3xl font-bold text-purple-900">{stats.uniqueCountries}</p>
              </div>
              <div className="text-4xl">🌍</div>
            </div>
          </div>

          <div className="bg-gradient-to-br from-orange-50 to-orange-100 p-6 rounded-xl border border-orange-200 animate-fade-in" style={{animationDelay: '0.3s'}}>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-orange-700">This Month</p>
                <p className="text-3xl font-bold text-orange-900">{stats.thisMonth}</p>
              </div>
              <div className="text-4xl">📅</div>
            </div>
          </div>
        </div>

        <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-8">
          <div>
            <h2 className="text-3xl font-bold text-green-900 mb-2 flex items-center">
              <span className="mr-3">📋</span>
              Waitlist Management
            </h2>
            <p className="text-green-700 font-medium">Monitor and manage waitlist registrations</p>
          </div>

          <div className="mt-4 md:mt-0 flex items-center gap-4">
            <div className="bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm font-semibold">
              {(paginatedEntries || []).length} of {stats.totalSignups || 0} entries
            </div>
            <div className="flex gap-2">
              {newEntriesSinceLastVisit.size > 0 && (
                <button
                  onClick={() => setSeenEntries(new Set(allEntries.map(e => e.id)))}
                  className="bg-green-500 hover:bg-green-600 text-white px-3 py-2 rounded-lg transition-colors text-sm"
                  title="Mark all as seen"
                >
                  ✅ Mark All Seen
                </button>
              )}
              <button
                onClick={fetchWaitlistData}
                className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg transition-colors flex items-center gap-2"
                title="Refresh data"
              >
                🔄 Refresh
              </button>
            </div>
          </div>
        </div>

        {/* Search and Filter */}
        <div className="flex flex-col sm:flex-row gap-4 mb-6">
          <div className="flex-1">
            <input
              type="text"
              placeholder="Search by name or email..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
            />
          </div>
          <div className="sm:w-48">
            <select
              value={countryFilter}
              onChange={(e) => setCountryFilter(e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
            >
              <option value="">All Countries</option>
              {(uniqueCountries || []).map(country => (
                <option key={country} value={country}>{country}</option>
              ))}
            </select>
          </div>
        </div>

        {/* Export Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 mb-6">
          <div className="flex gap-2">
            <button
              onClick={() => handleExport('csv')}
              disabled={(paginatedEntries || []).length === 0}
              className="bg-green-600 hover:bg-green-700 disabled:bg-gray-400 text-white px-4 py-2 rounded-lg transition-colors flex items-center gap-2"
            >
              📊 Export CSV
            </button>
            <button
              onClick={() => handleExport('json')}
              disabled={(paginatedEntries || []).length === 0}
              className="bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white px-4 py-2 rounded-lg transition-colors flex items-center gap-2"
            >
              📄 Export JSON
            </button>
          </div>
          <div className="text-sm text-gray-500 flex items-center">
            Last updated: {getTimeSinceUpdate()}
          </div>
        </div>

        {stats.totalSignups === 0 ? (
          <div className="text-center py-20">
            <div className="text-6xl mb-4">📝</div>
            <p className="text-gray-500 text-lg">No waitlist entries yet</p>
            <p className="text-sm text-gray-400 mt-2">New registrations will appear here automatically</p>
          </div>
        ) : (
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
            <div className="overflow-x-auto max-h-96 overflow-y-auto">
              <table className="w-full">
                <thead className="bg-gray-50 border-b border-gray-200 sticky top-0 z-10">
                  <tr>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">#</th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Name</th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Email</th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Country</th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Date Joined</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {(paginatedEntries || []).map((entry, index) => {
                    const globalIndex = (currentPage - 1) * 50 + index + 1;
                    return (
                      <WaitlistTableRow
                        key={entry.id}
                        entry={entry}
                        index={globalIndex}
                        formatDate={formatDate}
                        sanitizeText={sanitizeText}
                        shimmerLoading={shimmerLoading && index === 0}
                        isNew={isNewEntry(entry.id)}
                        onMarkAsSeen={markAsSeen}
                      />
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="mt-6 flex items-center justify-between">
            <div className="text-sm text-gray-500">
              Showing {((currentPage - 1) * 50) + 1} to {Math.min(currentPage * 50, (paginatedEntries || []).length)} of {(paginatedEntries || []).length} entries
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={prevPage}
                disabled={currentPage === 1}
                className="px-3 py-1 text-sm bg-gray-100 hover:bg-gray-200 disabled:bg-gray-50 disabled:text-gray-400 rounded transition-colors"
              >
                Previous
              </button>
              <span className="text-sm text-gray-600">
                Page {currentPage} of {totalPages}
              </span>
              <button
                onClick={nextPage}
                disabled={currentPage === totalPages}
                className="px-3 py-1 text-sm bg-gray-100 hover:bg-gray-200 disabled:bg-gray-50 disabled:text-gray-400 rounded transition-colors"
              >
                Next
              </button>
            </div>
          </div>
        )}

        <div className="mt-6 text-sm text-gray-500 text-center">
          <p>💡 New entries appear automatically without page refresh • Real-time subscription: {subscriptionStatus === 'SUBSCRIBED' ? '🟢 Active' : '🔴 Disconnected'}</p>
        </div>

        {/* Export Confirmation Modal */}
        {showExportModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white p-6 rounded-xl shadow-xl max-w-md w-full mx-4">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Confirm Export</h3>
              <p className="text-gray-600 mb-6">
                Export {(paginatedEntries || []).length} waitlist entries as {exportType.toUpperCase()}?
                This will include all currently visible data.
              </p>
              <div className="flex gap-3 justify-end">
                <button
                  onClick={() => setShowExportModal(false)}
                  className="px-4 py-2 text-gray-600 hover:text-gray-800 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={confirmExport}
                  className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg transition-colors"
                >
                  Export {exportType.toUpperCase()}
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminWaitlist;