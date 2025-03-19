// Configuration options that can be modified
export const CONFIG = {
    // How many items to fetch per page
    ITEMS_PER_PAGE: 20,
    
    // Time in milliseconds to wait before triggering infinite scroll loading
    INFINITE_SCROLL_THRESHOLD: 200,
    
    // For demo purposes, also enable button-based pagination
    ENABLE_LOAD_MORE_BUTTON: false,
    
    // Projects default sort order: "updated_at" or "created_at"
    PROJECTS_SORT_BY: "updated_at",
    
    // Animation speeds
    ANIMATION_SPEED: {
        cardFadeIn: 300,
        tabSwitch: 200
    }
};

