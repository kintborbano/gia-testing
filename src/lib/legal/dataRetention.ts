import type { LegalContent } from '@/components/legal/LegalDocument';

/**
 * Data Retention Policy copy. The prose source of truth lives in
 * docs/DATA_RETENTION_POLICY.md; this mirrors it for the rendered
 * /data-retention page.
 */
export const DATA_RETENTION_POLICY: LegalContent = {
  title: 'Data Retention Policy',
  intro: [
    'This Data Retention Policy explains how GIA manages temporary storage, retention, and deletion of processed information and generated reports.',
  ],
  sections: [
    {
      heading: 'Purpose',
      blocks: [
        {
          type: 'paragraph',
          text: 'GIA follows a minimal-retention approach intended to:',
        },
        {
          type: 'list',
          items: [
            'Support analytics processing',
            'Enable report generation',
            'Maintain platform stability and security',
            'Reduce unnecessary long-term storage of submitted data',
          ],
        },
      ],
    },
    {
      heading: 'Temporary Processing Data',
      blocks: [
        {
          type: 'paragraph',
          text: 'Submitted TikTok links, usernames, analytics information, and generated reports may be temporarily processed and cached to:',
        },
        {
          type: 'list',
          items: [
            'Generate dashboards',
            'Produce exports',
            'Improve processing performance',
          ],
        },
        {
          type: 'paragraph',
          text: 'Temporary processing data may be automatically deleted after processing completion or after a limited retention period.',
        },
      ],
    },
    {
      heading: 'Exported Reports',
      blocks: [
        {
          type: 'paragraph',
          text: 'Generated exports, including PDF and PNG reports:',
        },
        {
          type: 'list',
          items: [
            'May be temporarily stored to allow downloading',
            'May be automatically removed after export completion or expiration periods',
          ],
        },
        {
          type: 'paragraph',
          text: 'Users are responsible for storing downloaded copies externally.',
        },
      ],
    },
    {
      heading: 'Technical Logs & Security Data',
      blocks: [
        {
          type: 'paragraph',
          text: 'Limited operational and security-related logs may be retained temporarily for:',
        },
        {
          type: 'list',
          items: [
            'Platform diagnostics',
            'Abuse prevention',
            'Security monitoring',
            'Performance optimization',
          ],
        },
      ],
    },
    {
      heading: 'Data Minimization',
      blocks: [
        {
          type: 'paragraph',
          text: 'GIA aims to minimize unnecessary collection and retention of:',
        },
        {
          type: 'list',
          items: [
            'Personal information',
            'User-identifiable data',
            'Long-term analytics storage',
          ],
        },
        {
          type: 'paragraph',
          text: 'The platform currently does not require persistent user accounts.',
        },
      ],
    },
    {
      heading: 'Security Measures',
      blocks: [
        {
          type: 'paragraph',
          text: 'Retained data is protected using reasonable technical and organizational safeguards designed to prevent:',
        },
        {
          type: 'list',
          items: [
            'Unauthorized access',
            'Data misuse',
            'Accidental disclosure',
          ],
        },
      ],
    },
    {
      heading: 'Policy Updates',
      blocks: [
        {
          type: 'paragraph',
          text: 'This Data Retention Policy may be updated periodically as platform operations and infrastructure evolve.',
        },
      ],
    },
  ],
  effectiveDate: '6/15/2026',
};
