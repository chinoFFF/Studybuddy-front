// pages/AIChatRoom.tsx
import React, { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';

export const AIChatRoom: React.FC = () => {
  const navigate = useNavigate();

  const [messages, setMessages] = useState([
    { id: 1, sender: 'ia', text: '¡Hola! Bienvenido a tu sala de estudio optimizada con IA. ¿En qué concepto u objetivo de tus lecturas te gustaría profundizar hoy?' },
  ]);
  const [input, setInput] = useState('');
  const [isThinking, setIsThinking] = useState(false);
  
  // Estado para manejar dinámicamente los recursos vinculados
  const [resources, setResources] = useState([
    { id: 1, name: 'Documentacion_Proyecto.pdf' },
    { id: 2, name: 'Arquitectura_FastAPI.md' }
  ]);

  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isThinking) return;

    const userMsg = { id: Date.now(), sender: 'user', text: input };
    setMessages((prev) => [...prev, userMsg]);
    setInput('');
    setIsThinking(true);

    setTimeout(() => {
      const iaMsg = {
        id: Date.now() + 1,
        sender: 'ia',
        text: `He procesado tu consulta sobre "${userMsg.text}". Basándome en la documentación que tenemos indexada, te sugiero segmentar el análisis. ¿Quieres programar un simulacro o revisar las flashcards de este tema?`
      };
      setMessages((prev) => [...prev, iaMsg]);
      setIsThinking(false);
    }, 1500);
  };

  // Función para manejar la subida de archivos (PDF, Presentaciones o Apuntes)
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      const uploadedFile = files[0];
      
      // Añadimos el archivo subido al panel lateral de recursos simulando el proceso de Backend/RAG
      const newResource = {
        id: Date.now(),
        name: uploadedFile.name
      };
      
      setResources((prev) => [...prev, newResource]);
      
      // Notificación en el chat de que el archivo fue cargado
      setMessages((prev) => [
        ...prev, 
        { id: Date.now(), sender: 'ia', text: `⏳ Procesando e indexando "${uploadedFile.name}" en la base de conocimiento vectorial de la sala... ¡Listo! Ya puedes hacerme preguntas sobre este documento.` }
      ]);
    }
  };

  const triggerFileSelect = () => {
    fileInputRef.current?.click();
  };

  return (
    <div className="flex h-screen bg-gray-50 font-sans">
      
      {/* PANEL PRINCIPAL DEL CHAT */}
      <div className="flex-1 flex flex-col h-full border-r border-gray-200">
        
        {/* Encabezado del Chat */}
        <header className="p-4 bg-white border-b border-gray-200 flex items-center justify-between shadow-sm">
          <div className="flex items-center space-x-3">
            <button 
              onClick={() => navigate('/dashboard')}
              className="p-2 hover:bg-gray-100 rounded-lg text-gray-600 transition-colors"
              title="Volver al Dashboard"
            >
              ← Volver
            </button>
            <div>
              <h2 className="text-lg font-bold text-gray-800 flex items-center gap-1.5">
                <span>✨</span> Tutor Inteligente Gemini
              </h2>
              <p className="text-xs text-green-500 font-medium">● Agente RAG Activo</p>
            </div>
          </div>
        </header>

        {/* Zona de Mensajes */}
        <div className="flex-1 overflow-y-auto p-6 space-y-4 bg-gray-50">
          {messages.map((msg) => (
            <div key={msg.id} className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
              <div className={`max-w-[75%] rounded-2xl p-4 shadow-sm text-sm ${
                msg.sender === 'user' ? 'bg-indigo-600 text-white rounded-tr-none' : 'bg-white text-gray-800 border border-gray-100 rounded-tl-none'
              }`}>
                <p className="leading-relaxed whitespace-pre-line">{msg.text}</p>
              </div>
            </div>
          ))}

          {isThinking && (
            <div className="flex justify-start">
              <div className="bg-white text-gray-400 border border-gray-100 rounded-2xl rounded-tl-none p-4 text-xs font-medium animate-pulse">
                <span>🪄 Gemini está analizando tus apuntes...</span>
              </div>
            </div>
          )}
        </div>

        {/* Formulario de Entrada con Botón de Archivos */}
        <footer className="p-4 bg-white border-t border-gray-200">
          <form onSubmit={handleSendMessage} className="flex gap-3 items-center">
            
            {/* Input File oculto controlado por referencia */}
            <input 
              type="file" 
              ref={fileInputRef}
              onChange={handleFileChange}
              accept=".pdf, .ppt, .pptx, .txt, .doc, .docx"
              className="hidden" 
            />

            {/* NUEVO BOTÓN DE ADJUNTAR ARCHIVO */}
            <button
              type="button"
              onClick={triggerFileSelect}
              className="p-3 bg-gray-100 hover:bg-gray-200 text-gray-600 rounded-xl transition-colors shrink-0"
              title="Subir PDF, Presentaciones o Apuntes"
            >
              📎
            </button>

            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Pregúntale a la IA sobre tus documentos o código..."
              className="flex-1 px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 text-sm text-gray-800 bg-gray-50"
            />
            
            <button
              type="submit"
              disabled={!input.trim() || isThinking}
              className="px-5 py-3 bg-indigo-600 hover:bg-indigo-700 disabled:bg-gray-300 text-white font-semibold rounded-xl transition-colors text-sm shadow-sm shrink-0"
            >
              Enviar
            </button>
          </form>
        </footer>
      </div>

      {/* PANEL LATERAL DERECHO: RECURSOS DINÁMICOS */}
      <div className="w-80 bg-white h-full hidden lg:flex flex-col p-6 border-b border-gray-100">
        <h3 className="font-bold text-gray-800 text-md mb-4 flex items-center gap-2">
          📁 Recursos Vinculados
        </h3>
        <p className="text-xs text-gray-500 mb-6">Todos los documentos indexados en esta sala son analizados por la IA.</p>
        
        <div className="space-y-3 flex-1 overflow-y-auto">
          {resources.map((res) => (
            <div key={res.id} className="p-3 bg-gray-50 border border-gray-100 rounded-xl flex items-center justify-between gap-2">
              <span className="text-xs font-medium text-gray-700 truncate" title={res.name}>
                {res.name}
              </span>
              <span className="text-[10px] bg-indigo-100 text-indigo-700 px-1.5 py-0.5 rounded font-bold shrink-0">RAG</span>
            </div>
          ))}
        </div>

        <div className="pt-4 border-t border-gray-100 space-y-2">
          <button type="button" className="w-full py-2 bg-indigo-50 hover:bg-indigo-100 text-indigo-700 font-bold text-xs rounded-lg transition-colors">
            📝 Generar Flashcards
          </button>
          <button type="button" className="w-full py-2 bg-emerald-50 hover:bg-emerald-100 text-emerald-700 font-bold text-xs rounded-lg transition-colors">
            ⏱️ Iniciar Simulacro Examen
          </button>
        </div>
      </div>

    </div>
  );
};