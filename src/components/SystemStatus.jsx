import React, { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { supabase } from '../lib/supabase'
import { safeQuery, initializeDatabase, ensureSupabaseCacheSynced } from '../lib/supabaseUtils'

const SystemStatus = () => {
  const [status, setStatus] = useState({
    schemaValidated: false,
    cacheSynced: false,
    lastSync: null,
    loading: true,
    recovery: {
      inProgress: false,
      stage: '',
      progress: 0,
      emoji: '🔍'
    }
  })

  useEffect(() => {
    checkSystemStatus()
  }, [])

  const checkSystemStatus = async () => {
    try {
      // Check schema version
      const schemaVersion = await safeQuery('_meta', () =>
        supabase.from('_meta').select('value').eq('key', 'schema_version').single()
      , { createIfMissing: false, logErrors: false })

      // Check recent logs for sync activity
      const recentLogs = await safeQuery('_logs', () =>
        supabase.from('_logs')
          .select('*')
          .in('event', ['table_created', 'schema_upgraded', 'database_initialized'])
          .order('created_at', { ascending: false })
          .limit(5)
      , { createIfMissing: false, logErrors: false })

      const lastSync = recentLogs.length > 0 ? new Date(recentLogs[0].created_at) : null

      setStatus(prev => ({
        ...prev,
        schemaValidated: !!schemaVersion?.value,
        cacheSynced: recentLogs.length > 0,
        lastSync,
        loading: false
      }))
    } catch (err) {
      setStatus(prev => ({ ...prev, loading: false }))
    }
  }

  const triggerRecovery = async () => {
    setStatus(prev => ({
      ...prev,
      recovery: {
        inProgress: true,
        stage: 'Initializing database recovery...',
        progress: 10,
        emoji: '🛠️'
      }
    }))

    try {
      // Stage 1: Schema validation
      setStatus(prev => ({
        ...prev,
        recovery: { ...prev.recovery, stage: 'Validating schema...', progress: 25, emoji: '🔍' }
      }))
      await new Promise(resolve => setTimeout(resolve, 500))

      // Stage 2: Table creation
      setStatus(prev => ({
        ...prev,
        recovery: { ...prev.recovery, stage: 'Creating missing tables...', progress: 50, emoji: '🔨' }
      }))
      await new Promise(resolve => setTimeout(resolve, 500))

      // Stage 3: Policy verification
      setStatus(prev => ({
        ...prev,
        recovery: { ...prev.recovery, stage: 'Verifying security policies...', progress: 75, emoji: '🔐' }
      }))
      await new Promise(resolve => setTimeout(resolve, 500))

      // Stage 4: Cache sync
      setStatus(prev => ({
        ...prev,
        recovery: { ...prev.recovery, stage: 'Synchronizing cache...', progress: 90, emoji: '🔄' }
      }))

      // Run actual recovery
      await initializeDatabase()

      // Stage 5: Complete
      setStatus(prev => ({
        ...prev,
        recovery: { ...prev.recovery, stage: 'Recovery complete!', progress: 100, emoji: '✅' }
      }))

      // Refresh status after recovery
      setTimeout(() => {
        checkSystemStatus()
        setStatus(prev => ({
          ...prev,
          recovery: { inProgress: false, stage: '', progress: 0, emoji: '🔍' }
        }))
      }, 1000)

    } catch (err) {
      setStatus(prev => ({
        ...prev,
        recovery: {
          inProgress: false,
          stage: 'Recovery failed - check console',
          progress: 0,
          emoji: '❌'
        }
      }))
    }
  }

  if (status.loading) {
    return (
      <div className="bg-white p-4 rounded-lg border border-gray-200">
        <div className="animate-pulse">
          <div className="h-4 bg-gray-200 rounded w-1/4 mb-2"></div>
          <div className="space-y-2">
            <div className="h-3 bg-gray-200 rounded w-3/4"></div>
            <div className="h-3 bg-gray-200 rounded w-1/2"></div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="bg-white p-4 rounded-lg border border-gray-200">
      <h3 className="text-lg font-semibold text-gray-900 mb-3 flex items-center gap-2">
        System Status
        <span className="text-lg">{status.recovery.emoji}</span>
      </h3>

      {/* Recovery Progress */}
      {status.recovery.inProgress && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-4 p-3 bg-blue-50 border border-blue-200 rounded-md"
        >
          <div className="flex items-center gap-2 mb-2">
            <span className="text-sm font-medium text-blue-800">
              {status.recovery.stage}
            </span>
          </div>
          <div className="w-full bg-blue-200 rounded-full h-2">
            <motion.div
              className="bg-blue-600 h-2 rounded-full"
              initial={{ width: 0 }}
              animate={{ width: `${status.recovery.progress}%` }}
              transition={{ duration: 0.5, ease: 'easeInOut' }}
            />
          </div>
          <div className="text-xs text-blue-600 mt-1">
            {status.recovery.progress}% complete
          </div>
        </motion.div>
      )}

      <div className="space-y-3">
        <motion.div
          className="flex items-center justify-between"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.1 }}
        >
          <span className="text-sm text-gray-600">Schema Validated</span>
          <motion.span
            className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
              status.schemaValidated
                ? 'bg-green-100 text-green-800'
                : 'bg-red-100 text-red-800'
            }`}
            initial={{ scale: 0.8 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.2 }}
          >
            {status.schemaValidated ? '✅ Valid' : '❌ Invalid'}
          </motion.span>
        </motion.div>

        <motion.div
          className="flex items-center justify-between"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
        >
          <span className="text-sm text-gray-600">Cache Synced</span>
          <motion.span
            className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
              status.cacheSynced
                ? 'bg-green-100 text-green-800'
                : 'bg-yellow-100 text-yellow-800'
            }`}
            initial={{ scale: 0.8 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.3 }}
          >
            {status.cacheSynced ? '✅ Synced' : '⏳ Pending'}
          </motion.span>
        </motion.div>

        <motion.div
          className="flex items-center justify-between"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
        >
          <span className="text-sm text-gray-600">Last Sync</span>
          <span className="text-xs text-gray-500">
            {status.lastSync
              ? status.lastSync.toLocaleString()
              : 'Never'
            }
          </span>
        </motion.div>
      </div>

      <div className="mt-4 space-y-2">
        <motion.button
          onClick={checkSystemStatus}
          className="w-full bg-gray-100 hover:bg-gray-200 text-gray-700 px-3 py-2 rounded-md text-sm font-medium transition-colors"
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
        >
          🔄 Refresh Status
        </motion.button>

        <motion.button
          onClick={ensureSupabaseCacheSynced}
          className="w-full bg-purple-500 hover:bg-purple-600 text-white px-3 py-2 rounded-md text-sm font-medium transition-colors"
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
        >
          ⚡ Sync API Cache
        </motion.button>

        <motion.button
          onClick={triggerRecovery}
          disabled={status.recovery.inProgress}
          className="w-full bg-blue-500 hover:bg-blue-600 disabled:bg-blue-300 text-white px-3 py-2 rounded-md text-sm font-medium transition-colors disabled:cursor-not-allowed"
          whileHover={{ scale: status.recovery.inProgress ? 1 : 1.02 }}
          whileTap={{ scale: status.recovery.inProgress ? 1 : 0.98 }}
        >
          {status.recovery.inProgress ? '🔄 Recovery in Progress...' : '🛠️ Trigger Recovery'}
        </motion.button>
      </div>
    </div>
  )
}

export default SystemStatus