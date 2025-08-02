'use client';

import { LatencyMetrics } from '../../types/audio';

interface LatencyMonitorProps {
  metrics: LatencyMetrics | null;
}

export const LatencyMonitor: React.FC<LatencyMonitorProps> = ({ metrics }) => {
  return (
    <div>
      <h3 className="text-lg font-semibold text-gray-800 mb-4">Performance</h3>
      {!metrics ? (
        <div className="text-center py-4">
          <svg className="w-8 h-8 text-gray-300 mx-auto mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
          </svg>
          <p className="text-sm text-gray-400">No metrics yet</p>
        </div>
      ) : (
        <div className="space-y-3">
          <div className="flex justify-between items-center">
            <span className="text-sm text-gray-600">Speech Recognition</span>
            <span className="text-sm font-mono bg-blue-100 text-blue-800 px-2 py-1 rounded-full">
              {metrics.sttLatency}ms
            </span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-sm text-gray-600">AI Response</span>
            <span className="text-sm font-mono bg-green-100 text-green-800 px-2 py-1 rounded-full">
              {metrics.apiLatency}ms
            </span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-sm text-gray-600">Text-to-Speech</span>
            <span className="text-sm font-mono bg-purple-100 text-purple-800 px-2 py-1 rounded-full">
              {metrics.ttsLatency}ms
            </span>
          </div>
          <div className="border-t border-gray-200 pt-3">
            <div className="flex justify-between items-center">
              <span className="text-sm font-medium text-gray-800">Total Time</span>
              <span className={`text-sm font-mono px-2 py-1 rounded-full ${
                metrics.totalLatency < 1200 
                  ? 'bg-green-100 text-green-800' 
                  : 'bg-red-100 text-red-800'
              }`}>
                {metrics.totalLatency}ms
              </span>
            </div>
            <div className="mt-2 text-xs text-center">
              <span className={`${
                metrics.totalLatency < 1200 ? 'text-green-600' : 'text-red-600'
              }`}>
                Target: &lt; 1200ms {metrics.totalLatency < 1200 ? '✓' : '✗'}
              </span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
