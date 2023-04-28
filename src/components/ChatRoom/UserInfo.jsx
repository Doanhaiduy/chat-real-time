import { Avatar, Button, Typography } from "antd";
import styled from "styled-components";
import { auth, db } from "../../firebase/config";
import { useContext } from "react";
import { AuthContext } from "../../Context/AuthProvider";

const WrapperStyle = styled.div`
    display: flex;
    justify-content: space-between;
    padding: 12px 16px;
    border-bottom: 1px solid rgba(82, 38, 83);

    .username {
        color: white;
        margin-left: 5px;
    }
`;

function UserInfo() {
    const {
        user: { displayName, photoURL },
    } = useContext(AuthContext);
    return (
        <WrapperStyle>
            <div>
                <Avatar src={photoURL}>{photoURL ? "" : displayName?.charAt(0)?.toUpperCase()}</Avatar>
                <Typography.Text className="username">{displayName}</Typography.Text>
            </div>
            <Button ghost onClick={() => auth.signOut()}>
                Đăng xuất
            </Button>
        </WrapperStyle>
    );
}

export default UserInfo;
