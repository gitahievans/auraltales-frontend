"use client";

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
  IconArrowAutofitLeft,
  IconArrowBack,
} from "@tabler/icons-react";
import { useRouter, usePathname } from "next/navigation";
import Link from "next/link";
import { signOut } from "next-auth/react";

export function AuthorLayout({ children }: { children: React.ReactNode }) {
  const [mobileOpened, { toggle: toggleMobile }] = useDisclosure();
  const [desktopOpened, { toggle: toggleDesktop }] = useDisclosure(false);
  const router = useRouter();
  const pathname = usePathname();

  const mainNavItems = [
    { icon: IconLayoutDashboard, label: "Dashboard", href: "/author" },
    { icon: IconBook2, label: "Audiobooks", href: "/author/audiobooks" },
  ];

  const listNavItems = [
    { icon: IconHeartFilled, label: "Favorites", href: "/admin/favorites" },
    { icon: IconBookmark, label: "Wishlists", href: "/admin/wishlists" },
  ];

  const handleLogout = async () => {
    await signOut({
      callbackUrl: "/?logout=true",
      redirect: true,
    });
  };

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
            <div className="flex flex-col">
              <Title order={2}>AuralTales Author</Title>
              <Link href="/">
                <Group>
                  <IconArrowBack size="1rem" />
                  <Text size="xs" fw={300}>
                    Back to Main Website
                  </Text>
                </Group>
              </Link>
            </div>
          </Group>

          <Menu position="bottom-end" withArrow>
            <Menu.Target>
              <UnstyledButton>
                <Group>
                  <Avatar color="blue" radius="xl">
                    A
                  </Avatar>
                  <div style={{ flex: 1 }}>
                    <Text size="sm" fw={500}>
                      Author User
                    </Text>
                  </div>
                  <IconChevronDown size="1rem" />
                </Group>
              </UnstyledButton>
            </Menu.Target>

            <Menu.Dropdown>
              {/* <Menu.Item leftSection={<IconSettings size="1rem" />}>
                Settings
              </Menu.Item> */}
              <Menu.Item
                leftSection={<IconLogout size="1rem" />}
                color="red"
                onClick={handleLogout}
              >
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
