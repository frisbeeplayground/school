import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { CMSHeader } from "@/components/cms/cms-header";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  FormDescription,
} from "@/components/ui/form";
import { useCMS } from "@/lib/cms-context";
import { useToast } from "@/hooks/use-toast";
import { Save, Palette, Globe, Building2, MapPin, Phone, Mail, Clock } from "lucide-react";
import { Textarea } from "@/components/ui/textarea";

const schoolSettingsSchema = z.object({
  name: z.string().min(1, "School name is required"),
  slug: z.string().min(1, "Slug is required").regex(/^[a-z0-9-]+$/, "Only lowercase letters, numbers, and hyphens"),
  primaryColor: z.string().regex(/^#[0-9A-Fa-f]{6}$/, "Must be a valid hex color"),
  secondaryColor: z.string().regex(/^#[0-9A-Fa-f]{6}$/, "Must be a valid hex color"),
  tagline: z.string().optional(),
  description: z.string().optional(),
  address: z.string().optional(),
  phone: z.string().optional(),
  email: z.string().email().optional().or(z.literal("")),
  operatingHours: z.string().optional(),
});

type SchoolSettingsValues = z.infer<typeof schoolSettingsSchema>;

export default function CMSSettings() {
  const { currentSchool, setCurrentSchool } = useCMS();
  const { toast } = useToast();

  const form = useForm<SchoolSettingsValues>({
    resolver: zodResolver(schoolSettingsSchema),
    defaultValues: {
      name: currentSchool?.name || "",
      slug: currentSchool?.slug || "",
      primaryColor: currentSchool?.primaryColor || "#1e40af",
      secondaryColor: currentSchool?.secondaryColor || "#3b82f6",
      tagline: currentSchool?.tagline || "",
      description: currentSchool?.description || "",
      address: currentSchool?.address || "",
      phone: currentSchool?.phone || "",
      email: currentSchool?.email || "",
      operatingHours: currentSchool?.operatingHours || "",
    },
  });

  const onSubmit = (values: SchoolSettingsValues) => {
    if (currentSchool) {
      setCurrentSchool({
        ...currentSchool,
        ...values,
      });
    }
    toast({
      title: "Settings saved",
      description: "Your school settings have been updated.",
    });
  };

  return (
    <div className="flex-1 flex flex-col min-h-0">
      <CMSHeader title="Settings" />

      <div className="flex-1 overflow-auto p-6">
        <div className="max-w-2xl mx-auto space-y-6">
          <div>
            <h2 className="text-xl font-semibold">School Settings</h2>
            <p className="text-sm text-muted-foreground">
              Configure your school's website appearance and branding
            </p>
          </div>

          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <Card>
                <CardHeader className="pb-4">
                  <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-md bg-primary/10">
                      <Building2 className="h-5 w-5 text-primary" />
                    </div>
                    <div>
                      <CardTitle className="text-base">School Information</CardTitle>
                      <CardDescription>Basic details about your school</CardDescription>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <FormField
                    control={form.control}
                    name="name"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>School Name</FormLabel>
                        <FormControl>
                          <Input
                            placeholder="Springfield Academy"
                            {...field}
                            data-testid="input-school-name"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="slug"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Website URL Slug</FormLabel>
                        <FormControl>
                          <div className="flex items-center">
                            <span className="px-3 py-2 bg-muted border border-r-0 rounded-l-md text-sm text-muted-foreground">
                              yoursite.com/
                            </span>
                            <Input
                              placeholder="springfield"
                              className="rounded-l-none"
                              {...field}
                              data-testid="input-school-slug"
                            />
                          </div>
                        </FormControl>
                        <FormDescription>
                          Only lowercase letters, numbers, and hyphens
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="tagline"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Tagline</FormLabel>
                        <FormControl>
                          <Input
                            placeholder="Excellence in Education"
                            {...field}
                            data-testid="input-school-tagline"
                          />
                        </FormControl>
                        <FormDescription>
                          A short phrase that appears below your school name
                        </FormDescription>
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
                            placeholder="Providing quality education since 1970. Nurturing minds, building character, and preparing students for a bright future."
                            rows={3}
                            {...field}
                            data-testid="input-school-description"
                          />
                        </FormControl>
                        <FormDescription>
                          A brief description of your school for the website
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="pb-4">
                  <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-md bg-primary/10">
                      <MapPin className="h-5 w-5 text-primary" />
                    </div>
                    <div>
                      <CardTitle className="text-base">Contact Information</CardTitle>
                      <CardDescription>Your school's contact details for the website</CardDescription>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <FormField
                    control={form.control}
                    name="address"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Address</FormLabel>
                        <FormControl>
                          <Textarea
                            placeholder="123 Education Lane, Springfield, ST 12345"
                            rows={2}
                            {...field}
                            data-testid="input-school-address"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <div className="grid gap-4 sm:grid-cols-2">
                    <FormField
                      control={form.control}
                      name="phone"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Phone Number</FormLabel>
                          <FormControl>
                            <div className="flex items-center gap-2">
                              <Phone className="h-4 w-4 text-muted-foreground shrink-0" />
                              <Input
                                placeholder="+1 (555) 123-4567"
                                {...field}
                                data-testid="input-school-phone"
                              />
                            </div>
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="email"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Email Address</FormLabel>
                          <FormControl>
                            <div className="flex items-center gap-2">
                              <Mail className="h-4 w-4 text-muted-foreground shrink-0" />
                              <Input
                                placeholder="info@school.edu"
                                type="email"
                                {...field}
                                data-testid="input-school-email"
                              />
                            </div>
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  <FormField
                    control={form.control}
                    name="operatingHours"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Operating Hours</FormLabel>
                        <FormControl>
                          <div className="flex items-center gap-2">
                            <Clock className="h-4 w-4 text-muted-foreground shrink-0" />
                            <Input
                              placeholder="Mon - Fri: 8:00 AM - 4:00 PM"
                              {...field}
                              data-testid="input-school-hours"
                            />
                          </div>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="pb-4">
                  <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-md bg-primary/10">
                      <Palette className="h-5 w-5 text-primary" />
                    </div>
                    <div>
                      <CardTitle className="text-base">Brand Colors</CardTitle>
                      <CardDescription>Customize your school's color scheme</CardDescription>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid gap-4 sm:grid-cols-2">
                    <FormField
                      control={form.control}
                      name="primaryColor"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Primary Color</FormLabel>
                          <FormControl>
                            <div className="flex items-center gap-2">
                              <div
                                className="h-9 w-9 rounded-md border shrink-0"
                                style={{ backgroundColor: field.value }}
                              />
                              <Input
                                placeholder="#1e40af"
                                {...field}
                                data-testid="input-primary-color"
                              />
                            </div>
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="secondaryColor"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Secondary Color</FormLabel>
                          <FormControl>
                            <div className="flex items-center gap-2">
                              <div
                                className="h-9 w-9 rounded-md border shrink-0"
                                style={{ backgroundColor: field.value }}
                              />
                              <Input
                                placeholder="#3b82f6"
                                {...field}
                                data-testid="input-secondary-color"
                              />
                            </div>
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="pb-4">
                  <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-md bg-primary/10">
                      <Globe className="h-5 w-5 text-primary" />
                    </div>
                    <div>
                      <CardTitle className="text-base">Website Preview</CardTitle>
                      <CardDescription>Preview how your branding looks</CardDescription>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div
                    className="p-6 rounded-lg text-white"
                    style={{
                      background: `linear-gradient(135deg, ${form.watch("primaryColor")} 0%, ${form.watch("secondaryColor")} 100%)`,
                    }}
                  >
                    <h3 className="text-xl font-bold mb-2">
                      {form.watch("name") || "Your School Name"}
                    </h3>
                    <p className="text-white/80 text-sm">
                      Empowering minds, shaping futures
                    </p>
                    <div className="mt-4 flex gap-2">
                      <div className="px-4 py-2 bg-white/20 rounded-md text-sm backdrop-blur-sm">
                        Learn More
                      </div>
                      <div className="px-4 py-2 bg-white text-gray-900 rounded-md text-sm font-medium">
                        Apply Now
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <div className="flex justify-end">
                <Button type="submit" className="gap-1.5" data-testid="button-save-settings">
                  <Save className="h-4 w-4" />
                  Save Settings
                </Button>
              </div>
            </form>
          </Form>
        </div>
      </div>
    </div>
  );
}
