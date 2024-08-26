'use client';

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Tab } from '@/components/ui/custom/tab';
import styles from './gallery.module.scss';
import ImageView from '@/components/imageView';
import { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import NewImage from '@/components/modals/newImage/newImage';
import { open } from '@tauri-apps/api/dialog';
import { toast } from '@/components/ui/use-toast';
import { useAppState } from '@/context/stateProvider';

export default function Gallery() {
  const { appState } = useAppState();

  const [windowWidth, setWindowWidth] = useState<number>(2560);
  const [columns, setColumns] = useState<number>(3);
  const [modalOpen, setModalOpen] = useState<boolean>(false);
  const [newImagePath, setNewImagePath] = useState<string>('');

  const dialogFilters = [{
    name: '.png',
    extensions: ['png']
  },
  {
    name: '.jpeg',
    extensions: ['jpeg']
  }]

  function addNewImage() {
    open({
      multiple: false,
      filters: dialogFilters
    })
      .then((selectedPath) => {
        if (selectedPath) {
          setNewImagePath(selectedPath as string);
          console.log(newImagePath)
          toggleModal();
        }
      })
      .catch((err) => {
        toast({
          variant: 'destructive',
          description: 'Failed to open Image: ' + err,
        });
        console.log(err);
      });
  }

  function toggleModal() {
    setModalOpen(!modalOpen);
  }

  useEffect(() => {
    // Function to update the state with the current window width
    const handleResize = () => {
      setWindowWidth(window.innerWidth);
    };

    // Add event listener to update window width on resize
    window.addEventListener('resize', handleResize);

    // Call the function to set the initial window width
    handleResize();

    // Clean up the event listener on component unmount
    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  useEffect(() => {
    setColumns(Math.round(windowWidth / 600));
  }, [windowWidth]);

  return (
    <Tab>
      <Card className={styles.card}>
        <CardHeader>
          <CardTitle>Gallery</CardTitle>
          <CardDescription>View your processed astrophotos.</CardDescription>
        </CardHeader>
        <CardContent>
          <Button variant="secondary" onClick={addNewImage}>
            Add Image
          </Button>
        </CardContent>
      </Card>
      <div
        className={styles.content}
        style={{
          display: 'grid',
          gridTemplateColumns: `repeat(${columns}, 1fr)`,
          gap: 'var(--padding)',
        }}
      >
        {appState.image_list.map((image, index) => (
          <ImageView
            key={index}
            className={styles.imageView}
            title={image.title}
          />
        ))}
      </div>
      {modalOpen && <NewImage defaultValue={newImagePath} onClose={toggleModal} dialogFilters={dialogFilters} />}
    </Tab>
  );
}