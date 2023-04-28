import { createContext, useContext, useMemo, useState } from "react";
import { AuthContext } from "./AuthProvider";
import useFireStore from "../hooks/useFireStore";

export const AppContext = createContext();

// eslint-disable-next-line react/prop-types
function AppProvider({ children }) {
    const [isAddRoomVisible, setIsAddRoomVisible] = useState(false);
    const [isInviteMemberVisible, setIsInviteMemberVisible] = useState(false);
    const [selectedRoomId, setSelectedRoomId] = useState("");

    const {
        user: { uid },
    } = useContext(AuthContext);

    const roomsCondition = useMemo(() => {
        return {
            fieldName: "members",
            operator: "array-contains",
            compareValue: uid,
        };
    }, [uid]);
    const rooms = useFireStore("rooms", roomsCondition);

    const selectedRoom = useMemo(() => rooms.find((room) => room.id === selectedRoomId) || {}, [rooms, selectedRoomId]);
    const usersCondition = useMemo(() => {
        return {
            fieldName: "uid",
            operator: "in",
            compareValue: selectedRoom.members,
        };
    }, [selectedRoom.members]);
    const members = useFireStore("users", usersCondition);

    return (
        <AppContext.Provider
            value={{
                rooms,
                isAddRoomVisible,
                setIsAddRoomVisible,
                selectedRoomId,
                setSelectedRoomId,
                selectedRoom,
                members,
                isInviteMemberVisible,
                setIsInviteMemberVisible,
            }}
        >
            {children}
        </AppContext.Provider>
    );
}

export default AppProvider;
