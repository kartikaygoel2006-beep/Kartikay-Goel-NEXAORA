import { getSiteSettings } from "@/lib/queries";
import { SiteSettingsForm } from "./SiteSettingsForm";

export default async function AdminSiteSettingsPage() {
  const settings = await getSiteSettings();

  return (
    <div>
      <h2 className="font-display text-2xl text-royal-900">Home &amp; About content</h2>
      <p className="mt-1 text-sm text-cream-600">
        Controls the home page hero and the About page. Featured monuments and crafts are
        managed from their own list pages using the &ldquo;Feature&rdquo; button.
      </p>
      <div className="mt-6">
        <SiteSettingsForm settings={settings} />
      </div>
    </div>
  );
}
