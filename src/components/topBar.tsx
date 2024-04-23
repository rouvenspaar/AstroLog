import styles from './topBar.module.scss';
import { ThemeToggle } from './ui/custom/themeToggle';
import {
  Menubar,
  MenubarContent,
  MenubarItem,
  MenubarMenu,
  MenubarSeparator,
  MenubarShortcut,
  MenubarSub,
  MenubarSubContent,
  MenubarSubTrigger,
  MenubarTrigger,
} from '@/components/ui/menubar';

export function TopBar() {
  return (
    <div className={styles.topBar}>
      <Menubar>
        <MenubarMenu>
          <MenubarTrigger>App</MenubarTrigger>
          <MenubarContent>
            <MenubarItem>Preferences</MenubarItem>
            <MenubarSeparator />
            <MenubarItem>Exit</MenubarItem>
          </MenubarContent>
        </MenubarMenu>
        <MenubarMenu>
          <MenubarTrigger>Imaging Session</MenubarTrigger>
          <MenubarContent>
            <MenubarItem>Create New</MenubarItem>
          </MenubarContent>
        </MenubarMenu>
        <MenubarMenu>
          <MenubarTrigger>Equipment</MenubarTrigger>
          <MenubarContent>
            <MenubarSub>
              <MenubarSubTrigger>Create New</MenubarSubTrigger>
              <MenubarSubContent>
                <MenubarItem>Telescope</MenubarItem>
                <MenubarItem>Camera</MenubarItem>
                <MenubarItem>Mount</MenubarItem>
                <MenubarItem>Filter</MenubarItem>
                <MenubarItem>Flattener</MenubarItem>
              </MenubarSubContent>
            </MenubarSub>
          </MenubarContent>
        </MenubarMenu>
        <MenubarMenu>
          <MenubarTrigger>Calibration</MenubarTrigger>
          <MenubarContent>
            <MenubarSub>
              <MenubarSubTrigger>Create New</MenubarSubTrigger>
              <MenubarSubContent>
                <MenubarItem>Dark Frame</MenubarItem>
                <MenubarItem>Bias Frame</MenubarItem>
              </MenubarSubContent>
            </MenubarSub>
          </MenubarContent>
        </MenubarMenu>
        <MenubarMenu>
          <MenubarTrigger>Help</MenubarTrigger>
          <MenubarContent>
            <MenubarItem>Community Forum</MenubarItem>
            <MenubarSeparator />
            <MenubarItem>Feedback</MenubarItem>
          </MenubarContent>
        </MenubarMenu>
      </Menubar>
      <ThemeToggle></ThemeToggle>
    </div>
  );
}
