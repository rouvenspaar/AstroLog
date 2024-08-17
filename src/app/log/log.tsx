'use client';

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Tab } from '@/components/ui/custom/tab';
import styles from './log.module.scss';
import { SessionTable } from '@/components/sessionTable/sessionTable';
import { columns } from '@/components/sessionTable/columns';
import { useAppState } from '@/context/stateProvider';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { DropdownMenu, DropdownMenuContent, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { ChevronDown } from 'lucide-react';

export default function Log() {
  const { appState } = useAppState();

  return (
    <Tab className={styles.page}>
      <Card>
        <CardHeader>
          <CardTitle>Astrophotography Log</CardTitle>
          <CardDescription>
            Add imaging sessions and view your astrophotography log.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Button variant="secondary">Add Imaging Session</Button>
        </CardContent>
      </Card>
      <div className={styles.content}>
        <Card className={styles.tableCard}>
          <CardHeader>
            <div className={styles.tableHeader}>
              <Input className={styles.searchField} placeholder='Search...' />
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" className="ml-auto">
                    Columns <ChevronDown className="ml-2 h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">

                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </CardHeader>
          <CardContent className={styles.tableContent}>
            <SessionTable columns={columns} data={appState.log_data} />
          </CardContent>
        </Card>
        <Card className={styles.imagePreviewCard}>
          <CardHeader>
            <CardTitle>Image Preview</CardTitle>
            <CardDescription>Card Description</CardDescription>
          </CardHeader>
          <CardContent>
            <div className={styles.imagePreview}></div>
          </CardContent>
        </Card>
      </div>
    </Tab>
  );
}
