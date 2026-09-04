import Link from "next/link";
import { redirect } from "next/navigation";
import { requireAdmin } from "@/lib/auth";
import { AdminSidebar } from "@/components/admin/AdminSidebar";
import { Container } from "@/components/ui/Container";

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const { userId, isAdmin, profile } = await requireAdmin();

  if (!userId) {
    redirect("/login?next=/admin");
  }

  if (!isAdmin) {
    return (
      <Container className="py-20">
        <div className="mx-auto max-w-md rounded-2xl border border-cream-200 bg-white p-8 text-center">
          <h1 className="font-display text-2xl text-royal-900">Not authorized</h1>
          <p className="mt-3 text-sm text-cream-700">
            Your account ({profile?.full_name || "signed in user"}) doesn&rsquo;t have
            administrator access. Ask an existing administrator to grant your account the
            &lsquo;admin&rsquo; role in the <code>profiles</code> table.
          </p>
          <Link href="/" className="mt-6 inline-block text-sm font-medium text-royal-700 hover:underline">
            &larr; Back to the site
          </Link>
        </div>
      </Container>
    );
  }

  return (
    <Container className="py-10">
      <div className="mb-8">
        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-sandstone-600">
          Admin dashboard
        </p>
        <h1 className="font-display text-3xl text-royal-900">Studio 1947 content manager</h1>
      </div>
      <div className="flex flex-col gap-8 lg:flex-row">
        <AdminSidebar />
        <div className="min-w-0 flex-1">{children}</div>
      </div>
    </Container>
  );
}
