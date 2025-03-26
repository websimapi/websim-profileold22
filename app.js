import { CONFIG } from './config.js';

// State management
const state = {
    creator: null,
    creatorStats: null,
    activeTab: 'projects',
    cursors: {
        projects: null,
        followers: null,
        following: null,
        likes: null
    },
    loading: {
        projects: false,
        followers: false,
        following: false,
        likes: false
    },
    hasMore: {
        projects: true,
        followers: true,
        following: true,
        likes: true
    },
    scrollListeners: {}
};

// API functions
async function fetchCreator() {
    try {
        // Get creator username
        const creator = await window.websim.getCreatedBy();
        
        // Fetch full user profile
        const response = await fetch(`/api/v1/users/${creator.username}`);
        if (!response.ok) throw new Error('Failed to fetch creator data');
        
        const data = await response.json();
        state.creator = data.user;
        
        // Fetch creator stats
        const statsResponse = await fetch(`/api/v1/users/${creator.username}/stats`);
        if (statsResponse.ok) {
            const statsData = await statsResponse.json();
            state.creatorStats = statsData.stats;
        }
        
        // Update UI with creator data
        updateProfileUI();
        
        // Initially load follower and following counts
        loadFollowerCount();
        loadFollowingCount();
        
        // Load initial data for the active tab
        loadTabData(state.activeTab);
    } catch (error) {
        console.error('Error fetching creator:', error);
    }
}

async function loadFollowerCount() {
    try {
        const response = await fetch(`/api/v1/users/${state.creator.username}/followers?count=true`);
        if (response.ok) {
            const data = await response.json();
            document.getElementById('followers-count').textContent = data.followers.meta.count || 0;
        }
    } catch (error) {
        console.error('Error fetching follower count:', error);
    }
}

async function loadFollowingCount() {
    try {
        const response = await fetch(`/api/v1/users/${state.creator.username}/following?count=true`);
        if (response.ok) {
            const data = await response.json();
            document.getElementById('following-count').textContent = data.following.meta.count || 0;
        }
    } catch (error) {
        console.error('Error fetching following count:', error);
    }
}

async function loadProjects() {
    if (state.loading.projects || !state.hasMore.projects) return;
    
    state.loading.projects = true;
    updateLoadingState('projects');
    
    try {
        let url = `/api/v1/users/${state.creator.username}/projects?posted=true&first=${CONFIG.ITEMS_PER_PAGE}&sort_by=${CONFIG.PROJECTS_SORT_BY}`;
        if (state.cursors.projects) {
            url += `&after=${state.cursors.projects}`;
        }
        
        const response = await fetch(url);
        if (!response.ok) throw new Error(`Failed to fetch projects: ${response.status}`);
        
        const data = await response.json();
        renderProjects(data.projects.data);
        
        // Update cursor and has more state
        state.cursors.projects = data.projects.meta.end_cursor;
        state.hasMore.projects = data.projects.meta.has_next_page;
        
        if (!state.hasMore.projects) {
            document.getElementById('projects-loading').textContent = 'No more projects to load';
        }
    } catch (error) {
        console.error('Error loading projects:', error);
        document.getElementById('projects-loading').textContent = 'Error loading projects. Try again.';
    } finally {
        state.loading.projects = false;
        updateLoadingState('projects');
    }
}

async function loadFollowers() {
    if (state.loading.followers || !state.hasMore.followers) return;
    
    state.loading.followers = true;
    updateLoadingState('followers');
    
    try {
        let url = `/api/v1/users/${state.creator.username}/followers?first=${CONFIG.ITEMS_PER_PAGE}`;
        if (state.cursors.followers) {
            url += `&after=${state.cursors.followers}`;
        }
        
        const response = await fetch(url);
        if (!response.ok) throw new Error('Failed to fetch followers');
        
        const data = await response.json();
        renderFollowers(data.followers.data);
        
        // Update cursor and has more state
        state.cursors.followers = data.followers.meta.end_cursor;
        state.hasMore.followers = data.followers.meta.has_next_page;
    } catch (error) {
        console.error('Error loading followers:', error);
    } finally {
        state.loading.followers = false;
        updateLoadingState('followers');
    }
}

