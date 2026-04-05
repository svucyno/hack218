import { GlassCard } from '../components/common/GlassCard';
import { PageHeader } from '../components/common/PageHeader';
import { Settings as SettingsIcon, Globe, Bell, Volume2, Moon } from 'lucide-react';
import { useMedBridge } from '../contexts/MedBridgeContext';

export function Settings() {
  const { settings, updateSettings } = useMedBridge();

  return (
    <div className="max-w-2xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <PageHeader
        title="Settings"
        subtitle="Manage your app preferences and notifications."
        icon={SettingsIcon}
      />

      <GlassCard className="p-2 sm:p-4">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6 p-6 border-b border-slate-100">
           <div className="flex items-center gap-4">
               <div className="p-3 bg-violet-100 text-violet-600 rounded-2xl shrink-0">
                  <Globe className="w-7 h-7" />
               </div>
               <div>
                  <h3 className="font-bold text-slate-900 text-xl">Language</h3>
                  <p className="text-slate-500 font-medium mt-1">Choose app and voice language</p>
               </div>
           </div>
           <div className="flex bg-slate-100/80 rounded-xl p-1 w-full sm:w-auto self-end sm:self-auto">
              <button 
                onClick={() => updateSettings({ language: 'en' })}
                className={`flex-1 sm:flex-none px-6 py-2.5 rounded-lg font-bold transition-all ${settings.language === 'en' ? 'bg-white shadow-md text-slate-900' : 'text-slate-500 hover:text-slate-700 hover:bg-slate-200/50'}`}
              >
                English
              </button>
              <button 
                onClick={() => updateSettings({ language: 'te' })}
                className={`flex-1 sm:flex-none px-6 py-2.5 rounded-lg font-bold transition-all ${settings.language === 'te' ? 'bg-white shadow-md text-slate-900' : 'text-slate-500 hover:text-slate-700 hover:bg-slate-200/50'}`}
              >
                తెలుగు
              </button>
           </div>
        </div>

        <div className="flex items-center justify-between gap-6 p-6 border-b border-slate-100">
           <div className="flex items-center gap-4">
               <div className="p-3 bg-emerald-100 text-emerald-600 rounded-2xl shrink-0">
                  <Bell className="w-7 h-7" />
               </div>
               <div>
                  <h3 className="font-bold text-slate-900 text-xl">Notifications</h3>
                  <p className="text-slate-500 font-medium mt-1">Manage SMS and WhatsApp reminders</p>
               </div>
           </div>
           <label className="relative inline-flex items-center cursor-pointer shrink-0">
              <input 
                 type="checkbox" 
                 checked={settings.notificationsEnabled} 
                 onChange={(e) => updateSettings({ notificationsEnabled: e.target.checked })} 
                 className="sr-only peer" 
              />
              <div className="w-14 h-8 bg-slate-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-7 after:w-7 after:transition-all peer-checked:bg-emerald-500"></div>
           </label>
        </div>

        <div className="flex items-center justify-between gap-6 p-6 border-b border-slate-100">
           <div className="flex items-center gap-4">
               <div className="p-3 bg-amber-100 text-amber-600 rounded-2xl shrink-0">
                  <Volume2 className="w-7 h-7" />
               </div>
               <div>
                  <h3 className="font-bold text-slate-900 text-xl">Voice Prompts</h3>
                  <p className="text-slate-500 font-medium mt-1">Enable spoken instructions</p>
               </div>
           </div>
           <label className="relative inline-flex items-center cursor-pointer shrink-0">
              <input 
                 type="checkbox" 
                 checked={settings.voicePromptsEnabled} 
                 onChange={(e) => updateSettings({ voicePromptsEnabled: e.target.checked })}
                 className="sr-only peer" 
              />
              <div className="w-14 h-8 bg-slate-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-7 after:w-7 after:transition-all peer-checked:bg-emerald-500"></div>
           </label>
        </div>

        <div className="flex items-center justify-between gap-6 p-6 option-disabled">
           <div className="flex items-center gap-4 opacity-50">
               <div className="p-3 bg-slate-100 text-slate-600 rounded-2xl shrink-0">
                  <Moon className="w-7 h-7" />
               </div>
               <div>
                  <h3 className="font-bold text-slate-900 text-xl">Dark Mode</h3>
                  <p className="text-slate-500 font-medium mt-1">Coming soon in next update</p>
               </div>
           </div>
           <label className="relative inline-flex items-center cursor-pointer opacity-50 shrink-0">
              <input type="checkbox" disabled className="sr-only peer" />
              <div className="w-14 h-8 bg-slate-200 peer-focus:outline-none rounded-full peer after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-7 after:w-7 after:transition-all"></div>
           </label>
        </div>
      </GlassCard>
      
      <div className="text-center text-slate-400 font-medium text-sm pt-4">
        MedBridge App v2.0.0 (Premium Build)
      </div>
    </div>
  );
}
