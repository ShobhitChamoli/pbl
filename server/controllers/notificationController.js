const db = require('../data/firebaseDb');

const getMyNotifications = async (req, res) => {
    try {
        const notifications = await db.get('notifications');
        const userNotifications = notifications
            .filter(n => n.userId === req.user.id)
            .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
        res.status(200).json(userNotifications);
    } catch (error) {
        res.status(500).json({ message: 'Server Error' });
    }
};

const markAsRead = async (req, res) => {
    try {
        const { id } = req.params;
        const notification = await db.findById('notifications', id);

        if (!notification) {
            return res.status(404).json({ message: 'Notification not found' });
        }

        if (notification.userId !== req.user.id) {
            return res.status(401).json({ message: 'Not authorized' });
        }

        const updated = await db.update('notifications', id, { read: true });
        res.status(200).json(updated);
    } catch (error) {
        res.status(500).json({ message: 'Server Error' });
    }
};

const deleteNotification = async (req, res) => {
    try {
        const { id } = req.params;
        const notification = await db.findById('notifications', id);

        if (!notification) {
            return res.status(404).json({ message: 'Notification not found' });
        }

        if (notification.userId !== req.user.id) {
            return res.status(401).json({ message: 'Not authorized' });
        }

        await db.delete('notifications', id);
        res.json({ message: 'Notification removed' });
    } catch (error) {
        res.status(500).json({ message: 'Server Error' });
    }
};

const createNotification = async (req, res) => {
    try {
        const { userId, title, message, type } = req.body;

        const newNotification = await db.create('notifications', {
            userId,
            title,
            message,
            type: type || 'info',
            read: false,
            senderId: req.user.id
        });

        res.status(201).json(newNotification);
    } catch (error) {
        res.status(500).json({ message: 'Server Error' });
    }
};

module.exports = {
    getMyNotifications,
    markAsRead,
    deleteNotification,
    createNotification
};
