"use client";

import { useState } from "react";
import { useUser, useUpdateUser } from "@/lib/hooks/use-user";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { toast } from "sonner";
import { Link2, Save, Loader2 } from "lucide-react";

export function IntegrationsForm() {
  const { data: user } = useUser();
  const updateUser = useUpdateUser();
  const [githubUsername, setGithubUsername] = useState(
    user?.githubUsername || ""
  );
  const [leetcodeUsername, setLeetcodeUsername] = useState(
    user?.leetcodeUsername || ""
  );

  const hasChanges =
    githubUsername !== (user?.githubUsername || "") ||
    leetcodeUsername !== (user?.leetcodeUsername || "");

  const handleSave = async () => {
    try {
      await updateUser.mutateAsync({
        githubUsername: githubUsername.trim() || null,
        leetcodeUsername: leetcodeUsername.trim() || null,
      });
      toast.success("Integrations updated");
    } catch {
      toast.error("Failed to update integrations");
    }
  };

  return (
    <Card className="border-zinc-800 bg-zinc-900/50">
      <CardHeader>
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-gradient-to-br from-blue-500 to-cyan-600">
            <Link2 className="h-5 w-5 text-white" />
          </div>
          <div>
            <CardTitle className="text-zinc-100">Integrations</CardTitle>
            <CardDescription className="text-zinc-400">
              Connect your profiles to show progress in Analytics
            </CardDescription>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <label className="text-sm font-medium text-zinc-300">
            GitHub Username
          </label>
          <Input
            value={githubUsername}
            onChange={(e) => setGithubUsername(e.target.value)}
            placeholder="e.g., octocat"
            className="bg-zinc-800/50 border-zinc-700 text-zinc-100 placeholder:text-zinc-500"
          />
          <p className="text-xs text-zinc-500">
            Public contribution graph will appear in Analytics
          </p>
        </div>
        <div className="space-y-2">
          <label className="text-sm font-medium text-zinc-300">
            LeetCode Username
          </label>
          <Input
            value={leetcodeUsername}
            onChange={(e) => setLeetcodeUsername(e.target.value)}
            placeholder="e.g., leetcoder123"
            className="bg-zinc-800/50 border-zinc-700 text-zinc-100 placeholder:text-zinc-500"
          />
          <p className="text-xs text-zinc-500">
            Problem stats and contest rating will appear in Analytics
          </p>
        </div>
        <Button
          onClick={handleSave}
          disabled={!hasChanges || updateUser.isPending}
          className="bg-emerald-600 hover:bg-emerald-700 disabled:opacity-50"
        >
          {updateUser.isPending ? (
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          ) : (
            <Save className="mr-2 h-4 w-4" />
          )}
          Save
        </Button>
      </CardContent>
    </Card>
  );
}
