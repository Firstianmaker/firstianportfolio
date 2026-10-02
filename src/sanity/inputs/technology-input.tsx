"use client";

import { useId, useState } from 'react';
import { Button, Text, TextArea } from '@sanity/ui';
import { insert, setIfMissing, type ArrayOfPrimitivesInputProps } from 'sanity';
import { newTechnologyLines } from './technology-lines';

export function TechnologyInput(props: ArrayOfPrimitivesInputProps) {
  const [text, setText] = useState('');
  const [message, setMessage] = useState('');
  const id = useId();
  const additions = newTechnologyLines(text, props.value?.filter((value): value is string => typeof value === 'string'));
  function addSkills() {
    if (props.readOnly || !additions.length) return;
    props.onChange([setIfMissing([]), insert(additions, 'after', [-1])]);
    setText('');
    setMessage(`${additions.length} skills added.`);
  }
  return <div style={{ display: 'grid', gap: 24 }}>
    <div style={{ display: 'grid', gap: 12 }}>
      <label htmlFor={id}><Text size={1} weight="semibold">Paste technologies — one skill per line</Text></label>
      <TextArea id={id} value={text} rows={5} readOnly={props.readOnly} placeholder={'React\nTypeScript\nNestJS\nMySQL'} onChange={(event) => { setText(event.currentTarget.value); setMessage(''); }} />
      <Button text={`Add skills${additions.length ? ` (${additions.length})` : ''}`} tone="primary" disabled={props.readOnly || !additions.length} onClick={addSkills} />
      <Text size={1} muted>Existing skills are kept. Empty lines and duplicate names are skipped.</Text>
      <div role="status">{message && <Text size={1}>{message}</Text>}</div>
    </div>
    {props.renderDefault(props)}
  </div>;
}
