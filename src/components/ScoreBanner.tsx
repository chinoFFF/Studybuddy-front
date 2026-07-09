import React from 'react';

interface ScoreBannerProps {
  score: number;
  earnedPoints: number;
  totalPoints: number;
}

export const ScoreBanner: React.FC<ScoreBannerProps> = ({
  score,
  earnedPoints,
  totalPoints,
}) => {
  const passed = score >= 70;
  return (
    <div
      className={`mb-6 rounded-xl p-5 border ${
        passed ? 'bg-green-50 border-green-200' : 'bg-orange-50 border-orange-200'
      }`}
    >
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-gray-500">Calificación final</p>
          <h3 className="text-3xl font-bold text-gray-900">{score} / 100</h3>
          <p className="text-sm text-gray-600 mt-1">
            {earnedPoints} de {totalPoints} puntos
          </p>
        </div>
        <span className="text-4xl">{passed ? '🎉' : '📚'}</span>
      </div>
    </div>
  );
};
