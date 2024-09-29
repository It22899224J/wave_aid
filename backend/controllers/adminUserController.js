const server = require("../server");
const db = server.db;

exports.updateUser = async (req, res) => {
    const userId = req.params.userId;
    const { email, name, role } = req.body; // Values to be updated

    try {
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
            return res
                .status(404)
                .send({ error: `No Firestore document found for userId: ${userId}` });
        }

        // Step 3: Update the Firestore document
        const updateFirestoreData = {};
        if (email) updateFirestoreData.email = email;
        if (name) updateFirestoreData.name = name; // Assuming 'name' is stored in Firestore
        if (role) updateFirestoreData.role = role;

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
        res.status(500).send({ error: "Failed to update user or Firestore data" });
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
        console.error("Error deleting user or Firestore document:", error);
        res
            .status(500)
            .send({ error: "Failed to delete user or related Firestore data" });
    }
};
