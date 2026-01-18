"use client";

import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useCreateUser } from "@/lib/hooks/use-user";
import { Loader2 } from "lucide-react";

interface UsernameDialogProps {
  open: boolean;
}

export function UsernameDialog({ open }: UsernameDialogProps) {
  const [username, setUsername] = useState("");
  const [error, setError] = useState<string | null>(null);
  const createUser = useCreateUser();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    const trimmed = username.trim();

    if (trimmed.length < 2) {
      setError("Username must be at least 2 characters");
      return;
    }

    if (trimmed.length > 30) {
      setError("Username must be less than 30 characters");
      return;
    }

    try {
      await createUser.mutateAsync(trimmed);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong");
    }
  };

  return (
    <Dialog open={open}>
      <DialogContent
        className="sm:max-w-md"
        onPointerDownOutside={(e) => e.preventDefault()}
        onEscapeKeyDown={(e) => e.preventDefault()}
      >
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold text-center">
            Welcome to Pomodoro Todo
          </DialogTitle>
          <DialogDescription className="text-center text-muted-foreground">
            Enter a username to get started. You can change it later in
            settings.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4 mt-4">
          <div className="space-y-2">
            <Input
              placeholder="Enter your username"
              value={username}
              onChange={(e) => {
                setUsername(e.target.value);
                setError(null);
              }}
              className="text-center text-lg h-12"
              autoFocus
              disabled={createUser.isPending}
            />
            {error && (
              <p className="text-sm text-destructive text-center">{error}</p>
            )}
          </div>

          <Button
            type="submit"
            className="w-full h-11"
            disabled={createUser.isPending || username.trim().length < 2}
          >
            {createUser.isPending ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Creating...
              </>
            ) : (
              "Get Started"
            )}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}
