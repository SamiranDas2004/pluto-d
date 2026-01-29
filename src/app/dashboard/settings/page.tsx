'use client';

import { useEffect, useState } from 'react';
import { RotateCcw } from 'lucide-react';
import { WidgetSettings } from '@/types';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { CopyButton } from '@/components/copy-button';
import { widgetAPI } from '@/lib/api';
import { useDashboardStore } from '@/store';
import toast from 'react-hot-toast';

export default function SettingsPage() {
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('installation');
  const [settings, setSettings] = useState<WidgetSettings>({
    botToken: '',
    primaryColor: '#007bff',
    textColor: '#ffffff',
    fontFamily: 'Arial, sans-serif',
    position: 'bottom-right',
    welcomeMessage: 'Hi! How can I help you today?',
  });
  const { widgetSettings, setWidgetSettings } = useDashboardStore();

  useEffect(() => {
    fetchSettings();
  }, []);

  const fetchSettings = async () => {
    try {
      const response = await widgetAPI.get();
      setSettings(response.data);
      setWidgetSettings(response.data);
    } catch (error) {
      toast.error('Failed to load widget settings');
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    try {
      await widgetAPI.update({
        primary_color: settings.primaryColor,
        text_color: settings.textColor,
        font_family: settings.fontFamily,
        position: settings.position,
        welcome_message: settings.welcomeMessage,
      });
      setWidgetSettings(settings);
      toast.success('Settings saved successfully!');
    } catch (error) {
      toast.error('Failed to save settings');
    }
  };

  const handleRegenerateToken = async () => {
    try {
      const response = await widgetAPI.regenerateToken();
      setSettings({ ...settings, botToken: response.data.botToken });
      toast.success('Token regenerated successfully!');
    } catch (error) {
      toast.error('Failed to regenerate token');
    }
  };

  if (loading) {
    return <div className="text-center py-12">Loading...</div>;
  }

  const API_BASE = process.env.NEXT_PUBLIC_API_URL;
  const scriptTag = `<script src="${API_BASE}/widget/widget-direct.js" data-bot-token="${settings.botToken}"></script>`;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-slate-900">Widget Settings</h1>
        <p className="text-slate-600 mt-1">Configure your chatbot widget.</p>
      </div>

      <div className="space-y-4">
        <div className="inline-flex h-10 items-center justify-center rounded-md bg-slate-100 p-1">
          <button
            onClick={() => setActiveTab('installation')}
            className={`inline-flex items-center justify-center whitespace-nowrap rounded-sm px-3 py-1.5 text-sm font-medium transition-all ${
              activeTab === 'installation' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Installation
          </button>
          <button
            onClick={() => setActiveTab('customization')}
            className={`inline-flex items-center justify-center whitespace-nowrap rounded-sm px-3 py-1.5 text-sm font-medium transition-all ${
              activeTab === 'customization' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Customization
          </button>
        </div>

        {activeTab === 'installation' && (
          <div className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Bot Token</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex gap-2">
                  <Input
                    value={settings.botToken}
                    readOnly
                    className="font-mono text-sm"
                  />
                  <CopyButton text={settings.botToken} label="Copy" />
                </div>
                <Button
                  variant="outline"
                  onClick={handleRegenerateToken}
                  className="gap-2"
                >
                  <RotateCcw className="h-4 w-4" />
                  Regenerate Token
                </Button>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Installation Script</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-sm text-slate-600">
                  Add this script tag to your website to enable the widget:
                </p>
                <div className="bg-slate-900 text-slate-100 p-4 rounded font-mono text-sm overflow-x-auto">
                  {scriptTag}
                </div>
                <CopyButton text={scriptTag} label="Copy Script" />
              </CardContent>
            </Card>
          </div>
        )}

        {activeTab === 'customization' && (
          <div className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Appearance</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div>
                  <label className="text-sm font-medium text-slate-900">Primary Color (Button & Header)</label>
                  <div className="mt-2 flex gap-3 items-center">
                    <input
                      type="color"
                      value={settings.primaryColor}
                      onChange={(e) => setSettings({ ...settings, primaryColor: e.target.value })}
                      className="w-16 h-10 rounded border border-slate-300 cursor-pointer"
                    />
                    <Input
                      value={settings.primaryColor}
                      onChange={(e) => setSettings({ ...settings, primaryColor: e.target.value })}
                      className="font-mono"
                      placeholder="#007bff"
                    />
                  </div>
                </div>

                <div>
                  <label className="text-sm font-medium text-slate-900">Text Color (Header Text)</label>
                  <div className="mt-2 flex gap-3 items-center">
                    <input
                      type="color"
                      value={settings.textColor}
                      onChange={(e) => setSettings({ ...settings, textColor: e.target.value })}
                      className="w-16 h-10 rounded border border-slate-300 cursor-pointer"
                    />
                    <Input
                      value={settings.textColor}
                      onChange={(e) => setSettings({ ...settings, textColor: e.target.value })}
                      className="font-mono"
                      placeholder="#ffffff"
                    />
                  </div>
                </div>

                <div>
                  <label className="text-sm font-medium text-slate-900">Font Family</label>
                  <select
                    value={settings.fontFamily}
                    onChange={(e) => setSettings({ ...settings, fontFamily: e.target.value })}
                    className="mt-2 w-full px-3 py-2 border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="Arial, sans-serif">Arial</option>
                    <option value="Helvetica, sans-serif">Helvetica</option>
                    <option value="'Times New Roman', serif">Times New Roman</option>
                    <option value="Georgia, serif">Georgia</option>
                    <option value="'Courier New', monospace">Courier New</option>
                    <option value="Verdana, sans-serif">Verdana</option>
                    <option value="'Trebuchet MS', sans-serif">Trebuchet MS</option>
                    <option value="'Comic Sans MS', cursive">Comic Sans MS</option>
                  </select>
                </div>

                <div>
                  <label className="text-sm font-medium text-slate-900">Position</label>
                  <div className="flex gap-4 mt-2">
                    {(['bottom-right', 'bottom-left'] as const).map((pos) => (
                      <label key={pos} className="flex items-center gap-2 cursor-pointer">
                        <input
                          type="radio"
                          name="position"
                          value={pos}
                          checked={settings.position === pos}
                          onChange={(e) =>
                            setSettings({ ...settings, position: e.target.value as 'bottom-right' | 'bottom-left' })
                          }
                          className="w-4 h-4"
                        />
                        <span className="text-sm text-slate-700 capitalize">
                          {pos === 'bottom-right' ? 'Bottom Right' : 'Bottom Left'}
                        </span>
                      </label>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="text-sm font-medium text-slate-900">Welcome Message</label>
                  <Input
                    value={settings.welcomeMessage}
                    onChange={(e) => setSettings({ ...settings, welcomeMessage: e.target.value })}
                    className="mt-2"
                    placeholder="Hi! How can I help you today?"
                    maxLength={500}
                  />
                  <p className="text-xs text-slate-500 mt-1">{settings.welcomeMessage.length} / 500 characters</p>
                </div>

                <Button onClick={handleSave} className="w-full">
                  Save Changes
                </Button>
              </CardContent>
            </Card>
          </div>
        )}
      </div>
    </div>
  );
}
