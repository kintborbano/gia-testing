import type { LegalContent } from '@/components/legal/LegalDocument';

/**
 * Terms & Conditions copy. The prose source of truth lives in
 * docs/TERMS_AND_CONDITIONS.md; this mirrors it for the rendered /terms page.
 */
export const TERMS_AND_CONDITIONS: LegalContent = {
  title: 'Terms & Conditions',
  intro: [
    'These Terms & Conditions govern access to and use of GIA, powered by Sofi AI.',
    'By using the platform, users agree to comply with these Terms.',
  ],
  sections: [
    {
      heading: 'Platform Description',
      blocks: [
        {
          type: 'paragraph',
          text: 'GIA is a web-based analytics and reporting platform designed to simplify TikTok performance analytics through:',
        },
        {
          type: 'list',
          items: [
            'Dashboards',
            'Visual summaries',
            'PDF reports',
            'PNG exportable insights',
            'Recommendation-based analytics',
          ],
        },
        {
          type: 'paragraph',
          text: 'Features and functionality may evolve over time.',
        },
      ],
    },
    {
      heading: 'Acceptable Use',
      blocks: [
        { type: 'paragraph', text: 'Users agree not to:' },
        {
          type: 'list',
          items: [
            'Misuse or abuse the platform',
            'Attempt unauthorized access to systems or infrastructure',
            'Upload malicious content, scripts, or harmful materials',
            'Use automated tools to disrupt platform operations',
            'Use GIA for unlawful, fraudulent, or deceptive purposes',
          ],
        },
        {
          type: 'paragraph',
          text: 'Violation of these Terms may result in access restrictions or blocking.',
        },
      ],
    },
    {
      heading: 'Public Data Usage',
      blocks: [
        {
          type: 'paragraph',
          text: 'Users acknowledge that GIA processes publicly accessible TikTok information submitted to the platform. Users are responsible for:',
        },
        {
          type: 'list',
          items: [
            'Ensuring submitted data complies with applicable laws and platform rules',
            'Avoiding unauthorized or malicious use of analytics data',
          ],
        },
        {
          type: 'paragraph',
          text: 'GIA does not claim ownership over publicly available creator content.',
        },
      ],
    },
    {
      heading: 'Reports & Analytics Disclaimer',
      blocks: [
        {
          type: 'paragraph',
          text: 'Analytics, insights, recommendations, and generated reports are provided for informational purposes only. GIA does not guarantee:',
        },
        {
          type: 'list',
          items: [
            'Viral performance',
            'Audience growth',
            'Engagement increases',
            'Revenue or monetization outcomes',
          ],
        },
        {
          type: 'paragraph',
          text: 'Performance insights are based on available platform metrics and may vary depending on external algorithmic or platform changes.',
        },
      ],
    },
    {
      heading: 'Intellectual Property',
      blocks: [
        {
          type: 'paragraph',
          text: 'All platform assets, including but not limited to:',
        },
        {
          type: 'list',
          items: [
            'Branding',
            'Interface design',
            'Report templates',
            'Visual systems',
            'Proprietary analytics formatting',
            'Generated design structures',
          ],
        },
        {
          type: 'paragraph',
          text: 'remain the intellectual property of GIA and/or Sofi AI unless otherwise stated.',
        },
        {
          type: 'paragraph',
          text: 'Users may use exported reports for:',
        },
        {
          type: 'list',
          items: [
            'Personal sharing',
            'Portfolio purposes',
            'Social media posting',
            'Creator branding',
          ],
        },
        { type: 'paragraph', text: 'Users may not:' },
        {
          type: 'list',
          items: [
            'Resell the platform itself',
            'Reproduce proprietary platform assets without authorization',
            'Misrepresent generated analytics',
          ],
        },
      ],
    },
    {
      heading: 'Service Availability',
      blocks: [
        { type: 'paragraph', text: 'GIA may:' },
        {
          type: 'list',
          items: [
            'Modify or discontinue features',
            'Conduct maintenance or downtime',
            'Restrict or suspend access when necessary',
            'Update system functionality without prior notice',
          ],
        },
        {
          type: 'paragraph',
          text: 'The platform is provided on an "as available" basis.',
        },
      ],
    },
    {
      heading: 'Limitation of Liability',
      blocks: [
        {
          type: 'paragraph',
          text: 'To the fullest extent permitted by law, GIA and Sofi AI shall not be liable for:',
        },
        {
          type: 'list',
          items: [
            'Indirect damages',
            'Business interruption',
            'Data loss',
            'Analytics inaccuracies',
            'Platform downtime',
            'External platform changes affecting report accuracy',
          ],
        },
        {
          type: 'paragraph',
          text: 'Users access and use the platform at their own discretion and risk.',
        },
      ],
    },
    {
      heading: 'Third-Party Platform Disclaimer',
      blocks: [
        {
          type: 'paragraph',
          text: 'GIA is an independent analytics tool and is not affiliated with or endorsed by TikTok or its parent companies.',
        },
        {
          type: 'paragraph',
          text: 'All third-party trademarks and platform references belong to their respective owners.',
        },
      ],
    },
    {
      heading: 'Changes to Terms',
      blocks: [
        {
          type: 'paragraph',
          text: 'GIA reserves the right to revise these Terms & Conditions at any time.',
        },
        {
          type: 'paragraph',
          text: 'Continued use of the platform following updates constitutes acceptance of revised Terms.',
        },
      ],
    },
    {
      heading: 'Governing Law',
      blocks: [
        {
          type: 'paragraph',
          text: 'These Terms shall be governed by the applicable laws and regulations of the jurisdiction in which GIA operates.',
        },
      ],
    },
  ],
  effectiveDate: '6/15/2026',
};
