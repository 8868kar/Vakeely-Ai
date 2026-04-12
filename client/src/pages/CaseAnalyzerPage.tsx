import React, { useState, useRef } from 'react';
import { FaCloudUploadAlt, FaFileAlt, FaGavel, FaLightbulb, FaShieldAlt, FaExclamationTriangle, FaCheckCircle, FaSpinner } from 'react-icons/fa';
import api from '../services/api';

interface AnalyzerResponse {
  summary: string;
  strengths: string[];
  weaknesses: string[];
  strategy: string;
  relevantLaws: string[];
}

export default function CaseAnalyzerPage() {
  const [file, setFile] = useState<File | null>(null);
  const [text, setText] = useState('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<AnalyzerResponse | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<'upload' | 'text'>('upload');
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const droppedFile = e.dataTransfer.files[0];
      if (droppedFile.type === 'application/pdf') {
        setFile(droppedFile);
        setError(null);
      } else {
        setError('Only PDF files are supported at this time.');
      }
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const selectedFile = e.target.files[0];
      if (selectedFile.type === 'application/pdf') {
        setFile(selectedFile);
        setError(null);
      } else {
        setError('Only PDF files are supported at this time.');
      }
    }
  };

  const submitAnalysis = async () => {
    if (activeTab === 'upload' && !file) {
      setError('Please upload a PDF document for analysis.');
      return;
    }
    if (activeTab === 'text' && !text.trim()) {
      setError('Please paste the case text for analysis.');
      return;
    }

    setLoading(true);
    setError(null);
    setResult(null);

    const formData = new FormData();
    if (activeTab === 'upload' && file) {
      formData.append('document', file);
    } else {
      formData.append('text', text);
    }

    try {
      const response = await api.post('/analyzer/analyze', formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });
      if (response.data.success) {
        setResult(response.data.analysis);
      } else {
        setError('Analysis failed. Please try again.');
      }
    } catch (err: any) {
      console.error(err);
      setError(err.response?.data?.message || 'A network or server error occurred. Ensure your OpenAI API key is active.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-8 sm:px-6 lg:px-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-slate-800">Legal Case Analyzer</h1>
        <p className="mt-2 text-slate-600">Upload legal documents or paste case facts to instantly uncover strengths, weaknesses, and strategic insights using AI.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        
        {/* INPUT SECTION */}
        <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden flex flex-col h-[600px]">
          <div className="flex border-b border-slate-200">
            <button
              onClick={() => setActiveTab('upload')}
              className={`flex-1 py-4 text-center font-medium transition-colors ${activeTab === 'upload' ? 'bg-blue-50 text-blue-700 border-b-2 border-blue-600' : 'text-slate-600 hover:bg-slate-50'}`}
            >
              Upload PDF
            </button>
            <button
              onClick={() => setActiveTab('text')}
              className={`flex-1 py-4 text-center font-medium transition-colors ${activeTab === 'text' ? 'bg-blue-50 text-blue-700 border-b-2 border-blue-600' : 'text-slate-600 hover:bg-slate-50'}`}
            >
              Paste Text
            </button>
          </div>

          <div className="p-6 flex-1 flex flex-col items-center justify-center">
            {activeTab === 'upload' ? (
              <div 
                className={`w-full h-full border-2 border-dashed rounded-xl flex flex-col items-center justify-center p-6 text-center transition-all ${file ? 'border-blue-400 bg-blue-50/50' : 'border-slate-300 bg-slate-50 hover:bg-slate-100 hover:border-slate-400'}`}
                onDragOver={(e) => e.preventDefault()}
                onDrop={handleFileDrop}
              >
                {file ? (
                  <>
                    <FaFileAlt className="text-5xl text-blue-500 mb-4" />
                    <p className="text-lg font-medium text-slate-800 break-all">{file.name}</p>
                    <p className="text-sm text-slate-500 mt-1">{(file.size / 1024 / 1024).toFixed(2)} MB</p>
                    <button 
                      onClick={() => setFile(null)} 
                      className="mt-4 text-sm text-red-500 hover:underline font-medium"
                    >
                      Remove File
                    </button>
                  </>
                ) : (
                  <>
                    <FaCloudUploadAlt className="text-6xl text-slate-400 mb-4" />
                    <p className="text-lg font-medium text-slate-700 mb-2">Drag and drop your PDF here</p>
                    <p className="text-sm text-slate-500 mb-6">Max file size: 10MB</p>
                    <input 
                      type="file" 
                      accept=".pdf" 
                      className="hidden" 
                      ref={fileInputRef} 
                      onChange={handleFileChange} 
                    />
                    <button 
                      onClick={() => fileInputRef.current?.click()}
                      className="px-6 py-2 bg-white border border-slate-300 text-slate-700 font-medium rounded-lg hover:bg-slate-50 shadow-sm transition-all"
                    >
                      Browse Files
                    </button>
                  </>
                )}
              </div>
            ) : (
              <textarea
                value={text}
                onChange={(e) => setText(e.target.value)}
                placeholder="Paste your case facts, FIR details, or legal document text here..."
                className="w-full h-full p-4 border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 resize-none text-slate-700"
              />
            )}
          </div>

          <div className="p-6 border-t border-slate-100 bg-slate-50">
            {error && (
              <div className="mb-4 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg flex items-start gap-3">
                <FaExclamationTriangle className="mt-1 flex-shrink-0" />
                <p className="text-sm">{error}</p>
              </div>
            )}
            <button
              onClick={submitAnalysis}
              disabled={loading || (activeTab === 'upload' && !file) || (activeTab === 'text' && !text.trim())}
              className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-blue-300 disabled:cursor-not-allowed text-white font-medium py-3 rounded-xl shadow-sm transition-all flex items-center justify-center gap-2"
            >
              {loading ? (
                <>
                  <FaSpinner className="animate-spin" />
                  Analyzing Document...
                </>
              ) : (
                <>
                  <FaGavel />
                  Generate Case Analysis
                </>
              )}
            </button>
          </div>
        </div>

        {/* RESULTS SECTION */}
        <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden h-[600px] flex flex-col">
          {!result && !loading ? (
            <div className="flex-1 flex flex-col items-center justify-center p-8 text-center bg-slate-50/50">
              <div className="w-20 h-20 bg-blue-100 rounded-full flex items-center justify-center mb-6">
                <FaLightbulb className="text-3xl text-blue-600" />
              </div>
              <h3 className="text-xl font-semibold text-slate-800 mb-2">Awaiting Analysis</h3>
              <p className="text-slate-500 max-w-sm">Upload a document or paste text on the left to receive a comprehensive AI-powered legal breakdown.</p>
            </div>
          ) : loading ? (
            <div className="flex-1 flex flex-col items-center justify-center p-8 text-center">
              <div className="w-16 h-16 border-4 border-blue-100 border-t-blue-600 rounded-full animate-spin mb-6"></div>
              <h3 className="text-lg font-medium text-slate-800 mb-2">Processing Document...</h3>
              <p className="text-slate-500 text-sm">Our AI is extracting facts, identifying legal precedents, and formulating a strategy.</p>
            </div>
          ) : result ? (
            <div className="flex-1 overflow-y-auto p-6 space-y-8">
              {/* Summary */}
              <div>
                <h3 className="flex items-center gap-2 text-lg font-bold text-slate-800 border-b border-slate-100 pb-2 mb-3">
                  <FaFileAlt className="text-blue-500" /> Case Summary
                </h3>
                <p className="text-slate-700 leading-relaxed text-sm">{result.summary}</p>
              </div>

              {/* Strengths & Weaknesses */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-emerald-50 rounded-xl p-5 border border-emerald-100">
                  <h4 className="flex items-center gap-2 font-semibold text-emerald-800 mb-3">
                    <FaShieldAlt /> Core Strengths
                  </h4>
                  <ul className="space-y-2">
                    {result.strengths.map((str, idx) => (
                      <li key={idx} className="flex items-start gap-2 text-sm text-emerald-700">
                        <FaCheckCircle className="mt-0.5 flex-shrink-0" /> <span>{str}</span>
                      </li>
                    ))}
                  </ul>
                </div>
                
                <div className="bg-rose-50 rounded-xl p-5 border border-rose-100">
                  <h4 className="flex items-center gap-2 font-semibold text-rose-800 mb-3">
                    <FaExclamationTriangle /> Potential Loopholes
                  </h4>
                  <ul className="space-y-2">
                    {result.weaknesses.map((wk, idx) => (
                      <li key={idx} className="flex items-start gap-2 text-sm text-rose-700">
                        <span className="w-1.5 h-1.5 rounded-full bg-rose-400 mt-1.5 flex-shrink-0"></span> <span>{wk}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              {/* Legal Strategy */}
              <div className="bg-blue-50 rounded-xl p-5 border border-blue-100">
                <h3 className="flex items-center gap-2 text-lg font-bold text-blue-900 mb-3">
                  <FaLightbulb /> Recommended Strategy
                </h3>
                <p className="text-blue-800 leading-relaxed text-sm whitespace-pre-wrap">{result.strategy}</p>
              </div>

              {/* Relevant Laws */}
              <div>
                <h3 className="flex items-center gap-2 text-lg font-bold text-slate-800 border-b border-slate-100 pb-2 mb-3">
                  <FaGavel className="text-slate-500" /> Relevant Indian Laws
                </h3>
                <div className="flex flex-wrap gap-2">
                  {result.relevantLaws.map((law, idx) => (
                    <span key={idx} className="bg-slate-100 border border-slate-200 text-slate-700 text-xs font-medium px-3 py-1.5 rounded-full">
                      {law}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          ) : null}
        </div>

      </div>
    </div>
  );
}
