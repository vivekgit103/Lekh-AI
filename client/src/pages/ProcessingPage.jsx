import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { api } from '../services/api';
import ProcessingSteps from '../components/ProcessingSteps';

export default function ProcessingPage() {
  const location = useLocation();
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState(1);
  const [error, setError] = useState('');

  useEffect(() => {
    let isMounted = true;

    async function process() {
      const state = location.state;
      if (!state) {
        navigate('/upload');
        return;
      }

      // 01 UPLOAD
      setCurrentStep(1);

      try {
        // 02 UNDERSTAND
        setTimeout(() => {
          if (isMounted) setCurrentStep(2);
        }, 500);

        // Upload payload to server
        let response;
        if (state.sampleKey) {
          response = await api.uploadDemoSample(state.sampleKey);
        } else {
          const selectedFile = state.file || (typeof window !== 'undefined' && window.__pendingUploadFile);
          if (!selectedFile) {
            throw new Error('No file was received. Please return to upload and choose a PDF or image.');
          }

          const formData = new FormData();
          formData.append('file', selectedFile);
          response = await api.uploadDocument(formData);
          if (typeof window !== 'undefined') {
            window.__pendingUploadFile = null;
          }
        }

        if (response && response.success === false) {
          throw new Error(response.error || response.message || 'AI document analysis failed');
        }

        // 03 EXTRACT
        if (isMounted) setCurrentStep(3);

        // 04 VALIDATE
        setTimeout(() => {
          if (isMounted) setCurrentStep(4);
        }, 600);

        // 05 IDENTIFY RISK
        setTimeout(() => {
          if (isMounted) setCurrentStep(5);
        }, 1100);

        // 06 FIND DEADLINES
        setTimeout(() => {
          if (isMounted) setCurrentStep(6);
        }, 1600);

        // 07 BUILD ACTION PLAN
        setTimeout(() => {
          if (isMounted) setCurrentStep(7);
        }, 2100);

        // Complete & Navigate
        setTimeout(() => {
          if (isMounted && response?.document?.id) {
            navigate(`/documents/${response.document.id}`);
          }
        }, 2700);

      } catch (err) {
        if (isMounted) {
          const errDetail =
            err.response?.data?.error ||
            err.response?.data?.message ||
            err.message ||
            'Document processing audit failed';
          setError(errDetail);
        }
      }
    }

    process();

    return () => {
      isMounted = false;
    };
  }, [location.state, navigate]);

  return (
    <div className="max-w-3xl mx-auto space-y-12">
      {/* 04 — PROCESSING Header */}
      <section className="space-y-4 border-b border-[#D5CEC1] pb-8">
        <span className="font-mono text-xs uppercase tracking-widest text-[#3158A8] block">
          04 — PROCESSING
        </span>
        <h1 className="font-serif text-4xl sm:text-6xl font-bold tracking-tight text-[#101B2D] leading-[1.1]">
          Reading between
          <br />
          the lines.
        </h1>
        <p className="font-mono text-xs sm:text-sm text-[#70716D] max-w-xl">
          Multi-layer multimodal extraction coupled with deterministic mathematical rule audit.
        </p>
      </section>

      {error ? (
        <div className="p-8 border border-[#8B2626] bg-[#8B2626]/10 space-y-4">
          <span className="font-mono text-xs uppercase tracking-widest text-[#8B2626] font-bold block">
            [ PROCESSING HALTED ]
          </span>
          <p className="font-mono text-xs text-[#101B2D] leading-relaxed">
            {error}
          </p>
          <button
            onClick={() => navigate('/upload')}
            className="bg-[#101B2D] text-[#F1EBDD] px-6 py-2.5 font-mono text-xs uppercase tracking-widest rounded-sm"
          >
            [ RETURN TO UPLOAD ]
          </button>
        </div>
      ) : (
        <div className="space-y-6">
          <ProcessingSteps currentStep={currentStep} />
          <div className="flex items-center justify-between font-mono text-[11px] text-[#70716D] pt-2">
            <span>PIPELINE ENGINE: GEMINI 1.5 FLASH + AUDIT RULESET</span>
            <span className="text-[#3158A8]">STAGE {currentStep} OF 7</span>
          </div>
        </div>
      )}
    </div>
  );
}

