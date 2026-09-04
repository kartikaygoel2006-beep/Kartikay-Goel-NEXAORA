import { LocationForm } from "../LocationForm";
import { createLocation } from "../actions";

export default function NewLocationPage() {
  return (
    <div>
      <h2 className="font-display text-2xl text-royal-900">New location</h2>
      <div className="mt-6">
        <LocationForm action={createLocation} />
      </div>
    </div>
  );
}
