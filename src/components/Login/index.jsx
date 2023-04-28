import { Row, Col, Button, Typography } from "antd";
import firebase, { auth, db } from "../../firebase/config";
import { addDocument, generateKeywords } from "../../firebase/services";

const { Title } = Typography;
const fbProvider = new firebase.auth.FacebookAuthProvider();

function Login() {
    const handleFbLogin = async () => {
        const { additionalUserInfo, user } = await auth.signInWithPopup(fbProvider);
        if (additionalUserInfo?.isNewUser) {
            addDocument("users", {
                displayName: user.displayName,
                email: user.email,
                photoURL: user.photoURL,
                uid: user.uid,
                providerId: additionalUserInfo.providerId,
                keywords: generateKeywords(user.displayName),
            });
        }
    };

    return (
        <div>
            <Row justify={"center"} style={{ height: 800 }}>
                <Col>
                    <Title style={{ textAlign: "center" }}>Fun Chat</Title>
                    <Button style={{ width: "100%", marginBottom: 5 }}>Đăng Nhập Bằng Google</Button>
                    <Button style={{ width: "100%" }} onClick={handleFbLogin}>
                        Đăng Nhập Bằng Facebook
                    </Button>
                </Col>
            </Row>
        </div>
    );
}

export default Login;
