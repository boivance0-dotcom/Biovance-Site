import React from 'react'

// The platform backend (Digital Nervous System) is a self-contained dashboard
// served as a static file at /backend.html. Hosting it in an iframe keeps it
// fully isolated from the marketing site's styles and build — zero conflicts.
const Backend = () => {
  return (
    <div style={{ position: 'fixed', inset: 0, width: '100%', height: '100%', background: '#08100A' }}>
      <iframe
        src="/backend.html"
        title="Zytherion Biovance — Platform Backend"
        style={{ border: 'none', width: '100%', height: '100%', display: 'block' }}
      />
    </div>
  )
}

export default Backend
