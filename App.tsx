import React, { useState, useEffect } from 'react';
import { Plus, LayoutDashboard, Wallet, LogOut, Download, Share2 } from 'lucide-react';
import { ClosingForm } from './components/ClosingForm';
import { Dashboard } from './components/Dashboard';
import { CashClosingRecord } from './types';
import { MOCK_DATA, APP_NAME } from './constants';
import { analyzeClosingData } from './services/geminiService';

const App: React.FC = () => {
  // State for records, initialized from localStorage or Mock data
  const [records, setRecords] = useState<CashClosingRecord[]>(() => {
    const saved = localStorage.getItem('cashCloseRecords');
    return saved ? JSON.parse(saved) : MOCK_DATA;
  });

  const [showForm, setShowForm] = useState(false);
  const [analyzingId, setAnalyzingId] = useState<string | null>(null);
  const [installPrompt, setInstallPrompt] = useState<any>(null);

  // Persist to local storage
  useEffect(() => {
    localStorage.setItem('cashCloseRecords', JSON.stringify(records));
  }, [records]);

  // Handle PWA Install Prompt
  useEffect(() => {
    const handler = (e: any) => {
      e.preventDefault();
      setInstallPrompt(e);
    };
    window.addEventListener('beforeinstallprompt', handler);
    return () => window.removeEventListener('beforeinstallprompt', handler);
  }, []);

  const handleInstallClick = () => {
    if (!installPrompt) return;
    installPrompt.prompt();
    installPrompt.userChoice.then((choiceResult: any) => {
      if (choiceResult.outcome === 'accepted') {
        setInstallPrompt(null);
      }
    });
  };

  const handleShareClick = () => {
    const url = window.location.href;
    if (navigator.share) {
      navigator.share({
        title: APP_NAME,
        text: 'Acesse o App de Fechamento de Caixa',
        url: url,
      }).catch(console.error);
    } else {
      navigator.clipboard.writeText(url);
      alert('Link copiado! Envie para o seu celular ou do funcionário.');
    }
  };

  const handleSaveRecord = (data: Omit<CashClosingRecord, 'id' | 'totalRevenue' | 'finalBalance' | 'aiAnalysis'>) => {
    const totalRevenue = data.creditCard + data.debitCard + data.pix + data.cash + data.boleto;
    const finalBalance = totalRevenue + data.openingBalance;

    const newRecord: CashClosingRecord = {
      ...data,
      id: crypto.randomUUID(),
      totalRevenue,
      finalBalance,
    };

    setRecords(prev => [newRecord, ...prev]);
    setShowForm(false);
  };

  const handleAnalyze = async (record: CashClosingRecord) => {
    if (record.aiAnalysis) return; // Already analyzed

    setAnalyzingId(record.id);
    const analysis = await analyzeClosingData(record);
    
    setRecords(prev => prev.map(r => 
      r.id === record.id ? { ...r, aiAnalysis: analysis } : r
    ));
    setAnalyzingId(null);
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      {/* Header */}
      <header className="bg-indigo-700 text-white shadow-md sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="p-2 bg-indigo-600 rounded-lg">
              <Wallet className="w-6 h-6 text-white" />
            </div>
            <h1 className="text-xl font-bold tracking-tight hidden sm:block">{APP_NAME}</h1>
            <h1 className="text-xl font-bold tracking-tight sm:hidden">CashClose</h1>
          </div>
          
          <div className="flex items-center gap-2 sm:gap-4">
             {/* Share Button for Mobile Ease */}
             <button 
               onClick={handleShareClick}
               className="p-2 text-indigo-200 hover:text-white hover:bg-indigo-600 rounded-full transition-colors"
               title="Copiar Link / Compartilhar"
             >
               <Share2 className="w-5 h-5" />
             </button>

             {installPrompt && (
               <button 
                 onClick={handleInstallClick}
                 className="flex items-center gap-1 bg-white/10 hover:bg-white/20 px-3 py-1.5 rounded-md text-sm transition-colors"
               >
                 <Download className="w-4 h-4" />
                 <span className="hidden sm:inline">Instalar</span>
               </button>
             )}
             
             <div className="hidden md:flex text-indigo-200 text-sm items-center gap-1">
               <LayoutDashboard className="w-4 h-4" />
               <span>Painel</span>
             </div>
             <button className="text-indigo-200 hover:text-white transition-colors">
               <LogOut className="w-5 h-5" />
             </button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6">
        
        {/* Action Bar */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">Visão Geral</h2>
            <p className="text-sm text-gray-500 mt-1">Gerencie seus fechamentos de caixa diários.</p>
          </div>
          
          {!showForm && (
            <button
              onClick={() => setShowForm(true)}
              className="w-full sm:w-auto inline-flex items-center justify-center px-4 py-3 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-all hover:scale-105 active:scale-95"
            >
              <Plus className="w-5 h-5 mr-2" />
              Novo Fechamento
            </button>
          )}
        </div>

        {/* Content Area */}
        <div className="space-y-6">
          {showForm ? (
            <div className="animate-in fade-in slide-in-from-top-4 duration-300">
              <ClosingForm 
                onSave={handleSaveRecord} 
                onCancel={() => setShowForm(false)} 
              />
            </div>
          ) : (
            <Dashboard 
              records={records} 
              onAnalyze={handleAnalyze} 
              analyzingId={analyzingId}
            />
          )}
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-white border-t border-gray-200 mt-auto">
        <div className="max-w-7xl mx-auto px-4 py-6 sm:px-6 lg:px-8 flex flex-col sm:flex-row justify-between items-center gap-2">
          <p className="text-sm text-gray-500 text-center sm:text-left">© 2024 {APP_NAME}.</p>
          <div className="text-xs text-gray-400">
            Powered by Gemini AI
          </div>
        </div>
      </footer>
    </div>
  );
};

export default App;