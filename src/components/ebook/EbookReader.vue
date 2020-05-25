<template>
    <div class="ebook-reader">
        <div id="read"></div>
    </div>
</template>
<script>
import { ebookMixin } from '../../utils/mixin'
import { mapActions } from 'vuex'
import Epub from 'epubjs'
global.ePub = Epub
export default {
    mixins: [ebookMixin],
    data () {
        return {
            
        }
    },
    
    mounted () {
        const fileName = this.$route.params.fileName.split('|').join('/')
        console.log('fileName', fileName)
        // this.$store.dispatch('setFileName', fileName).then(() => {
        //     this.initEpub()
        // })
        this.setFileName(fileName).then(() => {
            this.initEpub()
        })
    },
    methods: {
        ...mapActions(['setMenuVisible']),
        prevPage () {
            if (this.rendition) {
                this.rendition.prev()
                this.hideTitleAndMenu()
            }
            
        },
        nextPage () {
            if (this.rendition) {
                this.rendition.next()
                this.hideTitleAndMenu()
            }
            this.hideTitleAndMenu()
        },
        toggleTitleAndMenu () {
            console.log('titlemenu.....')
            // this.$store.dispatch('setMenuVisible', !this.menuVisible)
            this.setMenuVisible(!this.menuVisible)
        },
        hideTitleAndMenu () {
            //  this.$store.dispatch('setMenuVisible', false)
            this.setMenuVisible()
        },
        initEpub () {
            const url = 'http://47.99.166.157/epub/' + this.fileName + '.epub'
            console.log(url)
            this.book = new Epub(url)
            console.log(this.book)
            this.rendition = this.book.renderTo('read', {
                width: window.innerWidth,
                height: window.innerHeight,
                method: 'default'
            })
            this.rendition.display()
            console.log('this.rendition', this.rendition)
            this.rendition.on('touchstart', event => {
                this.touchStartX = event.changedTouches[0].clientX
                console.log(this.touchStartX)
                this.touchStartTime = event.timeStamp
            })
            this.rendition.on('touchend', event => {
                const offsetX = event.changedTouches[0].clientX - this.touchStartX
                const time = event.timeStamp - this.touchStartTime
                if (time < 500 && offsetX > 40) {
                    this.prevPage()
                } else if (time < 500 && offsetX < -40) {
                    this.nextPage()
                } else {
                    this.toggleTitleAndMenu()
                }
                event.preventDefault()
                event.stopPropagation()
            })
        }
    }
}
</script>
<style lang="scss" scoped>
    @import "../../assets/styles/global.scss";
    .ebook-reader {
        width: 100%;
        height: 100%;
        overflow: hidden;
        .ebook-reader-mask {
            position: absolute;
            top: 0;
            left: 0;
            background: transparent;
            z-index: 150;
            width: 100%;
            height: 100%;
        }
  }
</style>
