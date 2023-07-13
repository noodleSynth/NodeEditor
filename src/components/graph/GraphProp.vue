<template>
  <label v-if="props.type == 7">
    {{ (props as DirectiveNode).name }}
  </label>
</template>

<script setup lang="ts">
import type { DirectiveNode, NodeTypes } from "@vue/compiler-core";
import { computed } from "vue";

const props = defineProps<{
  type: NodeTypes;
  name: string;
}>();
</script>
