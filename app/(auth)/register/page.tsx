"use client";

import jwtAxios from "@/app/lib/jwtAxios";
import {
  Button,
  Card,
  Form,
  Input,
  InputNumber,
  message,
  Select,
  Spin,
} from "antd";
import Link from "next/link";
import { redirect } from "next/navigation";
import { useEffect, useState } from "react";

export default function RegisterPage() {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [option1, setOption1] = useState([]);

  // useEffect(() => {
  //   jwtAxios.get("/master").then((res) => {
  //     const { roles } = res.data;
  //     setOption1(
  //       (roles ?? []).map((option: any) => ({
  //         value: option.id,
  //         label: option.name,
  //       })),
  //     );
  //   });
  // }, []);

  const onFinish = async (values: any) => {
    setLoading(true);
    await jwtAxios
      .post("/auth/register", values)
      .then((res) => {
        message.success(res.data.message);
        form.resetFields();
        setTimeout(() => {
          redirect("/login");
        }, 1000);
      })
      .catch((error) => {
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
      })
      .finally(() => {
        setLoading(false);
      });
  };

  return (
    <Card
      title="Create Account"
      className="w-full max-w-md shadow-xl rounded-xl"
    >
      <Spin spinning={loading} description="Creating Account">
        <Form
          form={form}
          layout="vertical"
          onFinish={onFinish}
          autoComplete="off"
        >
          <Form.Item label="Username" name="username">
            <Input placeholder="Enter username" />
          </Form.Item>

          <Form.Item label="Email" name="email">
            <Input placeholder="Enter email" />
          </Form.Item>

          <Form.Item label="Phone Number" name="phone_number">
            <Input placeholder="Enter phone number" />
          </Form.Item>

          <Form.Item label="Age" name="age">
            <InputNumber className="w-full!" placeholder="Enter age" min={18} />
          </Form.Item>

          <Form.Item label="Password" name="password">
            <Input.Password placeholder="Enter password" />
          </Form.Item>

          <Form.Item
            label="Confirm Password"
            name="confirm_password"
            dependencies={["password"]}
          >
            <Input.Password placeholder="Confirm password" />
          </Form.Item>

          {/* <Form.Item name="role_id" label="Role">
            <Select
              allowClear
              placeholder="Select"
              options={option1}
              showSearch
              // filterOption={(input: any, option: any) =>
              //   option?.label?.toLowerCase()?.includes(input?.toLowerCase())
              // }
            />
          </Form.Item> */}

          <Button htmlType="submit" type="primary" block>
            Register
          </Button>

          <div className="text-center mt-5">
            Already have an account?{" "}
            <Link href="/login" className="text-blue-600">
              Login
            </Link>
          </div>
        </Form>
      </Spin>
    </Card>
  );
}
