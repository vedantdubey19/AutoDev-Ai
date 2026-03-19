import React from 'react';

const Dashboard = () => {
  return (
    <div className="flex min-h-screen flex-col bg-slate-900 text-slate-50">
      <header className="flex items-center justify-between border-b border-slate-800 bg-slate-900 px-8 py-4">
        <h1 className="text-xl font-bold text-primary-500">AutoDev AI</h1>
        <div className="flex items-center gap-4">
          <span className="text-sm text-slate-400">Loading...</span>
          <div className="h-8 w-8 rounded-full bg-slate-700"></div>
        </div>
      </header>
      <main className="flex-1 p-8">
        <h2 className="mb-6 text-2xl font-semibold">Dashboard Overview</h2>
        <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
          <div className="rounded-xl border border-slate-800 bg-slate-800/50 p-6">
            <h3 className="text-sm font-medium text-slate-400">Total PRs Reviewed</h3>
            <p className="mt-2 text-3xl font-bold">0</p>
          </div>
          <div className="rounded-xl border border-slate-800 bg-slate-800/50 p-6">
            <h3 className="text-sm font-medium text-slate-400">Avg Review Time</h3>
            <p className="mt-2 text-3xl font-bold">0s</p>
          </div>
          <div className="rounded-xl border border-slate-800 bg-slate-800/50 p-6">
            <h3 className="text-sm font-medium text-slate-400">Highest Risk Active PR</h3>
            <p className="mt-2 text-3xl font-bold text-emerald-400">Low</p>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Dashboard;
