import { Outlet, Navigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { axiosInstance } from "~/lib/utls";
// import { User } from "@/types";

interface ProtectedRouteProps {
  children?: React.ReactNode;
  redirectPath: string;
}

const ProtectedRoute = ({
  redirectPath = "/login",
  children,
}: ProtectedRouteProps) => {
  const { isPending, isError } = useQuery({
    queryKey: ["isAuth"],
    queryFn: async () => {
      return (await axiosInstance.post("/auth/is-auth")).data;
    },
    retry: false,
    staleTime: 1000 * 60 * 60,
  });

  if (isPending) {
    return <span>Loading...</span>;
  }

  if (isError) {
    return <Navigate to={redirectPath} replace={true} />;
  }

  return <>{children ? children : <Outlet />}</>;
};

export default ProtectedRoute;
