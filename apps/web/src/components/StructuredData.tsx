export default function StructuredData() {
    const websiteSchema = {
        "@context": "https://schema.org",
        "@type": "WebSite",
        "name": "Bingo.prateekbh111.in",
        "url": "https://bingo.prateekbh111.in",
        "description": "Free online multiplayer Bingo games with real-time gameplay",
        "publisher": {
            "@type": "Organization",
            "name": "Bingo.prateekbh111.in",
            "url": "https://bingo.prateekbh111.in"
        },
        "potentialAction": {
            "@type": "SearchAction",
            "target": "https://bingo.prateekbh111.in/search?q={search_term_string}",
            "query-input": "required name=search_term_string"
        }
    };

    const organizationSchema = {
        "@context": "https://schema.org",
        "@type": "Organization",
        "name": "Bingo.prateekbh111.in",
        "url": "https://bingo.prateekbh111.in",
        "logo": "https://bingo.prateekbh111.in/icon.svg",
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
                "item": "https://bingo.prateekbh111.in"
            },
            {
                "@type": "ListItem",
                "position": 2,
                "name": "How to Play",
                "item": "https://bingo.prateekbh111.in/how-to-play"
            },
            {
                "@type": "ListItem",
                "position": 3,
                "name": "About",
                "item": "https://bingo.prateekbh111.in/about"
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
