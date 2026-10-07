import React, { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { api } from '../services/api';

export default function UploadPage() {
  const [file, setFile] = useState(null);
  const [dragActive, setDragActive] = useState(false);
  const [error, setError] = useState('');
  const fileInputRef = useRef(null);
  const navigate = useNavigate();

  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  };

  const validateAndSetFile = (selectedFile) => {
    setError('');
    if (!selectedFile) return;

    const allowed = ['application/pdf', 'image/jpeg', 'image/png', 'image/jpg', 'image/webp'];
    if (!allowed.includes(selectedFile.type.toLowerCase())) {
      setError('Unsupported file type. Please upload a PDF, PNG, or JPG document.');
      return;
    }

    if (selectedFile.size > 15 * 1024 * 1024) {
      setError('File size exceeds the 15MB limit.');
      return;
    }

    setFile(selectedFile);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      validateAndSetFile(e.dataTransfer.files[0]);
    }
  };

  const handleFileChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      validateAndSetFile(e.target.files[0]);
    }
  };

  const handleAnalyze = (e) => {
    e.preventDefault();
    if (!file) {
      setError('Please select a file to upload.');
      return;
    }

    // Safe in-memory reference to prevent browser history state cloning issues
    window.__pendingUploadFile = file;

    navigate('/processing', { state: { file, fileName: file.name } });
  };

  const handleSelectSample = (sampleKey, sampleName) => {
    navigate('/processing', { state: { sampleKey, sampleName } });
  };

  return (
    <div className="max-w-4xl mx-auto space-y-16">
      {/* 03 — UPLOAD Header */}
      <section className="space-y-4 border-b border-[#D5CEC1] pb-8">
        <span className="font-mono text-xs uppercase tracking-widest text-[#3158A8] block">
          03 — UPLOAD
        </span>
        <h1 className="font-serif text-4xl sm:text-6xl font-bold tracking-tight text-[#101B2D] leading-[1.1]">
          Bring us
          <br />
          the document.
        </h1>
        <p className="font-mono text-xs sm:text-sm text-[#70716D] max-w-xl">
          PDF, JPG or PNG. DocuSaathi will extract what matters.
        </p>
      </section>

      {/* Guaranteed Hackathon Demo Callout Banner */}
      <div className="p-6 border border-[#9A6B2F] bg-[#9A6B2F]/10 flex flex-col sm:flex-row sm:items-center justify-between gap-4 font-mono text-xs">
        <div className="space-y-1">
          <span className="font-bold uppercase tracking-wider text-[#9A6B2F] block">
            [ HACKATHON DEMO MODE ]
          </span>
          <p className="text-[#101B2D]">
            Need a guaranteed zero-lag demonstration without uploading? Use our pre-verified Indian tax notice.
          </p>
        </div>

        <button
          type="button"
          onClick={async () => {
            try {
              const demo = await api.getDemoSample();
              if (demo && demo.id) navigate(`/documents/${demo.id}`);
            } catch {
              handleSelectSample('tax_notice', 'Income Tax Intimation u/s 143(1)');
            }
          }}
          className="bg-[#101B2D] text-[#F1EBDD] px-5 py-2.5 rounded-sm uppercase tracking-widest hover:bg-[#1B2C47] transition-colors shrink-0"
        >
          [ TRY DEMO ]
        </button>
      </div>

      {error && (
        <div className="p-4 border border-[#8B2626] bg-[#8B2626]/10 font-mono text-xs text-[#8B2626]">
          {error}
        </div>
      )}

      {/* Large Quiet Cream Upload Region with thin border & document typography */}
      <div className="space-y-8">
        <form onSubmit={handleAnalyze} className="space-y-6">
          {!file ? (
            <div
              onDragEnter={handleDrag}
              onDragLeave={handleDrag}
              onDragOver={handleDrag}
              onDrop={handleDrop}
              onClick={() => fileInputRef.current?.click()}
              className={`border border-[#D5CEC1] bg-[#FAF8F2] p-12 sm:p-20 text-center cursor-pointer transition-colors ${
                dragActive ? 'bg-[#E8E0D2] border-[#3158A8]' : 'hover:bg-[#E8E0D2]/50'
              }`}
            >
              <input
                ref={fileInputRef}
                type="file"
                accept=".pdf,image/png,image/jpeg,image/jpg"
                onChange={handleFileChange}
                className="hidden"
              />

              <div className="space-y-6 max-w-md mx-auto">
                <div className="font-serif text-2xl sm:text-3xl font-bold tracking-tight text-[#101B2D]">
                  DROP DOCUMENT HERE
                </div>

                <div className="font-mono text-xs uppercase tracking-widest text-[#70716D]">
                  — OR —
                </div>

                <div>
                  <span className="inline-block border border-[#101B2D] text-[#101B2D] px-6 py-3 font-mono text-xs uppercase tracking-widest hover:bg-[#101B2D] hover:text-[#F1EBDD] transition-colors">
                    CHOOSE FILE
                  </span>
                </div>

                <div className="pt-4 border-t border-[#D5CEC1] font-mono text-[11px] text-[#70716D] uppercase tracking-wider">
                  ACCEPTED: PDF / JPG / PNG (UP TO 15MB)
                </div>
              </div>
            </div>
          ) : (
            /* Selected File Metadata Card */
            <div className="border border-[#D5CEC1] bg-[#FAF8F2] p-8 space-y-6">
              <div className="border-b border-[#D5CEC1] pb-4 flex items-center justify-between">
                <div>
                  <span className="font-mono text-[10px] text-[#3158A8] uppercase tracking-widest block">
                    SELECTED DOCUMENT
                  </span>
                  <span className="font-serif text-xl font-bold text-[#101B2D]">
                    {file.name}
                  </span>
                </div>
                <span className="font-mono text-xs text-[#2D6A4F] uppercase">
                  READY FOR AUDIT
                </span>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 font-mono text-xs">
                <div>
                  <span className="text-[#70716D] block">SIZE</span>
                  <span className="text-[#101B2D] font-bold">{(file.size / (1024 * 1024)).toFixed(2)} MB</span>
                </div>
                <div>
                  <span className="text-[#70716D] block">FORMAT</span>
                  <span className="text-[#101B2D] font-bold uppercase">{file.type || 'DOCUMENT'}</span>
                </div>
                <div>
                  <span className="text-[#70716D] block">STORAGE</span>
                  <span className="text-[#101B2D] font-bold">IN-MEMORY (EPHEMERAL)</span>
                </div>
              </div>

              <div className="pt-4 border-t border-[#D5CEC1] flex items-center justify-between">
                <button
                  type="button"
                  onClick={() => setFile(null)}
                  className="font-mono text-xs uppercase tracking-widest text-[#8B2626] hover:underline"
                >
                  [ REMOVE ]
                </button>

                <button
                  type="submit"
                  className="bg-[#101B2D] hover:bg-[#1B2C47] text-[#F1EBDD] px-8 py-3.5 rounded-sm font-mono text-xs uppercase tracking-widest transition-all"
                >
                  [ ANALYZE DOCUMENT ]
                </button>
              </div>
            </div>
          )}
        </form>
      </div>

      {/* Preset Document Scenarios */}
      <section className="space-y-6 border-t border-[#D5CEC1] pt-12">
        <div>
          <span className="font-mono text-xs uppercase tracking-widest text-[#3158A8] block mb-1">
            04 — PRE-LOADED SCENARIOS
          </span>
          <h2 className="font-serif text-2xl font-bold text-[#101B2D]">
            Instant evaluation suite for Indian paperwork.
          </h2>
          <p className="font-mono text-xs text-[#70716D] mt-1">
            Click any scenario to execute the 7-stage pipeline without local file picking:
          </p>
        </div>

        <div className="border border-[#D5CEC1] bg-[#FAF8F2] divide-y divide-[#D5CEC1]">
          {[
            {
              key: 'tax_notice',
              name: 'Income Tax Intimation u/s 143(1)',
              tag: 'HIGH RISK',
              tagColor: 'text-[#8B2626]',
              desc: 'Assesses ₹24,850 tax discrepancy, 30-day response window, and statutory interest u/s 220(2).',
            },
            {
              key: 'gst_invoice',
              name: 'B2B GST Tax Invoice (Apex Tech)',
              tag: 'LOW RISK',
              tagColor: 'text-[#2D6A4F]',
              desc: '₹1,41,600 total with 18% IGST check, Net-15 terms, and TDS compliance u/s 194C.',
            },
            {
              key: 'bank_letter',
              name: 'SBI Home Loan Sanction Letter',
              tag: 'MEDIUM RISK',
              tagColor: 'text-[#9A6B2F]',
              desc: '₹65 Lakhs approval at 8.5% p.a., monthly EMI ₹56,432, 60-day acceptance window.',
            },
            {
              key: 'rent_agreement',
              name: '11-Month Residential Lease Agreement',
              tag: 'MEDIUM RISK',
              tagColor: 'text-[#9A6B2F]',
              desc: '₹32,000/mo rent, 6-month lock-in clause, and security deposit forfeiture terms.',
            },
          ].map((item) => (
            <div
              key={item.key}
              onClick={() => handleSelectSample(item.key, item.name)}
              className="p-6 cursor-pointer hover:bg-[#E8E0D2] transition-colors flex flex-col sm:flex-row sm:items-center justify-between gap-4 font-mono text-xs"
            >
              <div className="space-y-1">
                <div className="flex items-center gap-3">
                  <span className={`font-bold ${item.tagColor}`}>
                    [{item.tag}]
                  </span>
                  <span className="font-serif text-base font-bold text-[#101B2D]">
                    {item.name}
                  </span>
                </div>
                <p className="text-[#70716D] leading-relaxed">
                  {item.desc}
                </p>
              </div>

              <span className="text-[#3158A8] uppercase tracking-wider shrink-0">
                RUN PIPELINE →
              </span>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}

