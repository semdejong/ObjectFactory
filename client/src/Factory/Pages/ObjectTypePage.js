import { useState, useEffect } from "react";
import { Button, Table, Tag, Popconfirm, Checkbox, Tooltip } from "antd";

import useLoading from "../../hooks/useLoading";
import useObjectTypes from "../../hooks/useObjectTypes";
import useSocket from "../../hooks/useSocket";

import Icon from "../../Components/Icon";
import FieldAndObjectTypeForm from "../../Components/FieldAndObjectTypeForm";
import FieldsSelector from "../../Components/FieldsSelector";

export default function ObjectTypePage() {
  const [isAddingNewObjectType, setIsAddingNewObjectType] = useState(false);

  const { objectTypes, loading, addObjectType, deleteObjectType } =
    useObjectTypes();

  const { socket } = useSocket();

  useEffect(() => {
    socket.on("test", (data) => {
      console.log(data);
    });

    return () => {
      socket.off("test");
    };
  }, [socket]);

  return !isAddingNewObjectType ? (
    <ObjectList
      setIsAddingNewObjectType={setIsAddingNewObjectType}
      objectTypes={objectTypes}
      loading={loading}
      deleteObjectType={deleteObjectType}
    />
  ) : (
    <AddObjectType
      setIsAddingNewObjectType={setIsAddingNewObjectType}
      addObjectType={addObjectType}
    />
  );
}

const ObjectList = ({
  setIsAddingNewObjectType,
  objectTypes,
  loading,
  deleteObjectType,
}) => {
  const { startLoading, stopLoading } = useLoading();

  if (loading || !objectTypes) {
    startLoading();
    return <></>;
  }

  stopLoading();

  const columns = [
    {
      title: "Name",
      dataIndex: "name",
      align: "center",
      key: "name",
    },
    {
      title: "Description",
      dataIndex: "description",
      align: "center",
      key: "description",
      render: (text) => {
        return text.length > 45 ? text.substring(1, 45) + "..." : text;
      },
    },
    {
      title: "Fields",
      dataIndex: "fields",
      align: "center",
      key: "fields",
      render: (fields) => {
        return fields.map((field) => <Tag>{field.name}</Tag>);
      },
    },
    {
      title: "Permissions",
      align: "center",
      children: [
        {
          title: "Read",
          dataIndex: "read",
          align: "center",
          key: "read",
          render: (roles) => {
            return roles.map((role) => <Tag>{role.name}</Tag>);
          },
        },
        {
          title: "Write",
          dataIndex: "write",
          align: "center",
          key: "write",
          render: (roles) => {
            return roles.map((role) => <Tag>{role.name}</Tag>);
          },
        },
        {
          title: "Update",
          dataIndex: "update",
          align: "center",
          key: "update",
          render: (roles) => {
            return roles.map((role) => <Tag>{role.name}</Tag>);
          },
        },
        {
          title: "Delete",
          dataIndex: "delete",
          align: "center",
          key: "delete",
          render: (roles) => {
            return roles.map((role) => <Tag>{role.name}</Tag>);
          },
        },
      ],
    },
    {
      title: "Admin Only",
      dataIndex: "adminOnly",
      align: "center",
      render: (_, record) => {
        return <Checkbox checked={record.adminOnly} readonly={true} />;
      },
    },
    {
      title: "Non User",
      dataIndex: "nonUser",
      align: "center",
      render: (_, record) => {
        return <Checkbox checked={record.nonUser} readonly={true} />;
      },
    },
    {
      title: "Actions",
      dataIndex: "Actions",
      align: "center",
      render: (_, record) => {
        return (
          <div className="flex flex-row space-x-4">
            <Popconfirm
              title="Sure to delete?"
              onConfirm={() => {
                deleteObjectType(record._id);
              }}
            >
              <span className="text-red-500 cursor-pointer">
                <Icon icon="fa-trash" />
              </span>
            </Popconfirm>
            <Tooltip title="Copy">
              <span
                className="text-blue-500 cursor-pointer"
                onClick={() => navigator.clipboard.writeText(record._id)}
              >
                <Icon icon="fa-copy" />
              </span>
            </Tooltip>
          </div>
        );
      },
    },
  ];

  return (
    <div className="flex flex-col relative w-full h-full">
      <div className="absolute bottom-10 right-10 ">
        <Button
          shape="circle"
          type="primary"
          size="large"
          onClick={() => setIsAddingNewObjectType(true)}
        >
          +
        </Button>
      </div>
      <Table
        className="w-full"
        columns={columns}
        rowKey={(record) => record._id}
        dataSource={objectTypes.data.objectTypes.map((objectType) => {
          return {
            ...objectType,
            read: [...objectType.permissions.read],
            write: [...objectType.permissions.write],
            update: [...objectType.permissions.update],
            delete: [...objectType.permissions.delete],
          };
        })}
      />
    </div>
  );
};

const AddObjectType = ({ setIsAddingNewObjectType, addObjectType }) => {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [permissions, setPermissions] = useState({
    read: [],
    write: [],
    update: [],
    delete: [],
  });
  const [adminOnly, setAdminOnly] = useState(false);
  const [nonUser, setNonUser] = useState(false);

  const [fields, setFields] = useState([]);

  const updatePermission = (permission, roles) => {
    setPermissions({ ...permissions, [permission]: roles });
  };

  const createObjectType = async () => {
    const response = await addObjectType(
      name,
      description,
      fields,
      permissions,
      adminOnly,
      nonUser
    );

    if (response.status === 200) {
      setIsAddingNewObjectType(false);
    }
  };

  const setAdminOnlyAndNonUser = (value, checked) => {
    if (value === "adminOnly") {
      setAdminOnly(checked);
      setNonUser(false);
    }
    if (value === "nonUser") {
      setNonUser(checked);
      setAdminOnly(false);
    }
  };

  return (
    <div className="w-full h-full flex flex-col space-y- overflow-auto">
      <div>
        <Button
          type="primary"
          shape="circle"
          size="large"
          onClick={() => setIsAddingNewObjectType(false)}
        >
          <Icon icon="fa-arrow-left" />
        </Button>
      </div>

      <FieldAndObjectTypeForm
        name={name}
        description={description}
        permissions={permissions}
        setName={setName}
        setDescription={setDescription}
        updatePermission={updatePermission}
      />
      <div className="flex flex-col mt-2">
        <span>Admin Only</span>
        <Checkbox
          checked={adminOnly}
          onChange={(e) =>
            setAdminOnlyAndNonUser("adminOnly", e.target.checked)
          }
        />
      </div>
      <div className="flex flex-col mt-2 mb-2">
        <span>Non User</span>
        <Checkbox
          checked={nonUser}
          onChange={(e) => setAdminOnlyAndNonUser("nonUser", e.target.checked)}
        />
      </div>
      <div>
        <span>Fields</span>
        <FieldsSelector fields={fields} setFields={setFields} />
      </div>
      <div className="w-full flex justify-end">
        <Button type="primary" onClick={createObjectType}>
          Create
        </Button>
      </div>
    </div>
  );
};
