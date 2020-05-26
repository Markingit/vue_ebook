<template>
    <div class="ebook-reader">
        <div id="read"></div>
    </div>
</template>
<script>
import { ebookMixin } from '../../utils/mixin'
import { mapActions } from 'vuex'
import Epub from 'epubjs'
import { getFontFamily, saveFontFamily, getFontSize, saveFontSize, getTheme, saveTheme } from '../../utils/localstorage'
// import { addCss } from '../../utils/book'
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
            // this.$store.dispatch('setMenuVisible', !this.menuVisible)
            if (this.menuVisible) {
                this.setSettingVisible(-1)
                this.setFontFamilyVisible(false)
            }
            this.setMenuVisible(!this.menuVisible)
        },
        hideTitleAndMenu () {
            //  this.$store.dispatch('setMenuVisible', false)
            this.setMenuVisible(false)
            this.setSettingVisible(-1)
            this.setFontFamilyVisible(false)
        },
        
        initFontSize () {
             // 字体大小缓存
            const fontSize = getFontSize(this.fileName)
            if (!fontSize) {
                saveFontSize(this.fileName, this.defaultFontSize)
            } else {
                this.rendition.themes.fontSize(fontSize)
                this.setDefaultFontSize(fontSize)
            }
        },
        initFontFamily () {
             // 字体缓存类型
            const font = getFontFamily(this.fileName)
            if (!font) {
                saveFontFamily(this.fileName, this.defaultFontFamily)
            } else {
                this.rendition.themes.font(font)
                this.setDefaultFontFamily(font)
            }
        },
        initTheme () {
            let defaultTheme = getTheme(this.fileName)
            if (!defaultTheme) {
                defaultTheme = this.themeList[0].name
                saveTheme(this.fileName, defaultTheme)
            }
            this.setDefaultTheme(defaultTheme)
            this.themeList.forEach(theme => {
                this.rendition.themes.register(theme.name, theme.style)
            })
            this.rendition.themes.select(defaultTheme)

        },
        initEpub () {
            const url = process.env.VUE_APP_EPUB_URL + '/' + this.fileName + '.epub'
            console.log(url)
            this.book = new Epub(url)
            this.setCurrentBook(this.book)
            console.log(this.book)
            this.rendition = this.book.renderTo('read', {
                width: window.innerWidth,
                height: window.innerHeight,
                method: 'default'
            })
            this.rendition.display().then(() => {
               this.initGlobalStyle()
               this.initTheme()
               this.initFontSize()
               this.initFontFamily()
            })
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
            this.rendition.hooks.content.register(contents => {
                Promise.all([
                    contents.addStylesheet(`${process.env.VUE_APP_RES_URL}/fonts/daysOne.css`),
                    contents.addStylesheet(`${process.env.VUE_APP_RES_URL}/fonts/cabin.css`),
                    contents.addStylesheet(`${process.env.VUE_APP_RES_URL}/fonts/montserrat.css`),
                    contents.addStylesheet(`${process.env.VUE_APP_RES_URL}/fonts/tangerine.css`)
                ]).then(() => {})
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
