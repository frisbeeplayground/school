import { useState, useEffect } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { CMSHeader } from "@/components/cms/cms-header";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { useCMS } from "@/lib/cms-context";
import { useToast } from "@/hooks/use-toast";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { 
  Palette, 
  Type, 
  Layout, 
  Sparkles, 
  Save, 
  RotateCcw, 
  Eye, 
  History, 
  Check,
  Loader2,
  Plus,
  Wand2,
} from "lucide-react";
import type { WebsiteTheme, DesignTokens, ThemeVersion } from "@shared/schema";
import { defaultDesignTokens } from "@shared/schema";

const fontOptions = [
  { value: "Inter, sans-serif", label: "Inter" },
  { value: "Playfair Display, serif", label: "Playfair Display" },
  { value: "Roboto, sans-serif", label: "Roboto" },
  { value: "Open Sans, sans-serif", label: "Open Sans" },
  { value: "Lato, sans-serif", label: "Lato" },
  { value: "Poppins, sans-serif", label: "Poppins" },
  { value: "Montserrat, sans-serif", label: "Montserrat" },
  { value: "Merriweather, serif", label: "Merriweather" },
  { value: "Georgia, serif", label: "Georgia" },
];

interface ColorInputProps {
  label: string;
  value: string;
  onChange: (value: string) => void;
  description?: string;
}

function ColorInput({ label, value, onChange, description }: ColorInputProps) {
  return (
    <div className="space-y-2">
      <Label className="text-sm font-medium">{label}</Label>
      <div className="flex items-center gap-2">
        <div 
          className="w-10 h-10 rounded-md border cursor-pointer overflow-hidden"
          style={{ backgroundColor: value }}
        >
          <input
            type="color"
            value={value}
            onChange={(e) => onChange(e.target.value)}
            className="w-full h-full opacity-0 cursor-pointer"
            data-testid={`color-input-${label.toLowerCase().replace(/\s+/g, '-')}`}
          />
        </div>
        <Input
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder="#000000"
          className="font-mono text-sm"
          data-testid={`color-text-${label.toLowerCase().replace(/\s+/g, '-')}`}
        />
      </div>
      {description && (
        <p className="text-xs text-muted-foreground">{description}</p>
      )}
    </div>
  );
}

