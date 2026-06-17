// Supabase Utilities for Resilient Database Operations
import { supabase } from './supabase'

// Current schema version
const CURRENT_SCHEMA_VERSION = 1;

// Table schemas for auto-creation with versioning
const TABLE_SCHEMAS = {
  // Schema metadata table (created first)
  _meta: `
    CREATE TABLE IF NOT EXISTS _meta (
      key TEXT PRIMARY KEY,
      value TEXT,
      updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
    );
    INSERT INTO _meta (key, value) VALUES ('schema_version', '${CURRENT_SCHEMA_VERSION}')
    ON CONFLICT (key) DO UPDATE SET value = '${CURRENT_SCHEMA_VERSION}', updated_at = NOW();
  `,

  // RPC function for executing DDL (created second)
  exec_sql_rpc: `
    CREATE OR REPLACE FUNCTION exec_sql(sql TEXT)
    RETURNS VOID
    LANGUAGE plpgsql
    SECURITY DEFINER
    AS $$
    BEGIN
      EXECUTE sql;
    END;
    $$;
  `,

  // RPC function for refreshing Supabase REST API schema cache (created third)
  refresh_supabase_rpc: `
    CREATE OR REPLACE FUNCTION refresh_supabase()
    RETURNS TEXT
    LANGUAGE plpgsql
    SECURITY DEFINER
    AS $$
    BEGIN
      -- Force refresh of Supabase REST API schema cache
      -- This ensures new tables, RPCs, and policies are immediately available
      PERFORM pg_notify('supabase:schema:refresh', 'manual_refresh');
      RETURN 'API schema cache refresh triggered at ' || NOW()::TEXT;
    END;
    $$;
  `,

  waitlist: `
    CREATE TABLE IF NOT EXISTS waitlist (
      id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
      name TEXT NOT NULL,
      email TEXT NOT NULL UNIQUE,
      country TEXT,
      created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
    );
    CREATE INDEX IF NOT EXISTS idx_waitlist_email ON waitlist(email);
    CREATE INDEX IF NOT EXISTS idx_waitlist_created_at ON waitlist(created_at DESC);
  `,

  newsletter_subscribers: `
    CREATE TABLE IF NOT EXISTS newsletter_subscribers (
      id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
      email TEXT NOT NULL UNIQUE,
      subscribed_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
      is_active BOOLEAN DEFAULT TRUE
    );
    CREATE INDEX IF NOT EXISTS idx_newsletter_email ON newsletter_subscribers(email);
    CREATE INDEX IF NOT EXISTS idx_newsletter_active ON newsletter_subscribers(is_active);
  `,

  blogs: `
    CREATE TABLE IF NOT EXISTS blogs (
      id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
      title TEXT NOT NULL,
      excerpt TEXT,
      content TEXT,
      featured_image TEXT,
      author TEXT DEFAULT 'Biovance Team',
      published BOOLEAN DEFAULT FALSE,
      created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
      updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
    );
    CREATE INDEX IF NOT EXISTS idx_blogs_published ON blogs(published);
    CREATE INDEX IF NOT EXISTS idx_blogs_created_at ON blogs(created_at DESC);
  `,

  members: `
    CREATE TABLE IF NOT EXISTS members (
      id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
      email TEXT NOT NULL UNIQUE,
      role TEXT DEFAULT 'user',
      created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
    );
    CREATE INDEX IF NOT EXISTS idx_members_email ON members(email);
  `,

  // Internal logs table for silent metric tracking
  _logs: `
    CREATE TABLE IF NOT EXISTS _logs (
      id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
      event TEXT NOT NULL,
      details JSONB,
      created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
    );
    CREATE INDEX IF NOT EXISTS idx_logs_event ON _logs(event);
    CREATE INDEX IF NOT EXISTS idx_logs_created_at ON _logs(created_at DESC);
  `
}

