import { Avatar, Form, Input, Modal, Select, Spin } from "antd";
import { useContext, useMemo, useState } from "react";
import { AppContext } from "../../Context/AppProvider";
import { addDocument } from "../../firebase/services";
import { AuthContext } from "../../Context/AuthProvider";
import { debounce } from "lodash";
import { db } from "../../firebase/config";

function DebounceSelect({ fetchOptions, debounceTimeout = 300, ...props }) {
    const [fetching, setFetching] = useState(false);
    const [options, setOptions] = useState([]);
    const debounceFetcher = useMemo(() => {
        const loadOption = (value) => {
            setOptions([]);
            setFetching(true);
            fetchOptions(value, props.curMembers).then((newOptions) => {
                setOptions(newOptions);
                setFetching(false);
            });
        };
        return debounce(loadOption, debounceTimeout);
    }, [fetchOptions, debounceTimeout]);
    return (
        <Select
            labelInValue
            filterOption={false}
            onSearch={debounceFetcher}
            notFoundContent={fetching ? <Spin size="small" /> : null}
            {...props}
        >
            {options.map((option) => (
                <Select.Option key={option.value} value={option.value} title={option.label}>
                    <Avatar size="small" src={option.photoURL}>
                        {option.photoURL ? "" : option.label?.charAt(0)?.toUpperCase()}
                    </Avatar>
                    {`${option.label}`}
                </Select.Option>
            ))}
        </Select>
    );
}

async function fetchUserList(search, curMembers) {
    return db
        .collection("users")
        .where("keywords", "array-contains", search)
        .orderBy("displayName")
        .limit(20)
        .get()
        .then((snapshot) => {
            return snapshot.docs
                .map((doc) => ({
                    label: doc.data().displayName,
                    value: doc.data().uid,
                    photoURL: doc.data().photoURL,
                }))
                .filter((option) => !curMembers.includes(option.value));
        });
}

function InviteMemberModal() {
    const { isInviteMemberVisible, setIsInviteMemberVisible, selectedRoomId, selectedRoom } = useContext(AppContext);
    const {
        user: { uid },
    } = useContext(AuthContext);

    const [value, setValue] = useState([]);
    const [form] = Form.useForm();

    const handleOk = () => {
        const roomRef = db.collection("rooms").doc(selectedRoomId);
        roomRef.update({
            members: [...selectedRoom.members, ...value.map((val) => val.value)],
        });
        form.resetFields();
        setIsInviteMemberVisible(false);
    };

    const handleCancel = () => {
        form.resetFields();

        setIsInviteMemberVisible(false);
    };
    console.log({ value });
    return (
        <div>
            <Modal title="Mời thêm thành viên" open={isInviteMemberVisible} onOk={handleOk} onCancel={handleCancel}>
                <Form form={form} layout="vertical">
                    <DebounceSelect
                        mode="multiple"
                        label="Tên các thành viên"
                        value={value}
                        placeholder="Nhập tên thành viên"
                        fetchOptions={fetchUserList}
                        onChange={(newValue) => setValue(newValue)}
                        style={{ width: "100%" }}
                        curMembers={selectedRoom.members}
                    />
                </Form>
            </Modal>
        </div>
    );
}

export default InviteMemberModal;
