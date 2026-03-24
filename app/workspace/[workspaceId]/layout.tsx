// app/workspace/[workspaceId]/layout.tsx
import AppShell from "@/components/layout/AppShell";

export default async function WorkspaceLayout({ children,params,}: {children: React.ReactNode;params: Promise<{ workspaceId: string }>;}) {
  const { workspaceId } = await params;

  return (
    <AppShell workspaceId={workspaceId}>
      {children}
    </AppShell>
  );
}