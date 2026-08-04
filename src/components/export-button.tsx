"use client";

import { useState } from "react";
import { usePathname } from "next/navigation";
import { Download, Loader2, FileText, Image as ImageIcon, X } from "lucide-react";
import { toPng } from "html-to-image";
import { useTranslations } from "next-intl";

export function ExportButton() {
  const [isExporting, setIsExporting] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const pathname = usePathname() || "";
  const t = useTranslations("Dashboard.reporting");

  // Determine if we are on the main dashboard menu vs any secondary drill-down page
  const strippedPath = pathname.replace(/^\/(en|es|pt)/, "");
  const isMainMenu = strippedPath === "/dashboard" || strippedPath === "/dashboard/" || strippedPath === "" || strippedPath === "/";

  const handleInitialClick = () => {
    if (isMainMenu) {
      handleExportScreenshot();
    } else {
      setShowModal(true);
    }
  };

  const handleExportScreenshot = async () => {
    setShowModal(false);
    setIsExporting(true);
    try {
      const element = document.getElementById("dashboard-export-area") || document.querySelector("main") || document.body;
      if (!element) return;

      const dataUrl = await toPng(element as HTMLElement, {
        backgroundColor: "#f8fafc",
        pixelRatio: 2,
      });

      const link = document.createElement("a");
      link.href = dataUrl;
      link.download = `pet-loyalty-export-${new Date().toISOString().split('T')[0]}.png`;
      link.click();
    } catch (error) {
      console.error("Screenshot export failed:", error);
    } finally {
      setIsExporting(false);
    }
  };

  const handleExportCsv = async () => {
    setShowModal(false);
    setIsExporting(true);
    try {
      let csvString = "";
      const tables = document.querySelectorAll("table");

      // 1. If an explicit HTML table element is rendered on screen, extract headers and row cells directly from the DOM
      if (tables.length > 0) {
        const table = tables[0];
        const rows = Array.from(table.querySelectorAll("tr"));
        const csvRows: string[] = [];
        for (const row of rows) {
          const cells = Array.from(row.querySelectorAll("th, td"));
          const rowData = cells.map(cell => {
            const text = (cell.textContent || "").trim().replace(/"/g, '""');
            return `"${text}"`;
          });
          if (rowData.length > 0) csvRows.push(rowData.join(","));
        }
        csvString = csvRows.join("\n");
      }

      // 2. Fallback: If no table element is rendered, fetch the appropriate REST API dataset for this route
      if (!csvString) {
        let apiUrl = "/api/analytics/organizations";
        if (strippedPath.includes("/map")) apiUrl = "/api/analytics/leaderboard/locations";
        else if (strippedPath.includes("/analytics")) apiUrl = "/api/analytics/timeseries/moving-average";
        
        const res = await fetch(apiUrl);
        const json = await res.json();
        const data = json.data || [];
        if (Array.isArray(data) && data.length > 0) {
          const headers = Object.keys(data[0]);
          const csvRows = [headers.join(",")];
          for (const item of data) {
            const values = headers.map(header => {
              const val = item[header];
              const stringVal = val === null || val === undefined ? "" : String(val);
              const escaped = stringVal.replace(/"/g, '""');
              return `"${escaped}"`;
            });
            csvRows.push(values.join(","));
          }
          csvString = csvRows.join("\n");
        }
      }

      if (csvString) {
        const blob = new Blob([csvString], { type: "text/csv;charset=utf-8;" });
        const url = URL.createObjectURL(blob);
        const link = document.createElement("a");
        link.href = url;
        link.download = `pet-loyalty-data-${new Date().toISOString().split('T')[0]}.csv`;
        link.click();
        URL.revokeObjectURL(url);
      } else {
        alert("No tabular data available for CSV export on this view.");
      }
    } catch (error) {
      console.error("CSV export failed:", error);
    } finally {
      setIsExporting(false);
    }
  };

  return (
    <>
      <button
        onClick={handleInitialClick}
        disabled={isExporting}
        className="flex items-center gap-2 px-4 py-2 bg-indigo-600 hover:bg-indigo-700 active:bg-indigo-800 text-white text-sm font-bold rounded-xl shadow-sm hover:shadow transition-all disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
      >
        {isExporting ? <Loader2 className="w-4 h-4 animate-spin" /> : <Download className="w-4 h-4" />}
        <span>{t("exportReport")}</span>
      </button>

      {/* Modern Modal Dialog when clicking Export Report off the main menu */}
      {showModal && (
        <div className="fixed inset-0 bg-slate-950/60 backdrop-blur-xs flex items-center justify-center z-[100] animate-in fade-in duration-200 p-4">
          <div className="bg-white border border-slate-200 shadow-2xl rounded-3xl p-6 sm:p-7 max-w-lg w-full text-slate-800 animate-in zoom-in-95 duration-200 relative">
            
            {/* Header & Dismiss Button */}
            <div className="flex items-start justify-between pb-4 border-b border-slate-100 mb-5">
              <div>
                <h3 className="text-lg sm:text-xl font-black text-slate-900 leading-tight">
                  {t("selectExportFormat") || "Select Export Format"}
                </h3>
                <p className="text-xs sm:text-sm text-slate-500 font-medium mt-1">
                  {t("exportSubtitle") || "Choose how you would like to export the current page and data."}
                </p>
              </div>
              <button
                onClick={() => setShowModal(false)}
                className="p-1.5 rounded-full hover:bg-slate-100 text-slate-400 hover:text-slate-600 transition-colors shrink-0 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Format Options Grid */}
            <div className="flex flex-col gap-3.5">
              {/* Option 1: CSV Data */}
              <button
                onClick={handleExportCsv}
                className="group flex items-start gap-4 p-4 rounded-2xl border border-slate-200 hover:border-emerald-500/80 bg-slate-50/50 hover:bg-emerald-50/40 transition-all text-left shadow-2xs hover:shadow-md cursor-pointer"
              >
                <div className="p-3 rounded-xl bg-emerald-100/80 text-emerald-700 font-bold shrink-0 group-hover:scale-105 transition-transform shadow-2xs">
                  <FileText className="w-6 h-6" />
                </div>
                <div>
                  <h4 className="text-sm sm:text-base font-extrabold text-slate-900 group-hover:text-emerald-900 transition-colors">
                    {t("downloadCsv") || "Download CSV Data"}
                  </h4>
                  <p className="text-xs text-slate-600 mt-1 leading-relaxed">
                    {t("csvDesc") || "Structured tabular spreadsheet data (.csv) for spreadsheet and DB analysis."}
                  </p>
                </div>
              </button>

              {/* Option 2: Screenshot */}
              <button
                onClick={handleExportScreenshot}
                className="group flex items-start gap-4 p-4 rounded-2xl border border-slate-200 hover:border-indigo-500/80 bg-slate-50/50 hover:bg-indigo-50/40 transition-all text-left shadow-2xs hover:shadow-md cursor-pointer"
              >
                <div className="p-3 rounded-xl bg-indigo-100/80 text-indigo-700 font-bold shrink-0 group-hover:scale-105 transition-transform shadow-2xs">
                  <ImageIcon className="w-6 h-6" />
                </div>
                <div>
                  <h4 className="text-sm sm:text-base font-extrabold text-slate-900 group-hover:text-indigo-900 transition-colors">
                    {t("downloadScreenshot") || "Download Screenshot"}
                  </h4>
                  <p className="text-xs text-slate-600 mt-1 leading-relaxed">
                    {t("screenshotDesc") || "High-resolution visual capture (.png) for slides and executive presentations."}
                  </p>
                </div>
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
