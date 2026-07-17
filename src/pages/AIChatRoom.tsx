// pages/AIChatRoom.tsx
import React, { useState, useRef, useEffect } from 'react';
import { useNavigate, useParams, useLocation } from 'react-router-dom';
import { documentsApi } from '../api/documents.api';
import { chatApi } from '../api/chat.api';
import { quizzesApi } from '../api/quizzes.api';
import { GenerateFlashcardsModal } from '../components/GenerateFlashcardsModal';
import { GenerateQuizModal } from '../components/GenerateQuizModal';

const DEFAULT_SESSION_NAME = 'Sesión de estudio';

interface DisplayMessage {
  id: string;
  sender: 'ia' | 'user';
  text: string;
  canRegenerate?: boolean;
}

interface Resource {
  id: string;
  name: string;
}

export const AIChatRoom: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { roomId } = useParams<{ roomId: string }>();
  const roomNameFromNav = (location.state as { roomName?: string } | null)?.roomName ?? null;

  const [messages, setMessages] = useState<DisplayMessage[]>([
    { id: 'welcome', sender: 'ia', text: '¡Hola! Bienvenido a tu sala de estudio optimizada con IA. ¿En qué concepto u objetivo de tus lecturas te gustaría profundizar hoy?' },
  ]);
  const [input, setInput] = useState('');
  const [isThinking, setIsThinking] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [regeneratingId, setRegeneratingId] = useState<string | null>(null);

  const [sessionId, setSessionId] = useState<string | null>(null);
  const [sessionName, setSessionName] = useState(DEFAULT_SESSION_NAME);
  const [isSessionReady, setIsSessionReady] = useState(false);

  const [roomName] = useState<string | null>(roomNameFromNav);

  const [resources, setResources] = useState<Resource[]>([]);

  const fileInputRef = useRef<HTMLInputElement>(null);
  const hasInitialized = useRef(false); // Evita doble-ejecución en React StrictMode (dev)

  useEffect(() => {
    if (hasInitialized.current) return;
    hasInitialized.current = true;

    if (!roomId) {
      setMessages((prev) => [
        ...prev,
        { id: 'no-room', sender: 'ia', text: '⚠️ No se encontró la sala de estudio. Vuelve al dashboard e intenta de nuevo.' }
      ]);
      return;
    }

    // El nombre de la sala viene por navigation state (ver roomNameFromNav).
    // GET /rooms/{room_id} no está disponible en el backend actual, así que
    // no dependemos de él. Si el usuario entra por URL directa/recarga sin
    // ese state, simplemente no se muestra el nombre (fallback silencioso).

    const loadResourcesFromSession = async (documentIds: string[]) => {
      if (documentIds.length === 0) {
        setResources([]);
        return;
      }

      const loaded = await Promise.all(
        documentIds.map(async (docId) => {
          try {
            const summary = await documentsApi.getSummary(docId);
            return { id: docId, name: summary.topic_name || docId };
          } catch {
            // El resumen puede no estar listo; igual mostramos el documento.
            return { id: docId, name: docId };
          }
        })
      );
      setResources(loaded);
    };

    const loadMessageHistory = async (sid: string) => {
      try {
        const history = await chatApi.listMessages(sid);
        if (history.length === 0) return; // Sesión sin mensajes: se queda el saludo inicial

        const sorted = [...history].sort((a, b) =>
          (a.created_at ?? '').localeCompare(b.created_at ?? '')
        );

        const mapped: DisplayMessage[] = sorted.map((m) => ({
          id: m.id,
          sender: m.role === 'user' ? 'user' : 'ia',
          text: m.content,
          canRegenerate: m.role === 'assistant',
        }));

        setMessages(mapped); // Reemplaza el saludo genérico por la conversación real
      } catch (error) {
        console.error('Error al cargar el historial del chat:', error);
      }
    };

    const initSession = async () => {
      try {
        // Busca si ya existe una sesión de chat para esta sala, para no
        // perder los documentos ya vinculados cada vez que se entra.
        const existingSessions = await chatApi.listSessions();
        const roomSessions = existingSessions
          .filter((s) => s.room_id === roomId)
          .sort((a, b) => (b.started_at ?? '').localeCompare(a.started_at ?? ''));

        if (roomSessions.length > 0) {
          const latest = roomSessions[0];
          setSessionId(latest.id);
          setSessionName(latest.name);
          setIsSessionReady(true);
          if (latest.documents && latest.documents.length > 0) {
            const loadedResources = latest.documents.map((doc: any) => ({
              id: doc.id,
              name: doc.title || doc.id
            }));
            setResources(loadedResources);
          } else {
            setResources([]);
          }

          await loadMessageHistory(latest.id);
          return;
        }

        // No había sesión previa: crea una nueva
        const session = await chatApi.createSession({
          room_id: roomId,
          name: DEFAULT_SESSION_NAME,
          document_ids: [],
        });
        setSessionId(session.id);
        setSessionName(session.name);
        setIsSessionReady(true);
      } catch (error) {
        console.error('Error al iniciar la sesión de chat:', error);
        setMessages((prev) => [
          ...prev,
          { id: 'session-error', sender: 'ia', text: '⚠️ No pude iniciar la sesión de chat con el servidor. Verifica tu conexión o intenta recargar la página.' }
        ]);
      }
    };

    initSession();
  }, [roomId]);

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isThinking || !sessionId) return;

    const userText = input;
    const userMsg: DisplayMessage = { id: `user-${Date.now()}`, sender: 'user', text: userText };
    setMessages((prev) => [...prev, userMsg]);
    setInput('');
    setIsThinking(true);

    try {
      const response = await chatApi.sendMessage(sessionId, { content: userText });
      setMessages((prev) => [
        ...prev,
        { id: response.assistant_message.id, sender: 'ia', text: response.assistant_message.content, canRegenerate: true }
      ]);
    } catch (error) {
      setMessages((prev) => [
        ...prev,
        { id: `error-${Date.now()}`, sender: 'ia', text: '⚠️ No pude procesar tu mensaje. Intenta de nuevo.' }
      ]);
    } finally {
      setIsThinking(false);
    }
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0 || !roomId) return;

    const uploadedFile = files[0];
    setIsUploading(true);

    setMessages((prev) => [
      ...prev,
      { id: `uploading-${Date.now()}`, sender: 'ia', text: `⏳ Procesando e indexando "${uploadedFile.name}" en la base de conocimiento vectorial de la sala...` }
    ]);

    try {
      const uploadedDoc = await documentsApi.upload(uploadedFile, roomId);
      const updatedResources = [...resources, { id: uploadedDoc.id, name: uploadedDoc.title }];
      setResources(updatedResources);

      setMessages((prev) => [
        ...prev,
        { id: `uploaded-${uploadedDoc.id}`, sender: 'ia', text: `✅ "${uploadedDoc.title}" quedó indexado. Ya puedes hacerme preguntas sobre este documento.` }
      ]);

      if (sessionId) {
        try {
          await chatApi.updateSession(sessionId, {
            name: sessionName,
            document_ids: updatedResources.map((r) => r.id),
          });
        } catch (error) {
          console.error('Error al vincular el documento a la sesión de chat:', error);
        }
      }

      try {
        const summary = await documentsApi.getSummary(uploadedDoc.id);
        setMessages((prev) => [
          ...prev,
          { id: `summary-${uploadedDoc.id}`, sender: 'ia', text: `📄 Resumen de "${uploadedDoc.title}":\n${summary.content}` }
        ]);
      } catch {
        // El resumen puede no estar listo aún; no es un error crítico.
      }
    } catch (error) {
      setMessages((prev) => [
        ...prev,
        { id: `upload-error-${Date.now()}`, sender: 'ia', text: `⚠️ No pude subir "${uploadedFile.name}". Intenta de nuevo en un momento.` }
      ]);
    } finally {
      setIsUploading(false);
      if (fileInputRef.current) fileInputRef.current.value = '';
    }
  };

  const triggerFileSelect = () => {
    fileInputRef.current?.click();
  };

  const handleRegenerateMessage = async (messageId: string) => {
    if (!sessionId || regeneratingId) return;

    setRegeneratingId(messageId);
    try {
      const regenerated = await chatApi.regenerateMessage(sessionId, messageId);
      setMessages((prev) =>
        prev.map((m) =>
          m.id === messageId
            ? { id: regenerated.id, sender: 'ia', text: regenerated.content, canRegenerate: true }
            : m
        )
      );
    } catch (error) {
      setMessages((prev) => [
        ...prev,
        { id: `regen-error-${Date.now()}`, sender: 'ia', text: '⚠️ No pude regenerar esa respuesta. Intenta de nuevo.' }
      ]);
    } finally {
      setRegeneratingId(null);
    }
  };

  const handleResourceClick = async (resourceId: string) => {
    try {
      const { url } = await documentsApi.getDownloadUrl(resourceId);
      window.open(url, '_blank');
    } catch (error) {
      setMessages((prev) => [
        ...prev,
        { id: `download-error-${Date.now()}`, sender: 'ia', text: `⚠️ No pude obtener el link de descarga de ese documento.` }
      ]);
    }
  };

  const handleResourceDelete = async (e: React.MouseEvent, resourceId: string, resourceName: string) => {
    e.stopPropagation();

    const confirmed = window.confirm(`¿Borrar "${resourceName}"? Esta acción no se puede deshacer.`);
    if (!confirmed) return;

    setDeletingId(resourceId);
    try {
      await documentsApi.delete(resourceId);
      const updatedResources = resources.filter((r) => r.id !== resourceId);
      setResources(updatedResources);

      if (sessionId) {
        try {
          await chatApi.updateSession(sessionId, {
            name: sessionName,
            document_ids: updatedResources.map((r) => r.id),
          });
        } catch (error) {
          console.error('Error al desvincular el documento de la sesión de chat:', error);
        }
      }

      setMessages((prev) => [
        ...prev,
        { id: `deleted-${Date.now()}`, sender: 'ia', text: `🗑️ "${resourceName}" fue eliminado de la base de conocimiento de la sala.` }
      ]);
    } catch (error) {
      setMessages((prev) => [
        ...prev,
        { id: `delete-error-${Date.now()}`, sender: 'ia', text: `⚠️ No pude borrar "${resourceName}". Intenta de nuevo.` }
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
              {roomName && (
                <p className="text-xs text-gray-400 font-semibold uppercase tracking-wide mb-0.5">{roomName}</p>
              )}
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
            <div key={msg.id} className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'} group`}>
              <div className={`relative max-w-[75%] rounded-2xl p-4 shadow-sm text-sm ${
                msg.sender === 'user' ? 'bg-indigo-600 text-white rounded-tr-none' : 'bg-white text-gray-800 border border-gray-100 rounded-tl-none'
              }`}>
                <p className="leading-relaxed whitespace-pre-line">{msg.text}</p>

                {msg.canRegenerate && (
                  <button
                    type="button"
                    onClick={() => handleRegenerateMessage(msg.id)}
                    disabled={regeneratingId === msg.id}
                    title="Regenerar respuesta"
                    className="absolute -bottom-3 -right-3 w-7 h-7 flex items-center justify-center rounded-full bg-white border border-gray-200 shadow-sm text-xs opacity-0 group-hover:opacity-100 transition-opacity hover:bg-gray-50 disabled:opacity-50"
                  >
                    {regeneratingId === msg.id ? '…' : '🔄'}
                  </button>
                )}
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

            <input
              type="file"
              ref={fileInputRef}
              onChange={handleFileChange}
              accept=".pdf, .ppt, .pptx, .txt, .doc, .docx"
              className="hidden"
            />

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
              placeholder={isSessionReady ? "Pregúntale a la IA sobre tus documentos o código..." : "Iniciando sesión de chat..."}
              disabled={!isSessionReady}
              className="flex-1 px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 text-sm text-gray-800 bg-gray-50 disabled:opacity-60"
            />

            <button
              type="submit"
              disabled={!input.trim() || isThinking || !isSessionReady}
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
          <GenerateFlashcardsModal
            documents={resources}
            onGenerated={(deck) => {
              setMessages((prev) => [
                ...prev,
                { id: `deck-${deck.id}`, sender: 'ia', text: `📝 Generé el mazo "${deck.title}" con ${deck.flashcards.length} tarjetas. Te llevo a repasarlo.` }
              ]);
              navigate(`/flashcards/${deck.id}`);
            }}
          />
          <GenerateQuizModal
            documents={resources}
            onGenerated={(quiz) => {
              setMessages((prev) => [
                ...prev,
                { id: `quiz-${quiz.id}`, sender: 'ia', text: `📝 Generé el quiz "${quiz.title}" con ${quiz.questions.length} preguntas sobre ${quiz.topic}.` }
              ]);
              // TODO: Navegar a la página del quiz
            }}
          />
        </div>
      </div>

    </div>
  );
};