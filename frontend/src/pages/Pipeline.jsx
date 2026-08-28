import React from 'react';
import { Database, FileCode, Cpu, BarChart3, Layout } from 'lucide-react';

export default function Pipeline() {
  const steps = [
    {
      num: '01',
      title: 'Data Collection & Ingestion',
      category: 'Data Engineering',
      tools: 'Stanford SNAP / UCSD Amazon Review Datasets',
      icon: Database,
      desc: 'Retrieves unstructured consumer reviews containing timestamps, raw text, and numerical star ratings across target electronics categories.',
    },
    {
      num: '02',
      title: 'Text Normalization & Preprocessing',
      category: 'NLP Foundation',
      tools: 'NLTK, spaCy, WordNetLemmatizer',
      icon: FileCode,
      desc: 'Normalizes raw text via tokenization, punctuation preservation for sentiment heuristics, and e-commerce stop-word filtering while keeping unmodified review sentences intact.',
    },
    {
      num: '03',
      title: 'Automated Topic Modeling',
      category: 'Aspect Extraction',
      tools: 'BERTopic, all-MiniLM-L6-v2, UMAP, HDBSCAN, LDA',
      icon: Cpu,
      desc: 'Transforms review sentences into dense semantic vector embeddings, reduces dimensionality with UMAP, and clusters recurring aspect themes using c-TF-IDF keyword extraction.',
    },
    {
      num: '04',
      title: 'Aspect Sentiment Quantification',
      category: 'Polarity Scoring',
      tools: 'VADER (SentimentIntensityAnalyzer)',
      icon: BarChart3,
      desc: 'Evaluates each topic-assigned sentence to generate normalized compound polarity scores between -1.0 and +1.0 alongside positive, neutral, and negative ratio distributions.',
    },
    {
      num: '05',
      title: 'REST Delivery & Intelligence Dashboard',
      category: 'Application Layer',
      tools: 'Django REST Framework & React (Vite)',
      icon: Layout,
      desc: 'Persists scored ABSA metrics into the database backend and surfaces filterable product feeds, feature-level scorecards, and evidence sentence drill-downs.',
    },
  ];

  return (
    <div className="w-full max-w-5xl mx-auto px-4 sm:px-8 py-10 space-y-8 text-left">
      <div className="space-y-1">
        <span className="text-[11px] font-semibold tracking-wider uppercase px-2.5 py-0.5 rounded-md bg-zinc-100 dark:bg-zinc-800/80 text-zinc-600 dark:text-zinc-400 border border-zinc-200 dark:border-zinc-700/80">
          Architecture
        </span>
        <h1 className="text-2xl font-bold tracking-tight text-zinc-950 dark:text-zinc-50">Technical Pipeline</h1>
        <p className="text-sm text-zinc-500 dark:text-zinc-400">
          The end-to-end analytical workflow transforming raw review text into aspect-level sentiment metrics.
        </p>
      </div>

      <div className="relative border-l border-zinc-200 dark:border-zinc-800 pl-6 ml-4 space-y-6">
        {steps.map((step) => {
          const Icon = step.icon;
          return (
            <div key={step.num} className="relative group">
              <div className="absolute -left-[35px] top-4 w-5 h-5 rounded-full bg-white dark:bg-[#07090e] border-2 border-zinc-900 dark:border-white flex items-center justify-center shadow-2xs">
                <div className="w-1.5 h-1.5 rounded-full bg-zinc-900 dark:bg-white" />
              </div>

              <div className="bg-white dark:bg-[#0c1019]/90 border border-zinc-200/90 dark:border-white/10 rounded-2xl p-6 shadow-xs hover:border-zinc-300 dark:hover:border-white/20 transition-colors">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-zinc-100 dark:border-zinc-800 pb-3">
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-xl bg-zinc-100 dark:bg-zinc-800/80 text-zinc-800 dark:text-zinc-200 flex items-center justify-center border border-zinc-200 dark:border-zinc-700/80 shrink-0">
                      <Icon size={18} />
                    </div>
                    <div>
                      <span className="text-[11px] font-bold uppercase tracking-wider text-zinc-400 dark:text-zinc-500">
                        Phase {step.num} • {step.category}
                      </span>
                      <h2 className="text-base font-bold text-zinc-900 dark:text-zinc-100">{step.title}</h2>
                    </div>
                  </div>

                  <span className="text-xs font-mono bg-zinc-50 dark:bg-zinc-900/80 border border-zinc-200/80 dark:border-zinc-700/80 text-zinc-700 dark:text-zinc-300 px-2.5 py-1 rounded-lg w-fit">
                    {step.tools}
                  </span>
                </div>

                <p className="text-sm text-zinc-600 dark:text-zinc-400 mt-3.5 leading-relaxed">
                  {step.desc}
                </p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}