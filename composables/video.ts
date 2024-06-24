import { Node } from '@tiptap/core'

export interface VideoOptions {
    allowFullscreen: boolean,
    HTMLAttributes: {
        [key: string]: any
    },
}

declare module '@tiptap/core' {
    interface Commands<ReturnType> {
        Video: {
            /**
             * Add an video to the editor
             */
            setVideo: (options: { src: string, title: string, type: string }) => ReturnType,
        }
    }
}

export default Node.create<VideoOptions>({
    name: 'video',
    group: 'block',
    atom: true,
    addOptions() {
        return {
            allowFullscreen: true,
            loop: true,
            controls: "true",
            playsinline: true,
            HTMLAttributes: {
                class: 'video-wrapper',
            },
        }
    },
    addAttributes() {
        return {
            src: {
                default: null,
            },
            title: {
                default: null,
            },
            frameborder: {
                default: 0,
            },
            allowfullscreen: {
                default: this.options.allowFullscreen,
                parseHTML: () => this.options.allowFullscreen,
            },
            loop: {
                default: true,
            },
            class: {
                default: null,
            },
            type: {
                default: null,
            },
            controls: {
                default: true,
            },
            playsinline: {
                default: true,
            },

        }
    },

    parseHTML() {
        return [{
            tag: 'video',
        }]
    },

    renderHTML({ HTMLAttributes }) {
        return ['video', { ...HTMLAttributes, class: 'TipTapVideo TipTapMedia', autoplay: false,  playsinline: true, controls: true, preload: 'metadata' }]
    },

    addCommands() {
        return {
            setVideo: (options: { src: string, title: string, type: string }) => ({ tr, dispatch }) => {
                const { selection } = tr
                const node = this.type.create(options)

                if (dispatch) {
                    tr.replaceRangeWith(selection.from, selection.to, node)
                }

                return true
            },
        }
    },
})