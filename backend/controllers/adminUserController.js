const server = require("../server");
const db = server.db;
const admin = server.admin;
const validator = require('validator');

exports.createUser = async (req, res) => {
    const { email, password, name, role, contactNo } = req.body;

    try {
        if (!email || !validator.isEmail(email)) {
            throw Error("Invalid email address");
        }
        if (!password || password.length < 6 || !validator.isStrongPassword(password)) {
            throw Error("Password must be a strong password");
        }
        if (!name || validator.isEmpty(name)) {
            throw Error("Name is required");
        }
        if (!role || validator.isEmpty(role)) {
            throw Error("Role is required");
        }
        if (!contactNo || !validator.isMobilePhone(contactNo, 'si-LK')) {
            throw Error("Invalid contact number");
        }
        const user = await admin.auth().createUser({
            email,
            password,
            name,
            role,
            contactNo,
        });

        await db.collection("users").add({
            userId: user.uid,
            email,
            name,
            role,
            contactNo,
        });

        res.status(201).send({
            message: "User created successfully",
            userId: user.uid,
            email,
            name,
            role,
            contactNo,
        });
    } catch (error) {
        console.error("Error updating user:", error);
        res.status(500).send({
            error: error.message || "An error occurred while updating the user.",
        });
    }
};


exports.updateUser = async (req, res) => {
    const userId = req.params.userId;
    const { email, name, role, contactNo } = req.body; // Values to be updated

    try {

        if (!email || !validator.isEmail(email)) {
            throw Error("Invalid email address");
        }
        if (!name || validator.isEmpty(name)) {
            throw Error("Name is required");
        }
        if (!role || validator.isEmpty(role)) {
            throw Error("Role is required");
        }
        if (!contactNo || !validator.isMobilePhone(contactNo, 'si-LK')) {
            throw Error("Invalid contact number");
        }

        // Step 1: Update Firebase Authentication record
        const updateAuthData = {};
        if (email) updateAuthData.email = email;

        if (Object.keys(updateAuthData).length > 0) {
            await admin.auth().updateUser(userId, updateAuthData);
            console.log(`Successfully updated Firebase Auth for userId: ${userId}`);
        }

        // Step 2: Query Firestore by userId field
        const querySnapshot = await db
            .collection("users")
            .where("userId", "==", userId)
            .get();

        // Check if any documents matched the query
        if (querySnapshot.empty) {
            console.log(`No Firestore document found for userId: ${userId}`);
            throw Error(`No Firestore document found for userId: ${userId}`)
        }

        // Step 3: Update the Firestore document
        const updateFirestoreData = {};
        if (email) updateFirestoreData.email = email;
        if (name) updateFirestoreData.name = name; // Assuming 'name' is stored in Firestore
        if (role) updateFirestoreData.role = role;
        if (contactNo) updateFirestoreData.contactNo = contactNo;
        querySnapshot.forEach(async (doc) => {
            await doc.ref.update(updateFirestoreData);
            console.log(`Successfully updated Firestore document with ID: ${doc.id}`);
        });

        // Respond with success message
        res.status(200).send({
            message: `Successfully updated user with ID: ${userId} in Firebase Auth and Firestore`,
        });
    } catch (error) {
        console.error("Error updating user:", error);
        res.status(500).send({
            error: error.message || "An error occurred while updating the user.",
        });
    }
};

exports.deleteUser = async (req, res) => {
    const userId = req.params.userId;

    try {
        // Step 1: Delete the Firebase Authentication user
        await admin.auth().deleteUser(userId);
        console.log(
            `Successfully deleted user with ID: ${userId} from Firebase Auth`
        );

        // Step 2: Query Firestore to find the document by the userId field
        const querySnapshot = await db
            .collection("users")
            .where("userId", "==", userId)
            .get();

        // Check if any documents matched the query
        if (querySnapshot.empty) {
            console.log(`No Firestore document found for userId: ${userId}`);
            return res
                .status(404)
                .send({ error: `No Firestore document found for userId: ${userId}` });
        }

        // Step 3: Delete the found Firestore document(s)
        querySnapshot.forEach(async (doc) => {
            await doc.ref.delete();
            console.log(`Successfully deleted Firestore document with ID: ${doc.id}`);
        });

        // Respond with success message
        res.status(200).send({
            message: `Successfully deleted user with ID: ${userId} from Firebase Auth and Firestore`,
        });
    } catch (error) {
        console.error("Error updating user:", error);
        res.status(500).send({
            error: error.message || "An error occurred while updating the user.",
        });
    }
};


exports.getUserLastLoginTime = async (req, res) => {
    // Extract the UID from URL parameters
    const uid = req.params.uid;
    console.log(`Fetching last login time for UID: ${uid}`); // Log the UID for debugging

    try {
        // Fetch the user record from Firebase
        const userRecord = await admin.auth().getUser(uid);

        // Access last sign-in time
        const lastLoginTime = userRecord.metadata.lastSignInTime;

        // Send the response with user ID and last login time
        res.status(200).json(lastLoginTime);
    } catch (error) {
        // Log the error details for troubleshooting
        console.error('Error fetching user data:', error);

        // Check if the error is a specific Firebase error for a non-existent user
        if (error.code === 'auth/user-not-found') {
            res.status(404).json({
                error: 'User not found',
            });
        } else {
            // Handle other possible errors
            res.status(500).json({
                error: 'An error occurred while fetching user data',
            });
        }
    }
};