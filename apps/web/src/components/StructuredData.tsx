export default function StructuredData() {
    const websiteSchema = {
        "@context": "https://schema.org",
        "@type": "WebSite",
        "name": "Bingooo.site",
        "url": "https://bingooo.site",
        "description": "Free online multiplayer Bingo games with real-time gameplay",
        "publisher": {
            "@type": "Organization",
            "name": "Bingooo.site",
            "url": "https://bingooo.site"
        },
        "potentialAction": {
            "@type": "SearchAction",
            "target": "https://bingooo.site/search?q={search_term_string}",
            "query-input": "required name=search_term_string"
        }
    };

    const organizationSchema = {
        "@context": "https://schema.org",
        "@type": "Organization",
        "name": "Bingooo.site",
        "url": "https://bingooo.site",
        "logo": "https://bingooo.site/icon.svg",
        "description": "Premier online Bingo gaming platform offering free multiplayer games",
        "foundingDate": "2024",
        "contactPoint": {
            "@type": "ContactPoint",
            "email": "prateekbh111@gmail.com",
            "contactType": "customer service"
        },
        "sameAs": [
            "https://x.com/prateekbh111",
            "https://prateekbh111-portfolio.vercel.app"
        ]
    };

    const gameSchema = {
        "@context": "https://schema.org",
        "@type": "Game",
        "name": "Online Bingo",
        "description": "Free multiplayer Bingo games with real-time gameplay and fair random number generation",
        "genre": "Board Game",
        "gamePlatform": "Web Browser",
        "numberOfPlayers": "Multiple",
        "playMode": "MultiPlayer",
        "applicationCategory": "Game",
        "operatingSystem": "Cross-platform"
    };

    const breadcrumbSchema = {
        "@context": "https://schema.org",
        "@type": "BreadcrumbList",
        "itemListElement": [
            {
                "@type": "ListItem",
                "position": 1,
                "name": "Home",
                "item": "https://bingooo.site"
            },
            {
                "@type": "ListItem",
                "position": 2,
                "name": "How to Play",
                "item": "https://bingooo.site/how-to-play"
            },
            {
                "@type": "ListItem",
                "position": 3,
                "name": "About",
                "item": "https://bingooo.site/about"
            }
        ]
    };

    return (
        <>
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{
                    __html: JSON.stringify(websiteSchema),
                }}
            />
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{
                    __html: JSON.stringify(organizationSchema),
                }}
            />
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{
                    __html: JSON.stringify(gameSchema),
                }}
            />
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{
                    __html: JSON.stringify(breadcrumbSchema),
                }}
            />
        </>
    );
}
