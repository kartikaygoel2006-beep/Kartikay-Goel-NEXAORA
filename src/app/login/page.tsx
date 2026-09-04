import type { Metadata } from "next";
import { Container } from "@/components/ui/Container";
import { LoginForm } from "./LoginForm";

export const metadata: Metadata = {
  title: "Administrator login",
};

export default async function LoginPage({
  searchParams,
}: {
  searchParams: Promise<{ next?: string }>;
}) {
  const { next } = await searchParams;

  return (
    <Container className="flex min-h-[70vh] items-center justify-center py-16">
      <div className="w-full max-w-sm rounded-2xl border border-cream-200 bg-white p-8 shadow-sm">
        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-sandstone-600">
          Studio 1947
        </p>
        <h1 className="mt-2 font-display text-2xl text-royal-900">Administrator login</h1>
        <p className="mt-1 text-sm text-cream-600">
          Sign in to manage monuments, forts, crafts, sources and images.
        </p>
        <div className="mt-6">
          <LoginForm next={next || "/admin"} />
        </div>
      </div>
    </Container>
  );
}
