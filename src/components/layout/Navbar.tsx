import { Link, useLocation } from 'react-router-dom';
import { Home, FileUp, Calendar, Bell, Settings, HeartPulse, User } from 'lucide-react';
import { cn } from '../../utils/cn';

export function Navbar() {
  const location = useLocation();
  
  const navItems = [
    { name: 'Home', path: '/', icon: Home },
    { name: 'Upload', path: '/upload', icon: FileUp },
    { name: 'Schedule', path: '/schedule', icon: Calendar },
    { name: 'Caregiver', path: '/caregiver', icon: User },
    { name: 'Alerts', path: '/alerts', icon: Bell },
  ];

  return (
    <nav className="fixed top-0 w-full z-50 glass-card rounded-none border-t-0 border-x-0 !shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <Link to="/" className="flex items-center gap-2">
              <HeartPulse className="h-8 w-8 text-primary" />
              <span className="text-xl font-bold text-gradient">
                MedBridge
              </span>
            </Link>
          </div>
          
          <div className="hidden sm:flex sm:items-center sm:space-x-8">
            {navItems.map((item) => {
              const isActive = location.pathname === item.path;
              const Icon = item.icon;
              return (
                <Link
                  key={item.name}
                  to={item.path}
                  className={cn(
                    'inline-flex items-center gap-1.5 px-1 pt-1 text-sm font-medium border-b-2 transition-colors',
                    isActive
                      ? 'border-primary text-primary-dark'
                      : 'border-transparent text-slate-500 hover:text-slate-800 hover:border-slate-300'
                  )}
                >
                  <Icon className="w-4 h-4" />
                  {item.name}
                </Link>
              );
            })}
          </div>

          <div className="flex items-center px-2 sm:px-0">
            <Link to="/settings" className="p-2 text-slate-400 hover:text-primary rounded-full hover:bg-primary-light transition-colors">
              <Settings className="w-5 h-5" />
            </Link>
            <button className="ml-3 px-3 py-1 text-sm font-medium text-slate-600 bg-slate-100 hover:bg-slate-200 rounded-full transition-colors">
              తెలుగు
            </button>
          </div>
        </div>
      </div>
      
      {/* Mobile Nav */}
      <div className="sm:hidden flex justify-around p-2 border-t glass-panel rounded-none border-x-0 border-b-0 fixed bottom-0 w-full z-50">
         {navItems.slice(0, 4).map((item) => {
            const isActive = location.pathname === item.path;
            const Icon = item.icon;
            return (
              <Link
                key={item.name}
                to={item.path}
                className={cn(
                  'flex flex-col items-center p-2 rounded-xl transition-colors',
                  isActive ? 'text-primary bg-primary-light/50' : 'text-slate-400 hover:text-slate-600'
                )}
              >
                <Icon className="w-6 h-6 mb-1" />
                <span className="text-[10px] uppercase font-bold tracking-wider">{item.name}</span>
              </Link>
            );
          })}
      </div>
    </nav>
  );
}
