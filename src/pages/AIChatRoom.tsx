// pages/AIChatRoom.tsx
import React, { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { documentsApi } from '../api/documents.api';

// TODO: reemplaza esto por el subject_id real en cuanto exista selección
// de materia/sala (por ejemplo, leyéndolo de useParams() una vez que la
// ruta sea algo como /rooms/:roomId/subjects/:subjectId/chat).
const subjectId = 'REEMPLAZA_CON_SUBJECT_ID_REAL';

export const AIChatRoom: React.FC = () => {
  const navigate = useNavigate();

  const [messages, setMessages] = useState([
    { id: 1, sender: 'ia', text: '¡Hola! Bienvenido a tu sala de estudio optimizada con IA. ¿En qué concepto u objetivo de tus lecturas te gustaría profundizar hoy?' },
  ]);
  const [input, setInput] = useState('');
  const [isThinking, setIsThinking] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  // Estado para manejar dinámicamente los recursos vinculados
  // (ahora usa el id real del documento que devuelve el backend)
  const [resources, setResources] = useState<{ id: string; name: string }[]>([
    { id: 'doc-demo-1', name: 'Documentacion_Proyecto.pdf' },
    { id: 'doc-demo-2', name: 'Arquitectura_FastAPI.md' }
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
  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    const uploadedFile = files[0];
    setIsUploading(true);

    // Mensaje optimista de "procesando" mientras sube al backend
    setMessages((prev) => [
      ...prev,
      { id: Date.now(), sender: 'ia', text: `⏳ Procesando e indexando "${uploadedFile.name}" en la base de conocimiento vectorial de la sala...` }
    ]);

    try {
      const uploadedDoc = await documentsApi.upload(uploadedFile, subjectId);

      // Añadimos el documento real (con su id del backend) al panel lateral
      setResources((prev) => [...prev, { id: uploadedDoc.id, name: uploadedDoc.title }]);

      setMessages((prev) => [
        ...prev,
        { id: Date.now(), sender: 'ia', text: `✅ "${uploadedDoc.title}" quedó indexado. Ya puedes hacerme preguntas sobre este documento.` }
      ]);

      // Intentamos traer el resumen generado por el backend.
      // Si el documento todavía se está procesando del lado del servidor,
      // simplemente lo omitimos sin romper el flujo del chat.
      try {
        const summary = await documentsApi.getSummary(uploadedDoc.id);
        setMessages((prev) => [
          ...prev,
          { id: Date.now() + 1, sender: 'ia', text: `📄 Resumen de "${uploadedDoc.title}":\n${summary.content}` }
        ]);
      } catch {
        // El resumen puede no estar listo aún; no es un error crítico.
      }
    } catch (error) {
      setMessages((prev) => [
        ...prev,
        { id: Date.now(), sender: 'ia', text: `⚠️ No pude subir "${uploadedFile.name}". Intenta de nuevo en un momento.` }
      ]);
    } finally {
      setIsUploading(false);
      // Permite volver a seleccionar el mismo archivo si hace falta reintentar
      if (fileInputRef.current) fileInputRef.current.value = '';
    }
  };

  const triggerFileSelect = () => {
    fileInputRef.current?.click();
  };

  // Click en un recurso: pide la URL real de descarga y la abre en pestaña nueva
  const handleResourceClick = async (resourceId: string) => {
    try {
      const { url } = await documentsApi.getDownloadUrl(resourceId);
      window.open(url, '_blank');
    } catch (error) {
      setMessages((prev) => [
        ...prev,
        { id: Date.now(), sender: 'ia', text: `⚠️ No pude obtener el link de descarga de ese documento.` }
      ]);
    }
  };

  // Borra el documento en el backend y lo quita del panel de recursos
  const handleResourceDelete = async (e: React.MouseEvent, resourceId: string, resourceName: string) => {
    e.stopPropagation(); // Evita que también dispare el click de descarga

    const confirmed = window.confirm(`¿Borrar "${resourceName}"? Esta acción no se puede deshacer.`);
    if (!confirmed) return;

    setDeletingId(resourceId);
    try {
      await documentsApi.delete(resourceId);
      setResources((prev) => prev.filter((r) => r.id !== resourceId));
      setMessages((prev) => [
        ...prev,
        { id: Date.now(), sender: 'ia', text: `🗑️ "${resourceName}" fue eliminado de la base de conocimiento de la sala.` }
      ]);
    } catch (error) {
      setMessages((prev) => [
        ...prev,
        { id: Date.now(), sender: 'ia', text: `⚠️ No pude borrar "${resourceName}". Intenta de nuevo.` }
      ]);
    } finally {
      setDeletingId(null);
    }
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
              disabled={isUploading}
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
            <div
              key={res.id}
              onClick={() => handleResourceClick(res.id)}
              className="p-3 bg-gray-50 border border-gray-100 rounded-xl flex items-center justify-between gap-2 cursor-pointer hover:bg-gray-100 transition-colors"
              title={`Descargar ${res.name}`}
            >
              <span className="text-xs font-medium text-gray-700 truncate" title={res.name}>
                {res.name}
              </span>
              <div className="flex items-center gap-1.5 shrink-0">
                <span className="text-[10px] bg-indigo-100 text-indigo-700 px-1.5 py-0.5 rounded font-bold">RAG</span>
                <button
                  type="button"
                  onClick={(e) => handleResourceDelete(e, res.id, res.name)}
                  disabled={deletingId === res.id}
                  className="text-gray-400 hover:text-red-600 font-bold text-xs w-4 h-4 flex items-center justify-center transition-colors disabled:opacity-50"
                  title={`Borrar ${res.name}`}
                >
                  {deletingId === res.id ? '…' : '✕'}
                </button>
              </div>
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