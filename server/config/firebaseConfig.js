const admin = require('firebase-admin');

let db = null;

/**
 * Initialize Firebase Admin SDK
 * Supports both local development (service account file) and production (environment variables)
 */
const initializeFirebase = () => {
    if (db) {
        return db; // Already initialized
    }

    try {
        // Check if Firebase credentials are provided via environment variables
        const projectId = process.env.FIREBASE_PROJECT_ID;
        const clientEmail = process.env.FIREBASE_CLIENT_EMAIL;
        const privateKey = process.env.FIREBASE_PRIVATE_KEY;

        if (!projectId || !clientEmail || !privateKey) {
            throw new Error(
                'Firebase credentials not found. Please set FIREBASE_PROJECT_ID, FIREBASE_CLIENT_EMAIL, and FIREBASE_PRIVATE_KEY environment variables.'
            );
        }

        // Initialize Firebase Admin SDK
        admin.initializeApp({
            credential: admin.credential.cert({
                projectId: projectId,
                clientEmail: clientEmail,
                // Handle private key formatting (Vercel compatibility)
                privateKey: privateKey.replace(/\\n/g, '\n'),
            }),
        });

        db = admin.firestore();

        // Configure Firestore settings for better performance
        db.settings({
            ignoreUndefinedProperties: true,
        });

        console.log('✅ Firebase initialized successfully');
        return db;
    } catch (error) {
        console.error('❌ Firebase initialization error:', error.message);
        throw error;
    }
};

// Initialize and export Firestore instance
const firestore = initializeFirebase();

module.exports = { db: firestore, admin };
