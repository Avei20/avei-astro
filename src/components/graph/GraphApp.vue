<template>
    <SigmaContainer :graph="graph" :settings="settings" />
</template>

<script setup lang="ts">
import { ref } from "vue";
import Graph from "graphology";
import type { Settings } from "sigma/settings";
import SigmaContainer from "./SigmaContainer.vue";

// `client:only="vue"` island: creates an empty graphology instance (matches the
// original `pages/graph/index.vue`) and lets SigmaContainer mount sigma on it.
// An empty graph still renders and the force-layout supervisor runs.
const graph = ref(new Graph());
const settings = ref({} as Settings);
</script>