async function loadFollowing() {
    if (state.loading.following || !state.hasMore.following) return;
    
    state.loading.following = true;
    updateLoadingState('following');
    
    try {
        let url = `/api/v1/users/${state.creator.username}/following?first=${CONFIG.ITEMS_PER_PAGE}`;
        if (state.cursors.following) {
            url += `&after=${state.cursors.following}`;
        }
        
        const response = await fetch(url);
        if (!response.ok) throw new Error('Failed to fetch following');
        
        const data = await response.json();
        renderFollowing(data.following.data);
        
        // Update cursor and has more state
        state.cursors.following = data.following.meta.end_cursor;
        state.hasMore.following = data.following.meta.has_next_page;
    } catch (error) {
        console.error('Error loading following:', error);
    } finally {
        state.loading.following = false;
        updateLoadingState('following');
    }
}

async function loadLikes() {
    if (state.loading.likes || !state.hasMore.likes) return;
    
    state.loading.likes = true;
    updateLoadingState('likes');
    
    try {
        let url = `/api/v1/users/${state.creator.username}/likes?first=${CONFIG.ITEMS_PER_PAGE}`;
        if (state.cursors.likes) {
            url += `&after=${state.cursors.likes}`;
        }
        
        const response = await fetch(url);
        if (!response.ok) throw new Error('Failed to fetch likes');
        
        const data = await response.json();
        renderLikes(data.likes.data);
        
        // Update cursor and has more state
        state.cursors.likes = data.likes.meta.end_cursor;
        state.hasMore.likes = data.likes.meta.has_next_page;
    } catch (error) {
        console.error('Error loading likes:', error);
    } finally {
        state.loading.likes = false;
        updateLoadingState('likes');
    }
}

// UI Rendering functions
function updateProfileUI() {
    if (!state.creator) return;
    
    // Set avatar
    const avatarEl = document.getElementById('avatar');
    if (state.creator.avatar_url) {
        avatarEl.src = state.creator.avatar_url;
    } else {
        avatarEl.src = `https://images.websim.ai/avatar/${state.creator.username}`;
    }
    
    // Set username
    document.getElementById('username').textContent = `@${state.creator.username}`;
    
    // Set bio/description
    const bioEl = document.getElementById('bio');
    bioEl.textContent = state.creator.description || '';
    
    // Set social links
    const twitterLink = document.getElementById('twitter-link');
    if (state.creator.twitter) {
        twitterLink.innerHTML = `<a href="https://twitter.com/${state.creator.twitter}" target="_blank">Twitter: @${state.creator.twitter}</a>`;
    }
    
    const discordLink = document.getElementById('discord-link');
    if (state.creator.discord_username) {
        discordLink.innerHTML = `<span>Discord: ${state.creator.discord_username}</span>`;
    }
    
    // Set stats
    if (state.creatorStats) {
        document.getElementById('total-views').textContent = state.creatorStats.total_views.toLocaleString();
        document.getElementById('total-likes').textContent = state.creatorStats.total_likes.toLocaleString();
    }
}

