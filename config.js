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
        tabSwitch: 200
    },
    
    // Showcase items
    SHOWCASE_ITEMS: [
        {
            title: "Featured Project 1",
            description: "An amazing interactive experience",
            url: "https://websim.ai/c/G2K9DFGHJ1K2M3N4O5",
            imageUrl: "https://images.websim.ai/v1/site/G2K9DFGHJ1K2M3N4O5/600"
        },
        {
            title: "Featured Project 2",
            description: "My best work yet",
            url: "https://websim.ai/c/Q7R8S9T1U2V3W4X5Y6",
            imageUrl: "https://images.websim.ai/v1/site/Q7R8S9T1U2V3W4X5Y6/600"
        }
    ]
};