'use client';

import { Session } from '@/context/stateProvider';
import { ColumnDef } from '@tanstack/react-table';
import { Button } from '../ui/button';
import { ArrowUpDown } from 'lucide-react';

export const columns: ColumnDef<Session>[] = [
  {
    accessorKey: 'date',
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Date
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      )
    },
  },
  {
    accessorKey: 'target',
    header: 'Target',
  },
  {
    accessorKey: 'sub_length',
    header: 'Sub Length',
  },
  {
    accessorKey: 'total_subs',
    header: 'Total Subs',
  },
  {
    accessorKey: 'integrated_subs',
    header: 'Integrated Subs',
  },
  {
    accessorKey: 'filter',
    header: 'Filter',
  },
  {
    accessorKey: 'gain',
    header: 'Gain',
  },
  {
    accessorKey: 'offset',
    header: 'Offset',
  },
  {
    accessorKey: 'camera_temp',
    header: 'Camera Temp',
  },
  {
    accessorKey: 'outside_temp',
    header: 'Outside Temp',
  },
  {
    accessorKey: 'average_seeing',
    header: 'Average Seeing',
  },
  {
    accessorKey: 'average_cloud_cover',
    header: 'Average Cloud Cover',
  },
  {
    accessorKey: 'average_moon',
    header: 'Average Moon',
  },
  {
    accessorKey: 'telescope',
    header: 'Telescope',
  },
  {
    accessorKey: 'flattener',
    header: 'Flattener',
  },
  {
    accessorKey: 'mount',
    header: 'Mount',
  },
  {
    accessorKey: 'camera',
    header: 'Camera',
  },
  {
    accessorKey: 'notes',
    header: 'Notes',
  },
];
