import React from 'react';
import type { AnswerMap, ExamQuestion, Feedback } from '../types/type';

interface QuestionCardProps {
  question: ExamQuestion;
  index: number;
  answers: AnswerMap;
  submitted: boolean;
  feedback?: Feedback;
  onAnswer: (id: string, value: number | boolean | string) => void;
}

export const QuestionCard: React.FC<QuestionCardProps> = ({
  question: q,
  index,
  answers,
  submitted,
  feedback,
  onAnswer,
}) => {
  const renderInput = () => {
    if (q.type === 'multiple_choice') {
      return (
        <div className="space-y-2">
          {q.options.map((opt, i) => {
            const selected = answers[q.id] === i;
            const isCorrect = i === q.correctOptionIndex;
            const showResult = submitted && (selected || isCorrect);
            return (
              <button
                key={i}
                type="button"
                disabled={submitted}
                onClick={() => onAnswer(q.id, i)}
                className={`w-full text-left px-4 py-3  rounded-lg border transition ${
                  submitted
                    ? showResult && isCorrect
                      ? 'border-green-400 bg-green-50'
                      : showResult && selected && !isCorrect
                        ? 'border-red-400 bg-red-50'
                        : 'border-gray-200 bg-white'
                    : selected
                      ? 'border-indigo-500 bg-indigo-50'
                      : 'border-gray-200 bg-white hover:border-indigo-300'
                } ${submitted ? 'cursor-not-allowed' : 'cursor-pointer'}`}
              >
                <span className="text-sm text-gray-700">{opt}</span>
              </button>
            );
          })}
        </div>
      );
    }

    if (q.type === 'true_false') {
      return (
        <div className="flex gap-3">
          {[true, false].map((val) => {
            const selected = answers[q.id] === val;
            const isCorrect = val === q.correctAnswer;
            const showResult = submitted && (selected || isCorrect);
            return (
              <button
                key={String(val)}
                type="button"
                disabled={submitted}
                onClick={() => onAnswer(q.id, val)}
                className={`flex-1 px-4 py-3 rounded-lg border font-medium transition ${
                  submitted
                    ? showResult && isCorrect
                      ? 'border-green-400 bg-green-50 text-green-700'
                      : showResult && selected && !isCorrect
                        ? 'border-red-400 bg-red-50 text-red-700'
                        : 'border-gray-200 bg-white text-gray-500'
                    : selected
                      ? 'border-indigo-500 bg-indigo-50 text-indigo-700'
                      : 'border-gray-200 bg-white text-gray-700 hover:border-indigo-300'
                } ${submitted ? 'cursor-not-allowed' : 'cursor-pointer'}`}
              >
                {val ? 'Verdadero' : 'Falso'}
              </button>
            );
          })}
        </div>
      );
    }

    return (
      <textarea
        value={(answers[q.id] as string) ?? ''}
        onChange={(e) => onAnswer(q.id, e.target.value)}
        disabled={submitted}
        rows={4}
        placeholder="Escribe tu respuesta..."
        className={`w-full px-4 py-3 border rounded-lg resize-none focus:outline-none focus:ring-2 focus:ring-indigo-500 ${
          submitted ? 'bg-gray-50 cursor-not-allowed' : ''
        }`}
      />
    );
  };

  return (
    <li className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6 transition hover:shadow-md hover:border-indigo-300">
      <div className="flex items-start justify-between mb-4">
        <h3 className="text-lg font-semibold text-gray-800">
          {index + 1}. {q.prompt}
        </h3>
        <span className="text-xs font-medium text-gray-400 bg-gray-100 px-2 py-1 rounded-full shrink-0 ml-3">
          {q.points} pts
        </span>
      </div>

      {renderInput()}

      {submitted && feedback && (
        <div
          className={`mt-4 p-4 rounded-lg text-sm ${
            feedback.correct
              ? 'bg-green-50 text-green-700 border border-green-200'
              : 'bg-amber-50 text-amber-700 border border-amber-200'
          }`}
        >
          <p className="font-semibold mb-1">
            {feedback.correct ? '✓ Correcto' : '✗ Revisa tu respuesta'}
          </p>
          <p className="text-gray-600">{feedback.detail}</p>
        </div>
      )}
    </li>
  );
};
