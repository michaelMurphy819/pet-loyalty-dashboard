"use client";

import React, { useMemo } from "react";
import { ComposableMap, Geographies, Geography, ZoomableGroup } from "react-simple-maps";
import { scaleQuantize } from "d3-scale";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useRouter } from "next/navigation";
import { Tooltip } from "react-tooltip";

const geoUrl = "https://cdn.jsdelivr.net/npm/world-atlas@2/countries-110m.json";

interface WorldHeatmapProps {
  data: Record<string, number>; // e.g. { "US": 150, "FR": 120 }
}

export function WorldHeatmap({ data }: WorldHeatmapProps) {
  const router = useRouter();

  // Map alpha-2 codes to full country names using Intl.DisplayNames
  const alpha2ToName = useMemo(() => {
    const regionNames = new Intl.DisplayNames(['en'], { type: 'region' });
    const mapping: Record<string, { code: string, value: number }> = {};
    
    Object.entries(data).forEach(([code, value]) => {
      try {
        const name = regionNames.of(code);
        if (name) {
          mapping[name.toLowerCase()] = { code, value };
        }
      } catch (e) {
        // Ignore invalid codes
      }
    });
    // Add common variations
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
        "#a5b4fc",
        "#818cf8",
        "#6366f1",
        "#4f46e5",
        "#4338ca",
        "#3730a3",
        "#312e81",
      ]);
  }, [data]);

  return (
    <Card className="flex flex-col h-full w-full">
      <CardHeader>
        <CardTitle className="text-sm font-medium text-slate-500">
          Global Adoption Heatmap
        </CardTitle>
      </CardHeader>
      <CardContent className="flex-1 flex justify-center items-center overflow-hidden">
        <div className="w-full h-full min-h-[500px]">
          <ComposableMap 
            projection="geoEqualEarth" 
            projectionConfig={{ scale: 150 }}
            className="w-full h-full"
          >
            <ZoomableGroup zoom={1} minZoom={1} maxZoom={10} center={[0, 0]}>
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
                      fill={val ? colorScale(val) : "#f8fafc"}
                      stroke={val ? "#312e81" : "#e2e8f0"}
                      strokeWidth={val ? 0.8 : 0.4}
                      style={{
                        default: { outline: "none" },
                        hover: { fill: "#3b82f6", outline: "none", transition: "all 0.2s", cursor: val ? "pointer" : "default" },
                        pressed: { outline: "none" },
                      }}
                      data-tooltip-id="map-tooltip"
                      data-tooltip-content={val ? `${geo.properties.name}: ${val.toLocaleString()} Adoptions` : `${geo.properties.name}: No data`}
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
            style={{ backgroundColor: '#1e293b', color: '#fff', borderRadius: '8px', padding: '8px 12px', fontWeight: 'bold' }}
          />
        </div>
      </CardContent>
    </Card>
  );
}
