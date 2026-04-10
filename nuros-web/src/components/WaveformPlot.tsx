// @ts-nocheck
"use client";
import React, { useMemo } from 'react';
import dynamic from 'next/dynamic';

const Plot = dynamic(() => import('react-plotly.js'), { ssr: false });

export default function WaveformPlot({ isPlaying }: { isPlaying: boolean }) {
  // Generate random surface data resembling a glottal wave
  const zData = useMemo(() => {
    let z = [];
    for (let i = 0; i < 30; i++) {
      let row = [];
      for (let j = 0; j < 30; j++) {
        // Create a central peak with noise
        let dist = Math.sqrt(Math.pow(i - 15, 2) + Math.pow(j - 15, 2));
        let val = (15 - dist) * 2 + (Math.random() * 5);
        if (val < 0) val = Math.random() * 2;
        
        // Simulating the negative/depth based range -80 to 0
        row.push(-80 + val * 4); 
      }
      z.push(row);
    }
    return z;
  }, [isPlaying]); // Update completely to "jitter" when playing

  return (
    <div className="w-full h-[350px] relative drop-shadow-[0_0_25px_rgba(255,182,193,0.3)] pointer-events-auto z-10">
      <Plot
        data={[
          {
            z: zData,
            type: 'surface',
            colorscale: [
              [0, '#0c1a30'],
              [0.3, '#103f54'],
              [0.6, '#20b2aa'],
              [0.8, '#ffb6c1'],
              [1, '#ffffff']
            ],
            showscale: true,
            colorbar: {
              thickness: 15,
              len: 0.8,
              outlinecolor: 'transparent',
              // Use font matching the rest
              tickfont: { color: '#a0aec0', size: 10 },
              x: 1.1 // Push the legend further right
            }
          }
        ]}
        layout={{
          autosize: true,
          margin: { l: 0, r: 0, b: 0, t: 0, pad: 0 },
          paper_bgcolor: 'transparent',
          plot_bgcolor: 'transparent',
          scene: {
            xaxis: { visible: false },
            yaxis: { visible: false },
            zaxis: { visible: false, range: [-80, 0] },
            camera: {
              eye: { x: 1.5, y: 1.5, z: 0.8 } // Start with the exact angle in screenshot
            }
          }
        }}
        config={{
          displayModeBar: true,
          displaylogo: false,
          modeBarButtonsToRemove: ['toImage', 'sendDataToCloud']
        }}
        style={{ width: "100%", height: "100%" }}
        useResizeHandler={true}
      />
    </div>
  );
}
