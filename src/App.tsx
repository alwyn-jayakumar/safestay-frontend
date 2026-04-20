import { Scanner } from './features/care/Scanner';
import { LayoutDashboard, UserCheck, Settings } from 'lucide-react';

function App() {
  return (
    <div className="min-h-screen bg-slate-50 pb-20">
      <header className="bg-white p-4 shadow-sm border-b sticky top-0 z-10">
        <h1 className="text-blue-600 font-extrabold text-2xl tracking-tight">SafeStay</h1>
      </header>

      <main className="max-w-md mx-auto py-6">
        <Scanner onVerified={(data) => console.log("Verify this in FastAPI:", data)} />
      </main>

      {/* Mobile Bottom Navigation */}
      <nav className="fixed bottom-0 left-0 right-0 bg-white border-t flex justify-around p-3 shadow-[0_-2px_10px_rgba(0,0,0,0.05)]">
        <button className="flex flex-col items-center text-blue-600">
          <LayoutDashboard size={24} />
          <span className="text-[10px] font-bold">Today</span>
        </button>
        <button className="flex flex-col items-center text-slate-400">
          <UserCheck size={24} />
          <span className="text-[10px] font-bold">Patients</span>
        </button>
        <button className="flex flex-col items-center text-slate-400">
          <Settings size={24} />
          <span className="text-[10px] font-bold">Settings</span>
        </button>
      </nav>
    </div>
  );
}

export default App;