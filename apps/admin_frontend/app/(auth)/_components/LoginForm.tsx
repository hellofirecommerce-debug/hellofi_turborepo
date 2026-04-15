"use client";

import { Button, Input, Label } from "@repo/ui";
import { EyeOpenIcon, EyeClosedIcon } from "@radix-ui/react-icons";
import React, { useState } from "react";
import { useMutation } from "@apollo/client/react";
import { ADMIN_LOGIN } from "../../../lib/graphql/mutations/auth.mutations";
import { useRedirectIfLoggedIn } from "../../../lib/hooks/useAdminAuth";
import { AdminLoginInput } from "@repo/validations";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { useNavigate } from "../../../lib/hooks/useNavigate";

interface AdminLoginResponse {
  adminUserLogin: {
    success: boolean;
    message: string;
    sessionId: string;
    user: {
      id: string;
      fName: string;
      lName: string;
      email: string;
      userType: string;
      status: string;
    };
  };
}

export default function LoginForm() {
  const router = useRouter();
  const { navigate } = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState<AdminLoginInput>({
    email: "",
    password: "",
  });

  useRedirectIfLoggedIn(); // ← replaces useQuery + useEffect

  const [adminLogin, { loading }] =
    useMutation<AdminLoginResponse>(ADMIN_LOGIN);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { id, value } = e.target;
    setFormData((prev) => ({ ...prev, [id]: value }));
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const { data } = await adminLogin({
      variables: { payload: formData },
    });
    if (data?.adminUserLogin?.success) {
      toast.success("Login successful");
      navigate("/home");
    }
  };

  const isDisabled = !formData.email || !formData.password || loading;

  return (
    <div className="flex flex-col items-center justify-center flex-1 lg:w-1/2 w-full px-6 py-10 sm:px-12">
      <div className="flex flex-col justify-center flex-1 w-full max-w-md mx-auto">
        <div>
          <div className="mb-8">
            <h1 className="mb-2 font-semibold text-gray-800 text-2xl sm:text-3xl">
              Sign In
            </h1>
            <p className="text-sm text-gray-500">
              Enter your email and password to sign in!
            </p>
          </div>

          <form onSubmit={handleSubmit}>
            <div className="space-y-5">
              <div>
                <Label htmlFor="email">
                  Email <span className="text-red-500">*</span>
                </Label>
                <Input
                  inputSize="md"
                  id="email"
                  placeholder="info@gmail.com"
                  type="email"
                  value={formData.email}
                  onChange={handleChange}
                  className="w-full mt-1"
                />
              </div>

              <div>
                <Label htmlFor="password">
                  Password <span className="text-red-500">*</span>
                </Label>
                <div className="relative mt-1">
                  <Input
                    inputSize="md"
                    id="password"
                    type={showPassword ? "text" : "password"}
                    placeholder="Enter your password"
                    value={formData.password}
                    onChange={handleChange}
                    className="w-full"
                  />
                  <span
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute z-30 -translate-y-1/2 cursor-pointer right-4 top-1/2 text-gray-500"
                  >
                    {showPassword ? (
                      <EyeOpenIcon className="w-4 h-4" />
                    ) : (
                      <EyeClosedIcon className="w-4 h-4" />
                    )}
                  </span>
                </div>
              </div>

              <Button
                className="w-full mt-2"
                size="md"
                type="submit"
                disabled={isDisabled}
              >
                {loading ? "Signing in..." : "Sign in"}
              </Button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
