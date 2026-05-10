export const config = {
    // Try to use the browser's current origin if we are in a deployment where frontend/backend are on same host, 
    // otherwise default to localhost:8080 for dev.
    // For this specific deployment with tunnels, we might need to manually set this or use a relative path if proxying.
    // However, since we are doing a quick tunnel setup, we will likely need to update this after starting the backend tunnel.
    apiBaseUrl: 'https://beige-tables-share.loca.lt',
};
