<template>
    <div class="ebook" ref="ebook">
        <ebook-header></ebook-header>
        <ebook-title></ebook-title>
        <ebook-reader></ebook-reader>
        <ebook-menu></ebook-menu>
        <ebook-bookmark></ebook-bookmark>
        <ebook-footer></ebook-footer>
    </div>
</template>
<script>
import EbookHeader from '../../components/ebook/EbookHeader'
import EbookReader from '../../components/ebook/EbookReader'
import EbookTitle from '../../components/ebook/EbookTitle'
import EbookMenu from '../../components/ebook/EbookMenu'
import EbookBookmark from '../../components/ebook/EbookBookmark'
import EbookFooter from '../../components/ebook/EbookFooter'
import { getReadTime, saveReadTime } from '../../utils/localstorage'
import { ebookMixin } from '../../utils//mixin'
export default {
    mixins: [ebookMixin],
    components: {
        EbookReader,
        EbookTitle,
        EbookMenu,
        EbookBookmark,
        EbookHeader,
        EbookFooter
    },
    mounted () {
        this.startLoopReadTime()
    },
    watch: {
        offsetY (newValue) {
            if (newValue && newValue > 0) {
                this.move(newValue)
            } else if (newValue === 0) {
                this.restore()
            }
        }
    },
    methods: {
        startLoopReadTime () {
            let readTime = getReadTime(this.fileName)
            if (!readTime) {
                readTime = 0
            }
            this.task = setInterval(() => {
                readTime++
                if (readTime % 30 === 0) {
                    saveReadTime(this.fileName, readTime)
                }
            }, 1000)
            
        },
        move (v) {
            this.$refs.ebook.style.top = v + 'px'
        },
        restore () {
            this.$refs.ebook.style.top = 0
            this.$refs.ebook.style.transition = 'all .2s linear'
            setTimeout(() => {
                this.$refs.ebook.style.transition = ''
            }, 200)
        }
    },
    beforeDestroy () {
        if (this.task) {
            clearInterval(this.task)
        }
    }
}
</script>
<style lang="scss" scoped>
  @import "../../assets/styles/global";

  .ebook {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
  }
</style>
