"use client";

import { useActionState } from "react";
import { updateSiteSettings, type FormState } from "./actions";
import { Button } from "@/components/ui/Button";
import { Input, Label, Textarea, FormRow } from "@/components/ui/Field";
import { SingleImageField } from "@/components/admin/SingleImageField";
import type { SiteSettings } from "@/lib/types";

const initialState: FormState = { error: null };

export function SiteSettingsForm({ settings }: { settings: SiteSettings | null }) {
  const [state, formAction, pending] = useActionState(updateSiteSettings, initialState);

  return (
    <form action={formAction} className="max-w-2xl space-y-8">
      <section>
        <h3 className="font-display text-xl text-royal-900">Home page hero</h3>
        <div className="mt-4 space-y-1">
          <FormRow>
            <Label htmlFor="hero_title">Title</Label>
            <Input id="hero_title" name="hero_title" defaultValue={settings?.hero_title ?? ""} />
          </FormRow>
          <FormRow>
            <Label htmlFor="hero_subtitle">Subtitle</Label>
            <Textarea id="hero_subtitle" name="hero_subtitle" defaultValue={settings?.hero_subtitle ?? ""} />
          </FormRow>
          <FormRow>
            <SingleImageField
              name="hero_image"
              label="Background image"
              pathPrefix="site-settings"
              defaultUrl={settings?.hero_image_url}
              defaultAlt={settings?.hero_image_alt}
              defaultCredit={settings?.hero_image_credit}
            />
          </FormRow>
          <div className="grid gap-4 sm:grid-cols-2">
            <FormRow>
              <Label htmlFor="hero_cta_primary_label">Primary button label</Label>
              <Input id="hero_cta_primary_label" name="hero_cta_primary_label" defaultValue={settings?.hero_cta_primary_label ?? ""} />
            </FormRow>
            <FormRow>
              <Label htmlFor="hero_cta_primary_href">Primary button link</Label>
              <Input id="hero_cta_primary_href" name="hero_cta_primary_href" defaultValue={settings?.hero_cta_primary_href ?? ""} />
            </FormRow>
            <FormRow>
              <Label htmlFor="hero_cta_secondary_label">Secondary button label</Label>
              <Input id="hero_cta_secondary_label" name="hero_cta_secondary_label" defaultValue={settings?.hero_cta_secondary_label ?? ""} />
            </FormRow>
            <FormRow>
              <Label htmlFor="hero_cta_secondary_href">Secondary button link</Label>
              <Input id="hero_cta_secondary_href" name="hero_cta_secondary_href" defaultValue={settings?.hero_cta_secondary_href ?? ""} />
            </FormRow>
          </div>
        </div>
      </section>

      <section className="border-t border-cream-200 pt-6">
        <h3 className="font-display text-xl text-royal-900">About page</h3>
        <div className="mt-4 space-y-1">
          <FormRow>
            <Label htmlFor="about_title">Page title</Label>
            <Input id="about_title" name="about_title" defaultValue={settings?.about_title ?? ""} />
          </FormRow>
          <FormRow>
            <Label htmlFor="about_body">Project description</Label>
            <Textarea id="about_body" name="about_body" defaultValue={settings?.about_body ?? ""} />
          </FormRow>
          <FormRow>
            <Label htmlFor="about_team">Team details</Label>
            <Textarea id="about_team" name="about_team" defaultValue={settings?.about_team ?? ""} />
          </FormRow>
          <div className="grid gap-4 sm:grid-cols-2">
            <FormRow>
              <Label htmlFor="about_contact_email">Contact email</Label>
              <Input id="about_contact_email" name="about_contact_email" type="email" defaultValue={settings?.about_contact_email ?? ""} />
            </FormRow>
            <FormRow>
              <Label htmlFor="about_contact_phone">Contact phone</Label>
              <Input id="about_contact_phone" name="about_contact_phone" defaultValue={settings?.about_contact_phone ?? ""} />
            </FormRow>
          </div>
        </div>
      </section>

      {state.error && <p className="text-sm text-red-700">{state.error}</p>}
      {state.success && !state.error && (
        <p className="text-sm text-emerald-700">Saved.</p>
      )}

      <Button type="submit" disabled={pending}>
        {pending ? "Saving…" : "Save content"}
      </Button>
    </form>
  );
}
