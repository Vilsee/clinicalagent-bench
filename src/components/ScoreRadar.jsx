import React from 'react';
import { Radar, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, ResponsiveContainer } from 'recharts';

export default function ScoreRadar({ axes }) {
  const data = [
    { subject: 'Accuracy', A: axes.accuracy, fullMark: 100 },
    { subject: 'Safety', A: axes.safety, fullMark: 100 },
    { subject: 'Regulatory', A: axes.compliance, fullMark: 100 },
    { subject: 'Transparency', A: axes.transparency, fullMark: 100 },
    { subject: 'Workflow', A: axes.workflow, fullMark: 100 },
  ];

  return (
    <div className="w-full h-full min-h-[350px] relative flex items-center justify-center">
      <ResponsiveContainer width="100%" height="100%">
        <RadarChart cx="50%" cy="50%" outerRadius="65%" data={data}>
          <PolarGrid stroke="rgba(255,255,255,0.1)" />
          <PolarAngleAxis dataKey="subject" tick={{ fill: 'rgba(240, 239, 244, 0.7)', fontSize: 12, fontFamily: 'Fira Code' }} />
          <PolarRadiusAxis angle={30} domain={[0, 100]} tick={false} axisLine={false} />
          <Radar 
            name="Model" 
            dataKey="A" 
            stroke="#7B61FF" 
            strokeWidth={2}
            fill="#7B61FF" 
            fillOpacity={0.4} 
            isAnimationActive={true}
            animationDuration={1500}
            animationEasing="ease-out"
          />
        </RadarChart>
      </ResponsiveContainer>
    </div>
  );
}