// Check if a table exists using lightweight SELECT query
export async function tableExists(tableName) {
  try {
    // Use a lightweight SELECT query instead of information_schema
    const { error } = await supabase
      .from(tableName)
      .select('count', { count: 'exact', head: true })
      .limit(1)

    // If no error, table exists
    // If error code 42P01 (relation does not exist), table doesn't exist
    // Other errors might indicate permissions or other issues
    if (error) {
      if (error.code === '42P01') {
        return false // Table definitely doesn't exist
      }
      // For other errors (permissions, etc.), assume table exists to avoid false negatives
      return true
    }

    return true // No error means table exists
  } catch (err) {
    // On network errors or other issues, assume table exists
    return true
  }
}

// Create a table if it doesn't exist
export async function createTableIfNotExists(tableName) {
  if (!TABLE_SCHEMAS[tableName]) {
    console.error(`❌ No schema defined for table: ${tableName}`)
    return false
  }

  try {
    // First ensure exec_sql RPC exists (except when creating the RPC itself or meta table)
    if (tableName !== 'exec_sql_rpc' && tableName !== '_meta') {
      await createTableIfNotExists('exec_sql_rpc')
    }

    // Use rpc to execute DDL
    const { error } = await supabase.rpc('exec_sql', {
      sql: TABLE_SCHEMAS[tableName]
    })

    if (error) {
      // If RPC fails, this is expected for missing tables - don't log as error
      if (error.message?.includes('function exec_sql') && error.message?.includes('does not exist')) {
        // Try creating the RPC function first
        try {
          await supabase.rpc('exec_sql', { sql: TABLE_SCHEMAS.exec_sql_rpc })
          // Retry the original operation
          const { error: retryError } = await supabase.rpc('exec_sql', {
            sql: TABLE_SCHEMAS[tableName]
          })
          if (!retryError) {
            await refreshSchemaCache()
            await logEvent('table_created', { table: tableName, method: 'rpc_retry' })
            return true
          }
        } catch (rpcError) {
          // Expected failure - log only if truly unexpected
        }
      }

      // For table creation failures, this is expected - don't spam console
      // Only log if it's not a "table already exists" type error
      if (!error.message?.includes('already exists') && !error.message?.includes('does not exist')) {
        console.warn(`⚠️ Unexpected error creating ${tableName}:`, error.message)
      }
      return false
    }

    // Success - refresh schema cache for immediate availability
    await refreshSchemaCache()
    await logEvent('table_created', { table: tableName, method: 'rpc' })
    return true
  } catch (err) {
    // Network or other unexpected errors - these are worth logging
    if (!err.message?.includes('Failed to fetch')) {
      console.warn(`⚠️ Unexpected error in createTableIfNotExists for ${tableName}:`, err.message)
    }
    return false
  }
}

// Refresh Supabase REST API schema cache
async function refreshSchemaCache() {
  try {
    // Use the dedicated RPC function for reliable cache refresh
    const { data, error } = await supabase.rpc('refresh_supabase')
    if (!error && data) {
      console.log('✅ API schema cache refreshed:', data)
      await logEvent('schema_cache_refreshed', { timestamp: new Date().toISOString() })
    } else {
      // Fallback to manual method if RPC fails
      console.warn('⚠️ RPC cache refresh failed, using fallback method')
      await supabase.from('_supabase_schema_cache').select('*').limit(1)
    }
  } catch (err) {
    console.warn('⚠️ Schema cache refresh failed:', err.message)
  }
}

// Silent metric tracking
async function logEvent(event, details = {}) {
  try {
    await safeQuery('_logs', () =>
      supabase.from('_logs').insert({
        event,
        details: { ...details, timestamp: new Date().toISOString() }
      })
    , { createIfMissing: false, logErrors: false })
  } catch (err) {
    // Silent failure - logging shouldn't break the app
  }
}

