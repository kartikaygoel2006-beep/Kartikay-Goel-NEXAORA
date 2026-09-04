import { SourceForm } from "../SourceForm";
import { createSource } from "../actions";

export default function NewSourcePage() {
  return (
    <div>
      <h2 className="font-display text-2xl text-royal-900">New source</h2>
      <div className="mt-6">
        <SourceForm action={createSource} />
      </div>
    </div>
  );
}
