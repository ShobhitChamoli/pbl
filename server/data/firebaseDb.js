const { db } = require('../config/firebaseConfig');
const { v4: uuidv4 } = require('uuid');

/**
 * Firestore Database Abstraction Layer
 * Provides a consistent API similar to the old db.js for minimal controller changes
 */

const firebaseDb = {
    /**
     * Get all documents from a collection with optional filtering
     * @param {string} collection - Collection name
     * @param {Object} filters - Optional filters { field: value }
     * @param {Object} orderBy - Optional ordering { field: 'asc' | 'desc' }
     * @param {number} limit - Optional limit
     * @returns {Promise<Array>} Array of documents
     */
    get: async (collection, filters = null, orderBy = null, limit = null) => {
        try {
            let query = db.collection(collection);

            // Apply filters
            if (filters) {
                Object.entries(filters).forEach(([field, value]) => {
                    query = query.where(field, '==', value);
                });
            }

            // Apply ordering
            if (orderBy) {
                Object.entries(orderBy).forEach(([field, direction]) => {
                    query = query.orderBy(field, direction);
                });
            }

            // Apply limit
            if (limit) {
                query = query.limit(limit);
            }

            const snapshot = await query.get();
            const documents = [];
            snapshot.forEach((doc) => {
                documents.push({ id: doc.id, ...doc.data() });
            });

            return documents;
        } catch (error) {
            console.error(`Error getting documents from ${collection}:`, error);
            throw error;
        }
    },

    /**
     * Find a document by ID
     * @param {string} collection - Collection name
     * @param {string} id - Document ID
     * @returns {Promise<Object|null>} Document or null
     */
    findById: async (collection, id) => {
        try {
            const docRef = db.collection(collection).doc(id);
            const doc = await docRef.get();

            if (!doc.exists) {
                return null;
            }

            return { id: doc.id, ...doc.data() };
        } catch (error) {
            console.error(`Error finding document by ID in ${collection}:`, error);
            throw error;
        }
    },

    /**
     * Find first document matching query
     * @param {string} collection - Collection name
     * @param {Object} query - Query object { field: value }
     * @returns {Promise<Object|null>} First matching document or null
     */
    findOne: async (collection, query) => {
        try {
            let firestoreQuery = db.collection(collection);

            // Apply query filters
            Object.entries(query).forEach(([field, value]) => {
                firestoreQuery = firestoreQuery.where(field, '==', value);
            });

            const snapshot = await firestoreQuery.limit(1).get();

            if (snapshot.empty) {
                return null;
            }

            const doc = snapshot.docs[0];
            return { id: doc.id, ...doc.data() };
        } catch (error) {
            console.error(`Error finding document in ${collection}:`, error);
            throw error;
        }
    },

    /**
     * Create a new document
     * @param {string} collection - Collection name
     * @param {Object} data - Document data
     * @returns {Promise<Object>} Created document with ID
     */
    create: async (collection, data) => {
        try {
            const id = uuidv4();
            const timestamp = new Date().toISOString();
            const newDoc = {
                id,
                createdAt: timestamp,
                ...data,
            };

            await db.collection(collection).doc(id).set(newDoc);

            return newDoc;
        } catch (error) {
            console.error(`Error creating document in ${collection}:`, error);
            throw error;
        }
    },

    /**
     * Update a document
     * @param {string} collection - Collection name
     * @param {string} id - Document ID
     * @param {Object} data - Update data
     * @returns {Promise<Object|null>} Updated document or null
     */
    update: async (collection, id, data) => {
        try {
            const docRef = db.collection(collection).doc(id);
            const doc = await docRef.get();

            if (!doc.exists) {
                return null;
            }

            const updatedData = {
                ...data,
                updatedAt: new Date().toISOString(),
            };

            await docRef.update(updatedData);

            const updatedDoc = await docRef.get();
            return { id: updatedDoc.id, ...updatedDoc.data() };
        } catch (error) {
            console.error(`Error updating document in ${collection}:`, error);
            throw error;
        }
    },

    /**
     * Delete a document
     * @param {string} collection - Collection name
     * @param {string} id - Document ID
     * @returns {Promise<boolean>} True if deleted, false if not found
     */
    delete: async (collection, id) => {
        try {
            const docRef = db.collection(collection).doc(id);
            const doc = await docRef.get();

            if (!doc.exists) {
                return false;
            }

            await docRef.delete();
            return true;
        } catch (error) {
            console.error(`Error deleting document from ${collection}:`, error);
            throw error;
        }
    },

    /**
     * Batch create multiple documents (for efficiency)
     * @param {string} collection - Collection name
     * @param {Array<Object>} dataArray - Array of document data
     * @returns {Promise<Array>} Array of created documents
     */
    batchCreate: async (collection, dataArray) => {
        try {
            const batch = db.batch();
            const createdDocs = [];
            const timestamp = new Date().toISOString();

            dataArray.forEach((data) => {
                const id = uuidv4();
                const docRef = db.collection(collection).doc(id);
                const newDoc = {
                    id,
                    createdAt: timestamp,
                    ...data,
                };
                batch.set(docRef, newDoc);
                createdDocs.push(newDoc);
            });

            await batch.commit();
            return createdDocs;
        } catch (error) {
            console.error(`Error batch creating documents in ${collection}:`, error);
            throw error;
        }
    },

    /**
     * Advanced query with multiple filters
     * @param {string} collection - Collection name
     * @param {Array} filters - Array of filter objects [{ field, operator, value }]
     * @param {Object} orderBy - Optional ordering { field: 'asc' | 'desc' }
     * @param {number} limit - Optional limit
     * @returns {Promise<Array>} Array of documents
     */
    query: async (collection, filters = [], orderBy = null, limit = null) => {
        try {
            let query = db.collection(collection);

            // Apply filters
            filters.forEach(({ field, operator, value }) => {
                query = query.where(field, operator, value);
            });

            // Apply ordering
            if (orderBy) {
                Object.entries(orderBy).forEach(([field, direction]) => {
                    query = query.orderBy(field, direction);
                });
            }

            // Apply limit
            if (limit) {
                query = query.limit(limit);
            }

            const snapshot = await query.get();
            const documents = [];
            snapshot.forEach((doc) => {
                documents.push({ id: doc.id, ...doc.data() });
            });

            return documents;
        } catch (error) {
            console.error(`Error querying ${collection}:`, error);
            throw error;
        }
    },

    /**
     * Delete all documents in a collection (use with caution!)
     * @param {string} collection - Collection name
     * @param {Object} filters - Optional filters to delete specific documents
     * @returns {Promise<number>} Number of documents deleted
     */
    deleteAll: async (collection, filters = null) => {
        try {
            let query = db.collection(collection);

            // Apply filters if provided
            if (filters) {
                Object.entries(filters).forEach(([field, value]) => {
                    query = query.where(field, '==', value);
                });
            }

            const snapshot = await query.get();

            if (snapshot.empty) {
                return 0;
            }

            // Firestore batch delete (max 500 per batch)
            const batchSize = 500;
            let deletedCount = 0;

            for (let i = 0; i < snapshot.docs.length; i += batchSize) {
                const batch = db.batch();
                const batchDocs = snapshot.docs.slice(i, i + batchSize);

                batchDocs.forEach((doc) => {
                    batch.delete(doc.ref);
                });

                await batch.commit();
                deletedCount += batchDocs.length;
            }

            return deletedCount;
        } catch (error) {
            console.error(`Error deleting all documents from ${collection}:`, error);
            throw error;
        }
    },
};

module.exports = firebaseDb;
