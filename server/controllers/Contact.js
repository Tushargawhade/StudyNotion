const Contact = require('../models/Contact');

// create contact handler function
exports.createContact = async (req, res) => {
    try {
        const { name, email, phoneNumber, subject, message } = req.body;

        if (!name || !email || !message) {
            return res.status(400).json({
                success: false,
                message: "All fields are required",
            });
        }

        const contactDetails = await Contact.create({
            name,
            email,
            phoneNumber: phoneNumber || "",
            subject: subject || "",
            message,
        });

        return res.status(200).json({
            success: true,
            message: "Message sent successfully",
            data: contactDetails,
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: error.message,
        });
    }
};
