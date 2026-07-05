import type { App } from "vue";
import "@mdi/font/css/materialdesignicons.css";
import "vuetify/styles";
import { createVuetify } from "vuetify";

const vuetify = createVuetify({
  ssr: true,
  theme: { themes: { light: { colors: { primary: "#150E00" } } } },
});

export default (app: App) => {
  app.use(vuetify);
};
