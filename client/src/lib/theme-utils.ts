import type { DesignTokens } from "@shared/schema";

export function generateThemeCSSVariables(tokens: DesignTokens): string {
  const variables: string[] = [];

  variables.push(`--theme-primary: ${tokens.colors.primary}`);
  variables.push(`--theme-secondary: ${tokens.colors.secondary}`);
  variables.push(`--theme-accent: ${tokens.colors.accent}`);
  variables.push(`--theme-background: ${tokens.colors.background}`);
  variables.push(`--theme-surface: ${tokens.colors.surface}`);
  variables.push(`--theme-text-primary: ${tokens.colors.text.primary}`);
  variables.push(`--theme-text-secondary: ${tokens.colors.text.secondary}`);
  variables.push(`--theme-text-muted: ${tokens.colors.text.muted}`);
  variables.push(`--theme-border: ${tokens.colors.border}`);
  variables.push(`--theme-error: ${tokens.colors.error}`);
  variables.push(`--theme-success: ${tokens.colors.success}`);
  variables.push(`--theme-warning: ${tokens.colors.warning}`);
  variables.push(`--theme-info: ${tokens.colors.info}`);

  variables.push(`--theme-font-heading: ${tokens.typography.fontFamily.heading}`);
  variables.push(`--theme-font-body: ${tokens.typography.fontFamily.body}`);
  variables.push(`--theme-font-mono: ${tokens.typography.fontFamily.mono}`);

  Object.entries(tokens.typography.fontSize).forEach(([key, value]) => {
    variables.push(`--theme-text-${key}: ${value}`);
  });

  Object.entries(tokens.typography.fontWeight).forEach(([key, value]) => {
    variables.push(`--theme-font-${key}: ${value}`);
  });

  Object.entries(tokens.typography.lineHeight).forEach(([key, value]) => {
    variables.push(`--theme-leading-${key}: ${value}`);
  });

  Object.entries(tokens.spacing).forEach(([key, value]) => {
    variables.push(`--theme-spacing-${key}: ${value}`);
  });

  Object.entries(tokens.borderRadius).forEach(([key, value]) => {
    variables.push(`--theme-radius-${key}: ${value}`);
  });

  Object.entries(tokens.shadows).forEach(([key, value]) => {
    variables.push(`--theme-shadow-${key}: ${value}`);
  });

  Object.entries(tokens.breakpoints).forEach(([key, value]) => {
    variables.push(`--theme-breakpoint-${key}: ${value}`);
  });

  return variables.join("; ");
}

export function injectThemeStyles(tokens: DesignTokens): void {
  const cssVariables = generateThemeCSSVariables(tokens);
  
  let styleElement = document.getElementById("theme-variables");
  if (!styleElement) {
    styleElement = document.createElement("style");
    styleElement.id = "theme-variables";
    document.head.appendChild(styleElement);
  }
  
  styleElement.textContent = `:root { ${cssVariables} }`;
}

export function hexToRgb(hex: string): { r: number; g: number; b: number } | null {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  return result
    ? {
        r: parseInt(result[1], 16),
        g: parseInt(result[2], 16),
        b: parseInt(result[3], 16),
      }
    : null;
}

export function getContrastColor(hexColor: string): string {
  const rgb = hexToRgb(hexColor);
  if (!rgb) return "#000000";
  
  const luminance = (0.299 * rgb.r + 0.587 * rgb.g + 0.114 * rgb.b) / 255;
  return luminance > 0.5 ? "#000000" : "#FFFFFF";
}
