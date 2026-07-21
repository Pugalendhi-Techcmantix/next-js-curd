"use client";

import { Button, Card, Form, Input } from "antd";
import Link from "next/link";

export default function LoginPage() {
  const [form] = Form.useForm();

  const onFinish = async (values: any) => {
    console.log(values);

    // Later

    // const res = await jwtAxios.post("/auth/login", values);

    // setToken(res.data.token);

    // router.push("/dashboard");
  };

  return (
    <Card
      title="Login"
      className="w-full max-w-md shadow-xl rounded-xl"
    >
      <Form
        form={form}
        layout="vertical"
        onFinish={onFinish}
        autoComplete="off"
      >
        <Form.Item
          label="Email"
          name="email"
          rules={[
            { required: true },
            { type: "email" },
          ]}
        >
          <Input placeholder="Enter email" />
        </Form.Item>

        <Form.Item
          label="Password"
          name="password"
          rules={[{ required: true }]}
        >
          <Input.Password placeholder="Enter password" />
        </Form.Item>

        <Button
          type="primary"
          htmlType="submit"
          block
        >
          Login
        </Button>

        <div className="text-center mt-5">
          Don't have an account?{" "}
          <Link href="/register" className="text-blue-600">
            Register
          </Link>
        </div>
      </Form>
    </Card>
  );
}