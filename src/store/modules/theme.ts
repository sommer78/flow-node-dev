import { defineStore } from "pinia";
import { ref, watch } from "vue";

export const useThemeStore = defineStore("theme", () => {
  const theme = ref<"light" | "dark">("dark");

  const toggleTheme = () => {
    theme.value = theme.value === "dark" ? "light" : "dark";
  };

  watch(
    theme,
    newTheme => {
      document.documentElement.classList.remove("light", "dark");
      document.documentElement.classList.add(newTheme);
    },
    { immediate: true }
  );

  return {
    theme,
    toggleTheme
  };
});
