// Configuration options that can be modified
export const CONFIG = {
    // How many items to fetch per page
    ITEMS_PER_PAGE: 20,
    
    // Time in milliseconds to wait before triggering infinite scroll loading
    INFINITE_SCROLL_THRESHOLD: 300,
    
    // For demo purposes, also enable button-based pagination
    ENABLE_LOAD_MORE_BUTTON: false,
    
    // Projects default sort order: "updated_at" or "created_at"
    PROJECTS_SORT_BY: "updated_at",
    
    // Animation speeds
    ANIMATION_SPEED: {
        cardFadeIn: 300,
        tabSwitch: 200,
        slideshow: 8000 // Time between slideshow transitions in milliseconds
    },
    
    // Showcase items
    SHOWCASE_ITEMS: [
        {
            title: "Club Duckling",
            description: "Interactive experience",
            url: "https://club-duckling.on.websim.ai",
            frameUrl: "https://club-duckling.on.websim.ai"
        },
        {
            title: "Pogemon",
            description: "Gaming adventure",
            url: "https://pogemon.on.websim.ai",
            frameUrl: "https://pogemon.on.websim.ai"
        },
        {
            title: "Webscape",
            description: "Digital landscape exploration",
            url: "https://webscape.on.websim.ai",
            frameUrl: "https://webscape.on.websim.ai"
        },
        {
            title: "The LLMs",
            description: "Language model showcase",
            url: "https://the-llms.on.websim.ai",
            frameUrl: "https://the-llms.on.websim.ai"
        }
    ]
};