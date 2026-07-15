"use client";

import { Download } from "lucide-react";

export function DownloadCsvButton({ data, label }: { data: any[], label: string }) {
  const handleDownload = () => {
    if (!data || data.length === 0) return;
    
    // Extract headers
    const headers = Object.keys(data[0]);
    
    // Convert data to CSV format
    const csvRows = [];
    csvRows.push(headers.join(","));
    
    for (const row of data) {
      const values = headers.map(header => {
        const val = row[header];
        // Escape quotes and wrap in quotes if there's a comma
        const stringVal = val === null || val === undefined ? "" : String(val);
        const escaped = stringVal.replace(/"/g, '""');
        return `"${escaped}"`;
      });
      csvRows.push(values.join(","));
    }
    
    const csvString = csvRows.join("\n");
    const blob = new Blob([csvString], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    
    const link = document.createElement("a");
    link.href = url;
    link.download = `regional-directory-${new Date().toISOString().split('T')[0]}.csv`;
    link.click();
    
    URL.revokeObjectURL(url);
  };

  return (
    <button 
      onClick={handleDownload}
      className="flex items-center gap-2 px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white text-sm font-medium rounded-lg shadow-sm transition-colors"
    >
      <Download className="w-4 h-4" />
      {label}
    </button>
  );
}
