<script lang="ts" setup>
import {
  ref,
  computed,
  onMounted,
  onUnmounted,
  $navigateTo,
} from "nativescript-vue";
import {isAndroid, ListView as NSListView, Screen, ScrollView as NSScrollView, View} from "@nativescript/core";
import {ScrollEventData} from "@nativescript/core/ui/scroll-view";
import {toRaw} from "vue";

enum Status {
  Top,
  Scroll,
  Bottom
}

const percentage = ref(0);
const currentStatus = ref(Status.Top);
const refViewWrap = ref();
const refViewTopStatus = ref();
const refViewScrollStatus = ref();
const refViewBottomStatus = ref();
const heightStatus = 65;

const items = ref(
    Array(100)
        .fill(0)
        .map((_, index) => `Item ${index + 1}`)
);
const calculatePercentage = (partialValue: number, totalValue: number) => Math.round((partialValue / totalValue) * 100);

function listViewLoaded(args: { object: NSScrollView }) {
  const scrollView = args.object;


  scrollView.on("scroll", (event: ScrollEventData) => {

    percentage.value = calculatePercentage(event.scrollY, scrollView.scrollableHeight)
    const viewWrap: View = toRaw(refViewWrap.value.nativeView)
    const viewTopStatus: View = toRaw(refViewTopStatus.value.nativeView)
    const viewScrollStatus: View = toRaw(refViewScrollStatus.value.nativeView)
    const viewBottomStatus: View = toRaw(refViewBottomStatus.value.nativeView)

    if (percentage.value === 0) {
      if (currentStatus.value !== Status.Top) {
        viewScrollStatus.animate({
          opacity: 0,
          duration: 250
        })
        viewTopStatus.animate({
          opacity: 1,
          duration: 250
        })
        viewWrap.animate({
          width: heightStatus,
          height: heightStatus,
          duration: 250
        })
      }
      currentStatus.value = Status.Top;

    } else if (percentage.value > 0 && percentage.value < 100) {
      if (currentStatus.value !== Status.Scroll) {
        viewScrollStatus.animate({
          width: 200,
          opacity: 1,
          duration: 250
        })
        viewTopStatus.animate({
          opacity: 0,
          duration: 250
        })
        viewBottomStatus.animate({
          opacity: 0,
          duration: 250
        })
        viewWrap.animate({
          width: 200,
          duration: 250
        })
      }

      currentStatus.value = Status.Scroll;
    } else {
      if (currentStatus.value !== Status.Bottom) {
        viewScrollStatus.animate({
          opacity: 0,
          duration: 250
        })
        viewBottomStatus.animate({
          opacity: 1,
          duration: 250
        })
        viewWrap.animate({
          width: heightStatus,
          height: heightStatus,
          duration: 250
        })
      }
      currentStatus.value = Status.Bottom;
    }
  })
}
</script>

<template>
  <Frame>
    <Page actionBarHidden="true" androidStatusBarBackground="#1F232B" class="bg-[#1F232B]">
      <ActionBar>
        <Label text="Home" class="font-bold text-lg"/>
      </ActionBar>

      <GridLayout rows="*" class="px-4">
        <ScrollView
            @loaded="listViewLoaded"
            height="100%"
            separatorColor="transparent"
            class="bg-transparent"
        >
          <StackLayout>
            <StackLayout v-for="(item, index) in items" :key="index">
              <Label :text="item" class="text-2xl mt-4 text-white"/>
              <Label :text="item" class="pt-1 text-white"/>
            </StackLayout>
          </StackLayout>
        </ScrollView>
        <GridLayout verticalAlignment="bottom" class="mb-14 items-center justify-center">
          <GridLayout ref="refViewWrap"
                      class="bg-[#2e343f] rounded-full items-center justify-center h-[65] w-[65] border-4 border-[#4c5567]">
            <Label ref="refViewTopStatus" class="text text-white " text="15 mins" verticalAlignment="center"
                   horizontalAlignment="center"></Label>
            <FlexboxLayout ref="refViewScrollStatus" class="justify-center items-center opacity-0">
              <Label class="text-center text-white " :text="`${percentage}%`"
                     verticalAlignment="center"
                     horizontalAlignment="center"></Label>
              <Progress class="w-[60%] ml-2" color="white" :value="percentage" maxValue="100"/>
            </FlexboxLayout>
            <Label ref="refViewBottomStatus" class="text-white m-icon-round opacity-0" text="arrow_upward"
                   verticalAlignment="center"
                   horizontalAlignment="center"></Label>
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
