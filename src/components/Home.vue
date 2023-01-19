<script lang="ts" setup>
import { ref, Ref, toRaw } from 'nativescript-vue';
import {
  isAndroid,
  ListView as NSListView,
  Screen,
  ScrollView as NSScrollView,
  View,
} from '@nativescript/core';
import { ScrollEventData } from '@nativescript/core/ui/scroll-view';
import { LoremIpsum } from 'lorem-ipsum';
import { NativeRef, Status } from '../types.ts';
const lorem = new LoremIpsum({
  sentencesPerParagraph: {
    max: 6,
    min: 4,
  },
  wordsPerSentence: {
    max: 16,
    min: 4,
  },
});

const percentage = ref(0);
const currentStatus = ref(Status.Top);
const refViewWrap = ref();
const refViewTopStatus = ref();
const refViewScrollStatus = ref();
const refViewBottomStatus = ref();
const items = ref(
  Array(30)
    .fill(0)
    .map((_, index) => ({
      title: lorem.generateWords(2),
      text: lorem.generateParagraphs(1),
    }))
);
const sizeStatus = 70;
let enablecrollStatusAnimation = true;
let scrollView: NSScrollView = null!;

const calculatePercentage = (partialValue: number, totalValue: number) =>
  Math.round((partialValue / totalValue) * 100);

const goTop = () => {
  enablecrollStatusAnimation = false;
  scrollView.scrollToVerticalOffset(0, true);
  setTimeout(() => {
    enablecrollStatusAnimation = true;
  }, 300);
};

const show = (view: NativeRef) =>
  toRaw(view.value.nativeView).animate({
    opacity: 1,
    duration: 250,
  });

const hide = (view: NativeRef) =>
  toRaw(view.value.nativeView).animate({
    opacity: 0,
    duration: 100,
  });

const animateWidth = (view: NativeRef, size: number) =>
  toRaw(view.value.nativeView).animate({
    width: size,
    duration: 250,
  });

const applyAnimation = (
  showView: NativeRef[],
  hideViews: NativeRef[],
  size: number
) => {
  show(showView);
  hideViews.forEach((hideView) => hide(hideView));
  animateWidth(refViewWrap, size);
};

function listViewLoaded(args: { object: NSScrollView }) {
  scrollView = args.object;

  scrollView.on('scroll', (event: ScrollEventData) => {
    percentage.value = calculatePercentage(
      event.scrollY,
      scrollView.scrollableHeight
    );

    if (percentage.value === 0) {
      if (currentStatus.value !== Status.Top) {
        applyAnimation(
          refViewTopStatus,
          [refViewScrollStatus, refViewBottomStatus],
          sizeStatus
        );
      }
      currentStatus.value = Status.Top;
    } else if (percentage.value > 0 && percentage.value < 100) {
      if (enablecrollStatusAnimation) {
        if (currentStatus.value !== Status.Scroll) {
          applyAnimation(
            refViewScrollStatus,
            [refViewTopStatus, refViewBottomStatus],
            200
          );
        }
      }
      currentStatus.value = Status.Scroll;
    } else if (percentage.value === 100) {
      if (currentStatus.value !== Status.Bottom) {
        applyAnimation(refViewBottomStatus, [refViewScrollStatus], sizeStatus);
      }
      currentStatus.value = Status.Bottom;
    }
  });
}
</script>

<template>
  <Frame>
    <Page
      actionBarHidden="true"
      androidStatusBarBackground="#121113"
      class="bg-[#121113]"
    >
      <ActionBar>
        <Label text="Home" class="font-bold text-lg" />
      </ActionBar>

      <GridLayout rows="*">
        <ScrollView @loaded="listViewLoaded" height="100%">
          <StackLayout class="px-4" paddingBottom="120">
            <StackLayout v-for="(item, index) in items" :key="index">
              <Label
                :text="item.title"
                class="text-2xl mt-6 text-white capitalize"
              />
              <Label
                textWrap="true"
                :text="item.text"
                class="pt-1 text-gray-400"
              />
            </StackLayout>
          </StackLayout>
        </ScrollView>
        <GridLayout
          verticalAlignment="bottom"
          class="mb-10 items-center justify-center"
        >
          <GridLayout
            ref="refViewWrap"
            class="
              bg-[#282729]
              rounded-full
              items-center
              justify-center
              h-[70]
              w-[70]
              border-4 border-[#1F1E1F]
            "
          >
            <Label
              ref="refViewTopStatus"
              class="text text-white"
              text="15 mins"
              verticalAlignment="center"
              horizontalAlignment="center"
            ></Label>
            <FlexboxLayout
              ref="refViewScrollStatus"
              class="justify-center items-center"
              opacity="0"
            >
              <Label
                class="text-center text-white"
                :text="`${percentage}%`"
                verticalAlignment="center"
                horizontalAlignment="center"
              ></Label>
              <Progress
                class="w-[60%] ml-2"
                color="white"
                :value="percentage"
                maxValue="100"
              />
            </FlexboxLayout>
            <Label
              ref="refViewBottomStatus"
              class="text-white m-icon-round"
              opacity="0"
              text="arrow_upward"
              verticalAlignment="center"
              horizontalAlignment="center"
              @tap="goTop"
            ></Label>
          </GridLayout>
        </GridLayout>
      </GridLayout>
    </Page>
  </Frame>
</template>

<style>
.x {
  background-color: #4c5567;
}
</style>
