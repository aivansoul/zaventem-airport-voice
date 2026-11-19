begin;

select plan(13);

select has_schema('zaventem_voicebot', 'registry schema exists');
select has_table('zaventem_voicebot', 'voicebot_instances', 'voicebot instance registry exists');
select has_table('zaventem_voicebot', 'knowledge_sources', 'knowledge source registry exists');
select has_table('zaventem_voicebot', 'refresh_runs', 'refresh run audit exists');
select has_table('zaventem_voicebot', 'source_versions', 'source version audit exists');

select ok(
  not has_schema_privilege('anon', 'zaventem_voicebot', 'usage'),
  'anon cannot use the private schema'
);
select ok(
  not has_schema_privilege('authenticated', 'zaventem_voicebot', 'usage'),
  'authenticated cannot use the private schema'
);
select ok(
  has_schema_privilege('service_role', 'zaventem_voicebot', 'usage'),
  'service_role can use the private schema'
);
select ok(
  not has_table_privilege('anon', 'zaventem_voicebot.knowledge_sources', 'select'),
  'anon cannot read source metadata'
);
select ok(
  not has_table_privilege('authenticated', 'zaventem_voicebot.knowledge_sources', 'select'),
  'authenticated cannot read source metadata'
);
select ok(
  has_table_privilege('service_role', 'zaventem_voicebot.knowledge_sources', 'select,insert,update,delete'),
  'service_role can maintain the registry'
);
select col_is_pk('zaventem_voicebot', 'knowledge_sources', 'id', 'source id is the primary key');
select fk_ok(
  'zaventem_voicebot', 'source_versions', 'source_id',
  'zaventem_voicebot', 'knowledge_sources', 'id',
  'source versions reference a source'
);

select * from finish();
rollback;
