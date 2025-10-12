import { MetadataRoute } from 'next'

export default function robots(): MetadataRoute.Robots {
    return {
        rules: {
            userAgent: '*',
            allow: '/',
            disallow: ['/api/', '/dashboard/', '/profile/'],
        },
        sitemap: 'https://bingo.prateekbh111.in/sitemap.xml',
    }
}
