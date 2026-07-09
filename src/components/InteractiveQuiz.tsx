import React, { useMemo, useState } from 'react';
import type { AnswerMap, Exam, Feedback } from '../types/type';
import { evaluateQuestion, isAnswered } from '../types/quiz/evaluate';
import { QuestionCard } from './QuestionCard';
import { ScoreBanner } from './ScoreBanner';

interface InteractiveQuizProps {
  exam: Exam;
}

export const InteractiveQuiz: React.FC<InteractiveQuizProps> = ({ exam }) => {
  const [answers, setAnswers] = useState<AnswerMap>({});
  const [submitted, setSubmitted] = useState(false);
  const [feedback, setFeedback] = useState<Record<string, Feedback>>({});

  const totalPoints = useMemo(
    () => exam.questions.reduce((sum, q) => sum + q.points, 0),
    [exam.questions],
  );

  const earnedPoints = useMemo(
    () =>
      exam.questions.reduce(
        (sum, q) => sum + (feedback[q.id]?.correct ? q.points : 0),
        0,
      ),
    [exam.questions, feedback],
  );

  const score = totalPoints > 0 ? Math.round((earnedPoints / totalPoints) * 100) : 0;
  const allAnswered = exam.questions.every((q) => isAnswered(q, answers));

  const setAnswer = (id: string, value: number | boolean | string) => {
    if (submitted) return;
    setAnswers((prev) => ({ ...prev, [id]: value }));
  };

  const handleSubmit = () => {
    if (submitted || !allAnswered) return;
    const result: Record<string, Feedback> = {};
    for (const q of exam.questions) {
      result[q.id] = evaluateQuestion(q, answers);
    }
    setFeedback(result);
    setSubmitted(true);
  };

  const handleReset = () => {
    setAnswers({});
    setFeedback({});
    setSubmitted(false);
  };

  return (
    <div className="p-3 w-full max-w-7xl mx-auto ">
      <header className="mb-6">
        <h2 className="text-3xl font-bold text-gray-900">{exam.title}</h2>
        <p className="text-gray-500 mt-1">{exam.description}</p>
      </header>

      {submitted && (
        <ScoreBanner
          score={score}
          earnedPoints={earnedPoints}
          totalPoints={totalPoints}
        />
      )}

      <ol className="space-y-6">
        {exam.questions.map((q, i) => (
          <QuestionCard
            key={q.id}
            question={q}
            index={i}
            answers={answers}
            submitted={submitted}
            feedback={feedback[q.id]}
            onAnswer={setAnswer}
          />
        ))}
      </ol>

      <div className="mt-6 flex items-center justify-between ">
        {!submitted ? (
          <button
            type="button"
            onClick={handleSubmit}
            disabled={!allAnswered}
            className={`px-6 py-3 rounded-xl font-semibold transition ${
              allAnswered
                ? 'bg-indigo-600 text-white hover:bg-indigo-700 shadow-sm'
                : 'bg-gray-200 text-gray-400 cursor-not-allowed'
            }`}
          >
            Enviar examen
          </button>
        ) : (
          <button
            type="button"
            onClick={handleReset}
            className="px-6 py-3 rounded-xl font-semibold bg-gray-100 text-gray-700 hover:bg-gray-200 transition"
          >
            Intentar de nuevo
          </button>
        )}

        {!submitted && !allAnswered && (
          <span className="text-sm text-gray-400">
            Responde todas las preguntas para enviar
          </span>
        )}
      </div>
    </div>
  );
};


export default InteractiveQuiz;