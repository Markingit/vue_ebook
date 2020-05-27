<template>
    <div class="ebook-reader">
        <div id="read"></div>
    </div>
</template>
<script>
import { ebookMixin } from '../../utils/mixin'
import { mapActions } from 'vuex'
import Epub from 'epubjs'
import { getFontFamily, saveFontFamily, getFontSize, saveFontSize, getTheme, saveTheme, getLocation } from '../../utils/localstorage'
// import { flatten } from '../../utils/book'
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
                this.rendition.prev().then(() => {
                    this.refreshLocation()
                })
                this.hideTitleAndMenu()
            }
            
        },
        nextPage () {
            if (this.rendition) {
                this.rendition.next().then(() => {
                    this.refreshLocation()
                })
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
        // 主题初始化
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
        // rendition 方法
        initRendition () {
             this.rendition = this.book.renderTo('read', {
                width: window.innerWidth,
                height: window.innerHeight,
                method: 'default'
            })
            // this.rendition.display().then(() => {
               
            //    this.initTheme()
            //    this.initFontSize()
            //    this.initFontFamily()
            //    this.initGlobalStyle()
            //    this.refreshLocation()
            // })
            const location = getLocation(this.fileName)
            this.display(location, () => {
               this.initTheme()
               this.initFontSize()
               this.initFontFamily()
               this.initGlobalStyle()
            //    this.refreshLocation()
            })
            console.log('this.rendition', this.rendition)
            this.rendition.hooks.content.register(contents => {
                Promise.all([
                    contents.addStylesheet(`${process.env.VUE_APP_RES_URL}/fonts/daysOne.css`),
                    contents.addStylesheet(`${process.env.VUE_APP_RES_URL}/fonts/cabin.css`),
                    contents.addStylesheet(`${process.env.VUE_APP_RES_URL}/fonts/montserrat.css`),
                    contents.addStylesheet(`${process.env.VUE_APP_RES_URL}/fonts/tangerine.css`)
                ]).then(() => {})
            })
        },
        // 手势方法
        initGesture () {
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
        },
        // 获取图书信息
        parseBook () {
            this.book.loaded.cover.then(cover => {
                this.book.archive.createUrl(cover).then(url => {
                    this.setCover(url)
                })
            })
            this.book.loaded.metadata.then(metadata => {
                this.setMetadata(metadata)
            })

            this.book.loaded.navigation.then(nav => {
                const navItem = (function flatten (arr) {
                    return [].concat(...arr.map(v => [v, ...flatten(v.subitems)]))
                })(nav.toc)

                function find (item, v = 0) {
                    const parent = navItem.filter(it => it.id === item.parent)[0]
                    return !item.parent ? v : (parent ? find(parent, ++v) : v)
                }

                navItem.forEach(item => {
                    item.level = find(item)
                    item.total = 0
                    item.pagelist = []
                    if (item.href.match(/^(.*)\.html$/)) {
                        item.idhref = item.href.match(/^(.*)\.html$/)[1]
                    } else if (item.href.match(/^(.*)\.xhtml$/)) {
                        item.idhref = item.href.match(/^(.*)\.xhtml$/)[1]
                    }
                })
                this.setNavigation(navItem)
            })
        },
        initEpub () {
            const url = process.env.VUE_APP_EPUB_URL + '/' + this.fileName + '.epub'
            console.log(url)
            this.book = new Epub(url)
            this.setCurrentBook(this.book)
            this.setIsPaginating(true)
            console.log(this.book)
            this.initRendition()
            this.initGesture()
            this.parseBook()
            this.book.ready.then(() => {
                return this.book.locations.generate(750 * (window.innerWidth / 375) * (getFontSize(this.fileName) / 16))
            }).then(locations => {
                this.setBookAvailable(true)
                this.setIsPaginating(false)
                this.refreshLocation()
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