function renderProjects(projects) {
    const projectsGrid = document.getElementById('projects-grid');
    
    projects.forEach(item => {
        const projectCard = document.createElement('div');
        projectCard.className = 'project-card';
        
        const project = item.project;
        const projectRevision = item.project_revision;
        
        let thumbnailUrl = projectRevision.current_screenshot_url;
        if (!thumbnailUrl) {
            thumbnailUrl = `https://images.websim.ai/v1/project/${project.id}/600`;
        }
        
        projectCard.innerHTML = `
            <a href="https://websim.ai/p/${project.id}" target="_blank">
                <img class="project-image" src="${thumbnailUrl}" alt="${project.title || 'Untitled Project'}">
                <div class="project-info">
                    <h3 class="project-title">${project.title || 'Untitled Project'}</h3>
                    <p class="project-description">${project.description || ''}</p>
                    <div class="project-stats">
                        <span>${project.stats.views.toLocaleString()} views</span>
                        <span>${project.stats.likes.toLocaleString()} likes</span>
                    </div>
                </div>
            </a>
        `;
        
        projectsGrid.appendChild(projectCard);
    });
}

function renderFollowers(followers) {
    const followersList = document.getElementById('followers-list');
    
    followers.forEach(item => {
        const follower = item.follow.user;
        const followDate = new Date(item.follow.created_at);
        
        const userItem = document.createElement('div');
        userItem.className = 'user-item';
        
        const avatarUrl = follower.avatar_url || `https://images.websim.ai/avatar/${follower.username}`;
        
        userItem.innerHTML = `
            <a href="https://websim.ai/@${follower.username}" target="_blank">
                <img class="user-avatar" src="${avatarUrl}" alt="${follower.username}">
            </a>
            <div class="user-info">
                <a href="https://websim.ai/@${follower.username}" target="_blank">
                    <h3 class="user-name">@${follower.username}</h3>
                </a>
                <p class="user-bio">${follower.description || ''}</p>
                <p class="follow-date">Following since ${followDate.toLocaleDateString()}</p>
            </div>
        `;
        
        followersList.appendChild(userItem);
    });
}

function renderFollowing(following) {
    const followingList = document.getElementById('following-list');
    
    following.forEach(item => {
        const followedUser = item.follow.user;
        const followDate = new Date(item.follow.created_at);
        
        const userItem = document.createElement('div');
        userItem.className = 'user-item';
        
        const avatarUrl = followedUser.avatar_url || `https://images.websim.ai/avatar/${followedUser.username}`;
        
        userItem.innerHTML = `
            <a href="https://websim.ai/@${followedUser.username}" target="_blank">
                <img class="user-avatar" src="${avatarUrl}" alt="${followedUser.username}">
            </a>
            <div class="user-info">
                <a href="https://websim.ai/@${followedUser.username}" target="_blank">
                    <h3 class="user-name">@${followedUser.username}</h3>
                </a>
                <p class="user-bio">${followedUser.description || ''}</p>
                <p class="follow-date">Following since ${followDate.toLocaleDateString()}</p>
            </div>
        `;
        
        followingList.appendChild(userItem);
    });
}

function renderLikes(likes) {
    const likesGrid = document.getElementById('likes-grid');
    
    likes.forEach(item => {
        const likeCard = document.createElement('div');
        likeCard.className = 'project-card';
        
        const project = item.project;
        const projectRevision = item.project_revision;
        const site = item.site;
        
        let thumbnailUrl = projectRevision.current_screenshot_url;
        if (!thumbnailUrl) {
            thumbnailUrl = `https://images.websim.ai/v1/site/${site.id}/600`;
        }
        
        likeCard.innerHTML = `
            <a href="https://websim.ai/c/${site.id}" target="_blank">
                <img class="project-image" src="${thumbnailUrl}" alt="${site.title || project.title || 'Untitled Project'}">
                <div class="project-info">
                    <h3 class="project-title">${site.title || project.title || 'Untitled Project'}</h3>
                    <p class="project-description">${project.description || ''}</p>
                    <div class="project-stats">
                        <span>Created by: @${project.created_by.username}</span>
                    </div>
                </div>
            </a>
        `;
        
        likesGrid.appendChild(likeCard);
    });
}

