<template>
    <div class="w-100">
        <VTextarea
            v-model="message"
            class="my-1 w-100 px-4"
            variant="outlined"
            density="compact"
            label="Feedback"
            :error-messages="errors"
            placeholder="Make sure your feedback is very good for my mental health and my feeling. Identity is Anonymous btw. :)"
        />
        <div class="d-flex justify-center w-100 mb-4">
            <VBtn color="primary" :loading="loading" @click="submitFeedback">Send</VBtn>
        </div>

        <VSnackbar v-model="snackbar" :timeout="4000" location="bottom center">
            {{ snackbarText }}
        </VSnackbar>
    </div>
</template>

<script setup lang="ts">
import { ref, computed } from "vue";
import { apiFetch, type ApiError } from "../utils/api";

const message = ref("");
const loading = ref(false);

// Local snackbar (no global Pinia store in Astro islands).
const snackbar = ref(false);
const snackbarText = ref("");

// Manual validation replicating the old vuelidate rules (required, min 10).
const touched = ref(false);
const errors = computed<string[]>(() => {
    if (!touched.value) return [];
    const list: string[] = [];
    if (!message.value.trim()) {
        list.push("Message is required to submit a feedback");
    } else if (message.value.trim().length < 10) {
        list.push("Message must be at least 10 characters");
    }
    return list;
});

const isValid = computed(
    () => message.value.trim().length >= 10,
);

const showSnackbar = (text: string) => {
    snackbarText.value = text;
    snackbar.value = true;
};

const submitFeedback = async () => {
    touched.value = true;
    if (!isValid.value) return;

    loading.value = true;
    try {
        const data = await apiFetch<{ message: string }>("/v1/feedback", {
            method: "POST",
            body: JSON.stringify({ message: message.value }),
        });
        showSnackbar(data.message);
        message.value = "";
        touched.value = false;
    } catch (e) {
        const err = e as ApiError;
        showSnackbar(err.message || "Failed to submit feedback");
    } finally {
        loading.value = false;
    }
};
</script>
