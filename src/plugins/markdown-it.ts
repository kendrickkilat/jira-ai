import md from "markdown-it";

declare module "#app" {
  interface NuxtApp {
    $mdRenderer: ReturnType<typeof md>;
  }
}

export default defineNuxtPlugin(() => {
  const renderer = md({
    html: false,
    xhtmlOut: false,
    breaks: true,
  });
  return {
    provide: {
      mdRenderer: renderer,
    },
  };
});
