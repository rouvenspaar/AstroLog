import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import React from 'react';
import { Input } from '@/components/ui/input';
import { z } from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';

const formSchema = z.object({
  target: z.string().min(2, {
    message: 'Username must be at least 2 characters.' // change
  })
});


export default function NewImagingSessionGeneral() {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      target: ""
    }
  });

  function onSubmit() {

  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)}>
        <FormField
          control={form.control}
          name="target"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Root Directory</FormLabel>
              <FormControl>
                <Input />
              </FormControl>
              <FormDescription>
                The directory in your filesystem where all of your astrophotos
                are stored. For a better user experience, this data should be
                available fast (e.g. on your computer).
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
      </form>
    </Form>
  );
}