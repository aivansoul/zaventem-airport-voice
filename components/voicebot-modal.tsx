"use client";

import Link from "next/link";
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
  type ButtonHTMLAttributes,
  type FormEvent,
  type ReactNode,
} from "react";
import {
  type DisconnectionDetails,
  useConversationControls,
  useConversationStatus,
} from "@elevenlabs/react";
import { PUBLIC_AGENT_ID } from "@/config/public-agent";
import { IconSprite } from "@/components/icon-sprite";
import { ZaventemWordmark } from "@/components/zaventem-wordmark";

type VoiceLanguage = "fr" | "nl" | "en";

const languageCopy: Record<VoiceLanguage, {
  title: string;
  subtitle: string;
  greeting: string;
  ready: string;
  start: string;
  connecting: string;
  listening: string;
  stop: string;
  placeholder: string;
  consent: string;
}> = {
  fr: {
    title: "L’aéroport vous écoute.",
    subtitle: "Posez votre question en français, néerlandais ou anglais.",
    greeting: "Bonjour, comment puis-je vous aider ?",
    ready: "Prêt à démarrer",
    start: "Démarrer la conversation",
    connecting: "Connexion en cours…",
    listening: "Micro actif, le voicebot vous écoute",
    stop: "Terminer la conversation",
    placeholder: "Ou écrivez votre question…",
    consent: "J’accepte l’usage du microphone et la conservation de cet essai jusqu’à 30 jours.",
  },
  nl: {
    title: "De luchthaven luistert.",
    subtitle: "Stel uw vraag in het Nederlands, Frans of Engels.",
    greeting: "Goedendag, hoe kan ik u helpen?",
    ready: "Klaar om te beginnen",
    start: "Gesprek starten",
    connecting: "Verbinding maken…",
    listening: "Microfoon actief, de voicebot luistert",
    stop: "Gesprek beëindigen",
    placeholder: "Of typ uw vraag…",
    consent: "Ik ga akkoord met het gebruik van de microfoon en de bewaring van deze test tot 30 dagen.",
  },
  en: {
    title: "The airport is listening.",
    subtitle: "Ask your question in English, French or Dutch.",
    greeting: "Hello, how can I help you?",
    ready: "Ready to begin",
    start: "Start the conversation",
    connecting: "Connecting…",
    listening: "Microphone active, the voicebot is listening",
    stop: "End the conversation",
    placeholder: "Or type your question…",
    consent: "I agree to microphone use and storage of this test for up to 30 days.",
  },
};

type VoicebotModalContextValue = {
  openVoicebot: (language?: VoiceLanguage) => void;
};

const VoicebotModalContext = createContext<VoicebotModalContextValue | null>(null);

function formatSessionError(message: string) {
  const permissionFailure = /microphone|permission|notallowed/i.test(message);
  const friendlyMessage = permissionFailure
    ? "Autorisez le microphone pour démarrer la conversation."
    : "La connexion vocale a été interrompue. Réessayez dans un instant.";

  return process.env.NODE_ENV === "development" ? `${friendlyMessage} (${message})` : friendlyMessage;
}

function describeDisconnect(details: DisconnectionDetails) {
  if (details.reason === "error") return details.message;
  return `Session ended by ${details.reason}`;
}

