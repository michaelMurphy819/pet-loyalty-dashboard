"use client";

import React, { useMemo } from "react";
import { ComposableMap, Geographies, Geography, ZoomableGroup } from "react-simple-maps";
import { scaleQuantize } from "d3-scale";
import { Card, CardContent } from "@/components/ui/card";
import { useRouter } from "next/navigation";
import { Tooltip } from "react-tooltip";
import { Globe, MousePointerClick, Maximize2 } from "lucide-react";

const geoUrl = "https://cdn.jsdelivr.net/npm/world-atlas@2/countries-110m.json";

interface WorldHeatmapProps {
  data: Record<string, number>;
}

export function WorldHeatmap({ data }: WorldHeatmapProps) {
  const router = useRouter();

  const alpha2ToName = useMemo(() => {
    const regionNames = new Intl.DisplayNames(['en'], { type: 'region' });
    const mapping: Record<string, { code: string, value: number }> = {};
    
    Object.entries(data).forEach(([code, value]) => {
      try {
        const name = regionNames.of(code);
        if (name) {
          mapping[name.toLowerCase()] = { code, value };
        }
      } catch (e) {}
    });
    if (mapping["united states"]) mapping["united states of america"] = mapping["united states"];
    if (mapping["united kingdom"]) mapping["united kingdom of great britain and northern ireland"] = mapping["united kingdom"];
    return mapping;
  }, [data]);

  const colorScale = useMemo(() => {
    const values = Object.values(data);
    const max = values.length > 0 ? Math.max(...values) : 100;
    
    return scaleQuantize<string>()
      .domain([0, max])
      .range([
        "#c7d2fe", // Indigo 200
        "#a5b4fc", // Indigo 300
        "#818cf8", // Indigo 400
        "#6366f1", // Indigo 500
        "#4f46e5", // Indigo 600
        "#4338ca", // Indigo 700
        "#312e81", // Indigo 900
      ]);
  }, [data]);

  return (
    <Card className="border border-slate-200/80 bg-white shadow-sm hover:shadow-md transition-all rounded-2xl overflow-hidden flex flex-col h-full w-full min-h-[520px]">
      <div className="py-3 px-5 border-b border-slate-100 bg-slate-50/50 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <div className="p-1.5 rounded-lg bg-indigo-100 text-indigo-700 font-bold shadow-2xs">
            <Globe className="w-4 h-4" />
          </div>
          <h3 className="text-sm font-bold text-slate-900 leading-none">Global Territory Concentration</h3>
        </div>
        
        <div className="flex items-center gap-3">
          <span className="inline-flex items-center gap-1.5 text-[11px] font-semibold text-slate-600 bg-white px-3 py-1 rounded-full border border-slate-200 shadow-2xs">
            <MousePointerClick className="w-3.5 h-3.5 text-indigo-600" />
            Click country to open drilldown analytics
          </span>
          <span className="hidden sm:inline-flex items-center gap-1.5 text-[11px] font-semibold text-slate-500 bg-slate-100 px-2.5 py-1 rounded-full border border-slate-200/80">
            <Maximize2 className="w-3.5 h-3.5 text-slate-400" />
            Scroll to zoom
          </span>
        </div>
      </div>

      <CardContent className="flex-1 flex justify-center items-center overflow-hidden p-0 bg-slate-900/5 relative min-h-[480px]">
        <div className="w-full h-full min-h-[480px] relative">
          <ComposableMap 
            projection="geoEqualEarth" 
            projectionConfig={{ scale: 165 }}
            className="w-full h-full min-h-[480px]"
          >
            <ZoomableGroup zoom={1} minZoom={1} maxZoom={8} center={[0, 10]}>
              <Geographies geography={geoUrl}>
                {({ geographies }) =>
                  geographies.map(geo => {
                    const countryName = (geo.properties.name || "").toLowerCase();
                    const countryData = alpha2ToName[countryName];
                    const val = countryData?.value;
                    const code = countryData?.code;
                    
                    return (
                      <Geography
                        key={geo.rsmKey}
                        geography={geo}
                        fill={val ? colorScale(val) : "#f1f5f9"}
                        stroke={val ? "#1e1b4b" : "#cbd5e1"}
                        strokeWidth={val ? 0.7 : 0.35}
                        style={{
                          default: { outline: "none" },
                          hover: { 
                            fill: val ? "#f59e0b" : "#e2e8f0", 
                            stroke: "#000000", 
                            strokeWidth: 1,
                            outline: "none", 
                            transition: "all 0.15s ease-in-out", 
                            cursor: val ? "pointer" : "default" 
                          },
                          pressed: { outline: "none" },
                        }}
                        data-tooltip-id="map-tooltip"
                        data-tooltip-content={val ? `${geo.properties.name}: ${val.toLocaleString()} Adoptions` : `${geo.properties.name}: No recorded adoptions`}
                        onClick={() => {
                          if (code) {
                            router.push(`/dashboard/map/${code.toUpperCase()}`);
                          }
                        }}
                      />
                    );
                  })
                }
              </Geographies>
            </ZoomableGroup>
          </ComposableMap>
          
          <Tooltip 
            id="map-tooltip" 
            style={{ 
              backgroundColor: '#0f172a', 
              color: '#f8fafc', 
              borderRadius: '10px', 
              padding: '8px 14px', 
              fontWeight: '700', 
              fontSize: '12px',
              border: '1px solid rgba(255,255,255,0.1)',
              boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.3)' 
            }}
          />
        </div>
      </CardContent>
    </Card>
  );
}