// Get current schema version
async function getCurrentSchemaVersion() {
  try {
    const result = await safeQuery('_meta', () =>
      supabase.from('_meta').select('value').eq('key', 'schema_version').single()
    , { createIfMissing: false, logErrors: false })

    return result?.value ? parseInt(result.value) : 0
  } catch (err) {
    return 0
  }
}

// Run schema migrations if needed
async function runMigrations(currentVersion) {
  const migrations = []

  // Future migrations can be added here
  // Example:
  // if (currentVersion < 2) {
  //   migrations.push('ALTER TABLE waitlist ADD COLUMN phone TEXT;')
  // }

  for (const migration of migrations) {
    try {
      await supabase.rpc('exec_sql', { sql: migration })
      await logEvent('migration_applied', { sql: migration.substring(0, 100) + '...' })
    } catch (err) {
      console.warn('Migration failed:', migration.substring(0, 50) + '...')
    }
  }
}

// Verify and create RLS policies
async function verifyPolicies() {
  const policies = [
    {
      table: 'waitlist',
      policies: [
        `CREATE POLICY "Enable read access for authenticated users" ON waitlist FOR SELECT TO authenticated USING (true);`,
        `CREATE POLICY "Enable insert for authenticated users" ON waitlist FOR INSERT TO authenticated WITH CHECK (true);`
      ]
    },
    {
      table: 'blogs',
      policies: [
        `CREATE POLICY "Enable read access for all users" ON blogs FOR SELECT USING (published = true);`,
        `CREATE POLICY "Enable full access for authenticated users" ON blogs FOR ALL TO authenticated USING (true);`
      ]
    }
  ]

  for (const { table, policies: tablePolicies } of policies) {
    for (const policy of tablePolicies) {
      try {
        await supabase.rpc('exec_sql', { sql: policy })
      } catch (err) {
        // Policy might already exist - silent failure
      }
    }
  }
}

// Safe query wrapper with automatic table creation and storage error handling
export async function safeQuery(tableName, queryFn, options = {}) {
  const {
    createIfMissing = true,
    fallbackData = [],
    logErrors = true,
    isStorage = false
  } = options

  try {
    const result = await queryFn()

    // Check for errors
    if (result.error) {
      const errorCode = result.error.code
      const errorMessage = result.error.message?.toLowerCase() || ''
      const statusCode = result.error.statusCode

      // Handle database table errors (expected recoveries - don't log)
      if (!isStorage && (errorCode === '42P01' || // PostgreSQL: relation does not exist
          errorCode === 'PGRST116' || // PostgREST: no rows (sometimes indicates missing table)
          errorMessage.includes('relation') && errorMessage.includes('does not exist'))) {

        if (createIfMissing) {
          const created = await createTableIfNotExists(tableName)
          if (created) {
            // Retry the query after table creation
            try {
              const retryResult = await queryFn()
              if (!retryResult.error) {
                return retryResult.data || fallbackData
              }
            } catch (retryError) {
              // Silent failure - expected during recovery
            }
          }
        }

        return fallbackData
      }

      // Handle storage permission errors (expected - don't spam console)
      if (isStorage && (statusCode === 403 || errorMessage.includes('permission') || errorMessage.includes('policy'))) {
        return fallbackData
      }

      // Only log truly unexpected errors (not 404/500 from missing tables)
      if (logErrors && statusCode !== 404 && statusCode !== 500 && errorCode !== '42P01') {
        console.error(`❌ Unexpected Supabase ${isStorage ? 'storage' : 'query'} error in '${tableName}':`, {
          code: errorCode,
          statusCode,
          message: result.error.message,
          details: result.error.details,
          hint: result.error.hint
        })
      }

      return fallbackData
    }

    return result.data || fallbackData

  } catch (err) {
    // Only log network/unexpected errors, not expected recoveries
    if (logErrors && !err.message?.includes('Failed to fetch') && !err.message?.includes('NetworkError')) {
      console.error(`💥 Unexpected error in safeQuery for '${tableName}':`, err.message)
    }
    return fallbackData
  }
}