function VoicebotDialog({ initialLanguage, onClose }: {
  initialLanguage: VoiceLanguage;
  onClose: () => void;
}) {
  const dialogRef = useRef<HTMLDialogElement>(null);
  const languageRef = useRef<HTMLButtonElement>(null);
  const endedRef = useRef(false);
  const receivedAgentReplyRef = useRef(false);
  const { startSession, endSession, sendUserMessage } = useConversationControls();
  const { status, message: sessionError } = useConversationStatus();
  const [language, setLanguage] = useState<VoiceLanguage>(initialLanguage);
  const [consent, setConsent] = useState(false);
  const [error, setError] = useState("");
  const [textQuestion, setTextQuestion] = useState("");
  const [hadConnected, setHadConnected] = useState(false);

  const connected = status === "connected";
  const connecting = status === "connecting";
  const configured = Boolean(PUBLIC_AGENT_ID);
  const copy = languageCopy[language];

  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;
    dialog.showModal();
    window.requestAnimationFrame(() => languageRef.current?.focus());
  }, []);

  useEffect(() => {
    if (connected) setHadConnected(true);
  }, [connected]);

  useEffect(() => {
    if (!sessionError) return;
    setError(formatSessionError(sessionError));
  }, [sessionError]);

  useEffect(() => () => {
    if (endedRef.current) return;
    endedRef.current = true;
    endSession();
  }, [endSession]);

  const finish = useCallback(() => {
    if (!endedRef.current) {
      endedRef.current = true;
      endSession();
    }
    onClose();
  }, [endSession, onClose]);

  async function start() {
    if (!configured || !consent || connecting || connected) return;
    setError("");
    setHadConnected(false);
    endedRef.current = false;
    receivedAgentReplyRef.current = false;

    if (!navigator.mediaDevices?.getUserMedia) {
      setError("Ce navigateur ne permet pas d’utiliser le microphone.");
      return;
    }

    try {
      await startSession({
        agentId: PUBLIC_AGENT_ID,
        connectionType: "websocket",
        overrides: { agent: { language } },
        onConnect: () => setError(""),
        onMessage: ({ role }) => {
          if (role === "agent") receivedAgentReplyRef.current = true;
        },
        onDisconnect: (details) => {
          if (endedRef.current) return;
          if (details.reason === "error" || !receivedAgentReplyRef.current) {
            setError(formatSessionError(describeDisconnect(details)));
          }
        },
        onError: (message) => setError(formatSessionError(message)),
      });
    } catch (cause) {
      const message = cause instanceof Error ? cause.message : "Connexion impossible";
      setError(formatSessionError(message));
    }
  }

  function stop() {
    if (!endedRef.current) {
      endedRef.current = true;
      endSession();
    }
  }

  function sendText(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const question = textQuestion.trim();
    if (!connected || !question) return;
    sendUserMessage(question);
    setTextQuestion("");
  }

  return (
    <dialog
      id="voicebot-dialog"
      ref={dialogRef}
      className="voice-modal"
      aria-labelledby="voice-modal-title"
      aria-describedby="voice-modal-description"
      onCancel={(event) => {
        event.preventDefault();
        finish();
      }}
      onClick={(event) => {
        if (event.target === event.currentTarget) finish();
      }}
    >
      <div className="voice-modal-panel">
        <div className="voice-modal-topbar">
          <div className="site-wordmark voice-modal-brand" aria-label="Zaventem Voice, by Banana Navy">
            <ZaventemWordmark />
          </div>

          <div className="voice-language-picker" role="group" aria-label="Langue de la conversation">
            {(["fr", "nl", "en"] as const).map((item, index) => (
              <button
                ref={index === 0 ? languageRef : undefined}
                type="button"
                key={item}
                aria-pressed={language === item}
                disabled={connecting || connected}
                onClick={() => setLanguage(item)}
              >
                {item.toUpperCase()}
              </button>
            ))}
          </div>

          <button className="voice-modal-close" type="button" aria-label="Fermer" onClick={finish}>
            <span /><span />
          </button>
        </div>

        <div className={`voice-modal-orb ${connected ? "is-live" : ""} ${connecting ? "is-connecting" : ""}`} aria-hidden="true">
          <i />
        </div>

        <div className="voice-modal-heading">
          <h2 id="voice-modal-title">{copy.title}</h2>
          <p id="voice-modal-description">{copy.subtitle}</p>
        </div>

        <div className="voice-session-card">
          <p className="voice-session-greeting">{copy.greeting}</p>
          <p className="voice-session-status" aria-live="polite">
            {connected ? copy.listening : connecting ? copy.connecting : hadConnected ? "Conversation terminée" : copy.ready}
          </p>

          {!connected && !connecting ? (
            <div className="voice-consent-row">
              <label>
                <input type="checkbox" checked={consent} onChange={(event) => setConsent(event.target.checked)} />
                <span>{copy.consent}</span>
              </label>
              <Link href="/confidentialite" onClick={finish}>Confidentialité</Link>
            </div>
          ) : null}

          {!connected ? (
            <button className="voice-session-button" type="button" disabled={!configured || !consent || connecting} onClick={start}>
              <IconSprite col={1} row={1} label="Microphone" className="voice-session-button-icon" />
              {connecting ? copy.connecting : copy.start}
            </button>
          ) : (
            <button className="voice-session-button is-stop" type="button" onClick={stop}>
              {copy.stop}
            </button>
          )}
        </div>

        <div className="voice-modal-guidance">
          <IconSprite col={1} row={1} label="Microphone" className="voice-guidance-icon" />
          <i aria-hidden="true" />
          <IconSprite col={7} row={1} label="Haut-parleur" className="voice-guidance-icon" />
          <p>Cette démo utilise votre microphone et vos haut-parleurs. Installez-vous au calme pour une conversation fluide.</p>
        </div>

        <form className="voice-text-form" onSubmit={sendText}>
          <label className="sr-only" htmlFor="voice-text-question">Question écrite</label>
          <input
            id="voice-text-question"
            value={textQuestion}
            onChange={(event) => setTextQuestion(event.target.value)}
            placeholder={copy.placeholder}
            disabled={!connected}
            autoComplete="off"
          />
          <button type="submit" aria-label="Envoyer la question" disabled={!connected || !textQuestion.trim()}>
            <span aria-hidden="true">➤</span>
          </button>
        </form>

        {error ? <p className="voice-modal-error" role="alert">{error}</p> : null}
        <p className="voice-modal-disclaimer">Prototype d’information uniquement. Ne communiquez aucune donnée sensible. Urgence immédiate : 112.</p>
      </div>
    </dialog>
  );
}

