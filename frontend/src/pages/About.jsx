import React from 'react';
import { GraduationCap, Users, Code2, ExternalLink } from 'lucide-react';

export default function About() {
  const team = [
    { name: 'Aditya Anand Baranwal', reg: '230905178' },
    { name: 'Asmit Paul', reg: '230905368' },
    { name: 'Harshith Goppu', reg: '230968380' },
  ];

  return (
    <div className="w-full max-w-5xl mx-auto px-4 sm:px-8 py-10 space-y-8 text-left">
      <div className="space-y-1">
        <span className="text-[11px] font-semibold tracking-wider uppercase px-2.5 py-0.5 rounded-md bg-zinc-100 text-zinc-600 border border-zinc-200">
          Attribution
        </span>
        <h1 className="text-2xl font-bold tracking-tight text-zinc-950">About the Project</h1>
        <p className="text-sm text-zinc-500">
          Product Review Intelligence System (PRIS) — Big Data Analytics Minor Project[cite: 1].
        </p>
      </div>

      {/* Mentor Section */}
      <div className="bg-white border border-zinc-200/90 rounded-2xl p-6 shadow-xs space-y-3">
        <div className="flex items-center gap-2 text-zinc-500 text-xs font-bold uppercase tracking-wider">
          <GraduationCap size={16} />
          <span>Project Mentor & Guide</span>
        </div>
        <div>
          <h2 className="text-xl font-bold text-zinc-900">Dr. Archana Praveen Kumar</h2>
          <p className="text-xs text-zinc-500 mt-0.5">
            School of Computer Engineering, Manipal Institute of Technology, Manipal[cite: 1]
          </p>
        </div>
      </div>

      {/* Team Section */}
      <div className="space-y-3">
        <div className="flex items-center gap-2 text-zinc-500 text-xs font-bold uppercase tracking-wider">
          <Users size={16} />
          <span>Project Authors</span>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {team.map((member) => (
            <div key={member.reg} className="bg-white border border-zinc-200/90 rounded-2xl p-5 shadow-xs space-y-1">
              <h3 className="font-bold text-zinc-900 text-sm">{member.name}</h3>
              <p className="text-xs font-mono text-zinc-500">Reg: {member.reg}</p>
            </div>
          ))}
        </div>
      </div>

      {/* GitHub Section */}
      <div className="bg-zinc-900 text-white rounded-2xl p-6 sm:p-7 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border border-zinc-800 shadow-xs">
        <div className="space-y-1">
          <h2 className="text-base font-bold">Source Code & Pipeline Scripts</h2>
          <p className="text-xs text-zinc-400">
            Access the Django REST API, React client, and BERTopic/VADER preprocessing notebooks.
          </p>
        </div>
        <a
          href="https://github.com/asmit-mit/PRIS"
          target="_blank"
          rel="noreferrer"
          className="inline-flex items-center gap-2 px-4 py-2 bg-white/10 hover:bg-white/15 text-white border border-white/10 rounded-xl text-xs font-semibold transition-colors"
        >
          <Code2 size={15} />
          <span>GitHub Repository</span>
          <ExternalLink size={13} className="opacity-60" />
        </a>
      </div>
    </div>
  );
}