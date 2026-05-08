'use client'

import { useState, useEffect } from 'react'
import { Save, AlertCircle, Loader2 } from 'lucide-react'

export default function AdminSettingsPage() {
  const [settings, setSettings] = useState<any>({
    storeName: '',
    contactEmail: '',
    description: '',
    contactPhone: '',
    address: {
      line1: '',
      line2: '',
      city: '',
      state: '',
      pincode: '',
      country: ''
    },
    businessHours: {
      weekday: '',
      weekend: ''
    }
  })
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [message, setMessage] = useState('')

  useEffect(() => {
    const fetchSettings = async () => {
      try {
        const res = await fetch('/api/settings')
        const data = await res.json()
        if (data.success) {
          setSettings(data.data)
        }
      } catch (err) {
        console.error('Failed to fetch settings:', err)
      } finally {
        setLoading(false)
      }
    }
    fetchSettings()
  }, [])

  const handleChange = (e: any) => {
    const { name, value } = e.target
    if (name.includes('.')) {
      const [parent, child] = name.split('.')
      setSettings((prev: any) => ({
        ...prev,
        [parent]: {
          ...prev[parent],
          [child]: value
        }
      }))
    } else {
      setSettings((prev: any) => ({
        ...prev,
        [name]: value
      }))
    }
  }

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault()
    setSaving(true)
    setMessage('')
    try {
      const res = await fetch('/api/settings', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(settings)
      })
      const data = await res.json()
      if (data.success) {
        setMessage('Settings saved successfully')
      } else {
        setMessage('Failed to save settings')
      }
    } catch (err) {
      setMessage('An error occurred while saving')
    } finally {
      setSaving(false)
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    )
  }

  return (
    <main className="flex-1">
      {/* Header */}
      <div className="bg-secondary border-b border-border sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div>
            <h1 className="font-serif text-3xl font-bold text-primary">
              Settings
            </h1>
            <p className="text-foreground/60 text-sm mt-1">
              Manage store configuration and SEO settings
            </p>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {message && (
          <div className={`mb-6 p-4 rounded-sm border ${message.includes('successfully') ? 'bg-green-50 border-green-200 text-green-800' : 'bg-red-50 border-red-200 text-red-800'}`}>
            {message}
          </div>
        )}

        {/* Store Settings */}
        <div className="bg-background border border-border rounded-sm p-6 mb-6">
          <h2 className="font-semibold text-lg text-foreground mb-6">
            Store Settings
          </h2>

          <form onSubmit={handleSave} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-foreground mb-2">
                  Store Name
                </label>
                <input
                  type="text"
                  name="storeName"
                  value={settings.storeName}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-border rounded-sm focus:outline-none focus:ring-2 focus:ring-primary"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-foreground mb-2">
                  Contact Email
                </label>
                <input
                  type="email"
                  name="contactEmail"
                  value={settings.contactEmail}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-border rounded-sm focus:outline-none focus:ring-2 focus:ring-primary"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-foreground mb-2">
                Store Description
              </label>
              <textarea
                name="description"
                value={settings.description}
                onChange={handleChange}
                rows={3}
                className="w-full px-4 py-2 border border-border rounded-sm focus:outline-none focus:ring-2 focus:ring-primary resize-none"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-foreground mb-2">
                  Contact Phone
                </label>
                <input
                  type="text"
                  name="contactPhone"
                  value={settings.contactPhone}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-border rounded-sm focus:outline-none focus:ring-2 focus:ring-primary"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-foreground mb-2">
                  Business Hours (Weekday)
                </label>
                <input
                  type="text"
                  name="businessHours.weekday"
                  value={settings.businessHours.weekday}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-border rounded-sm focus:outline-none focus:ring-2 focus:ring-primary"
                />
              </div>
            </div>

            <div className="bg-gray-50 p-4 rounded-sm space-y-4">
              <h3 className="text-sm font-medium text-foreground uppercase tracking-wider">Address Details</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <input
                  type="text"
                  name="address.line1"
                  placeholder="Address Line 1"
                  value={settings.address.line1}
                  onChange={handleChange}
                  className="px-4 py-2 border border-border rounded-sm"
                />
                <input
                  type="text"
                  name="address.line2"
                  placeholder="Address Line 2"
                  value={settings.address.line2}
                  onChange={handleChange}
                  className="px-4 py-2 border border-border rounded-sm"
                />
                <input
                  type="text"
                  name="address.city"
                  placeholder="City"
                  value={settings.address.city}
                  onChange={handleChange}
                  className="px-4 py-2 border border-border rounded-sm"
                />
                <input
                  type="text"
                  name="address.pincode"
                  placeholder="Pincode"
                  value={settings.address.pincode}
                  onChange={handleChange}
                  className="px-4 py-2 border border-border rounded-sm"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={saving}
              className="flex items-center gap-2 px-6 py-2 bg-primary text-primary-foreground font-medium rounded-sm hover:bg-primary/90 transition-colors disabled:opacity-50"
            >
              {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save size={18} />}
              Save Store Settings
            </button>
          </form>
        </div>

        {/* SEO Settings */}
        <div className="bg-background border border-border rounded-sm p-6 mb-6">
          <h2 className="font-semibold text-lg text-foreground mb-6">
            SEO Settings
          </h2>

          <form className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-foreground mb-2">
                Meta Title (Homepage)
              </label>
              <input
                type="text"
                defaultValue="Butterfly Couture | Luxury Fashion"
                maxLength={60}
                className="w-full px-4 py-2 border border-border rounded-sm focus:outline-none focus:ring-2 focus:ring-primary"
              />
              <p className="text-xs text-foreground/60 mt-1">
                60 characters recommended
              </p>
            </div>

            <div>
              <label className="block text-sm font-medium text-foreground mb-2">
                Meta Description
              </label>
              <textarea
                defaultValue="Discover exquisite butterfly-inspired luxury fashion collection. Premium couture pieces crafted with elegance and sophistication."
                maxLength={160}
                rows={3}
                className="w-full px-4 py-2 border border-border rounded-sm focus:outline-none focus:ring-2 focus:ring-primary resize-none"
              />
              <p className="text-xs text-foreground/60 mt-1">
                160 characters recommended
              </p>
            </div>

            <div>
              <label className="block text-sm font-medium text-foreground mb-2">
                Keywords
              </label>
              <input
                type="text"
                defaultValue="luxury fashion, couture, butterfly, elegant, premium"
                className="w-full px-4 py-2 border border-border rounded-sm focus:outline-none focus:ring-2 focus:ring-primary"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-foreground mb-2 flex items-center gap-2">
                <input type="checkbox" defaultChecked className="rounded" />
                Generate Sitemap Automatically
              </label>
            </div>

            <div>
              <label className="block text-sm font-medium text-foreground mb-2 flex items-center gap-2">
                <input type="checkbox" defaultChecked className="rounded" />
                Enable Search Engine Indexing
              </label>
            </div>

            <button
              type="submit"
              className="flex items-center gap-2 px-6 py-2 bg-primary text-primary-foreground font-medium rounded-sm hover:bg-primary/90 transition-colors"
            >
              <Save size={18} />
              Save SEO Settings
            </button>
          </form>
        </div>

        {/* Email Settings */}
        <div className="bg-background border border-border rounded-sm p-6 mb-6">
          <h2 className="font-semibold text-lg text-foreground mb-6">
            Email Settings
          </h2>

          <form className="space-y-6">
            <div className="bg-blue-50 border border-blue-200 rounded-sm p-4 flex gap-3">
              <AlertCircle size={20} className="text-blue-600 flex-shrink-0 mt-0.5" />
              <div>
                <p className="text-sm font-medium text-blue-900">
                  Email Integration Required
                </p>
                <p className="text-xs text-blue-800">
                  Connect your email service provider to send order confirmations and customer notifications.
                </p>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-foreground mb-2">
                SMTP Server
              </label>
              <input
                type="text"
                placeholder="smtp.example.com"
                className="w-full px-4 py-2 border border-border rounded-sm focus:outline-none focus:ring-2 focus:ring-primary"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-foreground mb-2">
                  SMTP Port
                </label>
                <input
                  type="number"
                  placeholder="587"
                  className="w-full px-4 py-2 border border-border rounded-sm focus:outline-none focus:ring-2 focus:ring-primary"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-foreground mb-2">
                  From Email Address
                </label>
                <input
                  type="email"
                  placeholder="noreply@butterflycouture.com"
                  className="w-full px-4 py-2 border border-border rounded-sm focus:outline-none focus:ring-2 focus:ring-primary"
                />
              </div>
            </div>

            <button
              type="submit"
              className="flex items-center gap-2 px-6 py-2 bg-primary text-primary-foreground font-medium rounded-sm hover:bg-primary/90 transition-colors"
            >
              <Save size={18} />
              Save Email Settings
            </button>
          </form>
        </div>

        {/* Danger Zone */}
        <div className="bg-red-50 border border-red-200 rounded-sm p-6">
          <h2 className="font-semibold text-lg text-red-900 mb-4">
            Danger Zone
          </h2>
          <p className="text-sm text-red-800 mb-4">
            These actions cannot be undone. Please proceed with caution.
          </p>
          <button className="px-6 py-2 bg-red-600 text-white font-medium rounded-sm hover:bg-red-700 transition-colors">
            Delete All Data
          </button>
        </div>
      </div>
    </main>
  )
}