// Ensure Supabase API schema cache is synced
export async function ensureSupabaseCacheSynced() {
  try {
    const { data, error } = await supabase.rpc('refresh_supabase')
    if (error) {
      console.warn('⚠️ Supabase cache refresh failed:', error.message)
    } else {
      console.log('✅ API schema cache refreshed:', data)
    }
  } catch (err) {
    console.error('❌ Cache refresh error:', err)
  }
}

// Initialize all required tables on app start
export async function initializeDatabase() {
  try {
    // Step 1: Create metadata table first
    await createTableIfNotExists('_meta')

    // Step 2: Check schema version and run migrations
    const currentVersion = await getCurrentSchemaVersion()
    if (currentVersion < CURRENT_SCHEMA_VERSION) {
      await runMigrations(currentVersion)
      await logEvent('schema_upgraded', {
        from: currentVersion,
        to: CURRENT_SCHEMA_VERSION
      })
    }

    // Step 3: Create all required tables
    const requiredTables = ['_logs', 'exec_sql_rpc', 'refresh_supabase_rpc', 'waitlist', 'newsletter_subscribers', 'blogs', 'members']
    let createdCount = 0

    for (const tableName of requiredTables) {
      const exists = await tableExists(tableName)
      if (!exists) {
        const created = await createTableIfNotExists(tableName)
        if (created) createdCount++
      }
    }

    // Step 4: Verify and create RLS policies
    await verifyPolicies()

    // Step 5: Force schema cache refresh after all changes
    await refreshSchemaCache()

    // Step 6: Log initialization metrics
    await logEvent('database_initialized', {
      tables_created: createdCount,
      schema_version: CURRENT_SCHEMA_VERSION,
      timestamp: new Date().toISOString()
    })

    // Only log if something was actually created (unexpected scenario)
    if (createdCount > 0) {
      console.log(`🔧 Database initialized: ${createdCount} tables created, schema v${CURRENT_SCHEMA_VERSION}`)
    }
    // Silent success - no logging needed for normal operation

  } catch (err) {
    console.error('❌ Database initialization error:', err.message)
    await logEvent('database_init_error', { error: err.message })
  }
}

// Enable Row Level Security for tables
export async function enableRLS(tableName) {
  try {
    const { error } = await supabase.rpc('exec_sql', {
      sql: `ALTER TABLE ${tableName} ENABLE ROW LEVEL SECURITY;`
    })

    if (error) {
      console.warn(`⚠️ Could not enable RLS for ${tableName}:`, error.message)
    } else {
      console.log(`🔒 RLS enabled for ${tableName}`)
    }
  } catch (err) {
    console.warn(`⚠️ Error enabling RLS for ${tableName}:`, err.message)
  }
}

// Create basic policies for authenticated users
export async function createBasicPolicies(tableName) {
  const policies = [
    `CREATE POLICY "Enable read access for authenticated users" ON ${tableName} FOR SELECT TO authenticated USING (true);`,
    `CREATE POLICY "Enable insert for authenticated users" ON ${tableName} FOR INSERT TO authenticated WITH CHECK (true);`,
    `CREATE POLICY "Enable update for authenticated users" ON ${tableName} FOR UPDATE TO authenticated USING (true);`,
    `CREATE POLICY "Enable delete for authenticated users" ON ${tableName} FOR DELETE TO authenticated USING (true);`
  ]

  for (const policy of policies) {
    try {
      const { error } = await supabase.rpc('exec_sql', { sql: policy })
      if (error && !error.message.includes('already exists')) {
        console.warn(`⚠️ Could not create policy for ${tableName}:`, error.message)
      }
    } catch (err) {
      console.warn(`⚠️ Error creating policy for ${tableName}:`, err.message)
    }
  }
}