export function VoicebotModalProvider({ children }: { children: ReactNode }) {
  const [modal, setModal] = useState<{ language: VoiceLanguage; key: number } | null>(null);
  const returnFocusRef = useRef<HTMLElement | null>(null);

  const openVoicebot = useCallback((language: VoiceLanguage = "fr") => {
    returnFocusRef.current = document.activeElement instanceof HTMLElement ? document.activeElement : null;
    setModal({ language, key: Date.now() });
  }, []);

  const closeVoicebot = useCallback(() => {
    setModal(null);
    window.requestAnimationFrame(() => returnFocusRef.current?.focus());
  }, []);

  const value = useMemo(() => ({ openVoicebot }), [openVoicebot]);

  return (
    <VoicebotModalContext.Provider value={value}>
      {children}
      {modal ? <VoicebotDialog key={modal.key} initialLanguage={modal.language} onClose={closeVoicebot} /> : null}
    </VoicebotModalContext.Provider>
  );
}

type VoicebotTriggerProps = Omit<ButtonHTMLAttributes<HTMLButtonElement>, "type"> & {
  initialLanguage?: VoiceLanguage;
};

export function VoicebotTrigger({ initialLanguage = "fr", onClick, children, ...props }: VoicebotTriggerProps) {
  const context = useContext(VoicebotModalContext);
  if (!context) throw new Error("VoicebotTrigger must be rendered inside VoicebotModalProvider");

  return (
    <button
      {...props}
      type="button"
      aria-haspopup="dialog"
      aria-controls="voicebot-dialog"
      onClick={(event) => {
        onClick?.(event);
        if (!event.defaultPrevented) context.openVoicebot(initialLanguage);
      }}
    >
      {children}
    </button>
  );
}
