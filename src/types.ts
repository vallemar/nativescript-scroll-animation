import { Ref } from 'nativescript-vue';
import { View } from '@nativescript/core';

export type NativeRef = Ref<{ nativeView: View }>;

export enum Status {
  Top,
  Scroll,
  Bottom,
}
