import type { AnswerMap, ExamQuestion, Feedback } from '../type';


export const evaluateQuestion = (q: ExamQuestion, answers: AnswerMap): Feedback => {
  const a = answers[q.id];

  if (q.type === 'multiple_choice') {
    const correct = a === q.correctOptionIndex;
    return {
      correct,
      detail: correct
        ? q.explanation
        : `Respuesta correcta: ${q.options[q.correctOptionIndex]}. ${q.explanation}`,
    };
  }

  if (q.type === 'true_false') {
    const correct = a === q.correctAnswer;
    return {
      correct,
      detail: correct
        ? q.explanation
        : `Respuesta correcta: ${q.correctAnswer ? 'Verdadero' : 'Falso'}. ${q.explanation}`,
    };
  }

  const text = typeof a === 'string' ? a.toLowerCase().trim() : '';
  const hits = q.acceptedKeywords.filter((k) => text.includes(k.toLowerCase()));
  const correct = hits.length >= Math.ceil(q.acceptedKeywords.length / 2);
  return {
    correct,
    detail: correct ? q.explanation : `Respuesta modelo: ${q.modelAnswer}. ${q.explanation}`,
  };
};

export const isAnswered = (q: ExamQuestion, answers: AnswerMap): boolean => {
  const a = answers[q.id];
  if (q.type === 'open') return typeof a === 'string' && a.trim().length > 0;
  return a !== undefined && a !== null;
};
