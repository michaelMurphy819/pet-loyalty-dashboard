"use client";

import { useState } from "react";
import { Download, Loader2 } from "lucide-react";
import { toPng } from "html-to-image";
import { useTranslations } from "next-intl";

export function ExportButton() {
  const [isExporting, setIsExporting] = useState(false);
  const t = useTranslations("Dashboard.reporting");

  const handleExport = async () => {
    setIsExporting(true);
    try {
      const element = document.getElementById("dashboard-export-area");
      if (!element) return;

      const dataUrl = await toPng(element, {
        backgroundColor: "#f8fafc", // slate-50 to match background
        pixelRatio: 2, // High resolution for PDFs and presentations
      });

      const link = document.createElement("a");
      link.href = dataUrl;
      link.download = `pet-loyalty-dashboard-${new Date().toISOString().split('T')[0]}.png`;
      link.click();
    } catch (error) {
      console.error("Export failed:", error);
    } finally {
      setIsExporting(false);
    }
  };

  return (
    <button
      onClick={handleExport}
      disabled={isExporting}
      className="flex items-center gap-2 px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-medium rounded-lg shadow-sm transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
    >
      {isExporting ? <Loader2 className="w-4 h-4 animate-spin" /> : <Download className="w-4 h-4" />}
      {t("exportReport")}
    </button>
  );
}
