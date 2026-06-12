import React, { useState, useRef, useEffect } from "react";
import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Image from '@tiptap/extension-image';
import Link from '@tiptap/extension-link';
import { supabase } from "../lib/supabase";

export default function BlogEditor({ editingBlog, onSave }) {
  const [title, setTitle] = useState(editingBlog?.title || "");
  const [author, setAuthor] = useState(editingBlog?.author || "");
  const [content, setContent] = useState(editingBlog?.content || "");
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");
  const [galleryImages, setGalleryImages] = useState([]);
  const [showImageSelector, setShowImageSelector] = useState(false);
  const [isPreview, setIsPreview] = useState(false);
  const [featuredImage, setFeaturedImage] = useState('');
  const [sendEmail, setSendEmail] = useState(false);
  const [sendNotification, setSendNotification] = useState(true);
  const [testEmail, setTestEmail] = useState('');

  const editor = useEditor({
    extensions: [
      StarterKit,
      Image.configure({
        HTMLAttributes: {
          style: 'max-width: 100%; border-radius: 8px; margin: 10px 0; display: block;',
        },
      }),
      Link.configure({
        openOnClick: false,
      }),
    ],
    content: content,
    onUpdate: ({ editor }) => {
      setContent(editor.getHTML());
    },
    editorProps: {
      attributes: {
        style: 'min-height: 400px; padding: 16px;',
      },
    },
  });

  // Update state when editingBlog changes
  React.useEffect(() => {
    console.log('🔄 Loading blog for editing:', editingBlog);
    console.log('📸 Featured image from DB:', editingBlog?.featured_image);
    console.log('🔍 editingBlog type:', typeof editingBlog, 'keys:', Object.keys(editingBlog || {}));

    // Reset all form fields when switching to new blog creation
    if (editingBlog && Object.keys(editingBlog).length === 0) {
      console.log('🆕 Creating new blog - resetting all fields');
      setTitle("");
      setAuthor("");
      setContent("");
      setFeaturedImage("");
      setSendEmail(false);
      setSendNotification(true);
      if (editor) {
        editor.commands.setContent('');
      }
      return;
    }

    // Load existing blog data for editing
    setTitle(editingBlog?.title || "");
    setAuthor(editingBlog?.author || "");
    setContent(editingBlog?.content || "");
    setFeaturedImage(editingBlog?.featured_image || "");

    console.log('✅ Featured image set to:', editingBlog?.featured_image || "");

    if (editor && editingBlog?.content) {
      editor.commands.setContent(editingBlog.content);
    }
  }, [editingBlog, editor]);

  // Load gallery images
  useEffect(() => {
    const loadGalleryImages = async () => {
      try {
        const { data, error } = await supabase.storage
          .from('test-bucket')
          .list('', { limit: 100, sortBy: { column: 'created_at', order: 'desc' } });

        if (error) {
          console.error('Error loading gallery images:', error);
          return;
        }

        const imagesWithUrls = data.map(file => ({
          name: file.name,
          url: supabase.storage.from('test-bucket').getPublicUrl(file.name).data.publicUrl,
          size: file.metadata?.size || 0,
          created_at: file.created_at
        }));

        setGalleryImages(imagesWithUrls);
      } catch (error) {
        console.error('Error loading gallery images:', error);
      }
    };

    loadGalleryImages();

    // Refresh gallery images when component becomes visible
    const handleVisibilityChange = () => {
      if (!document.hidden) {
        loadGalleryImages();
      }
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);
    return () => document.removeEventListener('visibilitychange', handleVisibilityChange);
  }, []);

  const insertImageAtCursor = (imageUrl) => {
    if (editor) {
      editor.chain().focus().setImage({ src: imageUrl }).run();
      console.log('🪄 Image inserted at cursor position');
    }
  };

  const insertImageFromGallery = (imageUrl, imageName) => {
    insertImageAtCursor(imageUrl);
    setShowImageSelector(false);
  };

  const handleImageUpload = async (file) => {
    if (!file) return;

    console.log('🖼️ Image selected:', file.name);

    // Check file size (limit to 5MB)
    if (file.size > 5 * 1024 * 1024) {
      alert("File size too large. Please choose an image under 5MB.");
      return;
    }

    try {
      console.log('☁️ Uploading to Supabase...');

      // Create a clean filename
      const cleanFileName = file.name.replace(/[^a-zA-Z0-9.-]/g, '_');
      const fileName = `blog-${Date.now()}-${cleanFileName}`;

      const { data, error } = await supabase.storage
        .from("test-bucket")
        .upload(fileName, file, {
          cacheControl: '3600',
          upsert: false,
          contentType: file.type
        });

      if (error) {
        console.error("Upload failed:", error);
        alert("Image upload failed: " + error.message);
        return;
      }

      // Get public URL
      const { data: urlData } = supabase.storage
        .from("test-bucket")
        .getPublicUrl(data.path);

      if (!urlData?.publicUrl) {
        console.error("Failed to get public URL");
        alert("Upload succeeded but failed to get image URL");
        return;
      }

      // Insert image at cursor position
      insertImageAtCursor(urlData.publicUrl);

      console.log('✅ Uploaded successfully:', urlData.publicUrl);
      alert("Image uploaded and inserted successfully!");
    } catch (err) {
      console.error("Unexpected error:", err);
      alert("Unexpected error during upload: " + err.message);
    }
  };

  const handleSendTestEmail = async () => {
    if (!testEmail) return;

    try {
      console.log('📧 Sending test email to:', testEmail);

      const blogData = {
        title,
        excerpt: content.replace(/<[^>]*>/g, '').substring(0, 300) + (content.length > 300 ? '...' : ''),
        featuredImageURL: featuredImage,
        url: `${window.location.origin}/updates`
      };

      const response = await fetch('https://rwwmyvrjvlibpzyqzxqg.functions.supabase.co/rapid-worker', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          type: 'blog_update',
          blog: blogData
        })
      });

      if (!response.ok) {
        const errorText = await response.text();
        console.error('💥 Error:', errorText);
        alert(`❌ Failed to send test email: Server responded with ${response.status} - ${errorText}`);
        return;
      }

      const data = await response.json();
      console.log('✅ Test email sent successfully:', data);
      alert(`✅ Test email sent to ${testEmail}! Check your inbox.`);
    } catch (error) {
      console.error('💥 Unexpected error sending test email:', error);
      alert('❌ Unexpected error sending test email: ' + error.message);
    }
  };

  const handleFeaturedImageUpload = async (file) => {
    if (!file) return;

    console.log('🖼️ Featured image selected:', file.name, 'Size:', (file.size / 1024 / 1024).toFixed(2) + 'MB');

    // Check file size (limit to 5MB)
    if (file.size > 5 * 1024 * 1024) {
      alert("File size too large. Please choose an image under 5MB.");
      return;
    }

    try {
      console.log('☁️ Uploading featured image to Supabase...');

      // Create a clean filename
      const cleanFileName = file.name.replace(/[^a-zA-Z0-9.-]/g, '_');
      const fileName = `featured-${Date.now()}-${cleanFileName}`;

      console.log('📁 Upload path:', fileName);

      const { data, error } = await supabase.storage
        .from("test-bucket")
        .upload(fileName, file, {
          cacheControl: '3600',
          upsert: false,
          contentType: file.type
        });

      if (error) {
        console.error("❌ Featured image upload failed:", error);
        alert("Featured image upload failed: " + error.message);
        return;
      }

      console.log('✅ Upload successful, data.path:', data.path);

      // Get public URL
      const { data: urlData } = supabase.storage
        .from("test-bucket")
        .getPublicUrl(data.path);

      if (!urlData?.publicUrl) {
        console.error("❌ Failed to get featured image URL");
        alert("Upload succeeded but failed to get image URL");
        return;
      }

      console.log('🔗 Generated public URL:', urlData.publicUrl);

      setFeaturedImage(urlData.publicUrl);
      console.log('✅ Featured image state updated to:', urlData.publicUrl);
      alert("Featured image uploaded successfully!");
    } catch (err) {
      console.error("💥 Unexpected error during featured image upload:", err);
      alert("Unexpected error during featured image upload: " + err.message);
    }
  };

  const handlePublish = async () => {
    setSaving(true);

    try {
      console.log('🚀 Publishing blog...');
      console.log('📸 Featured image to save:', featuredImage);
      console.log('📝 Blog data:', { title, author, content: content.substring(0, 100) + '...', featuredImage });

      let error;
      let blogId;

      if (editingBlog) {
        console.log('✏️ Updating existing blog:', editingBlog.id);
        const updateData = {
          title,
          author,
          content,
          featured_image: featuredImage || null,
          updated_at: new Date().toISOString(),
        };
        console.log('📤 Update data:', updateData);
        ({ error } = await supabase.from("blogs").update(updateData).eq('id', editingBlog.id));
        blogId = editingBlog.id;
      } else {
        console.log('📝 Creating new blog');
        const insertData = {
          title,
          author,
          content,
          featured_image: featuredImage || null,
          published: true,
          created_at: new Date().toISOString(),
        };
        console.log('📤 Insert data:', insertData);
        const { data, error: insertError } = await supabase.from("blogs").insert(insertData).select('id').single();

        error = insertError;
        blogId = data?.id;
        console.log('✅ New blog created with ID:', blogId);
      }

      if (error) {
        console.error("Error saving blog:", error);
        setMessage("⚠️ Failed to save blog: " + error.message);
        return;
      }

      console.log("Blog saved successfully:", { title, author, content: content.substring(0, 100) + "..." });

      // Send email newsletter to waitlist members if requested
      if (sendEmail) {
        try {
          console.log("📧 Sending email newsletter to waitlist members...");

          const blogData = {
            title,
            excerpt: content.replace(/<[^>]*>/g, '').substring(0, 300) + (content.length > 300 ? '...' : ''),
            featuredImageURL: featuredImage,
            url: `${window.location.origin}/updates`
          };

          const response = await fetch('https://rwwmyvrjvlibpzyqzxqg.functions.supabase.co/rapid-worker', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              type: 'blog_update',
              blog: blogData
            })
          });

          if (!response.ok) {
            const errorText = await response.text();
            console.error('❌ Newsletter send failed:', errorText);
            setMessage(prev => prev + " ⚠️ Blog saved but newsletter failed: " + errorText);
          } else {
            const data = await response.json();
            console.log('✅ Newsletter sent successfully:', data);
            setMessage(prev => prev + " 📧 Newsletter sent to all waitlist members!");
          }
        } catch (emailError) {
          console.error("Error sending newsletter:", emailError);
          setMessage(prev => prev + " ⚠️ Blog saved but newsletter failed: " + emailError.message);
        }
      }

      // Send member notifications if requested (same as newsletter but can be separate if needed)
      if (sendNotification) {
        try {
          console.log("🔔 Sending member notifications...");

          const blogData = {
            title,
            excerpt: content.replace(/<[^>]*>/g, '').substring(0, 300) + (content.length > 300 ? '...' : ''),
            featuredImageURL: featuredImage,
            url: `${window.location.origin}/updates`
          };

          const response = await fetch('https://rwwmyvrjvlibpzyqzxqg.functions.supabase.co/rapid-worker', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              type: 'blog_update',
              blog: blogData
            })
          });

          if (!response.ok) {
            const errorText = await response.text();
            console.error('❌ Notifications send failed:', errorText);
            setMessage(prev => prev + " ⚠️ Blog saved but notifications failed: " + errorText);
          } else {
            const data = await response.json();
            console.log('✅ Notifications sent successfully:', data);
            setMessage(prev => prev + " 🔔 Notifications sent to all members!");
          }
        } catch (notificationError) {
          console.error("Error sending member notifications:", notificationError);
          setMessage(prev => prev + " ⚠️ Blog saved but notifications failed: " + notificationError.message);
        }
      }

      setMessage(editingBlog ? "✅ Blog updated successfully!" : "✅ Blog published successfully!");
      if (!editingBlog) {
        console.log('🔄 Resetting form for new blog creation');
        console.log('📸 Clearing featured image from state');
        setTitle("");
        setAuthor("");
        setContent("");
        setFeaturedImage("");
        setSendEmail(false);
        setSendNotification(true); // Reset to default
        console.log('✅ Form reset complete');
      }
      onSave && onSave();
    } catch (err) {
      console.error("Unexpected error saving blog:", err);
      setMessage("⚠️ Unexpected error: " + err.message);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto bg-gradient-to-br from-white to-green-50 p-8 rounded-3xl shadow-2xl border border-green-100 mt-10 relative overflow-hidden">
      <div className="absolute top-0 right-0 w-32 h-32 bg-green-200 rounded-full blur-3xl opacity-20"></div>
      <div className="absolute bottom-0 left-0 w-24 h-24 bg-emerald-300 rounded-full blur-2xl opacity-30"></div>

      <div className="relative z-10">
        <h2 className="text-3xl font-bold text-green-900 mb-2 flex items-center">
          <span className="mr-3">🧬</span>
          {editingBlog ? "Edit Blog Post" : "Create New Blog"}
        </h2>
        <p className="text-green-700 mb-8 font-medium">Craft your story with rich formatting and embedded images</p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          <div>
            <label className="block text-sm font-semibold text-green-800 mb-2">Blog Title</label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Enter an engaging title..."
              className="w-full border-2 border-green-200 p-4 rounded-xl focus:ring-4 focus:ring-green-300 focus:border-green-400 transition-all shadow-sm"
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-green-800 mb-2">Author Name</label>
            <input
              type="text"
              value={author}
              onChange={(e) => setAuthor(e.target.value)}
              placeholder="Your name"
              className="w-full border-2 border-green-200 p-4 rounded-xl focus:ring-4 focus:ring-green-300 focus:border-green-400 transition-all shadow-sm"
            />
          </div>
        </div>

        <div className="mb-6">
          <label className="block text-sm font-semibold text-green-800 mb-2">Featured Image (for Email)</label>
          <div className="flex gap-4 items-center">
            <label className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-all shadow-md hover:shadow-lg transform hover:-translate-y-0.5 cursor-pointer">
              📷 Upload Featured Image
              <input
                type="file"
                accept="image/*"
                onChange={(e) => handleFeaturedImageUpload(e.target.files[0])}
                className="hidden"
              />
            </label>
            {featuredImage && (
              <div className="flex items-center gap-2">
                <img src={featuredImage} alt="Featured" className="w-16 h-16 object-cover rounded-lg border-2 border-green-200" />
                <span className="text-sm text-gray-600">Featured image set</span>
              </div>
            )}
          </div>
        </div>

        <div className="mb-6 space-y-4">
          <div>
            <label className="flex items-center gap-2">
              <input
                type="checkbox"
                checked={sendEmail}
                onChange={(e) => setSendEmail(e.target.checked)}
                className="w-4 h-4 text-green-600 bg-gray-100 border-gray-300 rounded focus:ring-green-500"
              />
              <span className="text-sm font-semibold text-green-800">Send as Email Newsletter</span>
            </label>
            <p className="text-xs text-gray-600 mt-1">Send this blog post as a styled email to newsletter subscribers</p>
          </div>

          <div>
            <label className="flex items-center gap-2">
              <input
                type="checkbox"
                checked={sendNotification}
                onChange={(e) => setSendNotification(e.target.checked)}
                className="w-4 h-4 text-green-600 bg-gray-100 border-gray-300 rounded focus:ring-green-500"
              />
              <span className="text-sm font-semibold text-green-800">Send Notification to Members</span>
            </label>
            <p className="text-xs text-gray-600 mt-1">Send a notification email to all Biovance members about this new blog post</p>
          </div>

          <div className="border-t border-gray-200 pt-4">
            <label className="block text-sm font-semibold text-green-800 mb-2">Test Email Preview</label>
            <div className="flex gap-2">
              <input
                type="email"
                value={testEmail}
                onChange={(e) => setTestEmail(e.target.value)}
                placeholder="your-email@example.com"
                className="flex-1 border-2 border-green-200 p-3 rounded-xl focus:ring-4 focus:ring-green-300 focus:border-green-400 transition-all text-sm"
              />
              <button
                onClick={handleSendTestEmail}
                disabled={!testEmail || saving}
                className="bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white px-4 py-3 rounded-xl transition-all shadow-md hover:shadow-lg font-semibold disabled:cursor-not-allowed transform hover:-translate-y-0.5"
              >
                📧 Send Test
              </button>
            </div>
            <p className="text-xs text-gray-600 mt-1">Send a preview of this blog email to yourself before publishing</p>
          </div>
        </div>

        {/* Rich Text Editor */}
        <div className="mb-8">
          <label className="block text-sm font-semibold text-green-800 mb-3">Blog Content</label>
          <div className="bg-white rounded-xl border border-green-200 overflow-hidden shadow-lg">
            <div className="flex border-b border-gray-200 bg-gray-50">
              <button
                onClick={() => setIsPreview(false)}
                className={`px-6 py-3 text-sm font-medium transition-colors ${!isPreview ? 'bg-green-100 text-green-800 border-b-2 border-green-500' : 'text-gray-600 hover:text-gray-800 hover:bg-gray-100'}`}
              >
                ✏️ Write
              </button>
              <button
                onClick={() => setIsPreview(true)}
                className={`px-6 py-3 text-sm font-medium transition-colors ${isPreview ? 'bg-green-100 text-green-800 border-b-2 border-green-500' : 'text-gray-600 hover:text-gray-800 hover:bg-gray-100'}`}
              >
                👁️ Preview
              </button>
            </div>

            {!isPreview ? (
              <div className="relative">
                {/* Enhanced Toolbar */}
                <div className="flex flex-wrap gap-2 p-4 border-b border-gray-200 bg-white">
                  <button
                    onClick={() => editor?.chain().focus().toggleBold().run()}
                    className={`px-4 py-2 text-sm font-medium rounded-lg transition-all ${editor?.isActive('bold') ? 'bg-green-600 text-white shadow-md' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}`}
                    title="Bold"
                  >
                    <strong>B</strong>
                  </button>
                  <button
                    onClick={() => editor?.chain().focus().toggleItalic().run()}
                    className={`px-4 py-2 text-sm font-medium rounded-lg transition-all ${editor?.isActive('italic') ? 'bg-green-600 text-white shadow-md' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}`}
                    title="Italic"
                  >
                    <em>I</em>
                  </button>
                  <button
                    onClick={() => editor?.chain().focus().toggleHeading({ level: 1 }).run()}
                    className={`px-4 py-2 text-sm font-medium rounded-lg transition-all ${editor?.isActive('heading', { level: 1 }) ? 'bg-green-600 text-white shadow-md' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}`}
                    title="Heading 1"
                  >
                    H1
                  </button>
                  <button
                    onClick={() => editor?.chain().focus().toggleHeading({ level: 2 }).run()}
                    className={`px-4 py-2 text-sm font-medium rounded-lg transition-all ${editor?.isActive('heading', { level: 2 }) ? 'bg-green-600 text-white shadow-md' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}`}
                    title="Heading 2"
                  >
                    H2
                  </button>
                  <button
                    onClick={() => editor?.chain().focus().toggleBulletList().run()}
                    className={`px-4 py-2 text-sm font-medium rounded-lg transition-all ${editor?.isActive('bulletList') ? 'bg-green-600 text-white shadow-md' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}`}
                    title="Bullet List"
                  >
                    • List
                  </button>
                  <button
                    onClick={() => {
                      const url = window.prompt('Enter URL:');
                      if (url) {
                        editor?.chain().focus().setLink({ href: url }).run();
                      }
                    }}
                    className={`px-4 py-2 text-sm font-medium rounded-lg transition-all ${editor?.isActive('link') ? 'bg-green-600 text-white shadow-md' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}`}
                    title="Add Link"
                  >
                    🔗 Link
                  </button>
                  <label className="px-4 py-2 text-sm font-medium rounded-lg bg-blue-600 text-white hover:bg-blue-700 cursor-pointer transition-all shadow-md hover:shadow-lg" title="Insert Image">
                    📷 Image
                    <input
                      type="file"
                      accept="image/*"
                      onChange={(e) => handleImageUpload(e.target.files[0])}
                      className="hidden"
                    />
                  </label>
                </div>

                {/* Editor with better styling */}
                <EditorContent
                  editor={editor}
                  className="min-h-[500px] p-6 prose prose-lg max-w-none focus:outline-none"
                  style={{
                    fontFamily: 'Inter, system-ui, sans-serif',
                    lineHeight: '1.7',
                    fontSize: '16px'
                  }}
                />
              </div>
            ) : (
              /* Enhanced Preview Mode */
              <div className="min-h-[500px] p-6 bg-gray-50">
                <div className="max-w-4xl mx-auto">
                  {featuredImage && (
                    <img
                      src={featuredImage}
                      alt="Featured"
                      className="w-full max-h-64 object-cover rounded-lg mb-6 shadow-md"
                    />
                  )}
                  <h1 className="text-3xl font-bold text-gray-900 mb-4">{title || 'Blog Title'}</h1>
                  <p className="text-gray-600 mb-6">By {author || 'Author'} • {new Date().toLocaleDateString()}</p>
                  <div
                    className="prose prose-lg max-w-none"
                    style={{
                      fontFamily: 'Inter, system-ui, sans-serif',
                      lineHeight: '1.8',
                      color: '#374151'
                    }}
                    dangerouslySetInnerHTML={{ __html: content }}
                  />
                </div>
              </div>
            )}
          </div>
        </div>


        {/* Image Selector Modal */}
        {showImageSelector && (
          <div className="mb-6 p-4 bg-white rounded-xl border border-gray-200">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold text-gray-800">Select Image from Gallery</h3>
              <button
                onClick={() => setShowImageSelector(false)}
                className="text-gray-500 hover:text-gray-700"
              >
                ✕
              </button>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-h-60 overflow-y-auto">
              {galleryImages.map((image, index) => (
                <div
                  key={index}
                  onClick={() => insertImageFromGallery(image.url, image.name)}
                  className="cursor-pointer border border-gray-200 rounded-lg overflow-hidden hover:border-green-400 transition-colors"
                >
                  <img
                    src={image.url}
                    alt={image.name}
                    className="w-full h-20 object-cover"
                  />
                  <div className="p-2 text-xs text-gray-600 truncate">
                    {image.name}
                  </div>
                </div>
              ))}
            </div>
            {galleryImages.length === 0 && (
              <p className="text-center text-gray-500 py-8">No images in gallery yet. Upload some images first!</p>
            )}
          </div>
        )}

        <div className="flex flex-col sm:flex-row gap-4 justify-end">
          {editingBlog && (
            <button
              onClick={() => onSave && onSave()}
              className="bg-gray-500 hover:bg-gray-600 text-white px-8 py-3 rounded-xl transition-all shadow-md hover:shadow-lg font-semibold"
            >
              ❌ Cancel Edit
            </button>
          )}
          <button
            onClick={handlePublish}
            disabled={saving}
            className="bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white px-8 py-3 rounded-xl transition-all shadow-md hover:shadow-lg font-semibold disabled:opacity-50 disabled:cursor-not-allowed transform hover:-translate-y-0.5"
          >
            {saving ? (
              <span className="flex items-center">
                <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                {editingBlog ? "Updating..." : "Publishing..."}
              </span>
            ) : (
              <span className="flex items-center">
                🚀 {editingBlog ? "Update Blog" : "Publish Blog"}
              </span>
            )}
          </button>
        </div>

        {message && (
          <div className={`mt-6 p-4 rounded-xl border-2 ${
            message.includes("✅")
              ? "bg-green-50 border-green-200 text-green-800"
              : "bg-red-50 border-red-200 text-red-800"
          }`}>
            <p className="font-semibold">{message}</p>
          </div>
        )}
      </div>
    </div>
  );
}