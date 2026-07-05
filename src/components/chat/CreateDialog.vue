<template>
    <VDialog :model-value="modelValue" @update:model-value="(v) => emit('update:modelValue', v)" persistent max-width="290">
        <VCard>
            <VCardTitle color="primary" class="headline">Username and Gemini Limiter</VCardTitle>
            <VCardText>
                <VTextField
                    density="compact"
                    variant="outlined"
                    v-model="username"
                    label="Username"
                    required
                />
            </VCardText>
            <VSlider class="px-4" label="Harmful Content" v-model="harmful" />
            <VCardActions class="d-flex justify-end">
                <VBtn color="primary" @click="startChat">Start Chat</VBtn>
            </VCardActions>
        </VCard>
    </VDialog>
</template>

<script setup lang="ts">
import { ref } from "vue";

const props = defineProps<{ modelValue: boolean }>();
const emit = defineEmits<{
    "update:modelValue": [boolean];
    start: [string];
}>();

const username = ref("");
const harmful = ref(0);

const startChat = () => {
    emit("start", username.value);
    emit("update:modelValue", false);
};
</script>
