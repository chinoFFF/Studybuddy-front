import React from 'react';
import { InteractiveQuiz } from '../components/InteractiveQuiz';
import type { Exam } from '../types/type';

// Estructura simulada del JSON que el servidor (IA) enviará
const mockExam: Exam = {
  id: 'exam-001',
  title: 'Examen de Repaso: Inteligencia Artificial',
  description: 'Cuestionario generado automáticamente a partir de los documentos de tu sala de estudio.',
  questions: [
    {
      id: 'q1',
      type: 'multiple_choice',
      prompt: '¿Qué técnica permite reducir la dimensionalidad preservando la mayor varianza posible?',
      options: [
        'K-Means',
        'Análisis de Componentes Principales (PCA)',
        'Regresión Lineal',
        'K-Nearest Neighbors',
      ],
      correctOptionIndex: 1,
      explanation:
        'PCA proyecta los datos sobre los ejes de mayor varianza, reduciendo dimensiones sin perder información relevante.',
      points: 25,
    },
    {
      id: 'q2',
      type: 'true_false',
      prompt: 'El overfitting ocurre cuando el modelo generaliza bien a datos no vistos.',
      correctAnswer: false,
      explanation:
        'El overfitting es justo lo contrario: el modelo memoriza los datos de entrenamiento y falla al generalizar.',
      points: 25,
    },
    {
      id: 'q3',
      type: 'open',
      prompt: 'Explica brevemente qué es el descenso de gradiente y su rol en el entrenamiento de redes neuronales.',
      acceptedKeywords: ['optimización', 'minimizar', 'pérdida', 'parámetros', 'aprendizaje'],
      modelAnswer:
        'El descenso de gradiente es un algoritmo de optimización que ajusta los parámetros minimizando la función de pérdida iterativamente.',
      explanation:
        'El descenso de gradiente actualiza los pesos en dirección contraria al gradiente de la función de pérdida.',
      points: 25,
    },
    {
      id: 'q4',
      type: 'multiple_choice',
      prompt: '¿Cuál de los siguientes es un modelo de lenguaje basado en transformers?',
      options: ['ResNet', 'BERT', 'VGG16', 'YOLO'],
      correctOptionIndex: 1,
      explanation: 'BERT (Bidirectional Encoder Representations from Transformers) es un modelo de lenguaje basado en la arquitectura transformer.',
      points: 25,
    },
  ],
};

export const Examenes: React.FC = () => {
  return (
    <div className="min-h-screen bg-gray-50 p-5 ">
      <InteractiveQuiz exam={mockExam} />
    </div>
  );
};
