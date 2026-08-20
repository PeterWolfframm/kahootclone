import { Download } from 'lucide-react';
import { BarChart, Button, Card, Stat, useToast } from '../../design-system';
import { SCORE_BUCKETS } from './data';

export function ReportsView() {
  const { toast } = useToast();

  return (
    <div className="flex flex-col gap-6 px-10 py-8">
      <div className="grid grid-cols-3 gap-6">
        <Stat label="Sessions this month" value={128} delta="+9%" tone="success" />
        <Stat label="Median score" value={76} suffix="%" delta="+3%" tone="success" />
        <Stat label="Drop-off" value={9} suffix="%" delta="-1%" tone="success" />
      </div>
      <div className="grid grid-cols-[1.4fr_1fr] gap-6">
        <BarChart title="Score distribution" data={SCORE_BUCKETS} highlightIndex={4} height={200} />
        <Card padding={28}>
          <div className="mb-3 font-display text-xl font-semibold leading-snug tracking-tight">Export</div>
          <p className="mb-6 text-sm text-secondary">
            Download a CSV of every session from the last 30 days — scores, times, and completion.
          </p>
          <Button
            icon={<Download size={16} strokeWidth={2.5} />}
            onClick={() => toast('Report queued — check your email', 'success')}
          >
            Export CSV
          </Button>
        </Card>
      </div>
    </div>
  );
}
