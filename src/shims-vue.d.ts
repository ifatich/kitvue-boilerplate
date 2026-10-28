declare module '*.vue' {
  import { defineComponent } from 'vue'

  const component: ReturnType<typeof defineComponent>
  export default component
}

declare module 'kitvue-public*' {
  const content: Record<string, unknown>
  export default content
}

declare module 'kitvue*' {
  const content: Record<string, unknown>
  export default content
}
