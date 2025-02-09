"use client";

import { useState } from "react";
import { useDisclosure } from "@mantine/hooks";
import {
  AppShell,
  Burger,
  Group,
  Text,
  UnstyledButton,
  Avatar,
  Menu,
  NavLink,
  Title,
  Divider,
} from "@mantine/core";
import {
  IconBook2,
  IconUsers,
  IconLayoutDashboard,
  IconUserCircle,
  IconMicrophone,
  IconCategory,
  IconBoxMultiple,
  IconHeartFilled,
  IconBookmark,
  IconChevronDown,
  IconLogout,
  IconSettings,
} from "@tabler/icons-react";
import { useRouter, usePathname } from "next/navigation";

export function AdminLayout({ children }: { children: React.ReactNode }) {
  const [mobileOpened, { toggle: toggleMobile }] = useDisclosure();
  const [desktopOpened, { toggle: toggleDesktop }] = useDisclosure(false);
  const router = useRouter();
  const pathname = usePathname();

  const mainNavItems = [
    { icon: IconLayoutDashboard, label: "Dashboard", href: "/admin" },
    { icon: IconBook2, label: "Audiobooks", href: "/admin/audiobooks" },
    { icon: IconUserCircle, label: "Authors", href: "/admin/authors" },
    { icon: IconMicrophone, label: "Narrators", href: "/admin/narrators" },
    { icon: IconCategory, label: "Categories", href: "/admin/categories" },
    { icon: IconBoxMultiple, label: "Collections", href: "/admin/collections" },
    { icon: IconUsers, label: "Users", href: "/admin/users" },
  ];

  const listNavItems = [
    { icon: IconHeartFilled, label: "Favorites", href: "/admin/favorites" },
    { icon: IconBookmark, label: "Wishlists", href: "/admin/wishlists" },
  ];

  return (
    <AppShell
      header={{ height: 60 }}
      navbar={{
        width: 300,
        breakpoint: "sm",
        collapsed: { mobile: !mobileOpened, desktop: !desktopOpened },
      }}
      padding="md"
    >
      <AppShell.Header>
        <Group h="100%" px="md" justify="space-between">
          <Group>
            <Burger
              opened={mobileOpened}
              onClick={toggleMobile}
              hiddenFrom="sm"
              size="sm"
            />
            <Burger
              opened={desktopOpened}
              onClick={toggleDesktop}
              visibleFrom="sm"
              size="sm"
            />
            <Title order={3}>Soundleaf Admin</Title>
          </Group>

          <Menu position="bottom-end" withArrow>
            <Menu.Target>
              <UnstyledButton>
                <Group>
                  <Avatar color="blue" radius="xl">
                    AD
                  </Avatar>
                  <div style={{ flex: 1 }}>
                    <Text size="sm" fw={500}>
                      Admin User
                    </Text>
                  </div>
                  <IconChevronDown size="1rem" />
                </Group>
              </UnstyledButton>
            </Menu.Target>

            <Menu.Dropdown>
              <Menu.Item leftSection={<IconSettings size="1rem" />}>
                Settings
              </Menu.Item>
              <Menu.Item leftSection={<IconLogout size="1rem" />} color="red">
                Logout
              </Menu.Item>
            </Menu.Dropdown>
          </Menu>
        </Group>
      </AppShell.Header>

      <AppShell.Navbar p="md">
        <Title order={4} mb="md">
          Main Navigation
        </Title>
        {mainNavItems.map((item) => (
          <NavLink
            key={item.href}
            leftSection={<item.icon size="1.2rem" />}
            label={item.label}
            active={pathname === item.href}
            onClick={() => router.push(item.href)}
            mb="xs"
          />
        ))}

        <Divider my="md" />

        <Title order={4} mb="md">
          User Lists
        </Title>
        {listNavItems.map((item) => (
          <NavLink
            key={item.href}
            leftSection={<item.icon size="1.2rem" />}
            label={item.label}
            active={pathname === item.href}
            onClick={() => router.push(item.href)}
            mb="xs"
          />
        ))}
      </AppShell.Navbar>

      <AppShell.Main
        styles={{
          main: {
            backgroundColor: "white",
          },
        }}
      >
        {children}
      </AppShell.Main>
    </AppShell>
  );
}
