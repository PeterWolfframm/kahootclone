import { useEffect, useMemo, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { TopBar } from '../components/TopBar';
import { ShapeIcon } from '../components/ShapeIcon';
import {
  COLORS,
  TIME_OPTIONS,
  supabase,
  type KahootRow,
  type OptionRow,
  type QuestionRow,
  type QuestionType,
} from '../lib/supabase';
import { blankQuestion, defaultOptions } from '../lib/quiz';

const TYPE_LABELS: Record<QuestionType, string> = {
  quiz: 'Quiz',
  true_false: 'True/false',
  multi_select: 'Multi-select',
  type_answer: 'Type answer',
  slider: 'Slider',
};

export function Editor() {
  const { id } = useParams();
  const nav = useNavigate();
  const [kahoot, setKahoot] = useState<KahootRow | null>(null);
  const [questions, setQuestions] = useState<QuestionRow[]>([]);
  const [options, setOptions] = useState<OptionRow[]>([]);
  const [typeAnswers, setTypeAnswers] = useState<Record<string, string>>({});
  const [selected, setSelected] = useState<string | null>(null);
  const [mine, setMine] = useState(false);
  const [busy, setBusy] = useState(false);
  const [promptDraft, setPromptDraft] = useState('');

  const q = questions.find(x => x.id === selected) ?? null;
  const qOpts = useMemo(
    () => options.filter(o => o.question_id === selected).sort((a, b) => a.position - b.position),
    [options, selected]
  );

  async function load() {
    const [{ data: k }, { data: qs }, user] = await Promise.all([
      supabase.from('kahoots').select('*').eq('id', id).single(),
      supabase.from('questions').select('*').eq('kahoot_id', id).order('position'),
      supabase.auth.getUser(),
    ]);
    if (!k) return;
    setKahoot(k as KahootRow);
    setMine(user.data.user?.id === (k as KahootRow).owner_id);
    const list = (qs as QuestionRow[]) ?? [];
    setQuestions(list);
    setSelected(list[0]?.id ?? null);
    if (list.length) {
      const ids = list.map(x => x.id);
      const { data: opts } = await supabase.from('options').select('*').in('question_id', ids);
      const { data: tas } = await supabase.from('type_answers').select('*').in('question_id', ids);
      setOptions((opts as OptionRow[]) ?? []);
      const map: Record<string, string> = {};
      for (const t of tas ?? []) map[t.question_id] = t.answer;
      setTypeAnswers(map);
    }
  }

  useEffect(() => {
    load();
  }, [id]);

  useEffect(() => {
    setPromptDraft(q?.prompt ?? '');
  }, [q?.id, q?.prompt]);

  async function saveKahoot(patch: Partial<KahootRow>) {
    if (!id || !mine) return;
    const { data } = await supabase.from('kahoots').update(patch).eq('id', id).select().single();
    if (data) setKahoot(data as KahootRow);
  }

  async function addQuestion(type: QuestionType) {
    if (!id || !mine) return;
    const { data: qrow, error } = await supabase
      .from('questions')
      .insert({ ...blankQuestion(type), kahoot_id: id, position: questions.length })
      .select()
      .single();
    if (error || !qrow) return alert(error?.message);
    const opts = defaultOptions(type).map(o => ({ ...o, question_id: qrow.id }));
    const { data: inserted } = await supabase.from('options').insert(opts).select();
    setQuestions(qs => [...qs, qrow as QuestionRow]);
    setOptions(os => [...os, ...((inserted as OptionRow[]) ?? [])]);
    setSelected(qrow.id);
  }

  async function saveQuestion(patch: Partial<QuestionRow>) {
    if (!q || !mine) return;
    const { data } = await supabase.from('questions').update(patch).eq('id', q.id).select().single();
    if (data) setQuestions(qs => qs.map(x => (x.id === q.id ? (data as QuestionRow) : x)));
  }

  async function saveOption(opt: OptionRow, patch: Partial<OptionRow>) {
    if (!mine) return;
    const { data } = await supabase.from('options').update(patch).eq('id', opt.id).select().single();
    if (data) setOptions(os => os.map(x => (x.id === opt.id ? (data as OptionRow) : x)));
  }

  async function saveTypeAnswer(value: string) {
    if (!q || !mine) return;
    await supabase.from('type_answers').delete().eq('question_id', q.id);
    if (value.trim()) await supabase.from('type_answers').insert({ question_id: q.id, answer: value.trim() });
  }

  async function deleteQuestion() {
    if (!q || !mine) return;
    if (!confirm('Delete this question?')) return;
    await supabase.from('options').delete().eq('question_id', q.id);
    await supabase.from('type_answers').delete().eq('question_id', q.id);
    const { error } = await supabase.from('questions').delete().eq('id', q.id);
    if (error) return alert(error.message);
    const remaining = questions.filter(x => x.id !== q.id);
    setQuestions(remaining);
    setOptions(os => os.filter(o => o.question_id !== q.id));
    setTypeAnswers(m => {
      const next = { ...m };
      delete next[q.id];
      return next;
    });
    setSelected(remaining[0]?.id ?? null);
  }

  async function upload(kind: 'covers' | 'questions', file: File) {
    const { data: user } = await supabase.auth.getUser();
    if (!user.user) return;
    const path = `${user.user.id}/${crypto.randomUUID()}-${file.name}`;
    const { error } = await supabase.storage.from(kind).upload(path, file);
    if (error) return alert(error.message);
    const { data } = supabase.storage.from(kind).getPublicUrl(path);
    return data.publicUrl;
  }

  async function hostNow() {
    setBusy(true);
    nav(`/host/${id}`);
  }

  if (!kahoot) {
    return (
      <div className="page">
        <TopBar />
        <div className="library">Loading…</div>
      </div>
    );
  }

  return (
    <div className="page">
      <TopBar />
      <div className="library" style={{ paddingBottom: 8 }}>
        <div className="row" style={{ justifyContent: 'space-between', alignItems: 'center' }}>
          <input
            className="field"
            style={{ maxWidth: 420, margin: 0, fontSize: 22 }}
            value={kahoot.title}
            disabled={!mine}
            onChange={e => setKahoot({ ...kahoot, title: e.target.value })}
            onBlur={() => saveKahoot({ title: kahoot.title })}
          />
          <div className="row">
            {mine && (
              <select
                className="field"
                style={{ width: 'auto', margin: 0 }}
                value={kahoot.visibility}
                onChange={e => saveKahoot({ visibility: e.target.value as 'private' | 'public' })}
              >
                <option value="private">Private</option>
                <option value="public">Public</option>
              </select>
            )}
            <button className="btn btn-primary" style={{ width: 'auto' }} disabled={busy || questions.length < 1} onClick={hostNow}>
              Host
            </button>
          </div>
        </div>
        {mine && (
          <div className="row" style={{ marginTop: 10, alignItems: 'center' }}>
            <label className="btn btn-dark" style={{ width: 'auto' }}>
              Cover
              <input
                type="file"
                accept="image/*"
                hidden
                onChange={async e => {
                  const file = e.target.files?.[0];
                  if (!file) return;
                  const url = await upload('covers', file);
                  if (url) saveKahoot({ cover_url: url });
                }}
              />
            </label>
            {kahoot.cover_url && <img src={kahoot.cover_url} alt="" style={{ height: 48, borderRadius: 6 }} />}
          </div>
        )}
        <textarea
          className="field"
          disabled={!mine}
          value={kahoot.description}
          placeholder="Description"
          onChange={e => setKahoot({ ...kahoot, description: e.target.value })}
          onBlur={() => saveKahoot({ description: kahoot.description })}
        />
      </div>
      <div className="editor">
        <aside className="qlist">
          {questions.map((item, i) => (
            <button key={item.id} className={`qitem ${item.id === selected ? 'active' : ''}`} onClick={() => setSelected(item.id)}>
              {i + 1}. {item.prompt.slice(0, 40)}
            </button>
          ))}
          {mine && (
            <div className="row" style={{ marginTop: 8 }}>
              {(['quiz', 'true_false', 'multi_select', 'type_answer', 'slider'] as QuestionType[]).map(t => (
                <button key={t} className="btn btn-dark" style={{ width: 'auto', fontSize: 12, padding: '8px 10px' }} onClick={() => addQuestion(t)}>
                  {TYPE_LABELS[t]}
                </button>
              ))}
            </div>
          )}
        </aside>
        <section className="canvas">
          {!q ? (
            <p>Add a question to get started.</p>
          ) : (
            <>
              <label className="label" htmlFor="prompt">
                Question
              </label>
              <input
                id="prompt"
                className="field"
                disabled={!mine}
                value={promptDraft}
                onChange={e => setPromptDraft(e.target.value)}
                onBlur={() => {
                  if (promptDraft !== q.prompt) saveQuestion({ prompt: promptDraft });
                }}
              />
              <div className="row">
                <label>
                  Time{' '}
                  <select
                    className="field"
                    style={{ width: 'auto' }}
                    disabled={!mine}
                    value={q.time_limit_ms}
                    onChange={e => saveQuestion({ time_limit_ms: Number(e.target.value) })}
                  >
                    {TIME_OPTIONS.map(ms => (
                      <option key={ms} value={ms}>
                        {ms / 1000}s
                      </option>
                    ))}
                  </select>
                </label>
                <label>
                  Points{' '}
                  <select
                    className="field"
                    style={{ width: 'auto' }}
                    disabled={!mine}
                    value={q.points_multiplier}
                    onChange={e => saveQuestion({ points_multiplier: Number(e.target.value) })}
                  >
                    <option value={0}>No points</option>
                    <option value={1}>Standard</option>
                    <option value={2}>Double</option>
                  </select>
                </label>
                {mine && (
                  <label className="btn btn-dark" style={{ width: 'auto' }}>
                    Image
                    <input
                      type="file"
                      accept="image/*"
                      hidden
                      onChange={async e => {
                        const file = e.target.files?.[0];
                        if (!file) return;
                        const url = await upload('questions', file);
                        if (url) saveQuestion({ image_url: url });
                      }}
                    />
                  </label>
                )}
              </div>
              {q.image_url && <img src={q.image_url} alt="" style={{ maxHeight: 180, borderRadius: 8 }} />}
              {q.type === 'type_answer' ? (
                <>
                  <label className="label">Accepted answer</label>
                  <input
                    className="field"
                    disabled={!mine}
                    value={typeAnswers[q.id] ?? ''}
                    onChange={e => setTypeAnswers(m => ({ ...m, [q.id]: e.target.value }))}
                    onBlur={e => saveTypeAnswer(e.target.value)}
                  />
                </>
              ) : q.type === 'slider' ? (
                <div className="row">
                  <label>
                    Min <input className="field" type="number" disabled={!mine} value={q.slider_min ?? 0} onChange={e => saveQuestion({ slider_min: Number(e.target.value) })} />
                  </label>
                  <label>
                    Max <input className="field" type="number" disabled={!mine} value={q.slider_max ?? 100} onChange={e => saveQuestion({ slider_max: Number(e.target.value) })} />
                  </label>
                  <label>
                    Correct <input className="field" type="number" disabled={!mine} value={q.slider_correct ?? 50} onChange={e => saveQuestion({ slider_correct: Number(e.target.value) })} />
                  </label>
                  <label>
                    ± <input className="field" type="number" disabled={!mine} value={q.slider_tolerance} onChange={e => saveQuestion({ slider_tolerance: Number(e.target.value) })} />
                  </label>
                </div>
              ) : (
                <div style={{ display: 'grid', gap: 10 }}>
                  {qOpts.map(opt => (
                    <div key={opt.id} className="option" style={{ background: COLORS[opt.position] }}>
                      <ShapeIcon index={opt.position} />
                      <input
                        type="text"
                        disabled={!mine}
                        value={opt.text}
                        placeholder={`Answer ${opt.position + 1}`}
                        onChange={e => saveOption(opt, { text: e.target.value })}
                      />
                      <label style={{ fontSize: 12 }}>
                        <input
                          type={q.type === 'multi_select' ? 'checkbox' : 'radio'}
                          name={`correct-${q.id}`}
                          checked={opt.is_correct}
                          disabled={!mine}
                          onChange={async () => {
                            if (q.type === 'multi_select') {
                              saveOption(opt, { is_correct: !opt.is_correct });
                            } else {
                              for (const o of qOpts) await saveOption(o, { is_correct: o.id === opt.id });
                            }
                          }}
                        />{' '}
                        Correct
                      </label>
                    </div>
                  ))}
                </div>
              )}
              {mine && (
                <p>
                  <button className="btn btn-red" type="button" style={{ width: 'auto' }} onClick={deleteQuestion}>
                    Delete question
                  </button>
                </p>
              )}
              {!mine && <p>You can host this public kahoot, but only the owner can edit it.</p>}
              <p>
                <Link to="/library">Back to library</Link>
              </p>
            </>
          )}
        </section>
      </div>
    </div>
  );
}
