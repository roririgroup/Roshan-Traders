import React, { useState, useEffect } from 'react';
import mammoth from 'mammoth';

export default function PRDPage() {
  const [content, setContent] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const loadDocument = async () => {
      try {
        const response = await fetch('/Project Requirement & Vision Document.docx');
        if (!response.ok) {
          throw new Error('Failed to load document');
        }
        const arrayBuffer = await response.arrayBuffer();
        const result = await mammoth.convertToHtml({ arrayBuffer });
        setContent(result.value);
        setLoading(false);
      } catch (err) {
        console.error('Error loading document:', err);
        setError('Failed to load document. Please try downloading it instead.');
        setLoading(false);
      }
    };

    loadDocument();
  }, []);

  if (loading) {
    return (
      <div className="p-6 bg-slate-50 min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#F08344] mx-auto mb-4"></div>
          <p className="text-slate-600">Loading document...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-6 bg-slate-50 min-h-screen">
        <div className="max-w-7xl mx-auto">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-slate-900 mb-2">Project Requirement & Vision Document</h1>
            <p className="text-slate-600">View the complete project documentation</p>
          </div>

          <div className="bg-white rounded-xl shadow-lg p-6 text-center">
            <p className="text-red-600 mb-4">{error}</p>
            <a
              href="/Project Requirement & Vision Document.docx"
              download
              className="inline-flex items-center px-4 py-2 bg-[#F08344] text-white rounded-lg hover:bg-[#e0763a] transition-colors"
            >
              Download Document
            </a>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 bg-slate-50 min-h-screen">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-slate-900 mb-2">Project Requirement & Vision Document</h1>
          <p className="text-slate-600">View the complete project documentation</p>
        </div>

        <div className="bg-white rounded-xl shadow-lg p-6">
          <div
            className="prose prose-slate max-w-none"
            dangerouslySetInnerHTML={{ __html: content }}
          />
        </div>
      </div>
    </div>
  );
}
