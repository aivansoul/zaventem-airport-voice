"use client";

import { ConversationProvider } from "@elevenlabs/react";
import { VoicebotModalProvider } from "@/components/voicebot-modal";

export function VoiceProvider({ children }: { children: React.ReactNode }) {
  return (
    <ConversationProvider>
      <VoicebotModalProvider>{children}</VoicebotModalProvider>
    </ConversationProvider>
  );
}
