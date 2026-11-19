insert into zaventem_voicebot.voicebot_instances
  (provider, provider_agent_id, label, enabled, is_test)
values
  (
    'elevenlabs',
    'agent_4601m7scsffqexhv6g064mbgvtjj',
    'Brussels Airport Voice — Prototype Banana Navy',
    true,
    true
  )
on conflict (provider, provider_agent_id) do update set
  label = excluded.label,
  enabled = excluded.enabled,
  is_test = excluded.is_test,
  updated_at = now();
