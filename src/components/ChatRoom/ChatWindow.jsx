import { Avatar, Button, Input, Tooltip, Form, Alert } from "antd";
import { UserAddOutlined } from "@ant-design/icons";
import styled from "styled-components";
import Message from "./Message";
import { useContext, useMemo, useState } from "react";
import { AppContext } from "../../Context/AppProvider";
import { addDocument } from "../../firebase/services";
import { AuthContext } from "../../Context/AuthProvider";
import { useForm } from "antd/es/form/Form";
import useFireStore from "../../hooks/useFireStore";

const HeaderStyled = styled.div`
    display: flex;
    justify-content: space-between;
    height: 56px;
    padding: 0 16px;
    align-items: center;
    border-bottom: 1px solid rgb(230, 230, 230);
    .header {
        &__info {
            display: flex;
            flex-direction: column;
            justify-content: center;
        }
        &__title {
            margin: 0;
            font-weight: bold;
        }
        &__description {
            font-size: 12px;
        }
    }
`;

const WrapperStyled = styled.div`
    height: 100vh;
`;

const ButtonGroupStyled = styled.div`
    display: flex;
    align-items: center;
`;

const MessageListStyled = styled.div`
    max-height: 100%;
    overflow-y: auto;
`;
const ContentStyled = styled.div`
    height: calc(100% - 56px);
    display: flex;
    flex-direction: column;
    padding: 11px;
    justify-content: flex-end;
`;

const FormStyle = styled(Form)`
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 2px 2px 2px 0;
    border: 1px solid rgba(230, 230, 230);
    border-radius: 2px;
    .ant-form-item {
        flex: 1;
        margin-bottom: 0;
    }
`;

function ChatWindow() {
    const { selectedRoom, members, setIsInviteMemberVisible } = useContext(AppContext);
    const {
        user: { uid, photoURL, displayName },
    } = useContext(AuthContext);
    const [inputValue, setInputValue] = useState("");
    const [form] = useForm();

    const handleInputChange = (e) => {
        setInputValue(e.target.value);
    };

    const handleOnSubmit = () => {
        addDocument("messages", {
            text: inputValue,
            uid,
            photoURL,
            roomId: selectedRoom.id,
            displayName,
        });
        form.resetFields(["messages"]);
    };

    const condition = useMemo(
        () => ({
            fieldName: "roomId",
            operator: "==",
            compareValue: selectedRoom.id,
        }),
        [selectedRoom.id]
    );

    const messages = useFireStore("messages", condition);
    console.log({ messages });
    return (
        <WrapperStyled>
            {selectedRoom.id ? (
                <>
                    <HeaderStyled>
                        <div className="header__info">
                            <p className="header__title">{selectedRoom.name}</p>
                            <span className="header__description">{selectedRoom.description}</span>
                        </div>
                        <ButtonGroupStyled>
                            <Button
                                type="text"
                                icon={<UserAddOutlined />}
                                onClick={() => setIsInviteMemberVisible(true)}
                            >
                                Mời
                            </Button>
                            <Avatar.Group size="small" maxCount={2}>
                                {members.map((member) => (
                                    <Tooltip title={member.displayName} key={member.id}>
                                        <Avatar src={member.photoURL}>
                                            {member.photoURL ? "" : member.displayName?.charAt(0)?.toUpperCase()}
                                        </Avatar>
                                    </Tooltip>
                                ))}
                            </Avatar.Group>
                        </ButtonGroupStyled>
                    </HeaderStyled>
                    <ContentStyled>
                        <MessageListStyled>
                            {messages.map((mess) => (
                                <Message
                                    key={mess.id}
                                    text={mess.text}
                                    photoURL={mess.photoURL}
                                    displayName={mess.displayName}
                                    createdAt={mess.createdAt}
                                />
                            ))}
                        </MessageListStyled>
                        <FormStyle form={form}>
                            <Form.Item name="messages">
                                <Input
                                    onChange={handleInputChange}
                                    onPressEnter={handleOnSubmit}
                                    placeholder="Nhập tin nhắn..."
                                    bordered={false}
                                    autoComplete="off"
                                />
                            </Form.Item>
                            <Button type="primary" onClick={handleOnSubmit}>
                                Gửi
                            </Button>
                        </FormStyle>
                    </ContentStyled>
                </>
            ) : (
                <Alert message="Hãy chọn phòng" type="info" showIcon style={{ margin: 5 }} closable />
            )}
        </WrapperStyled>
    );
}

export default ChatWindow;
