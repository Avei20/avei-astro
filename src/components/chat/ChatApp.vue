<template>
    <VCard class="mx-2 my-5" height="100%">
        <VCard class="h-100">
            <VCardTitle class="d-flex-column align-center" color="primary">
                <span class="d-flex mb-4 align-center justify-center text-h4">
                    Avei Gemini
                    <VIcon icon="mdi-robot" class="ml-4 w-auto" />
                </span>
                <VAutocomplete
                    v-model="messageObject.aiModel"
                    label="Select Model"
                    no-data-text="No Model Available."
                    class="mt-2 align-self-center"
                    @update:focused="fetchModel"
                    :items="modelSelection"
                    item-value="key"
                    item-title="name"
                    variant="outlined"
                    density="compact"
                />
                <VDivider />
            </VCardTitle>
            <VCardText style="height: 400px; overflow-y: auto">
                <VList>
                    <div v-for="message in messages" :key="message.id">
                        <VListItem class="d-flex justify-space-between py-2">
                            <div>
                                <span v-if="message.isUser" class="d-flex align-center">
                                    <VIcon icon="mdi-account-circle" class="mr-2" />
                                    User
                                </span>
                                <span v-else class="d-flex align-center">
                                    <VIcon icon="mdi-robot" class="mr-2" />
                                    Gemini
                                </span>
                            </div>
                            <div v-html="marked(message.message)"></div>
                        </VListItem>
                    </div>
                </VList>
            </VCardText>
            <VDivider />
            <VCardActions>
                <VTextField
                    v-model="messageObject.message"
                    variant="outlined"
                    density="compact"
                    label="Type your message"
                    @keyup.enter="sendMessage"
                    append-icon="mdi-send"
                    @click:append="sendMessage"
                />
            </VCardActions>
        </VCard>
    </VCard>
    <ChatCreateDialog v-model="isDialogOpen" @start="onStartChat" />
    <VSnackbar v-model="snackbar" :timeout="3000">{{ snackbarMessage }}</VSnackbar>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted } from "vue";
import { marked } from "marked";
import { v4 as uuidv4 } from "uuid";
import { apiFetch } from "../../utils/api";
import { socket } from "../../utils/socket";
import ChatCreateDialog from "./CreateDialog.vue";

interface ChatMessage {
    id: string;
    message: string;
    date: Date;
    isUser: boolean;
    aiModel: unknown;
}

const messages = ref<ChatMessage[]>([]);
const modelSelection = ref<{ key: string; name: string }[]>([]);

// Create dialog (was chatStore.isWantToCreate). Open on mount to match the old
// `onBeforeMount` that set `chatStore.isWantToCreate = true`.
const isDialogOpen = ref(false);
const username = ref("");

// Local snackbar (was appStore.showSnackbar).
const snackbar = ref(false);
const snackbarMessage = ref("");
const showSnackbar = (msg: string) => {
    snackbarMessage.value = msg;
    snackbar.value = true;
};

const messageObject = reactive({
    id: uuidv4(),
    message: "",
    date: new Date(),
    isUser: true,
    aiModel: null as unknown,
});

const sendMessage = () => {
    if (!messageObject.message || !messageObject.aiModel) {
        return;
    }

    const msg: ChatMessage = {
        id: messageObject.id,
        message: messageObject.message,
        date: messageObject.date,
        isUser: messageObject.isUser,
        aiModel: messageObject.aiModel,
    };
    socket.emit("new message", msg);
    messages.value.push(msg);
    messageObject.message = "";
};

const fetchModel = async () => {
    const response = await apiFetch<{ data: { key: string; name: string }[] }>(
        "v1/chat",
    );
    modelSelection.value = response.data;
};

const onStartChat = (name: string) => {
    username.value = name;
};

onMounted(() => {
    // Open the chat setup dialog (matches old `chatStore.isWantToCreate = true`).
    isDialogOpen.value = true;

    // Fetch available models.
    fetchModel();

    // Wire the socket. `connect()` is a no-op when autoConnect already connected.
    socket.connect();
    socket.emit("join", { paleo: "paleo", name: "user" });

    socket.on("new message", (msg: ChatMessage) => {
        messages.value.push(msg);
    });

    socket.on("exception", (msg: { status?: string; message?: string }) => {
        if (msg.status === "error") {
            showSnackbar(msg.message || "An error occurred");
        }
    });
});
</script>
