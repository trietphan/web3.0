import sanityClient from '@sanity/client'

export const client = sanityClient({
  projectId: 's6ung6x2',
  dataset: 'production',
  apiVersion: 'v1',
  token:
    'skJId1VmxR9GzsTPNtm21oLBQw1txdM56hV7cqZzSB9pWhz6tFUAS0eM4MHDb1mwcU4yMK483GRhXaNqus5QHWcz7Axo6gfFVZeW9Ziwqp3gfstuTbF9av6YSKQ8G6Uq1UEMh1RSoCurISQlBhuQuVG2nOL7KxdYgDOjBv2gfpeMwDTomt3u',
  useCdn: false,
})