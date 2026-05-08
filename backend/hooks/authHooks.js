/**
 * Authentication Hooks
 * These hooks are called at different stages of the authentication process.
 */

export const authHooks = {
    // called before user registration
    beforeSignup: async (request) => {
        console.log("🔍 Running pre-signup hooks...");
        // Add custom logic here (e.g., rate limiting, additional validation)
    },

    // called after user registration
    afterSignup: async (user, token) => {
        console.log("🎉 User signed up successfully:", user.email);
        // Add custom logic here (e.g., send welcome email, clear cache)
    },

    // called before user login
    beforeLogin: async (request) => {
        console.log("🔍 Running pre-login hooks...");
    },

    // called after user login
    afterLogin: async (user, token) => {
        console.log("✅ User logged in successfully:", user.email);
    },

    // called on user logout
    onLogout: async (request) => {
        console.log("🚪 User logged out");
    }
};
