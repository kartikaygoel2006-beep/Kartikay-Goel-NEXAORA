import type { Metadata } from "next";
import { Container } from "@/components/ui/Container";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { EmptyState } from "@/components/ui/EmptyState";
import { getSiteSettings } from "@/lib/queries";

export const metadata: Metadata = {
  title: "About",
  description: "About Studio 1947 — purpose, team and contact information.",
};

export default async function AboutPage() {
  const settings = await getSiteSettings();

  return (
    <Container className="py-16">
      <SectionHeading
        eyebrow="About"
        title={settings?.about_title || "About Studio 1947"}
      />

      <div className="mt-8 grid gap-10 lg:grid-cols-[2fr_1fr]">
        <div className="space-y-8">
          <section>
            <h2 className="font-display text-xl text-royal-900">Project description</h2>
            {settings?.about_body ? (
              <p className="mt-3 whitespace-pre-line text-cream-800">{settings.about_body}</p>
            ) : (
              <EmptyState
                className="mt-3"
                title="No project description added yet"
                description="The administrator can add this from the admin dashboard."
              />
            )}
          </section>

          <section>
            <h2 className="font-display text-xl text-royal-900">Team</h2>
            {settings?.about_team ? (
              <p className="mt-3 whitespace-pre-line text-cream-800">{settings.about_team}</p>
            ) : (
              <EmptyState className="mt-3" title="No team details added yet" />
            )}
          </section>
        </div>

        <aside className="rounded-2xl border border-cream-200 bg-white p-6">
          <h2 className="font-display text-lg text-royal-900">Contact</h2>
          {settings?.about_contact_email || settings?.about_contact_phone ? (
            <ul className="mt-3 space-y-2 text-sm text-cream-800">
              {settings?.about_contact_email && (
                <li>
                  <a href={`mailto:${settings.about_contact_email}`} className="hover:underline">
                    {settings.about_contact_email}
                  </a>
                </li>
              )}
              {settings?.about_contact_phone && <li>{settings.about_contact_phone}</li>}
            </ul>
          ) : (
            <p className="mt-3 text-sm text-cream-600">No contact details added yet.</p>
          )}
        </aside>
      </div>
    </Container>
  );
}
