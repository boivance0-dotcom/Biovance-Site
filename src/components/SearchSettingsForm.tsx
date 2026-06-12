import React, { useEffect, useState } from 'react';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from '@/components/ui/select';
import { Slider } from '@/components/ui/slider';
import { Separator } from '@/components/ui/separator';
import { Button } from '@/components/ui/button';

const STORAGE_KEY = 'searchSettings';

export type SearchSettings = {
  provider: 'EcoSearch' | 'Google' | 'Bing' | 'DuckDuckGo';
  safeSearch: 'off' | 'moderate' | 'strict';
  language: 'auto' | 'en' | 'hi' | 'es' | 'fr';
  region: 'auto' | 'US' | 'IN' | 'EU';
  theme: 'system' | 'light' | 'dark';
  resultsPerPage: number;
  openInNewTab: boolean;
  suggestions: boolean;
  saveHistory: boolean;
  defaultTimeRange: 'any' | 'day' | 'week' | 'month' | 'year';
};

const defaultSettings: SearchSettings = {
  provider: 'EcoSearch',
  safeSearch: 'moderate',
  language: 'auto',
  region: 'auto',
  theme: 'system',
  resultsPerPage: 15,
  openInNewTab: true,
  suggestions: true,
  saveHistory: false,
  defaultTimeRange: 'any',
};

function loadSettings(): SearchSettings {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) return { ...defaultSettings, ...JSON.parse(raw) } as SearchSettings;
  } catch {}
  return defaultSettings;
}

export const SearchSettingsForm: React.FC = () => {
  const [settings, setSettings] = useState<SearchSettings>(defaultSettings);

  useEffect(() => {
    setSettings(loadSettings());
  }, []);

  const save = () => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(settings));
  };

  const reset = () => setSettings(defaultSettings);

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-semibold text-white">Search settings</h3>
        <p className="text-white/70 text-sm">Tune your experience. These preferences are stored in your browser.</p>
      </div>

      <Separator className="bg-white/10" />

      <div className="grid md:grid-cols-2 gap-6">
        <div className="space-y-3">
          <Label className="text-white/90">Default provider</Label>
          <Select value={settings.provider} onValueChange={(v) => setSettings(s => ({ ...s, provider: v as SearchSettings['provider'] }))}>
            <SelectTrigger className="bg-black/30 border-white/20 text-white">
              <SelectValue />
            </SelectTrigger>
            <SelectContent className="bg-black/80 text-white border-white/20">
              <SelectItem value="EcoSearch">EcoSearch</SelectItem>
              <SelectItem value="Google">Google</SelectItem>
              <SelectItem value="Bing">Bing</SelectItem>
              <SelectItem value="DuckDuckGo">DuckDuckGo</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-3">
          <Label className="text-white/90">Safe search</Label>
          <Select value={settings.safeSearch} onValueChange={(v) => setSettings(s => ({ ...s, safeSearch: v as SearchSettings['safeSearch'] }))}>
            <SelectTrigger className="bg-black/30 border-white/20 text-white">
              <SelectValue />
            </SelectTrigger>
            <SelectContent className="bg-black/80 text-white border-white/20">
              <SelectItem value="off">Off</SelectItem>
              <SelectItem value="moderate">Moderate</SelectItem>
              <SelectItem value="strict">Strict</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-3">
          <Label className="text-white/90">Language</Label>
          <Select value={settings.language} onValueChange={(v) => setSettings(s => ({ ...s, language: v as SearchSettings['language'] }))}>
            <SelectTrigger className="bg-black/30 border-white/20 text-white">
              <SelectValue />
            </SelectTrigger>
            <SelectContent className="bg-black/80 text-white border-white/20">
              <SelectItem value="auto">Auto</SelectItem>
              <SelectItem value="en">English</SelectItem>
              <SelectItem value="hi">Hindi</SelectItem>
              <SelectItem value="es">Spanish</SelectItem>
              <SelectItem value="fr">French</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-3">
          <Label className="text-white/90">Region</Label>
          <Select value={settings.region} onValueChange={(v) => setSettings(s => ({ ...s, region: v as SearchSettings['region'] }))}>
            <SelectTrigger className="bg-black/30 border-white/20 text-white">
              <SelectValue />
            </SelectTrigger>
            <SelectContent className="bg-black/80 text-white border-white/20">
              <SelectItem value="auto">Auto</SelectItem>
              <SelectItem value="US">United States</SelectItem>
              <SelectItem value="IN">India</SelectItem>
              <SelectItem value="EU">Europe</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-3">
          <Label className="text-white/90">Theme</Label>
          <Select value={settings.theme} onValueChange={(v) => setSettings(s => ({ ...s, theme: v as SearchSettings['theme'] }))}>
            <SelectTrigger className="bg-black/30 border-white/20 text-white">
              <SelectValue />
            </SelectTrigger>
            <SelectContent className="bg-black/80 text-white border-white/20">
              <SelectItem value="system">System</SelectItem>
              <SelectItem value="light">Light</SelectItem>
              <SelectItem value="dark">Dark</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-3">
          <Label className="text-white/90">Results per page: <span className="text-white/70">{settings.resultsPerPage}</span></Label>
          <Slider defaultValue={[settings.resultsPerPage]} min={10} max={50} step={5}
            onValueChange={(v) => setSettings(s => ({ ...s, resultsPerPage: v[0] }))} className="w-full" />
        </div>
      </div>

      <Separator className="bg-white/10" />

      <div className="grid md:grid-cols-3 gap-6">
        <div className="flex items-center justify-between py-1">
          <div>
            <Label className="text-white/90">Open results in new tab</Label>
            <div className="text-white/60 text-xs">Middle-click or switch to open in same tab</div>
          </div>
          <Switch checked={settings.openInNewTab} onCheckedChange={(v) => setSettings(s => ({ ...s, openInNewTab: v }))} />
        </div>

        <div className="flex items-center justify-between py-1">
          <div>
            <Label className="text-white/90">Show suggestions</Label>
            <div className="text-white/60 text-xs">Autocomplete as you type</div>
          </div>
          <Switch checked={settings.suggestions} onCheckedChange={(v) => setSettings(s => ({ ...s, suggestions: v }))} />
        </div>

        <div className="flex items-center justify-between py-1">
          <div>
            <Label className="text-white/90">Save history</Label>
            <div className="text-white/60 text-xs">Store queries in this browser</div>
          </div>
          <Switch checked={settings.saveHistory} onCheckedChange={(v) => setSettings(s => ({ ...s, saveHistory: v }))} />
        </div>
      </div>

      <div className="space-y-3">
        <Label className="text-white/90">Default time range</Label>
        <Select value={settings.defaultTimeRange} onValueChange={(v) => setSettings(s => ({ ...s, defaultTimeRange: v as SearchSettings['defaultTimeRange'] }))}>
          <SelectTrigger className="bg-black/30 border-white/20 text-white">
            <SelectValue />
          </SelectTrigger>
          <SelectContent className="bg-black/80 text-white border-white/20">
            <SelectItem value="any">Any time</SelectItem>
            <SelectItem value="day">Past 24 hours</SelectItem>
            <SelectItem value="week">Past week</SelectItem>
            <SelectItem value="month">Past month</SelectItem>
            <SelectItem value="year">Past year</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <Separator className="bg-white/10" />

      <div className="flex items-center justify-between">
        <Button variant="secondary" className="bg-white/10 text-white border border-white/20" onClick={reset}>Reset</Button>
        <Button className="bg-[#86C232] text-black hover:bg-[#79b22e]" onClick={save}>Save</Button>
      </div>
    </div>
  );
};

export default SearchSettingsForm;