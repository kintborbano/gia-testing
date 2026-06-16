import type { LegalContent } from '@/components/legal/LegalDocument';

/**
 * Privacy Policy copy. The prose source of truth lives in
 * docs/PRIVACY_POLICY.md; this mirrors it for the rendered /privacy page.
 */
export const PRIVACY_POLICY: LegalContent = {
  title: 'Privacy Policy',
  intro: [
    'GIA, powered by Sofi AI, is committed to protecting user privacy and maintaining responsible data practices. This Privacy Policy explains how GIA collects, processes, and protects information when users access and use the platform.',
    'By using GIA, users acknowledge and agree to the practices described in this Policy.',
  ],
  sections: [
    {
      heading: 'Platform Overview',
      blocks: [
        {
          type: 'paragraph',
          text: 'GIA is a web-based TikTok analytics and report generation tool that transforms publicly accessible content performance data into simplified visual reports and insights.',
        },
        {
          type: 'paragraph',
          text: 'The platform is intended to provide creators and users with readable, shareable, and non-technical analytics summaries.',
        },
      ],
    },
    {
      heading: 'Information We Collect',
      blocks: [
        { type: 'subheading', text: 'Submitted Analytics Data' },
        {
          type: 'paragraph',
          text: 'Users may voluntarily submit:',
        },
        {
          type: 'list',
          items: [
            'TikTok usernames',
            'TikTok profile links',
            'TikTok video links',
            'Publicly accessible content information',
          ],
        },
        {
          type: 'paragraph',
          text: 'GIA processes submitted information solely for analytics generation and report creation purposes.',
        },
        { type: 'subheading', text: 'Technical & Usage Information' },
        {
          type: 'paragraph',
          text: 'GIA may automatically collect limited technical information, including:',
        },
        {
          type: 'list',
          items: [
            'Browser type',
            'Device information',
            'IP address',
            'Session activity',
            'Usage analytics',
            'Cookies and similar technologies',
          ],
        },
        {
          type: 'paragraph',
          text: 'This information is used to maintain platform functionality, performance, and security.',
        },
      ],
    },
    {
      heading: 'How Information is Used',
      blocks: [
        {
          type: 'paragraph',
          text: 'Information processed through GIA may be used to:',
        },
        {
          type: 'list',
          items: [
            'Generate analytics dashboards and reports',
            'Produce exportable PDF and PNG summaries',
            'Improve platform usability and performance',
            'Monitor security and prevent misuse',
            'Analyze general platform traffic and usage trends',
          ],
        },
        {
          type: 'paragraph',
          text: 'GIA does not use submitted TikTok data for advertising or resale purposes.',
        },
      ],
    },
    {
      heading: 'Public Data Notice',
      blocks: [
        {
          type: 'paragraph',
          text: 'GIA analyzes publicly accessible TikTok information submitted by users. Users acknowledge and agree that:',
        },
        {
          type: 'list',
          items: [
            'GIA does not access private TikTok account information',
            'Users are responsible for ensuring they have the right or authorization to analyze submitted accounts where applicable',
            'Publicly available social media metrics may be processed for reporting and analytics purposes',
          ],
        },
      ],
    },
    {
      heading: 'Data Storage & Retention',
      blocks: [
        {
          type: 'paragraph',
          text: 'GIA is designed with a minimal data retention approach. Generated analytics and reports may be:',
        },
        {
          type: 'list',
          items: [
            'Temporarily cached for processing purposes',
            'Stored briefly to support export functionality',
            'Automatically removed after processing or after a limited retention period',
          ],
        },
        {
          type: 'paragraph',
          text: 'GIA does not currently require account creation or persistent user profiles. Further information is available in the Data Retention Policy.',
        },
      ],
    },
    {
      heading: 'Cookies & Tracking Technologies',
      blocks: [
        {
          type: 'paragraph',
          text: 'GIA may use cookies and similar technologies to:',
        },
        {
          type: 'list',
          items: [
            'Maintain platform functionality',
            'Improve user experience',
            'Analyze website traffic and performance',
            'Support security and stability',
          ],
        },
        {
          type: 'paragraph',
          text: 'Users may disable cookies through browser settings, though certain features may not function properly.',
        },
      ],
    },
    {
      heading: 'Data Security',
      blocks: [
        {
          type: 'paragraph',
          text: 'GIA implements reasonable safeguards designed to protect processed information and platform integrity. Security measures may include:',
        },
        {
          type: 'list',
          items: [
            'HTTPS encryption',
            'Secure infrastructure environments',
            'Limited access controls',
            'Monitoring against abuse and unauthorized activity',
          ],
        },
        {
          type: 'paragraph',
          text: 'While reasonable efforts are made to protect information, no internet-based platform can guarantee absolute security.',
        },
      ],
    },
    {
      heading: 'Third-Party Services',
      blocks: [
        {
          type: 'paragraph',
          text: 'GIA may rely on third-party infrastructure and analytics services necessary for platform operation. These services may include:',
        },
        {
          type: 'list',
          items: [
            'Hosting providers',
            'Analytics tools',
            'Export generation services',
            'Infrastructure monitoring tools',
          ],
        },
        {
          type: 'paragraph',
          text: 'GIA is not responsible for the privacy practices of external third-party platforms beyond its control.',
        },
      ],
    },
    {
      heading: 'Third-Party Platform Disclaimer',
      blocks: [
        {
          type: 'paragraph',
          text: 'GIA is an independent analytics tool and is not affiliated with, endorsed by, or sponsored by TikTok or its parent companies.',
        },
        {
          type: 'paragraph',
          text: 'All trademarks, platform names, and related assets belong to their respective owners.',
        },
      ],
    },
    {
      heading: 'Policy Updates',
      blocks: [
        {
          type: 'paragraph',
          text: 'GIA reserves the right to modify or update this Privacy Policy as the platform evolves. Updated versions may be reflected through revised effective dates and platform notices.',
        },
        {
          type: 'paragraph',
          text: 'Continued use of GIA after updates constitutes acceptance of the revised Policy.',
        },
      ],
    },
    {
      heading: 'Contact Information',
      blocks: [
        {
          type: 'paragraph',
          text: 'For questions or concerns regarding this Privacy Policy, users may contact GIA — Powered by Sofi AI.',
        },
        {
          type: 'lead',
          text: 'Insert official support/contact email',
        },
      ],
    },
  ],
  effectiveDate: '6/15/2026',
};
