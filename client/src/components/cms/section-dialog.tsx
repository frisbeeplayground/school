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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import type { PageSection, SectionType } from "@shared/schema";
import { useEffect } from "react";

const sectionFormSchema = z.object({
  type: z.enum(["hero", "features", "about", "gallery", "contact", "testimonials", "cta", "stats"]),
  enabled: z.boolean(),
  title: z.string().min(1, "Title is required"),
  subtitle: z.string().optional(),
  content: z.string().optional(),
  ctaText: z.string().optional(),
  ctaLink: z.string().optional(),
});

type SectionFormValues = z.infer<typeof sectionFormSchema>;

interface SectionDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  section?: PageSection | null;
  onSave: (data: Partial<PageSection>) => void;
}

const sectionTypes: { value: SectionType; label: string }[] = [
  { value: "hero", label: "Hero Section" },
  { value: "features", label: "Features Grid" },
  { value: "about", label: "About Section" },
  { value: "stats", label: "Statistics" },
  { value: "cta", label: "Call to Action" },
  { value: "gallery", label: "Image Gallery" },
  { value: "contact", label: "Contact Form" },
  { value: "testimonials", label: "Testimonials" },
];

export function SectionDialog({
  open,
  onOpenChange,
  section,
  onSave,
}: SectionDialogProps) {
  const form = useForm<SectionFormValues>({
    resolver: zodResolver(sectionFormSchema),
    defaultValues: {
      type: "hero",
      enabled: true,
      title: "",
      subtitle: "",
      content: "",
      ctaText: "",
      ctaLink: "",
    },
  });

  useEffect(() => {
    if (section) {
      const props = section.props as Record<string, unknown>;
      form.reset({
        type: section.type,
        enabled: section.enabled,
        title: (props.title as string) || (props.heading as string) || "",
        subtitle: (props.subtitle as string) || (props.subheading as string) || "",
        content: (props.content as string) || (props.description as string) || "",
        ctaText: (props.ctaText as string) || (props.buttonText as string) || "",
        ctaLink: (props.ctaLink as string) || (props.buttonLink as string) || "",
      });
    } else {
      form.reset({
        type: "hero",
        enabled: true,
        title: "",
        subtitle: "",
        content: "",
        ctaText: "",
        ctaLink: "",
      });
    }
  }, [section, form]);

  const onSubmit = (values: SectionFormValues) => {
    const props: Record<string, unknown> = {
      title: values.title,
      subtitle: values.subtitle,
      heading: values.title,
      subheading: values.subtitle,
      content: values.content,
      description: values.content,
      ctaText: values.ctaText,
      ctaLink: values.ctaLink,
      buttonText: values.ctaText,
      buttonLink: values.ctaLink,
    };

    onSave({
      id: section?.id,
      type: values.type,
      enabled: values.enabled,
      props: props as PageSection["props"],
    });
    onOpenChange(false);
  };

  const watchType = form.watch("type");

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>
            {section ? "Edit Section" : "Add New Section"}
          </DialogTitle>
          <DialogDescription>
            Configure the content and appearance of this section.
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="type"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Section Type</FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                    disabled={!!section}
                  >
                    <FormControl>
                      <SelectTrigger data-testid="select-section-type">
                        <SelectValue placeholder="Select a section type" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {sectionTypes.map((type) => (
                        <SelectItem key={type.value} value={type.value}>
                          {type.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="enabled"
              render={({ field }) => (
                <FormItem className="flex flex-row items-center justify-between rounded-lg border p-3">
                  <div className="space-y-0.5">
                    <FormLabel>Visible</FormLabel>
                    <p className="text-sm text-muted-foreground">
                      Show this section on the website
                    </p>
                  </div>
                  <FormControl>
                    <Switch
                      checked={field.value}
                      onCheckedChange={field.onChange}
                      data-testid="switch-section-enabled"
                    />
                  </FormControl>
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="title"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>
                    {watchType === "hero" ? "Headline" : "Heading"}
                  </FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Enter main heading..."
                      {...field}
                      data-testid="input-section-title"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="subtitle"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Subheading</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Enter subheading..."
                      {...field}
                      data-testid="input-section-subtitle"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {(watchType === "about" || watchType === "cta") && (
              <FormField
                control={form.control}
                name="content"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Content</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="Enter content..."
                        className="min-h-[100px]"
                        {...field}
                        data-testid="input-section-content"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            )}

            {(watchType === "hero" || watchType === "cta") && (
              <>
                <FormField
                  control={form.control}
                  name="ctaText"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Button Text</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="e.g., Learn More"
                          {...field}
                          data-testid="input-section-cta-text"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="ctaLink"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Button Link</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="e.g., /admissions"
                          {...field}
                          data-testid="input-section-cta-link"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </>
            )}

            <DialogFooter>
              <Button
                type="button"
                variant="outline"
                onClick={() => onOpenChange(false)}
              >
                Cancel
              </Button>
              <Button type="submit" data-testid="button-save-section">
                {section ? "Save Changes" : "Add Section"}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
