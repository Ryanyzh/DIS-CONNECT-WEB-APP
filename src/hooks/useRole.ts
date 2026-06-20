import { useState, useEffect } from "react";

export function useRole(uid: string | undefined) {
    const [role, setRole] = useState<string>();
    const [roleLoading, setRoleLoading] = useState<boolean>(true);

    const fetchRole = async () => {
        try {
            setRoleLoading(true);

            if (!uid) {
                throw new Error("No UID provided");
            }

            const response = await fetch(`/api/v1/users/${uid}`);

            if (!response.ok) {
                throw new Error(`Error retrieving user: ${response.status}`);
            }

            const user = await response.json();
            console.log(user.role); // debugging
            setRole(user.role);
        } catch (error) {
            console.error("Error fetching user data from Firestore: ", error);
            setRole(undefined);
        } finally {
            setRoleLoading(false);
        }
    };

    useEffect(() => {
        fetchRole();
    }, [uid]);

    return { role, roleLoading };
}