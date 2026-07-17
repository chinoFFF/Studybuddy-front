// components/GenerateQuizModal.tsx
import React, { useState } from 'react';
import { quizzesApi } from '../api/quizzes.api';
import type { QuizResponse } from '../types/quiz';

interface DocumentOption {
  id: string;
  name: string;
}

interface GenerateQuizModalProps {
  documents: DocumentOption[];
  onGenerated?: (quiz: QuizResponse) => void;
}

export const GenerateQuizModal: React.FC<GenerateQuizModalProps> = ({
  documents,
  onGenerated,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [documentId, setDocumentId] = useState('');
  const [numQuestions, setNumQuestions] = useState(5);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [generatedQuiz, setGeneratedQuiz] = useState<QuizResponse | null>(null);

  const hasDocuments = documents.length > 0;

  const resetState = () => {
    setDocumentId('');
    setNumQuestions(5);
    setError('');
    setGeneratedQuiz(null);
    setLoading(false);
  };

  const handleOpen = () => {
    resetState();
    setDocumentId(documents[0]?.id ?? '');
    setIsOpen(true);
  };

  const handleClose = () => {
    resetState();
    setIsOpen(false);
  };

  const handleGenerate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!documentId) return;

    setLoading(true);
    setError('');

    try {
      const quiz = await quizzesApi.generate({
        document_id: documentId,
        num_questions: numQuestions,
      });
      setGeneratedQuiz(quiz);
      onGenerated?.(quiz);
    } catch (err) {
      console.error(err);
      setError('No se pudo generar el quiz. Intenta de nuevo.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <button
        type="button"
        onClick={handleOpen}
        disabled={!hasDocuments}
        title={hasDocuments ? undefined : 'Sube al menos un documento primero'}
        className="w-full py-2 bg-emerald-50 hover:bg-emerald-100 text-emerald-700 font-bold text-xs rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
      >
        📝 Generar Quiz
      </button>

      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4 transition-opacity duration-300">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden border border-gray-100">

            <div className="p-6 border-b border-gray-100 flex justify-between items-center bg-gray-50/50">
              <h3 className="text-xl font-bold text-gray-800">Generar Quiz</h3>
              <button onClick={handleClose} className="text-gray-400 hover:text-gray-600 font-bold text-xl">✕</button>
            </div>

            <div className="p-6">
              {!generatedQuiz ? (
                <form onSubmit={handleGenerate} className="space-y-4">
                  {error && (
                    <div className="rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-600">
                      {error}
                    </div>
                  )}

                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">Documento</label>
                    <select
                      required
                      value={documentId}
                      onChange={(e) => setDocumentId(e.target.value)}
                      className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500 text-gray-800 bg-white"
                    >
                      {documents.map((doc) => (
                        <option key={doc.id} value={doc.id}>{doc.name}</option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">Número de preguntas</label>
                    <input
                      type="number"
                      min={1}
                      max={20}
                      required
                      value={numQuestions}
                      onChange={(e) => setNumQuestions(Number(e.target.value))}
                      className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500 text-gray-800"
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full py-3 bg-emerald-600 hover:bg-emerald-700 disabled:bg-gray-300 text-white font-semibold rounded-xl transition-colors shadow-sm"
                  >
                    {loading ? 'Generando...' : 'Generar Quiz'}
                  </button>
                </form>
              ) : (
                <div className="space-y-4 text-center">
                  <div className="w-12 h-12 bg-green-100 text-green-600 rounded-full flex items-center justify-center text-2xl mx-auto">✓</div>
                  <div>
                    <h4 className="font-bold text-gray-800 text-lg">¡Quiz "{generatedQuiz.title}" listo!</h4>
                    <p className="text-sm text-gray-500 mt-1">
                      Se generaron {generatedQuiz.questions.length} preguntas sobre {generatedQuiz.topic}.
                    </p>
                  </div>
                  <button
                    onClick={handleClose}
                    className="mt-2 w-full py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold rounded-xl transition-colors shadow-sm"
                  >
                    Listo
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
};