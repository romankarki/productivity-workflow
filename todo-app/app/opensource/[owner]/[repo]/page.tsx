"use client";

import { use, useState } from "react";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { MainLayout } from "@/components/layout/main-layout";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { IssueList } from "@/components/opensource/issue-list";
import { PRList } from "@/components/opensource/pr-list";
import { RepoNotes } from "@/components/opensource/repo-notes";
import { useTrackedRepos } from "@/lib/hooks/use-repos";
import { useUser } from "@/lib/hooks/use-user";
import { UsernameDialog } from "@/components/onboarding/username-dialog";
import { Skeleton } from "@/components/ui/skeleton";
import {
  ArrowLeft,
  CircleDot,
  GitPullRequest,
  StickyNote,
  ExternalLink,
} from "lucide-react";

type Tab = "issues" | "prs" | "notes";

const tabs: { id: Tab; label: string; icon: typeof CircleDot }[] = [
  { id: "issues", label: "Issues", icon: CircleDot },
  { id: "prs", label: "Pull Requests", icon: GitPullRequest },
  { id: "notes", label: "Notes", icon: StickyNote },
];

interface RepoDetailPageProps {
  params: Promise<{ owner: string; repo: string }>;
}

export default function RepoDetailPage({ params }: RepoDetailPageProps) {
  const { owner, repo } = use(params);
  const [activeTab, setActiveTab] = useState<Tab>("issues");

  const { data: user, isLoading: userLoading } = useUser();
  const { data: repos = [], isLoading: reposLoading } = useTrackedRepos();

  // Find the tracked repo record (needed for notes repoId)
  const trackedRepo = repos.find(
    (r) => r.owner === owner && r.name === repo
  );

  if (userLoading || reposLoading) {
    return (
      <MainLayout>
        <div className="space-y-4">
          <Skeleton className="h-8 w-64" />
          <Skeleton className="h-10 w-96" />
          <Skeleton className="h-96" />
        </div>
      </MainLayout>
    );
  }

  if (!user) {
    return <UsernameDialog open={true} />;
  }

  return (
    <MainLayout>
      <div className="space-y-5">
        {/* Header with back button and repo name */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Link href="/opensource">
              <Button variant="ghost" size="icon" className="h-8 w-8">
                <ArrowLeft className="h-4 w-4" />
              </Button>
            </Link>
            <div>
              <h1 className="text-xl font-bold tracking-tight">
                {owner}/{repo}
              </h1>
            </div>
          </div>

          <a
            href={`https://github.com/${owner}/${repo}`}
            target="_blank"
            rel="noopener noreferrer"
          >
            <Button variant="outline" size="sm" className="gap-1.5 text-xs">
              <ExternalLink className="h-3 w-3" />
              View on GitHub
            </Button>
          </a>
        </div>

        {/* Tab bar */}
        <div className="flex items-center gap-1 rounded-lg border border-border/40 bg-muted/30 p-1">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;

            return (
              <Button
                key={tab.id}
                variant="ghost"
                size="sm"
                onClick={() => setActiveTab(tab.id)}
                className={cn(
                  "flex-1 gap-2 rounded-md text-xs font-medium transition-all",
                  isActive
                    ? "bg-background text-foreground shadow-sm"
                    : "text-muted-foreground hover:text-foreground"
                )}
              >
                <Icon className="h-3.5 w-3.5" />
                {tab.label}
              </Button>
            );
          })}
        </div>

        {/* Tab content */}
        <Card className="border-border/40 bg-card/50 backdrop-blur">
          <CardContent className="p-5">
            {activeTab === "issues" && (
              <IssueList owner={owner} repo={repo} />
            )}
            {activeTab === "prs" && (
              <PRList owner={owner} repo={repo} />
            )}
            {activeTab === "notes" && trackedRepo && (
              <RepoNotes repoId={trackedRepo.id} />
            )}
            {activeTab === "notes" && !trackedRepo && (
              <p className="py-8 text-center text-sm text-muted-foreground">
                This repo is not in your tracked list. Add it first to save notes.
              </p>
            )}
          </CardContent>
        </Card>
      </div>
    </MainLayout>
  );
}
