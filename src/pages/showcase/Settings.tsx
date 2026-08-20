import { useState } from 'react';
import { Button, Card, Checkbox, Dialog, Input, Select, Switch, useToast } from '../../design-system';

export function SettingsView() {
  const { toast } = useToast();
  const [org, setOrg] = useState('North field high');
  const [tz, setTz] = useState('utc');
  const [shuffle, setShuffle] = useState(true);
  const [showQ, setShowQ] = useState(true);
  const [danger, setDanger] = useState(false);

  return (
    <div className="flex flex-col gap-6 px-10 py-8">
      <Card padding={28} className="max-w-xl">
        <div className="mb-6 font-display text-xl font-semibold leading-snug tracking-tight">Workspace</div>
        <div className="flex flex-col gap-5">
          <Input label="Organisation name" value={org} onChange={setOrg} />
          <Select
            label="Time zone"
            value={tz}
            onChange={setTz}
            options={[
              { value: 'utc', label: 'UTC' },
              { value: 'cet', label: 'Central European Time' },
              { value: 'pt', label: 'Pacific Time' },
            ]}
          />
          <Checkbox label="Shuffle answer order by default" checked={shuffle} onChange={setShuffle} />
          <Switch label="Show question on player screens" checked={showQ} onChange={setShowQ} />
          <div>
            <Button
              onClick={() => toast('Settings saved', 'success')}
            >
              Save changes
            </Button>
          </div>
        </div>
      </Card>

      <Card padding={28} className="max-w-xl">
        <div className="mb-2 font-display text-xl font-semibold leading-snug tracking-tight">Danger zone</div>
        <p className="mb-5 text-sm text-secondary">Wipe every quiz, report, and player in this workspace. This can't be undone.</p>
        <Button variant="danger" onClick={() => setDanger(true)}>
          Delete workspace
        </Button>
      </Card>

      <Dialog
        open={danger}
        title="Delete this workspace?"
        onClose={() => setDanger(false)}
        actions={
          <>
            <Button variant="ghost" onClick={() => setDanger(false)}>
              Cancel
            </Button>
            <Button
              variant="danger"
              onClick={() => {
                setDanger(false);
                toast("Workspace marked for deletion — it's locked for 7 days", 'danger');
              }}
            >
              Delete
            </Button>
          </>
        }
      >
        Type-answer quizzes, live sessions, and reports all go. You'll have 7 days to cancel.
      </Dialog>
    </div>
  );
}
