'use client';

import styles from './equipment.module.scss';
import { Modal } from '@/components/ui/custom/modal';
import { EquipmentType } from '@/enums/equipmentType';
import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage
} from '@/components/ui/form';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@/components/ui/select';
import { useForm } from 'react-hook-form';

import * as z from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { Input } from '@/components/ui/input';
import { EquipmentItem } from '@/interfaces/equipment';
import { v4 as uuidv4 } from 'uuid';
import { invoke } from '@tauri-apps/api/core';
import { Switch } from '@/components/ui/switch';
import { toast } from '@/components/ui/use-toast';
import { getViewName } from '@/utils/equipment';
import { useAppState } from '@/context/stateProvider';
import { useModal } from '@/context/modalProvider';

const baseEquipmentSchema = z.object({
  brand: z.string().min(1, 'Brand is required'),
  name: z.string().min(1, 'Name is required')
});

export const telescopeSchema = baseEquipmentSchema.extend({
  focal_length: z.number().positive('Focal length must be a positive number'),
  aperture: z.number().positive('Aperture must be a positive number')
});

export const cameraSchema = baseEquipmentSchema.extend({
  chip_size: z.string().min(1, 'Chip size is required'),
  mega_pixel: z.number().positive('Mega pixel must be a positive number'),
  rgb: z.boolean()
});

export const mountSchema = baseEquipmentSchema;

export const filterSchema = baseEquipmentSchema.extend({
  filter_type: z.string().min(1, 'Filter type is required')
});

export const flattenerSchema = baseEquipmentSchema.extend({
  factor: z.number().positive('Factor must be a positive number')
});

export const equipmentSchema = z.discriminatedUnion('type', [
  z.object({ type: z.literal(EquipmentType.TELESCOPE), ...telescopeSchema.shape }),
  z.object({ type: z.literal(EquipmentType.CAMERA), ...cameraSchema.shape }),
  z.object({ type: z.literal(EquipmentType.MOUNT), ...mountSchema.shape }),
  z.object({ type: z.literal(EquipmentType.FILTER), ...filterSchema.shape }),
  z.object({ type: z.literal(EquipmentType.FLATTENER), ...flattenerSchema.shape })
]);

export type EquipmentFormValues = z.infer<typeof equipmentSchema>

interface EquipmentProps {
  type: EquipmentType;
}

export default function EquipmentModal({ type }: EquipmentProps) {
  const { setAppState } = useAppState();
  const { closeModal } = useModal();

  const form = useForm<EquipmentFormValues>({
    resolver: zodResolver(equipmentSchema),
    defaultValues: {
      type: type,
      brand: '',
      name: '',
      rgb: false,
    }
  });

  const equipmentType = form.watch('type');

  function onSubmit(values: EquipmentFormValues) {
    const item: EquipmentItem = {
      id: uuidv4(),
      ...values
    } as EquipmentItem;

    invoke('check_equipment_duplicate', { viewName: getViewName(item) })
      .then(() => {
          switch (equipmentType) {
            case EquipmentType.TELESCOPE:
              invoke('save_telescope', { telescope: item })
                .then(() => {
                  setAppState(prevState => ({
                    ...prevState,
                    equipmentList: {
                      ...prevState.equipment_list,
                      telescope_list: [...prevState.equipment_list.telescope_list, item]
                    }
                  }));
                  toast({
                    description: 'Added Telescope successfully!',
                  });
                  closeModal();
                })
                .catch((error) => {
                  toast({
                    variant: 'destructive',
                    title: 'Uh oh! Something went wrong.',
                    description: 'Error: ' + error,
                  });
                });
              break;
            case EquipmentType.CAMERA:
              break;
            case EquipmentType.MOUNT:
              break;
            case EquipmentType.FILTER:
              break;
            case EquipmentType.FLATTENER:
              break;
          }
        }
      )
      .catch((error) => {
        toast({
          variant: 'destructive',
          title: 'Uh oh! Something went wrong.',
          description: 'Error: ' + error,
        });
      });
  }

  return (
    <Modal
      title={'Add ' + equipmentType}
      subtitle={"Enter the details of your new " + equipmentType + " here."}
      separator
      className={styles.modal}
    >
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          <FormField
            control={form.control}
            name="type"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Equipment Type</FormLabel>
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select equipment type" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {Object.values(EquipmentType).map((type) => (
                      <SelectItem key={type} value={type}>
                        {type}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="brand"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Brand</FormLabel>
                <FormControl>
                  <Input placeholder="Enter brand" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Name</FormLabel>
                <FormControl>
                  <Input placeholder="Enter name" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          {equipmentType === EquipmentType.TELESCOPE && (
            <>
              <FormField
                control={form.control}
                name="focal_length"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Focal Length (mm)</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        placeholder="Enter focal length"
                        {...field}
                        onChange={(e) => field.onChange(parseFloat(e.target.value))}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="aperture"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Aperture (mm)</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        placeholder="Enter aperture"
                        {...field}
                        onChange={(e) => field.onChange(parseFloat(e.target.value))}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </>
          )}
          {equipmentType === EquipmentType.CAMERA && (
            <>
              <FormField
                control={form.control}
                name="chip_size"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Chip Size</FormLabel>
                    <FormControl>
                      <Input placeholder="Enter chip size" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="mega_pixel"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Mega Pixels</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        placeholder="Enter mega pixels"
                        {...field}
                        onChange={(e) => field.onChange(parseFloat(e.target.value))}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="rgb"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                    <div className="space-y-0.5">
                      <FormLabel className="text-base">RGB</FormLabel>
                      <FormDescription>
                        Is this an RGB camera?
                      </FormDescription>
                    </div>
                    <FormControl>
                      <Switch
                        checked={field.value}
                        onCheckedChange={field.onChange}
                      />
                    </FormControl>
                  </FormItem>
                )}
              />
            </>
          )}
          {equipmentType === EquipmentType.FILTER && (
            <FormField
              control={form.control}
              name="filter_type"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Filter Type</FormLabel>
                  <FormControl>
                    <Input placeholder="Enter filter type" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          )}
          {equipmentType === EquipmentType.FLATTENER && (
            <FormField
              control={form.control}
              name="factor"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Factor</FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      placeholder="Enter factor"
                      {...field}
                      onChange={(e) => field.onChange(parseFloat(e.target.value))}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          )}
          <Button type="submit">Save Equipment</Button>
        </form>
      </Form>
    </Modal>
  );
}
