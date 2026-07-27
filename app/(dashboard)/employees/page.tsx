"use client";

import { useEffect, useState } from "react";
import API from "@/app/lib/apiRoutes";
import jwtAxios from "@/app/lib/jwtAxios";
import {
  Button,
  Card,
  Col,
  Descriptions,
  Flex,
  Form,
  Input,
  InputNumber,
  Modal,
  Popconfirm,
  Row,
  Select,
  Space,
  Table,
  TableColumnsType,
  Tag,
  Typography,
  message,
} from "antd";
import {
  DeleteOutlined,
  EditOutlined,
  EyeOutlined,
  PlusOutlined,
  ReloadOutlined,
} from "@ant-design/icons";
import {DEFAULT_PAGE, DEFAULT_PAGE_SIZE, toSelectOptions } from "@/app/lib/config";
import { DefaultOptionType } from "antd/es/select";

const { Title } = Typography;

export default function EmployeesPage() {
  const [page, setPage] = useState(DEFAULT_PAGE);
  const [perPage, setPerPage] = useState(DEFAULT_PAGE_SIZE);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(false);
  const [employees, setEmployees] = useState([]);
  const [viewModalOpen, setViewModalOpen] = useState(false);
  const [viewLoading, setViewLoading] = useState(false);
  const [viewEmployee, setViewEmployee] = useState<any>(null);

  const [option1, setOption1] = useState<DefaultOptionType[]>([]);

  const [open, setOpen] = useState(false);
  const [submitLoading, setSubmitLoading] = useState(false);

  const [form] = Form.useForm();

  const [editOpen, setEditOpen] = useState(false);
  const [editLoading, setEditLoading] = useState(false);

  const [editForm] = Form.useForm();
  const [editingId, setEditingId] = useState<number | null>(null);
  const [editEmployee, setEditEmployee] = useState<any>(null);

  useEffect(() => {
    if (!open && !editOpen) return;

    const fetchRoles = async () => {
      try {
        const res = await jwtAxios.get(API.MASTER.DROPDOWN);

        const { roles } = res.data;

        setOption1(toSelectOptions(roles));
      } catch (error: any) {
        message.error(error.response?.data?.message);
      }
    };

    fetchRoles();
  }, [open, editOpen]);

  const handleEdit = async (record: any) => {
    try {
      setEditLoading(true);

      const res = await jwtAxios.get(API.EMPLOYEE.GET(record.id));

      setEditingId(record.id);
      setEditEmployee(res.data.data);

      setEditOpen(true);
    } catch (error: any) {
      message.error(error.response?.data?.message);
    } finally {
      setEditLoading(false);
    }
  };

  const fetchData = async (currentPage = page, currentPerPage = perPage) => {
    try {
      setLoading(true);

      const res = await jwtAxios.get(API.EMPLOYEE.LIST, {
        params: {
          page: currentPage,
          perPage: currentPerPage,
        },
      });

      setEmployees(res.data.data);
      setTotal(res.data.pagination.total);
    } catch (error: any) {
      message.error(error.response?.data?.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData(page, perPage);
  }, [page, perPage]);

  const deleteEmployee = async (id: number) => {
    try {
      const res = await jwtAxios.delete(API.EMPLOYEE.DELETE(id));

      message.success(res.data.message);

      fetchData();
    } catch (error: any) {
      message.error(error.response?.data?.message);
    }
  };
  const handleView = async (id: number) => {
    try {
      setViewModalOpen(true);
      setViewLoading(true);
      const res = await jwtAxios.get(API.EMPLOYEE.GET(id));
      setViewEmployee(res.data.data);
    } catch (error: any) {
      message.error(error.response?.data?.message);
    } finally {
      setViewLoading(false);
    }
  };

  const columns: TableColumnsType<any> = [
    {
      title: "Id",
      dataIndex: "id",
      width: 70,
    },
    {
      title: "Username",
      dataIndex: "username",
      width: 200,
    },
    {
      title: "Email",
      dataIndex: "email",
      width: 200,
    },
    {
      title: "Phone",
      dataIndex: "phoneNumber",
      width: 200,
    },
    {
      title: "Age",
      dataIndex: "age",
      width: 80,
    },
    {
      title: "Role",
      render: (_: any, record: any) => (
        <Tag color="blue">{record.role?.name}</Tag>
      ),
      width: 150,
    },
    {
      title: "Status",
      render: () => <Tag color="green">Active</Tag>,
      width: 120,
    },
    {
      title: "Created At",
      dataIndex: "createdAt",
      width: 150,
    },
    {
      title: "Updated At",
      dataIndex: "updatedAt",
      width: 150,
    },
    {
      title: "Action",
      fixed: "right",
      width: 150,
      render: (_: any, record: any) => (
        <Space>
          <Button
            type="text"
            icon={<EyeOutlined />}
            onClick={() => handleView(record.id)}
          />

          <Button
            type="text"
            icon={<EditOutlined className="text-blue-500!" />}
            onClick={() => handleEdit(record)}
          />

          <Popconfirm
            title="Delete Employee?"
            onConfirm={() => deleteEmployee(record.id)}
          >
            <Button type="text" danger icon={<DeleteOutlined />} />
          </Popconfirm>
        </Space>
      ),
    },
  ];

  const handleSubmit = async (values: any) => {
    try {
      setSubmitLoading(true);
      const res = await jwtAxios.post(API.EMPLOYEE.CREATE, values);
      message.success(res.data.message);
      setOpen(false);
      form.resetFields();
      fetchData();
    } catch (error: any) {
      message.error(error.response?.data?.message);
      const errorList = error?.response?.data?.errors || {};
      form.setFields(
        Object.keys(values).map((field) => ({ name: field, errors: [] })),
      );
      const validationErrors = Object.entries(errorList).map(
        ([fieldName, messages]) => ({
          name: fieldName,
          errors: messages as string[],
        }),
      );
      form.setFields(validationErrors);
    } finally {
      setSubmitLoading(false);
    }
  };

  const handleUpdate = async (values: any) => {
    try {
      setEditLoading(true);
      const res = await jwtAxios.put(API.EMPLOYEE.UPDATE(editingId!), values);
      message.success(res.data.message);
      setEditOpen(false);
      fetchData();
    } catch (error: any) {
      message.error(error.response?.data?.message);
      const errorList = error?.response?.data?.errors || {};
      editForm.setFields(
        Object.keys(values).map((field) => ({
          name: field,
          errors: [],
        })),
      );
      const validationErrors = Object.entries(errorList).map(
        ([fieldName, messages]) => ({
          name: fieldName,
          errors: messages as string[],
        }),
      );
      editForm.setFields(validationErrors);
    } finally {
      setEditLoading(false);
    }
  };

  return (
    <Card>
      <Flex justify="space-between" align="center" className="mb-5!">
        <Title level={4}>Employees</Title>
        <Space>
          <Button icon={<ReloadOutlined />} onClick={() => fetchData()}>
            Reload
          </Button>
          <Button
            type="primary"
            icon={<PlusOutlined />}
            onClick={() => {
              setOpen(true);
            }}
          >
            Add
          </Button>
        </Space>
      </Flex>

      <Table
        size="small"
        rowKey="id"
        loading={loading}
        columns={columns}
        dataSource={employees}
        scroll={{ x: 1000, y: 500 }}
        pagination={{
          current: page,
          pageSize: perPage,
          total,
          showSizeChanger: true,
          showTotal: (total) => `Total ${total}`,
          onChange: (newPage, newPageSize) => {
            setPage(newPage);
            setPerPage(newPageSize);
          },
        }}
      />

      <Modal
        title="Employee Details"
        loading={viewLoading}
        open={viewModalOpen}
        onCancel={() => setViewModalOpen(false)}
        destroyOnHidden
        footer={null}
        width={700}
      >
        <Descriptions bordered column={1}>
          <Descriptions.Item label="ID">{viewEmployee?.id}</Descriptions.Item>

          <Descriptions.Item label="Username">
            {viewEmployee?.username}
          </Descriptions.Item>

          <Descriptions.Item label="Email">
            {viewEmployee?.email}
          </Descriptions.Item>

          <Descriptions.Item label="Phone">
            {viewEmployee?.phoneNumber}
          </Descriptions.Item>

          <Descriptions.Item label="Age">{viewEmployee?.age}</Descriptions.Item>

          <Descriptions.Item label="Role">
            {viewEmployee?.role?.name}
          </Descriptions.Item>
        </Descriptions>
      </Modal>

      <Modal
        title="Add Employee"
        open={open}
        onCancel={() => {
          form.resetFields();
          setOpen(false);
        }}
        confirmLoading={submitLoading}
        width={700}
        destroyOnHidden
        footer={[
          <Button
            key="cancel"
            onClick={() => {
              form.resetFields();
              setOpen(false);
            }}
          >
            Cancel
          </Button>,
          <Button
            key="save"
            type="primary"
            loading={submitLoading}
            onClick={() => form.submit()}
          >
            Save
          </Button>,
        ]}
      >
        <Form form={form} layout="vertical" onFinish={handleSubmit}>
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item label="Username" name="username">
                <Input placeholder="Enter" />
              </Form.Item>
            </Col>

            <Col span={12}>
              <Form.Item label="Email" name="email">
                <Input placeholder="Enter" className="w-full!" />
              </Form.Item>
            </Col>

            <Col span={12}>
              <Form.Item label="Phone Number" name="phone_number">
                <Input placeholder="Enter" className="w-full!" />
              </Form.Item>
            </Col>

            <Col span={12}>
              <Form.Item label="Age" name="age">
                <InputNumber placeholder="Enter" className="w-full!" min={18} />
              </Form.Item>
            </Col>

            <Col span={12}>
              <Form.Item label="Role" name="role_id">
                <Select
                  allowClear
                  placeholder="Select"
                  className="w-full!"
                  options={option1}
                  showSearch={{
                    optionFilterProp: ["label"],
                  }}
                />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item label="Password" name="password">
                <Input.Password placeholder="Enter" />
              </Form.Item>
            </Col>
          </Row>
        </Form>
      </Modal>

      <Modal
        title="Edit Employee"
        open={editOpen}
        afterOpenChange={(opened) => {
          if (opened && editEmployee) {
            editForm.setFieldsValue({
              username: editEmployee.username,
              email: editEmployee.email,
              phone_number: editEmployee.phoneNumber,
              age: editEmployee.age,
              role_id: editEmployee.role.id,
            });
          }
        }}
        onCancel={() => {
          editForm.resetFields();
          setEditOpen(false);
        }}
        width={700}
        footer={[
          <Button
            key="cancel"
            onClick={() => {
              editForm.resetFields();
              setEditOpen(false);
            }}
          >
            Cancel
          </Button>,
          <Button
            key="save"
            type="primary"
            loading={editLoading}
            onClick={() => editForm.submit()}
          >
            Update
          </Button>,
        ]}
      >
        <Form form={editForm} layout="vertical" onFinish={handleUpdate}>
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item label="Username" name="username">
                <Input placeholder="Enter" />
              </Form.Item>
            </Col>

            <Col span={12}>
              <Form.Item label="Email" name="email">
                <Input placeholder="Enter" />
              </Form.Item>
            </Col>

            <Col span={12}>
              <Form.Item label="Phone Number" name="phone_number">
                <Input placeholder="Enter" />
              </Form.Item>
            </Col>

            <Col span={12}>
              <Form.Item label="Age" name="age">
                <InputNumber placeholder="Enter" className="w-full!" min={18} />
              </Form.Item>
            </Col>

            <Col span={12}>
              <Form.Item label="Role" name="role_id">
                <Select
                  allowClear
                  placeholder="Select"
                  options={option1}
                  className="w-full!"
                  showSearch={{
                    optionFilterProp: "label",
                  }}
                />
              </Form.Item>
            </Col>
          </Row>
        </Form>
      </Modal>
    </Card>
  );
}
