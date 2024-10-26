import vectory from "@/assets/images/victory.svg";
import background from "@/assets/images/login.png";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "../../components/ui/tabs";
import { useCallback, useState } from "react";
import { Input } from "../../components/ui/input";
import { Button } from "../../components/ui/button";
import { toast } from "sonner";
import { apiClient } from "../../lib/api-client";
import { LOGIN_ROUTES, SIGNUP_ROUTES } from "../../utlis/constant";
import { useNavigate } from "react-router-dom";
import { useUserInfoStore } from "../../store";

export const Auth = () => {
  const navigate = useNavigate();
  const { setUserInfo } = useUserInfoStore();
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [confirmPassword, setConfirmPassword] = useState<string>("");

  const validateSignup = useCallback(() => {
    if (!email.length) {
      toast.error("Email is required");
      return false;
    }
    if (!password.length) {
      toast.error("Password is required");
      return false;
    }
    if (!confirmPassword.length) {
      toast.error("Confirm Password is required");
      return false;
    }
    if (password !== confirmPassword) {
      toast.error("Confirm-Password  and Password  must be same");
      return false;
    }
    return true;
  }, [confirmPassword, email.length, password]);

  const validateLogin = useCallback(() => {
    if (!email.length) {
      toast.error("Email is required");
      return false;
    }
    if (!password.length) {
      toast.error("Password is required");
      return false;
    }
    return true;
  }, [email.length, password.length]);

  const handleLogin = useCallback(async () => {
    if (!validateLogin()) return;
    try {
      const response = await apiClient.post(
        LOGIN_ROUTES,
        {
          email,
          password,
        },
        {
          withCredentials: true,
        }
      );
      if (response.data.user.id) {
        setUserInfo(response.data.user);
        if (response.data.user.profileSetup) navigate("/chat");
        else navigate("/profile");
      }
    } catch (error) {
      console.log(error);
    }
  }, [email, navigate, password, setUserInfo, validateLogin]);

  const handleSignup = useCallback(async () => {
    if (!validateSignup()) return;
    try {
      const response = await apiClient.post(
        SIGNUP_ROUTES,
        {
          email,
          password,
        },
        {
          withCredentials: true,
        }
      );
      console.log({ response });
      setUserInfo(response.data.user);
      navigate("/profile");
    } catch (error) {
      console.log(error);
    }
  }, [email, navigate, password, setUserInfo, validateSignup]);

  return (
    <div className="h-screen w-screen flex items-center justify-center">
      <div className="h-[80vh] bg-white border-2 px-8 border-white text-opacity-90 shadow-2xl w-[80vw] md:w-[90vw] lg:w-[70vw] xl:w-[60vw] rounded-2xl grid xl:grid-cols-2 ">
        <div className="flex flex-col gap-10 items-center justify-center ">
          <div className="flex items-center justify-center flex-col">
            <div className="flex items-center justify-center">
              <h1 className="text-5xl font-bold md:text-6xl ">Welcome</h1>
              <img src={vectory} alt="vectory" className="h-[100px]" />
            </div>
            <p className="font-medium text-center ">
              Fill in the details to get start with the best Chat App!
            </p>
          </div>
          <div className="flex items-center justify-center w-full ">
            <Tabs defaultValue="login" className="w-3/4">
              <TabsList className="bg-transparent rounded-none w-full">
                <TabsTrigger
                  value="login"
                  className="data-[state=active]:bg-transparent text-black text-opacity-90 border-b-2 rounded-none w-full data-[state=active]:text-black data-[state=active]:font-semibold data-[state=active]:border-b-purple-500 p-3 transition-all duration-300"
                >
                  Login
                </TabsTrigger>
                <TabsTrigger
                  value="signup"
                  className="data-[state=active]:bg-transparent text-black text-opacity-90 border-b-2 rounded-none w-full data-[state=active]:text-black data-[state=active]:font-semibold data-[state=active]:border-b-purple-500 p-3 transition-all duration-300"
                >
                  SignUp
                </TabsTrigger>
              </TabsList>
              <TabsContent value="login" className="flex flex-col gap-6 mt-10">
                <Input
                  placeholder="Email..."
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="rounded-full p-6 "
                />
                <Input
                  placeholder="Password..."
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="rounded-full p-6 "
                />
                <Button className="rounded-full p-6" onClick={handleLogin}>
                  Login
                </Button>
              </TabsContent>
              <TabsContent value="signup" className="flex flex-col gap-5 ">
                <Input
                  placeholder="Email..."
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="rounded-full p-6 "
                />
                <Input
                  placeholder="Password..."
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="rounded-full p-6 "
                />
                <Input
                  placeholder="Confirm Password..."
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="rounded-full p-6 "
                />
                <Button className="rounded-full p-6" onClick={handleSignup}>
                  SignUp
                </Button>
              </TabsContent>
            </Tabs>
          </div>
        </div>
        <div className="hidden xl:flex justify-center items-center ">
          <img src={background} alt="background" className="h-[600px]" />
        </div>
      </div>
    </div>
  );
};