export default function CMSThemeEditor() {
  const { currentSchool } = useCMS();
  const { toast } = useToast();
  
  const [activeTab, setActiveTab] = useState("colors");
  const [draftTokens, setDraftTokens] = useState<DesignTokens>(defaultDesignTokens);
  const [themeName, setThemeName] = useState("Custom Theme");
  const [hasChanges, setHasChanges] = useState(false);
  const [showPreview, setShowPreview] = useState(false);

  const { data: themes = [], isLoading: themesLoading } = useQuery<WebsiteTheme[]>({
    queryKey: [`/api/schools/${currentSchool?.id}/themes`],
    enabled: !!currentSchool?.id,
  });

  const { data: activeTheme } = useQuery<WebsiteTheme & { isDefault?: boolean }>({
    queryKey: [`/api/schools/${currentSchool?.id}/themes/active`],
    enabled: !!currentSchool?.id,
  });

  const { data: versions = [] } = useQuery<ThemeVersion[]>({
    queryKey: activeTheme?.id ? [`/api/themes/${activeTheme.id}/versions`] : [],
    enabled: !!activeTheme?.id && !activeTheme?.isDefault,
  });

  useEffect(() => {
    if (activeTheme && !activeTheme.isDefault && activeTheme.designTokens) {
      setDraftTokens(activeTheme.designTokens as DesignTokens);
      setThemeName(activeTheme.name || "Custom Theme");
    } else if (currentSchool) {
      setDraftTokens({
        ...defaultDesignTokens,
        colors: {
          ...defaultDesignTokens.colors,
          primary: currentSchool.primaryColor,
          secondary: currentSchool.secondaryColor,
        },
      });
    }
  }, [activeTheme, currentSchool]);

  const createThemeMutation = useMutation({
    mutationFn: async (data: { name: string; designTokens: DesignTokens }) => {
      const res = await apiRequest("POST", `/api/schools/${currentSchool?.id}/themes`, {
        name: data.name,
        designTokens: data.designTokens,
        isActive: true,
      });
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [`/api/schools/${currentSchool?.id}/themes`] });
      setHasChanges(false);
      toast({ title: "Theme created", description: "Your new theme has been saved." });
    },
    onError: (error) => {
      toast({ title: "Error", description: error.message, variant: "destructive" });
    },
  });

  const updateThemeMutation = useMutation({
    mutationFn: async (data: { id: string; name?: string; designTokens?: DesignTokens }) => {
      const res = await apiRequest("PATCH", `/api/themes/${data.id}`, {
        name: data.name,
        designTokens: data.designTokens,
      });
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [`/api/schools/${currentSchool?.id}/themes`] });
      queryClient.invalidateQueries({ queryKey: [`/api/schools/${currentSchool?.id}/themes/active`] });
      setHasChanges(false);
      toast({ title: "Theme saved", description: "Your changes have been saved." });
    },
    onError: (error) => {
      toast({ title: "Error", description: error.message, variant: "destructive" });
    },
  });

  const createVersionMutation = useMutation({
    mutationFn: async (themeId: string) => {
      const res = await apiRequest("POST", `/api/themes/${themeId}/versions`, {});
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [`/api/themes/${activeTheme?.id}/versions`] });
      toast({ title: "Version saved", description: "A snapshot of your theme has been saved." });
    },
  });

  const activateThemeMutation = useMutation({
    mutationFn: async (themeId: string) => {
      const res = await apiRequest("POST", `/api/themes/${themeId}/activate`, {});
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [`/api/schools/${currentSchool?.id}/themes`] });
      queryClient.invalidateQueries({ queryKey: [`/api/schools/${currentSchool?.id}/themes/active`] });
      toast({ title: "Theme activated", description: "This theme is now live on your website." });
    },
  });

  const updateColor = (path: string, value: string) => {
    setHasChanges(true);
    setDraftTokens((prev) => {
      const parts = path.split(".");
      const newTokens = JSON.parse(JSON.stringify(prev)) as DesignTokens;
      let current = newTokens.colors as unknown as Record<string, unknown>;
      
      for (let i = 0; i < parts.length - 1; i++) {
        current = current[parts[i]] as Record<string, unknown>;
      }
      current[parts[parts.length - 1]] = value;
      
      return newTokens;
    });
  };

  const updateTypography = (path: string, value: string) => {
    setHasChanges(true);
    setDraftTokens((prev) => {
      const parts = path.split(".");
      const newTokens = JSON.parse(JSON.stringify(prev)) as DesignTokens;
      let current = newTokens.typography as unknown as Record<string, unknown>;
      
      for (let i = 0; i < parts.length - 1; i++) {
        current = current[parts[i]] as Record<string, unknown>;
      }
      current[parts[parts.length - 1]] = value;
      
      return newTokens;
    });
  };

  const handleSave = () => {
    if (activeTheme && !activeTheme.isDefault) {
      updateThemeMutation.mutate({
        id: activeTheme.id,
        name: themeName,
        designTokens: draftTokens,
      });
    } else {
      createThemeMutation.mutate({
        name: themeName,
        designTokens: draftTokens,
      });
    }
  };

  const handleResetToDefaults = () => {
    setDraftTokens(defaultDesignTokens);
    setHasChanges(true);
  };

  const handleCreateVersion = () => {
    if (activeTheme && !activeTheme.isDefault) {
      createVersionMutation.mutate(activeTheme.id);
    }
  };

  const generateCssVariables = (tokens: DesignTokens): string => {
    return `
      --theme-primary: ${tokens.colors.primary};
      --theme-secondary: ${tokens.colors.secondary};
      --theme-accent: ${tokens.colors.accent};
      --theme-background: ${tokens.colors.background};
      --theme-surface: ${tokens.colors.surface};
      --theme-text-primary: ${tokens.colors.text.primary};
      --theme-text-secondary: ${tokens.colors.text.secondary};
      --theme-text-muted: ${tokens.colors.text.muted};
      --theme-border: ${tokens.colors.border};
      --theme-font-heading: ${tokens.typography.fontFamily.heading};
      --theme-font-body: ${tokens.typography.fontFamily.body};
    `;
  };

  if (themesLoading) {
    return (
      <div className="flex-1 flex flex-col min-h-0">
        <CMSHeader title="Theme Editor" />
        <div className="flex-1 flex items-center justify-center">
          <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
        </div>
      </div>
    );
  }

  return (
    <div className="flex-1 flex flex-col min-h-0">
      <CMSHeader title="Theme Editor">
        <div className="flex items-center gap-2">
          {hasChanges && (
            <Badge variant="outline" className="text-orange-600 border-orange-600">
              Unsaved changes
            </Badge>
          )}
          <Button
            variant="outline"
            size="sm"
            onClick={() => setShowPreview(!showPreview)}
            data-testid="button-toggle-preview"
          >
            <Eye className="h-4 w-4 mr-2" />
            {showPreview ? "Hide Preview" : "Preview"}
          </Button>
          {activeTheme && !activeTheme.isDefault && (
            <Button
              variant="outline"
              size="sm"
              onClick={handleCreateVersion}
              disabled={createVersionMutation.isPending}
              data-testid="button-save-version"
            >
              <History className="h-4 w-4 mr-2" />
              Save Version
            </Button>
          )}
          <Button
            onClick={handleSave}
            disabled={updateThemeMutation.isPending || createThemeMutation.isPending}
            data-testid="button-save-theme"
          >
            {(updateThemeMutation.isPending || createThemeMutation.isPending) ? (
              <Loader2 className="h-4 w-4 mr-2 animate-spin" />
            ) : (
              <Save className="h-4 w-4 mr-2" />
            )}
            Save Theme
          </Button>
        </div>
      </CMSHeader>

      <div className="flex-1 flex overflow-hidden">
        <div className={`flex-1 overflow-auto p-6 ${showPreview ? 'w-1/2' : 'w-full'}`}>
          <div className="max-w-3xl space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Palette className="h-5 w-5" />
                  Theme Settings
                </CardTitle>
                <CardDescription>
                  Customize the visual appearance of your school website
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="theme-name">Theme Name</Label>
                  <Input
                    id="theme-name"
                    value={themeName}
                    onChange={(e) => {
                      setThemeName(e.target.value);
                      setHasChanges(true);
                    }}
                    placeholder="My Custom Theme"
                    data-testid="input-theme-name"
                  />
                </div>
                
                {themes.length > 0 && (
                  <div className="space-y-2">
                    <Label>Saved Themes</Label>
                    <div className="flex flex-wrap gap-2">
                      {themes.map((theme) => (
                        <Button
                          key={theme.id}
                          variant={theme.isActive ? "default" : "outline"}
                          size="sm"
                          onClick={() => activateThemeMutation.mutate(theme.id)}
                          className="gap-2"
                          data-testid={`button-theme-${theme.id}`}
                        >
                          {theme.isActive && <Check className="h-3 w-3" />}
                          {theme.name}
                        </Button>
                      ))}
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>

            <Tabs value={activeTab} onValueChange={setActiveTab}>
              <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="colors" className="gap-2" data-testid="tab-colors">
                  <Palette className="h-4 w-4" />
                  Colors
                </TabsTrigger>
                <TabsTrigger value="typography" className="gap-2" data-testid="tab-typography">
                  <Type className="h-4 w-4" />
                  Typography
                </TabsTrigger>
                <TabsTrigger value="ai" className="gap-2" data-testid="tab-ai">
                  <Sparkles className="h-4 w-4" />
                  AI Assist
                </TabsTrigger>
              </TabsList>

              <TabsContent value="colors" className="mt-4 space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Brand Colors</CardTitle>
                    <CardDescription>Primary colors that define your school's identity</CardDescription>
                  </CardHeader>
                  <CardContent className="grid grid-cols-2 gap-4">
                    <ColorInput
                      label="Primary Color"
                      value={draftTokens.colors.primary}
                      onChange={(v) => updateColor("primary", v)}
                      description="Main brand color for buttons, links, and accents"
                    />
                    <ColorInput
                      label="Secondary Color"
                      value={draftTokens.colors.secondary}
                      onChange={(v) => updateColor("secondary", v)}
                      description="Supporting color for highlights and variants"
                    />
                    <ColorInput
                      label="Accent Color"
                      value={draftTokens.colors.accent}
                      onChange={(v) => updateColor("accent", v)}
                      description="Attention-grabbing color for CTAs and emphasis"
                    />
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Background Colors</CardTitle>
                    <CardDescription>Base colors for page backgrounds and surfaces</CardDescription>
                  </CardHeader>
                  <CardContent className="grid grid-cols-2 gap-4">
                    <ColorInput
                      label="Background"
                      value={draftTokens.colors.background}
                      onChange={(v) => updateColor("background", v)}
                      description="Main page background color"
                    />
                    <ColorInput
                      label="Surface"
                      value={draftTokens.colors.surface}
                      onChange={(v) => updateColor("surface", v)}
                      description="Cards and elevated surfaces"
                    />
                    <ColorInput
                      label="Border"
                      value={draftTokens.colors.border}
                      onChange={(v) => updateColor("border", v)}
                      description="Borders and dividers"
                    />
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Text Colors</CardTitle>
                    <CardDescription>Typography hierarchy colors</CardDescription>
                  </CardHeader>
                  <CardContent className="grid grid-cols-3 gap-4">
                    <ColorInput
                      label="Primary Text"
                      value={draftTokens.colors.text.primary}
                      onChange={(v) => updateColor("text.primary", v)}
                      description="Headlines and important text"
                    />
                    <ColorInput
                      label="Secondary Text"
                      value={draftTokens.colors.text.secondary}
                      onChange={(v) => updateColor("text.secondary", v)}
                      description="Body text and descriptions"
                    />
                    <ColorInput
                      label="Muted Text"
                      value={draftTokens.colors.text.muted}
                      onChange={(v) => updateColor("text.muted", v)}
                      description="Captions and subtle text"
                    />
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Status Colors</CardTitle>
                    <CardDescription>Colors for alerts, success messages, and warnings</CardDescription>
                  </CardHeader>
                  <CardContent className="grid grid-cols-4 gap-4">
                    <ColorInput
                      label="Success"
                      value={draftTokens.colors.success}
                      onChange={(v) => updateColor("success", v)}
                    />
                    <ColorInput
                      label="Error"
                      value={draftTokens.colors.error}
                      onChange={(v) => updateColor("error", v)}
                    />
                    <ColorInput
                      label="Warning"
                      value={draftTokens.colors.warning}
                      onChange={(v) => updateColor("warning", v)}
                    />
                    <ColorInput
                      label="Info"
                      value={draftTokens.colors.info}
                      onChange={(v) => updateColor("info", v)}
                    />
                  </CardContent>
                </Card>

                <div className="flex justify-end">
                  <Button variant="outline" onClick={handleResetToDefaults} data-testid="button-reset-colors">
                    <RotateCcw className="h-4 w-4 mr-2" />
                    Reset to Defaults
                  </Button>
                </div>
              </TabsContent>

              <TabsContent value="typography" className="mt-4 space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Font Families</CardTitle>
                    <CardDescription>Choose fonts that reflect your school's character</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-2">
                      <Label>Heading Font</Label>
                      <Select
                        value={draftTokens.typography.fontFamily.heading}
                        onValueChange={(v) => updateTypography("fontFamily.heading", v)}
                      >
                        <SelectTrigger data-testid="select-heading-font">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          {fontOptions.map((font) => (
                            <SelectItem 
                              key={font.value} 
                              value={font.value}
                              style={{ fontFamily: font.value }}
                            >
                              {font.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <p className="text-2xl font-bold" style={{ fontFamily: draftTokens.typography.fontFamily.heading }}>
                        The Quick Brown Fox
                      </p>
                    </div>

                    <Separator />

                    <div className="space-y-2">
                      <Label>Body Font</Label>
                      <Select
                        value={draftTokens.typography.fontFamily.body}
                        onValueChange={(v) => updateTypography("fontFamily.body", v)}
                      >
                        <SelectTrigger data-testid="select-body-font">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          {fontOptions.map((font) => (
                            <SelectItem 
                              key={font.value} 
                              value={font.value}
                              style={{ fontFamily: font.value }}
                            >
                              {font.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <p style={{ fontFamily: draftTokens.typography.fontFamily.body }}>
                        Lorem ipsum dolor sit amet, consectetur adipiscing elit. 
                        Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.
                      </p>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Type Scale Preview</CardTitle>
                    <CardDescription>See how text sizes will appear on your website</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {Object.entries(draftTokens.typography.fontSize).map(([key, size]) => (
                      <div key={key} className="flex items-baseline gap-4">
                        <span className="text-xs text-muted-foreground w-12">{key}</span>
                        <span 
                          style={{ 
                            fontSize: size, 
                            fontFamily: key.includes("xl") || key === "lg" 
                              ? draftTokens.typography.fontFamily.heading 
                              : draftTokens.typography.fontFamily.body 
                          }}
                        >
                          The quick brown fox jumps over the lazy dog
                        </span>
                      </div>
                    ))}
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="ai" className="mt-4 space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Wand2 className="h-5 w-5" />
                      AI Design Assistant
                    </CardTitle>
                    <CardDescription>
                      Let AI help you create a beautiful, cohesive design for your school website
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="p-8 border-2 border-dashed rounded-lg text-center">
                      <Sparkles className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                      <h3 className="font-semibold mb-2">AI-Powered Theme Generation</h3>
                      <p className="text-sm text-muted-foreground mb-4">
                        Coming soon! AI will analyze your school's identity and generate 
                        a custom color palette and typography that reflects your brand.
                      </p>
                      <Button disabled variant="outline">
                        <Sparkles className="h-4 w-4 mr-2" />
                        Generate Theme with AI
                      </Button>
                    </div>
                  </CardContent>
                </Card>

                {versions.length > 0 && (
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <History className="h-5 w-5" />
                        Version History
                      </CardTitle>
                      <CardDescription>
                        Previous versions of your theme that you can restore
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-2">
                        {versions.map((version) => (
                          <div 
                            key={version.id} 
                            className="flex items-center justify-between p-3 bg-muted/50 rounded-lg"
                          >
                            <div>
                              <p className="font-medium">Version {version.versionNumber}</p>
                              <p className="text-sm text-muted-foreground">
                                {new Date(version.createdAt).toLocaleDateString()}
                              </p>
                            </div>
                            <Button 
                              variant="outline" 
                              size="sm"
                              onClick={async () => {
                                const res = await apiRequest("POST", `/api/theme-versions/${version.id}/revert`, {});
                                if (res.ok) {
                                  queryClient.invalidateQueries({ queryKey: [`/api/schools/${currentSchool?.id}/themes/active`] });
                                  toast({ title: "Theme restored", description: `Reverted to version ${version.versionNumber}` });
                                }
                              }}
                              data-testid={`button-revert-${version.id}`}
                            >
                              <RotateCcw className="h-4 w-4 mr-2" />
                              Restore
                            </Button>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                )}
              </TabsContent>
            </Tabs>
          </div>
        </div>

        {showPreview && (
          <div className="w-1/2 border-l bg-muted/30 overflow-hidden">
            <div className="p-4 border-b bg-background">
              <h3 className="font-semibold">Live Preview</h3>
              <p className="text-sm text-muted-foreground">
                See how your theme looks on your website
              </p>
            </div>
            <div className="h-[calc(100%-80px)] overflow-auto">
              <style>{`:root { ${generateCssVariables(draftTokens)} }`}</style>
              <iframe
                src={`/preview/${currentSchool?.slug || 'springfield'}`}
                className="w-full h-full border-0"
                title="Theme Preview"
              />
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