function renderShowcase() {
    const showcaseGrid = document.getElementById('showcase-grid');
    if (!showcaseGrid) return;
    
    showcaseGrid.innerHTML = '';
    
    CONFIG.SHOWCASE_ITEMS.forEach(item => {
        const showcaseItem = document.createElement('div');
        showcaseItem.className = 'showcase-item';
        
        showcaseItem.innerHTML = `
            <a href="${item.url}" target="_blank">
                <img class="showcase-image" src="${item.imageUrl}" alt="${item.title}">
                <div class="showcase-info">
                    <h3 class="showcase-title">${item.title}</h3>
                    <p class="showcase-description">${item.description}</p>
                </div>
            </a>
        `;
        
        showcaseGrid.appendChild(showcaseItem);
    });
}

function updateLoadingState(type) {
    const loadingElement = document.getElementById(`${type}-loading`);
    
    if (state.loading[type]) {
        loadingElement.style.display = 'block';
        loadingElement.textContent = 'Loading more...';
    } else if (!state.hasMore[type]) {
        loadingElement.style.display = 'block';
        loadingElement.textContent = 'No more items to load';
    } else {
        loadingElement.style.display = 'none';
    }
}

function loadTabData(tab) {
    switch (tab) {
        case 'projects':
            loadProjects();
            break;
        case 'followers':
            loadFollowers();
            break;
        case 'following':
            loadFollowing();
            break;
        case 'likes':
            loadLikes();
            break;
    }
}

// Tab switching functionality
function initTabs() {
    const tabButtons = document.querySelectorAll('.tab-button');
    
    tabButtons.forEach(button => {
        button.addEventListener('click', () => {
            const tab = button.getAttribute('data-tab');
            
            // Update active tab
            tabButtons.forEach(btn => btn.classList.remove('active'));
            button.classList.add('active');
            
            // Show active content
            document.querySelectorAll('.tab-content').forEach(content => {
                content.classList.remove('active');
            });
            document.getElementById(tab).classList.add('active');
            
            // Update state
            state.activeTab = tab;
            
            // Load data if not already loaded
            if (!state.loading[tab] && state.hasMore[tab] && 
                document.getElementById(`${tab}-${tab === 'projects' || tab === 'likes' ? 'grid' : 'list'}`).children.length === 0) {
                loadTabData(tab);
            }
        });
    });
}

// Improved infinite scrolling with debounce and better threshold calculation
function initInfiniteScroll() {
    const debounce = (func, delay) => {
        let timeout;
        return function() {
            const context = this;
            const args = arguments;
            clearTimeout(timeout);
            timeout = setTimeout(() => func.apply(context, args), delay);
        };
    };
    
    const scrollHandler = debounce(() => {
        if (!state.loading[state.activeTab] && state.hasMore[state.activeTab]) {
            const scrollY = window.scrollY;
            const visibleHeight = document.documentElement.clientHeight;
            const pageHeight = document.documentElement.scrollHeight;
            const scrollPercentage = (scrollY + visibleHeight) / pageHeight;
            
            // Load more when user scrolls past 75% of the page or is close to bottom
            if (scrollPercentage > 0.75 || 
                (pageHeight - (scrollY + visibleHeight)) < CONFIG.INFINITE_SCROLL_THRESHOLD) {
                loadTabData(state.activeTab);
            }
        }
    }, 100);

    window.addEventListener('scroll', scrollHandler);
    state.scrollListeners.main = scrollHandler;
    
    // Also check on window resize
    window.addEventListener('resize', scrollHandler);
}

// Initialize the app
async function initApp() {
    await fetchCreator();
    renderShowcase();
    initTabs();
    initInfiniteScroll();
    
    // Check if we need to load immediately (for small pages)
    setTimeout(() => {
        const visibleHeight = document.documentElement.clientHeight;
        const pageHeight = document.documentElement.scrollHeight;
        
        if (pageHeight <= visibleHeight && state.hasMore[state.activeTab]) {
            loadTabData(state.activeTab);
        }
    }, 100);
}

// Start the app
document.addEventListener('DOMContentLoaded', initApp);