import md from "markdown-it";

declare module "#app" {
  interface NuxtApp {
    $mdRenderer: ReturnType<typeof md>;
  }
}

export default defineNuxtPlugin(() => {
  const renderer = md({
    html: true,
    xhtmlOut: true,
    breaks: true,
  });
  return {
    provide: {
      mdRenderer: renderer,
    },
  };
});
