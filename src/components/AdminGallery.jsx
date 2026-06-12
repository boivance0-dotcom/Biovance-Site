import React, { useState, useEffect } from 'react'
import { supabase } from '../lib/supabase'
import { safeQuery } from '../lib/supabaseUtils'
import { Upload, X, Image as ImageIcon, Trash2 } from 'lucide-react'

const AdminGallery = () => {
  const [images, setImages] = useState([])
  const [loading, setLoading] = useState(false)
  const [uploading, setUploading] = useState(false)
  const [selectedImage, setSelectedImage] = useState(null)
  const [searchTerm, setSearchTerm] = useState('')
  const [sortBy, setSortBy] = useState('newest')
  const [viewMode, setViewMode] = useState('grid') // grid or list
  const [toast, setToast] = useState(null)

  useEffect(() => {
    fetchGalleryImages()
  }, [])

  // Refresh gallery when component becomes visible (e.g., when switching tabs)
  useEffect(() => {
    const handleVisibilityChange = () => {
      if (!document.hidden) {
        fetchGalleryImages()
      }
    }

    document.addEventListener('visibilitychange', handleVisibilityChange)
    return () => document.removeEventListener('visibilitychange', handleVisibilityChange)
  }, [])

  const fetchGalleryImages = async () => {
    try {
      console.log('📦 Fetching gallery images from Supabase...')

      // Check if user is authenticated for storage access
      const { data: userData, error: userError } = await supabase.auth.getUser()
      if (userError || !userData.user) {
        console.error('❌ Auth check failed for gallery fetch:', userError || 'No user session')
        setImages([])
        return
      }
      console.log('✅ User authenticated for gallery fetch:', userData.user.email)

      // Use safeQuery for storage operations
      const data = await safeQuery('test-bucket', () =>
        supabase.storage
          .from('test-bucket')
          .list('', { limit: 100, sortBy: { column: 'name', order: 'desc' } })
      , { isStorage: true })

      if (!data || data.length === 0) {
        console.log('🪣 No images found in bucket (list returned empty).')
        console.log('🔍 Bucket contents via dashboard should show files like: gallery-1731083023456-myimage.jpg')
        setImages([])
        return
      }

      console.log(`📂 Found ${data.length} files in root`)

      const imagesWithUrls = data
        .filter(file => file.name && !file.name.endsWith('/')) // Filter out folders
        .map(file => {
          console.log(`📂 Found file: ${file.name}`)
          const publicUrl = supabase.storage.from('test-bucket').getPublicUrl(file.name).data.publicUrl
          console.log(`🔗 Generated URL: ${publicUrl}`)
          return {
            name: file.name,
            url: publicUrl,
            size: file.metadata?.size || 0,
            created_at: file.created_at || new Date().toISOString()
          }
        })

      console.log('✅ Gallery fetched:', imagesWithUrls.length, 'images')
      setImages(imagesWithUrls)
    } catch (err) {
      console.error('💥 Error loading gallery:', err)
      setImages([])
    } finally {
      setLoading(false)
    }
  }

  const handleImageUpload = async (e) => {
    console.log("🧾 Raw file input event:", e);
    console.log("📂 Files received:", e.target.files);

    const files = Array.from(e.target.files)
    if (files.length === 0) return

    setUploading(true)
    let successCount = 0

    const sessionStartTime = Date.now()
    console.log(`🚀 Starting upload of ${files.length} file(s) to Supabase...`)

    // Check auth before upload
    const { data: userData, error: userError } = await supabase.auth.getUser()
    if (userError || !userData.user) {
      console.error('❌ Auth check failed:', userError || 'No user session')
      alert('❌ Please log in as admin before uploading images.')
      setUploading(false)
      e.target.value = ''
      return
    }
    console.log('✅ User authenticated:', userData.user.email)

    for (const file of files) {
      try {
        console.log('📤 Processing:', file.name, `(${formatFileSize(file.size)})`)

        // Check file size (limit to 5MB)
        if (file.size > 5 * 1024 * 1024) {
          alert(`❌ File ${file.name} is too large. Please choose images under 5MB.`)
          continue
        }

        // Create unique filename
        const uniqueName = 'gallery-' + Date.now() + '-' + file.name.replace(/\s+/g,'_')

        console.log('☁️ Uploading to Supabase Storage...')
        console.log('📡 Request details:', {
          bucket: 'test-bucket',
          fileName: uniqueName,
          fileSize: formatFileSize(file.size),
          contentType: file.type,
          timestamp: new Date().toISOString()
        })

        // Upload with timeout and diagnostics
        console.log('🔍 Starting upload diagnostics...')
        const startTime = Date.now()

        const uploadPromise = supabase.storage
          .from('test-bucket')
          .upload(uniqueName, file, {
            cacheControl: '3600',
            upsert: false
          })

        // Add progress monitoring
        const progressCheck = setInterval(() => {
          const elapsed = Date.now() - startTime
          if (elapsed > 15000) {
            console.warn('⚠️ UPLOAD STALLED: Likely permission or policy lock (15s elapsed)')
          }
        }, 5000)

        const timeoutPromise = new Promise((_, reject) =>
          setTimeout(() => {
            clearInterval(progressCheck)
            reject(new Error('Upload timeout after 30 seconds'))
          }, 30000)
        )

        const { data, error } = await Promise.race([uploadPromise, timeoutPromise])
        clearInterval(progressCheck)
        const uploadDuration = Date.now() - startTime
        console.log(`⏱️ Upload completed in ${uploadDuration}ms`)

        if (error) {
          console.error('❌ Upload failed for', file.name, ':', error)
          console.error('Full error details:', {
            message: error.message,
            statusCode: error.statusCode,
            hint: error.hint,
            details: error.details,
            code: error.code
          })

          // Detect permission/policy issues
          if (error.statusCode === 403 || error.message?.includes('permission') || error.message?.includes('policy')) {
            console.error('🔒 PERMISSION BLOCK DETECTED!')
            console.error('💡 FIX: Create this RLS policy in Supabase SQL Editor:')
            console.error(`
CREATE POLICY "Allow authenticated uploads to test-bucket" ON storage.objects
FOR INSERT TO authenticated
WITH CHECK (bucket_id = 'test-bucket');
            `)
          }

          setToast(`❌ Upload failed: ${error.message}`)
          setTimeout(() => setToast(null), 5000)
          continue
        }

        if (!data) {
          console.error('❌ Upload returned no data for', file.name)
          alert(`❌ Upload failed for ${file.name}: No response from server`)
          continue
        }

        console.log('✅ Upload successful, data shape:', data)

        // Get the public URL
        const { data: urlData } = supabase.storage
          .from('test-bucket')
          .getPublicUrl(data.path)

        if (!urlData?.publicUrl) {
          console.error('❌ Failed to get public URL for', file.name)
          setToast(`❌ Failed to generate URL for ${file.name}`)
          setTimeout(() => setToast(null), 5000)
          continue
        }

        console.log('🔗 Generated public URL:', urlData.publicUrl)

        // Add to gallery
        const newImage = {
          name: data.path,
          url: urlData.publicUrl,
          size: file.size,
          created_at: new Date().toISOString()
        }

        setImages(prev => [newImage, ...prev])
        successCount++

        console.log('🎉 Successfully added to gallery:', file.name)
        setToast('✅ Upload complete!')
        setTimeout(() => setToast(null), 3000)

        console.log('✅ Upload Result:', {
          file: file.name,
          path: data.path,
          url: urlData.publicUrl,
          size: formatFileSize(file.size),
          uploadedAt: new Date().toISOString(),
          bucket: 'test-bucket'
        })
      } catch (err) {
        console.error('💥 Unexpected error uploading', file.name, ':', err)
        console.error('Full error object:', err)
        setToast(`💥 Unexpected error: ${err.message}`)
        setTimeout(() => setToast(null), 5000)
      }
    }

    setUploading(false)

    // Final console summary
    console.log('📊 UPLOAD SESSION SUMMARY:')
    console.log(`   Files processed: ${files.length}`)
    console.log(`   Successful uploads: ${successCount}`)
    console.log(`   Failed uploads: ${files.length - successCount}`)
    console.log(`   Total session time: ${Date.now() - sessionStartTime}ms`)
    console.log(`   Bucket used: test-bucket`)
    console.log(`   Auth status: ${userData.user ? '✅ Valid' : '❌ Invalid'}`)

    if (successCount > 0) {
      setToast(`🎉 Successfully uploaded ${successCount} image(s)!`)
      setTimeout(() => setToast(null), 5000)
      console.log(`✅ Upload session complete: ${successCount} successful uploads`)
    } else {
      setToast('❌ No images were uploaded successfully.')
      setTimeout(() => setToast(null), 5000)
    }

    // Reset file input
    e.target.value = ''
  }

  const handleDeleteImage = async (imageName) => {
    if (!confirm(`Are you sure you want to delete "${imageName}"?`)) return;

    try {
      console.log("🗑️ Deletion started for:", imageName);

      // 1️⃣ Fetch all files from Supabase root
      const allFiles = await safeQuery('test-bucket', () =>
        supabase.storage
          .from('test-bucket')
          .list('', { limit: 1000 })
      , { isStorage: true });

      if (!allFiles || allFiles.length === 0) {
        alert('❌ No files found in bucket or error fetching files.');
        return;
      }

      console.log("📦 Files found in bucket:", allFiles.map(f => f.name));

      // 2️⃣ Match filename ignoring accidental folder mismatch
      const targetFile = allFiles.find(f => f.name === imageName);

      if (!targetFile) {
        alert(`❌ File "${imageName}" not found in bucket.`);
        console.warn("⚠️ File not found in bucket:", imageName);
        return;
      }

      const filePath = targetFile.name;
      console.log("✅ Confirmed file path to delete:", filePath);

      // 3️⃣ Delete exact file path
      const deleteResult = await safeQuery('test-bucket', () =>
        supabase.storage
          .from('test-bucket')
          .remove([filePath])
      , { isStorage: true });

      if (!deleteResult) {
        alert("❌ Error deleting file - operation failed silently");
        return;
      }

      console.log("✅ File deleted from Supabase:", filePath);

      // 4️⃣ Wait for Supabase to sync
      await new Promise((r) => setTimeout(r, 1500));

      // 5️⃣ Refresh gallery
      await fetchGalleryImages();

      alert("✅ Image deleted successfully and gallery refreshed!");
    } catch (err) {
      console.error("💥 Unexpected error deleting file:", err);
      alert("Unexpected error: " + err.message);
    }
  }

  const copyImageUrl = (url) => {
    navigator.clipboard.writeText(url)
    alert('Image URL copied to clipboard!')
  }

  const formatFileSize = (bytes) => {
    if (bytes === 0) return '0 Bytes'
    const k = 1024
    const sizes = ['Bytes', 'KB', 'MB', 'GB']
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
  }

  return (
    <div className="max-w-6xl mx-auto bg-gradient-to-br from-white to-green-50 p-8 rounded-3xl shadow-2xl border border-green-100 mt-10 relative overflow-hidden">
      <div className="absolute top-0 right-0 w-32 h-32 bg-green-200 rounded-full blur-3xl opacity-20"></div>
      <div className="absolute bottom-0 left-0 w-24 h-24 bg-emerald-300 rounded-full blur-2xl opacity-30"></div>

      <div className="relative z-10">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-8">
          <div>
            <h2 className="text-3xl font-bold text-green-900 mb-2 flex items-center">
              <ImageIcon className="mr-3 w-8 h-8" />
              Media Gallery
            </h2>
            <p className="text-green-700 font-medium">Professional image management for your content</p>
          </div>

          <button
            onClick={fetchGalleryImages}
            className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg transition-colors flex items-center gap-2"
            title="Refresh gallery"
          >
            🔄 Refresh
          </button>
        </div>

        {/* Controls */}
        <div className="flex flex-col sm:flex-row gap-4 mt-4 md:mt-0">
          <div className="flex gap-2">
            <button
              onClick={() => setViewMode('grid')}
              className={`p-2 rounded-lg ${viewMode === 'grid' ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-600'}`}
            >
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                <path d="M5 3a2 2 0 00-2 2v2a2 2 0 002 2h2a2 2 0 002-2V5a2 2 0 00-2-2H5zM5 11a2 2 0 00-2 2v2a2 2 0 002 2h2a2 2 0 002-2v-2a2 2 0 00-2-2H5zM11 5a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V5zM11 13a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
              </svg>
            </button>
            <button
              onClick={() => setViewMode('list')}
              className={`p-2 rounded-lg ${viewMode === 'list' ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-600'}`}
            >
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M3 4a1 1 0 011-1h12a1 1 0 011 1v2a1 1 0 01-1 1H4a1 1 0 01-1-1V4zM3 10a1 1 0 011-1h6a1 1 0 011 1v6a1 1 0 01-1 1H4a1 1 0 01-1-1v-6zM14 9a1 1 0 00-1 1v6a1 1 0 001 1h2a1 1 0 001-1v-6a1 1 0 00-1-1h-2z" clipRule="evenodd" />
              </svg>
            </button>
          </div>

          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
          >
            <option value="newest">Newest First</option>
            <option value="oldest">Oldest First</option>
            <option value="name">Name A-Z</option>
            <option value="size">Size</option>
          </select>
        {/* Search */}
        <div className="mb-6">
          <input
            type="text"
            placeholder="Search images..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
          />
        </div>
        </div>

        {/* Upload Section */}
        <div className="mb-8">
          <label
            className="flex items-center justify-center w-full h-32 px-4 transition bg-green-50 border-2 border-green-300 border-dashed rounded-xl hover:bg-green-100 hover:border-green-400 cursor-pointer"
            onDrop={(e) => {
              e.preventDefault()
              const files = Array.from(e.dataTransfer.files).filter(file => file.type.startsWith('image/'))
              if (files.length > 0) {
                handleImageUpload({ target: { files } })
              }
            }}
            onDragOver={(e) => e.preventDefault()}
          >
            <div className="flex flex-col items-center justify-center pt-5 pb-6">
              <Upload className={`w-8 h-8 mb-3 ${uploading ? 'text-green-400 animate-bounce' : 'text-green-600'}`} />
              <p className="mb-2 text-sm text-green-600">
                {uploading ? 'Uploading...' : 'Click to upload or drag & drop images'}
              </p>
              <p className="text-xs text-green-500">PNG, JPG, GIF up to 5MB each</p>
            </div>
            <input
              type="file"
              multiple
              accept="image/*"
              onChange={handleImageUpload}
              className="hidden"
              disabled={uploading}
            />
          </label>
        </div>

        {/* Toast Notification */}
        {toast && (
          <div className="fixed top-4 right-4 bg-green-500 text-white px-4 py-2 rounded-lg shadow-lg z-50">
            {toast}
          </div>
        )}

        {/* Gallery Display */}
        {images.length === 0 ? (
          <div className="text-center py-20">
            <ImageIcon className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-500">No images uploaded yet</p>
            <p className="text-sm text-gray-400 mt-2">Upload some images to get started</p>
          </div>
        ) : (
          <>
            {viewMode === 'grid' ? (
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
                {images
                  .filter(img => img.name.toLowerCase().includes(searchTerm.toLowerCase()))
                  .sort((a, b) => {
                    switch (sortBy) {
                      case 'oldest':
                        return new Date(a.created_at) - new Date(b.created_at)
                      case 'name':
                        return a.name.localeCompare(b.name)
                      case 'size':
                        return b.size - a.size
                      default:
                        return new Date(b.created_at) - new Date(a.created_at)
                    }
                  })
                  .map((image, index) => (
                  <div key={index} className="relative group">
                    <div
                      className="aspect-square bg-gray-200 rounded-xl overflow-hidden cursor-pointer hover:shadow-xl transition-all duration-300 hover:-translate-y-1"
                      onClick={() => setSelectedImage(image)}
                    >
                      <img
                        src={image.url}
                        alt={image.name}
                        className="w-full h-full object-cover hover:scale-110 transition-transform duration-300"
                        loading="lazy"
                      />
                    </div>

                    {/* Overlay with actions */}
                    <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-60 transition-all duration-300 rounded-xl flex items-center justify-center opacity-0 group-hover:opacity-100">
                      <div className="flex gap-3">
                        <button
                          onClick={(e) => {
                            e.stopPropagation()
                            copyImageUrl(image.url)
                          }}
                          className="bg-white text-gray-800 p-3 rounded-full hover:bg-gray-100 transition-all duration-200 hover:scale-110 shadow-lg"
                          title="Copy URL"
                        >
                          📋
                        </button>
                        <button
                          onClick={(e) => {
                            e.stopPropagation()
                            handleDeleteImage(image.name)
                          }}
                          className="bg-red-500 text-white p-3 rounded-full hover:bg-red-600 transition-all duration-200 hover:scale-110 shadow-lg"
                          title="Delete"
                        >
                          <Trash2 className="w-5 h-5" />
                        </button>
                      </div>
                    </div>

                    {/* Image info */}
                    <div className="mt-3">
                      <div className="text-sm font-medium text-gray-900 truncate" title={image.name}>
                        {image.name}
                      </div>
                      <div className="text-xs text-gray-500 mt-1">
                        {formatFileSize(image.size)} • {new Date(image.created_at).toLocaleDateString()}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="space-y-4">
                {images
                  .filter(img => img.name.toLowerCase().includes(searchTerm.toLowerCase()))
                  .sort((a, b) => {
                    switch (sortBy) {
                      case 'oldest':
                        return new Date(a.created_at) - new Date(b.created_at)
                      case 'name':
                        return a.name.localeCompare(b.name)
                      case 'size':
                        return b.size - a.size
                      default:
                        return new Date(b.created_at) - new Date(a.created_at)
                    }
                  })
                  .map((image, index) => (
                  <div key={index} className="bg-white p-4 rounded-xl shadow-sm border border-gray-200 hover:shadow-md transition-shadow">
                    <div className="flex items-center gap-4">
                      <div
                        className="w-20 h-20 bg-gray-200 rounded-lg overflow-hidden cursor-pointer flex-shrink-0"
                        onClick={() => setSelectedImage(image)}
                      >
                        <img
                          src={image.url}
                          alt={image.name}
                          className="w-full h-full object-cover hover:scale-105 transition-transform"
                          loading="lazy"
                        />
                      </div>

                      <div className="flex-1 min-w-0">
                        <div className="font-medium text-gray-900 truncate" title={image.name}>
                          {image.name}
                        </div>
                        <div className="text-sm text-gray-500 mt-1">
                          {formatFileSize(image.size)} • Uploaded {new Date(image.created_at).toLocaleDateString()}
                        </div>
                      </div>

                      <div className="flex gap-2">
                        <button
                          onClick={() => copyImageUrl(image.url)}
                          className="bg-gray-100 text-gray-700 px-3 py-2 rounded-lg hover:bg-gray-200 transition-colors text-sm font-medium"
                        >
                          Copy URL
                        </button>
                        <button
                          onClick={() => handleDeleteImage(image.name)}
                          className="bg-red-500 text-white px-3 py-2 rounded-lg hover:bg-red-600 transition-colors text-sm font-medium"
                        >
                          Delete
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </>
        )}

        {/* Image Modal */}
        {selectedImage && (
          <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 p-4">
            <div className="relative max-w-4xl max-h-full">
              <img
                src={selectedImage.url}
                alt={selectedImage.name}
                className="max-w-full max-h-full object-contain rounded-lg"
              />
              <button
                onClick={() => setSelectedImage(null)}
                className="absolute top-4 right-4 bg-white text-gray-800 p-2 rounded-full hover:bg-gray-100 transition-colors"
              >
                <X className="w-6 h-6" />
              </button>
              <div className="absolute bottom-4 left-4 bg-black bg-opacity-75 text-white p-3 rounded-lg">
                <p className="text-sm font-medium">{selectedImage.name}</p>
                <p className="text-xs opacity-75">
                  Size: {formatFileSize(selectedImage.size)} |
                  Created: {new Date(selectedImage.created_at).toLocaleDateString()}
                </p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

// ✅ Wrapped adjacent JSX elements to fix render error
export default AdminGallery