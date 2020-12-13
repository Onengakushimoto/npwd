import React, { useState } from 'react';
import { AppWrapper } from '../../../ui/components';
import { AppTitle } from '../../../ui/components/AppTitle';
import { AppContent } from '../../../ui/components/AppContent';
import {
  useContextMenu,
  MapStringOptions,
} from '../../../ui/hooks/useContextMenu';
import { useConfig } from '../../../config/hooks/useConfig';
import { useSettings } from '../hooks/useSettings';
import { List } from '../../../ui/components/List';
import { useSimcard } from '../../../os/simcard/hooks/useSimcard';
import { useApp } from '../../../os/apps/hooks/useApps';
import { SettingItem } from './SettingItem';

import {
  Brush,
  Wallpaper,
  Phone,
  Smartphone,
  ZoomIn,
  LibraryMusic,
  VolumeUp,
} from '@material-ui/icons';

import { ListSubheader } from '@material-ui/core';
import useLocalStorage from '../../../os/phone/hooks/useLocalStorage';

const SubHeaderComp = (props: { text: string }) => (
  <ListSubheader component='div' disableSticky>
    {props.text}
  </ListSubheader>
);

export const SettingsApp = () => {
  const settingsApp = useApp('SETTINGS');
  const [config] = useConfig();
  const { setSettings, settings } = useSettings();
  const [, setVal, getStorageItem] = useLocalStorage();
  const simcard = useSimcard();

  const wallpapers = config.wallpapers.map(
    MapStringOptions(getStorageItem('wallpaper'), (val: string) =>
      setVal('wallpaper', val)
    )
  );
  const frames = config.frames.map(
    MapStringOptions(getStorageItem('frame'), (val: string) =>
      setVal('frame', val)
    )
  );
  const themes = Object.keys(config.themes).map(
    MapStringOptions(getStorageItem('theme'), (val: string) =>
      setVal('theme', val)
    )
  );
  const zoomOptions = config.zoomOptions.map(
    MapStringOptions(getStorageItem('zoom'), (val: string) =>
      setVal('zoom', val)
    )
  );
  // Doesn't actually do anything for the time being
  const ringtones = config.ringtones.map(
    MapStringOptions(getStorageItem('ringtone'), (val: string) =>
      setVal('ringtone', val)
    )
  );
  // * Probably gonna make this a slider component in the future
  // const ringtoneVols = config.ringtoneVols.map(
  //   MapStringOptions(settings.ringtoneVol, (val: number) => setSettings('ringtoneVol', val))
  // )

  // TODO: These new settings all work

  const [openMenu, closeMenu, ContextMenu, isMenuOpen] = useContextMenu();
  return (
    <AppWrapper>
      <AppTitle app={settingsApp} />
      <AppContent backdrop={isMenuOpen} onClickBackdrop={closeMenu}>
        <List disablePadding subheader={<SubHeaderComp text='Phone' />}>
          <SettingItem
            label='Phone Number'
            value={simcard.number}
            icon={<Phone />}
          />
          <SettingItem
            label='Ringtone'
            value={getStorageItem('ringtone')}
            options={ringtones}
            onClick={openMenu}
            icon={<LibraryMusic />}
          />
          {
            // * NOTE: This component is most likely temporary
            // * Probably want to make it a slider in the future. Ignore hardcoded for the meantime
          }
          <SettingItem
            label='Ringtone Volume'
            value='100%'
            options={['100%', '80%', '70%']}
            onClick={openMenu}
            icon={<VolumeUp />}
          />
        </List>
        <List disablePadding subheader={<SubHeaderComp text='Appearance' />}>
          <SettingItem
            label='Theme'
            value={getStorageItem('theme')}
            options={themes}
            onClick={openMenu}
            icon={<Brush />}
          />
          <SettingItem
            label='Wallpaper'
            value={getStorageItem('wallpaper')}
            options={wallpapers}
            onClick={openMenu}
            icon={<Wallpaper />}
          />
          <SettingItem
            label='Frame'
            value={getStorageItem('frame')}
            options={frames}
            onClick={openMenu}
            icon={<Smartphone />}
          />
          <SettingItem
            label='Zoom'
            value={getStorageItem('zoom')}
            options={zoomOptions}
            onClick={openMenu}
            icon={<ZoomIn />}
          />
        </List>
      </AppContent>
      <ContextMenu />
    </AppWrapper>
  );
};
