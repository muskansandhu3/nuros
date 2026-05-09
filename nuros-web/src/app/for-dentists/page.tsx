import React from 'react';
import Link from 'next/link';

export default function GenericInfoPage() {
  return (
    <div className="min-h-screen bg-[#0a0f1c] flex items-center justify-center text-white px-4">
      <div className="text-center max-w-lg">
         <h1 className="text-4xl font-extrabold mb-4">Coming Soon</h1>
         <p className="text-slate-400 mb-8 leading-relaxed">
           We are actively preparing this information for our public launch. Check back soon for detailed insights.
         </p>
         <Link href="/" className="inline-block bg-accent-teal text-midnight-900 font-bold px-8 py-3 rounded-xl hover:bg-[#06e3bd] transition-colors">
            Return Home
         </Link>
      </div>
    </div>
  );
}
