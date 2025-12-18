/**
 * Email Rendering Utility
 *
 * Converts React Email components to HTML for sending via Resend.
 * Handles template variable replacement and HTML minification.
 */

import { createElement, ComponentType } from 'react';

/**
 * Renders a React Email component to HTML string
 *
 * @param component - React Email component to render
 * @param props - Props to pass to the component
 * @returns HTML string with inline styles
 */
export async function renderEmailToHtml<P extends object>(
  component: ComponentType<P>,
  props: P
): Promise<string> {
  // Dynamic import to avoid bundling react-email in client build
  const { render } = await import('@react-email/render');

  // Create element with the component and props
  const element = createElement(component as ComponentType<P>, props);
  const html = await render(element, {
    pretty: false, // Minified HTML for better email client compatibility
  });

  return html;
}

/**
 * Replaces template variables in rendered HTML
 * Used for personalizing emails (unsubscribe URLs, names, etc.)
 *
 * @param html - Rendered HTML with template variables
 * @param variables - Object with variable name-value pairs
 * @returns HTML with variables replaced
 */
export function replaceTemplateVariables(
  html: string,
  variables: Record<string, string>
): string {
  let result = html;

  for (const [key, value] of Object.entries(variables)) {
    // Replace {{variable}} patterns
    const regex = new RegExp(`{{\\s*${key}\\s*}}`, 'g');
    result = result.replace(regex, value);
  }

  return result;
}

/**
 * Generates personalized unsubscribe URL for a subscriber
 *
 * @param subscriberId - Subscriber UUID
 * @param baseUrl - Base URL of the application
 * @returns Complete unsubscribe URL
 */
export function generateUnsubscribeUrl(
  subscriberId: string,
  baseUrl: string = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'
): string {
  return `${baseUrl}/api/subscribers/unsubscribe?id=${subscriberId}`;
}

/**
 * Generates personalized newsletter view URL
 *
 * @param newsletterSlug - Newsletter slug
 * @param baseUrl - Base URL of the application
 * @returns Complete newsletter view URL
 */
export function generateNewsletterUrl(
  newsletterSlug: string,
  baseUrl: string = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'
): string {
  return `${baseUrl}/newsletter/${newsletterSlug}`;
}

/**
 * Base email configuration
 */
export const EMAIL_CONFIG = {
  brandName: 'PEPE Dome',
  supportEmail: process.env.SUPPORT_EMAIL || 'info@pepedome.com',
  address: 'Pepe Dome, Munchen, Germany',
  unsubscribeText: 'Abmelden',
  viewInBrowserText: 'Im Browser ansehen',
} as const;
