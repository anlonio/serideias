import {
  VuetifyTiptap,
  VuetifyViewer,
  createVuetifyProTipTap,
  BaseKit,
  Bold,
  Italic,
  Underline,
  Strike,
  Color,
  Highlight,
  Heading,
  TextAlign,
  FontFamily,
  FontSize,
  SubAndSuperScript,
  BulletList,
  OrderedList,
  TaskList,
  Indent,
  Link,
  Image,
  Video,
  Table,
  Blockquote,
  HorizontalRule,
  Code,
  CodeBlock,
  Clear,
  History,
} from 'vuetify-pro-tiptap'
import 'vuetify-pro-tiptap/styles/editor.css'
import '~/assets/styles/markdown/github.scss'

export default defineNuxtPlugin((app) => {
  const vuetifyProTipTap = createVuetifyProTipTap({
    lang: 'en',
    components: {
      VuetifyTiptap,
      VuetifyViewer,
    },
    extensions: [
      BaseKit.configure({
        placeholder: {
          placeholder: 'Digite alguma coisa...',
        },
      }),
      Bold,
      Italic,
      Underline,
      Strike,
      Code.configure({ divider: true }),
      Heading,
      TextAlign,
      FontFamily,
      FontSize,
      Color,
      Highlight.configure({ divider: true }),
      SubAndSuperScript.configure({ divider: true }),
      Clear.configure({ divider: true }),
      BulletList,
      OrderedList,
      TaskList,
      Indent.configure({ divider: true }),
      Link,
      Image.configure({
        upload(file: File) {
          const url = URL.createObjectURL(file)
          console.log('mock upload api :>> ', url)
          return Promise.resolve(url)
        },
      }),
      Video,
      Table.configure({ divider: true }),
      Blockquote,
      HorizontalRule,
      CodeBlock.configure({ divider: true }),
      History.configure({ divider: true }),
    ],
  })

  app.vueApp.use(vuetifyProTipTap)
})

