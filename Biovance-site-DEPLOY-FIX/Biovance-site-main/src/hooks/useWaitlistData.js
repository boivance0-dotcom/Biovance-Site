import { useState, useEffect, useCallback, useMemo } from 'react';
import { supabase } from '../lib/supabase';
import { safeQuery } from '../lib/supabaseUtils';

const WAITLIST_TABLE = import.meta.env.VITE_SUPABASE_WAITLIST_TABLE || 'waitlist';
const ITEMS_PER_PAGE = 50;

// Utility functions
const sanitizeText = (text) => {
  if (!text) return '';
  return text.toString().replace(/[<>]/g, '').trim();
};

const formatDate = (dateString) => {
  const date = new Date(dateString);
  return date.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });
};

const retryWithBackoff = async (fn, maxRetries = 3, baseDelay = 1000) => {
  for (let i = 0; i < maxRetries; i++) {
    try {
      return await fn();
    } catch (error) {
      if (i === maxRetries - 1) throw error;
      const delay = baseDelay * Math.pow(2, i);
      console.log(`⏳ Retrying in ${delay}ms... (${i + 1}/${maxRetries})`);
      await new Promise(resolve => setTimeout(resolve, delay));
    }
  }
};

export const useWaitlistData = (initialPage = 1, initialSearch = '', initialCountry = '') => {
  const [allEntries, setAllEntries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [lastUpdated, setLastUpdated] = useState(null);
  const [currentPage, setCurrentPage] = useState(initialPage);
  const [searchTerm, setSearchTerm] = useState(initialSearch);
  const [countryFilter, setCountryFilter] = useState(initialCountry);
  const [subscriptionStatus, setSubscriptionStatus] = useState('active');

  // Calculate stats
  const stats = useMemo(() => {
    const totalSignups = allEntries.length;
    const uniqueCountries = new Set(allEntries.map(entry => entry.country).filter(Boolean)).size;
    const thisMonth = allEntries.filter(entry => {
      const entryDate = new Date(entry.created_at);
      const now = new Date();
      return entryDate.getMonth() === now.getMonth() && entryDate.getFullYear() === now.getFullYear();
    }).length;

    return { totalSignups, uniqueCountries, thisMonth };
  }, [allEntries]);

  // Filter entries based on search and country
  const filteredEntries = useMemo(() => {
    return allEntries.filter(entry => {
      const matchesSearch = !searchTerm ||
        sanitizeText(entry.name).toLowerCase().includes(searchTerm.toLowerCase()) ||
        sanitizeText(entry.email).toLowerCase().includes(searchTerm.toLowerCase());

      const matchesCountry = !countryFilter || entry.country === countryFilter;

      return matchesSearch && matchesCountry;
    });
  }, [allEntries, searchTerm, countryFilter]);

  // Paginate filtered entries
  const paginatedEntries = useMemo(() => {
    const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
    const endIndex = startIndex + ITEMS_PER_PAGE;
    return filteredEntries.slice(startIndex, endIndex);
  }, [filteredEntries, currentPage]);

  const totalPages = Math.ceil(filteredEntries.length / ITEMS_PER_PAGE);

  // Get unique countries for filter dropdown
  const uniqueCountries = useMemo(() => {
    return [...new Set(allEntries.map(entry => entry.country).filter(Boolean))].sort();
  }, [allEntries]);

  // Fetch data with retry logic and safe table handling
  const fetchWaitlistData = useCallback(async () => {
    try {
      console.log('📦 Fetching waitlist data...');
      setLoading(true);
      setError(null);

      const result = await retryWithBackoff(async () => {
        // Limit to past 12 months for performance
        const twelveMonthsAgo = new Date();
        twelveMonthsAgo.setMonth(twelveMonthsAgo.getMonth() - 12);

        return await safeQuery(WAITLIST_TABLE, () =>
          supabase
            .from(WAITLIST_TABLE)
            .select('*')
            .gte('created_at', twelveMonthsAgo.toISOString())
            .order('created_at', { ascending: false })
        );
      });

      console.log(`✅ Loaded ${result.length} waitlist entries`);
      setAllEntries(result);
      setLastUpdated(new Date());
    } catch (err) {
      console.error('❌ Error fetching waitlist:', err);
      setError(err.message);
      // Set empty array as fallback
      setAllEntries([]);
    } finally {
      setLoading(false);
    }
  }, []);

  // Set up real-time subscription
  useEffect(() => {
    fetchWaitlistData();

    // Set up real-time subscription with error handling
    let subscription;
    try {
      subscription = supabase
        .channel('waitlist_changes')
        .on('postgres_changes', {
          event: 'INSERT',
          schema: 'public',
          table: WAITLIST_TABLE
        }, (payload) => {
          console.log('🔄 New waitlist entry:', sanitizeText(payload.new.email));
          setAllEntries(prev => [payload.new, ...prev]);
          setLastUpdated(new Date());
        })
        .subscribe((status) => {
          setSubscriptionStatus(status);
          if (status === 'SUBSCRIBED') {
            console.log('📡 Real-time subscription active');
          } else if (status === 'CLOSED') {
            console.warn('⚠️ Real-time subscription closed - table may not exist yet');
          } else if (status === 'CHANNEL_ERROR') {
            console.warn('⚠️ Real-time subscription error - table may not exist');
          }
        });
    } catch (subError) {
      console.warn('⚠️ Could not set up real-time subscription:', subError.message);
      setSubscriptionStatus('ERROR');
    }

    return () => {
      if (subscription) {
        subscription.unsubscribe();
      }
    };
  }, [fetchWaitlistData]);

  // Reset to page 1 when filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, countryFilter]);

  // Export functions
  const exportToCSV = useCallback(() => {
    console.log('📤 Exporting waitlist data to CSV');
    const headers = ['Name', 'Email', 'Country', 'Date Joined'];
    const csvContent = [
      headers.join(','),
      ...filteredEntries.map(entry => [
        `"${sanitizeText(entry.name)}"`,
        `"${sanitizeText(entry.email)}"`,
        `"${sanitizeText(entry.country || 'Not specified')}"`,
        `"${formatDate(entry.created_at)}"`
      ].join(','))
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', `biovance-waitlist-${new Date().toISOString().split('T')[0]}.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    console.log('✅ CSV export completed');
  }, [filteredEntries]);

  const exportToJSON = useCallback(() => {
    console.log('📤 Exporting waitlist data to JSON');
    const jsonData = filteredEntries.map(entry => ({
      name: sanitizeText(entry.name),
      email: sanitizeText(entry.email),
      country: sanitizeText(entry.country || 'Not specified'),
      dateJoined: formatDate(entry.created_at),
      signupDate: entry.created_at
    }));

    const blob = new Blob([JSON.stringify(jsonData, null, 2)], { type: 'application/json;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', `biovance-waitlist-${new Date().toISOString().split('T')[0]}.json`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    console.log('✅ JSON export completed');
  }, [filteredEntries]);

  // Pagination functions
  const goToPage = useCallback((page) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
    }
  }, [totalPages]);

  const nextPage = useCallback(() => goToPage(currentPage + 1), [currentPage, goToPage]);
  const prevPage = useCallback(() => goToPage(currentPage - 1), [currentPage, goToPage]);

  return {
    // Data
    allEntries,
    filteredEntries,
    paginatedEntries,
    stats,
    uniqueCountries,

    // State
    loading,
    error,
    lastUpdated,
    currentPage,
    totalPages,
    searchTerm,
    countryFilter,
    subscriptionStatus,

    // Actions
    fetchWaitlistData,
    setSearchTerm,
    setCountryFilter,
    exportToCSV,
    exportToJSON,
    goToPage,
    nextPage,
    prevPage,

    // Utilities
    formatDate,
    sanitizeText
  };
};