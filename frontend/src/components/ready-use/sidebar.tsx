import { useState } from "react";
import { Sidebar as SidebarComponent, Menu, MenuItem } from "react-pro-sidebar";
import { NavLink, useLocation } from "react-router-dom";
import {
  GripVertical,
  Home,
  LayoutDashboard,
  Power,
  UserRound,
  WalletCards,
  ArrowUpFromDot,
  ArrowDownToDot,
} from "lucide-react";
import { useMutation } from "@tanstack/react-query";

import { rgbToHex, axiosInstance } from "~/lib/utls";

interface SidebarProps {
  toggled: boolean;
  setToggled: (toggled: boolean) => void;
  setBroken: (broken: boolean) => void;
}

type NavLinksType = {
  link: string;
  icon?: React.ReactNode;
  label: string;
};

function Sidebar({ toggled, setToggled, setBroken }: SidebarProps) {
  const location = useLocation();
  const [collapsed, setCollapsed] = useState(false);
  // const [toggled, setToggled] = useState(false);

  const logoutMutation = useMutation({
    mutationKey: ["logout"],
    mutationFn: async () => {
      return (await axiosInstance.post("/auth/logout")).data;
    },
    onSuccess: () => {
      window.location.href = "/login"; //sekalian refresh
    },
  });

  const navlinks: NavLinksType[] = [
    {
      link: "/dashboard",
      label: "Dashboard",
      icon: <LayoutDashboard size={20} />,
    },
    {
      link: "/pengeluaran",
      label: "Pengeluaran",
      icon: <ArrowUpFromDot size={20} />,
    },
    {
      link: "/pemasukan",
      label: "Pemasukan",
      icon: <ArrowDownToDot size={20} />,
    },
    {
      link: "/rumah",
      label: "Rumah",
      icon: <Home size={20} />,
    },
    {
      link: "/penghuni",
      label: "Penghuni",
      icon: <UserRound size={20} />,
    },
    {
      link: "/jenis-iuran",
      label: "Jenis Iuran",
      icon: <WalletCards size={20} />,
    },
  ];

  return (
    <SidebarComponent
      backgroundColor="#1f2937"
      collapsed={collapsed}
      toggled={toggled}
      onBackdropClick={() => setToggled(false)}
      breakPoint="md"
      onBreakPoint={setBroken}
      rootStyles={{
        color: "#8A8C91",
      }}
    >
      <div className="p-6 bg-zinc-600 flex justify-between">
        <h1
          className={`font-bold text-xl text-nowrap text-stone-300 capitalize ${
            collapsed ? "hidden" : ""
          }`}
        >
          Admin
        </h1>
        <button type="button" onClick={() => setCollapsed(!collapsed)}>
          <GripVertical className="text-stone-400 hover:text-stone-300" />
        </button>
      </div>
      <Menu
        menuItemStyles={{
          button: {
            ":hover": {
              backgroundColor: "#1f2937",
              ["& > .ps-menu-icon, & > .ps-menu-label"]: {
                color: rgbToHex("214,211,209"),
              },
            },
            ["&.ps-active"]: {
              ["& > .ps-menu-icon, & > .ps-menu-label"]: {
                color: rgbToHex("214,211,209"),
              },
            },
          },
          label: {
            marginTop: "3px",
            opacity: collapsed ? 0 : 1,
          },
        }}
      >
        {navlinks.map((link) => (
          <MenuItem
            key={link.link}
            component={<NavLink to={link.link} />}
            icon={link.icon || <Home size={20} />}
            active={location.pathname === link.link}
          >
            {link.label}
          </MenuItem>
        ))}
        <MenuItem icon={<Power />} onClick={() => logoutMutation.mutate()}>
          Logout
        </MenuItem>
      </Menu>
    </SidebarComponent>
  );
}

export default Sidebar;
