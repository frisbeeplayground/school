import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import type { Notice } from "@shared/schema";
import { useEffect } from "react";

const noticeFormSchema = z.object({
  title: z.string().min(1, "Title is required"),
  description: z.string().min(1, "Description is required"),
  fileUrl: z.string().optional(),
  pinned: z.boolean(),
});

type NoticeFormValues = z.infer<typeof noticeFormSchema>;

interface NoticeDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  notice?: Notice | null;
  onSave: (data: Partial<Notice>) => void;
}

export function NoticeDialog({
  open,
  onOpenChange,
  notice,
  onSave,
}: NoticeDialogProps) {
  const form = useForm<NoticeFormValues>({
    resolver: zodResolver(noticeFormSchema),
    defaultValues: {
      title: "",
      description: "",
      fileUrl: "",
      pinned: false,
    },
  });

  useEffect(() => {
    if (notice) {
      form.reset({
        title: notice.title,
        description: notice.description,
        fileUrl: notice.fileUrl || "",
        pinned: notice.pinned,
      });
    } else {
      form.reset({
        title: "",
        description: "",
        fileUrl: "",
        pinned: false,
      });
    }
  }, [notice, form]);

  const onSubmit = (values: NoticeFormValues) => {
    onSave({
      id: notice?.id,
      ...values,
    });
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>
            {notice ? "Edit Notice" : "Create Notice"}
          </DialogTitle>
          <DialogDescription>
            Create or edit a notice for the school website.
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="title"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Title</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Enter notice title..."
                      {...field}
                      data-testid="input-notice-title"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Description</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Enter notice description..."
                      className="min-h-[120px]"
                      {...field}
                      data-testid="input-notice-description"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="fileUrl"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Attachment URL (optional)</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="https://..."
                      {...field}
                      data-testid="input-notice-file"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="pinned"
              render={({ field }) => (
                <FormItem className="flex flex-row items-center justify-between rounded-lg border p-3">
                  <div className="space-y-0.5">
                    <FormLabel>Pin Notice</FormLabel>
                    <p className="text-sm text-muted-foreground">
                      Pinned notices appear at the top
                    </p>
                  </div>
                  <FormControl>
                    <Switch
                      checked={field.value}
                      onCheckedChange={field.onChange}
                      data-testid="switch-notice-pinned"
                    />
                  </FormControl>
                </FormItem>
              )}
            />

            <DialogFooter>
              <Button
                type="button"
                variant="outline"
                onClick={() => onOpenChange(false)}
              >
                Cancel
              </Button>
              <Button type="submit" data-testid="button-save-notice">
                {notice ? "Save Changes" : "Create Notice"}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
