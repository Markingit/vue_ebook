
import { mapGetters, mapActions } from 'vuex'
import { themeList, addCss, removeAllCss, getReadTimByMinute } from '../utils/book'
import { saveLocation, getBookmark } from '../utils/localstorage'

export const storeHomeMixin = {
    computed: {
      ...mapGetters([
        'offsetY',
        'hotSearchOffsetY',
        'flapCardVisible'
      ])
    },
    methods: {
      ...mapActions([
        'setOffsetY',
        'setHotSearchOffsetY',
        'setFlapCardVisible'
      ]),
      showBookDetail (book) {
        // gotoBookDetail(this, book)
      }
    }
  }

export const ebookMixin = {
    computed: {
        ...mapGetters([
            'fileName',
            'menuVisible',
            'settingVisible',
            'defaultFontSize',
            'defaultFontFamily',
            'fontFamilyVisible',
            'defaultTheme',
            'bookAvailable',
            'progress',
            'section',
            'isPaginating',
            'currentBook',
            'navigation',
            'cover',
            'metadata',
            'paginate',
            'pagelist',
            'offsetY',
            'isBookmark',
            'speakingIconBottom'
        ]),
        themeList () {
            return themeList(this)
        },
        getSectionName () {
            if (this.section) {
              const section = this.currentBook.section(this.section)
              if (section && section.href && this.currentBook && this.currentBook.navigation) {
                // return this.currentBook.navigation.get(section.href).label
                return this.navigation[this.section].label
              }
            }
          }
    },
    methods: {
        ...mapActions([
            'setFileName',
            'setMenuVisible',
            'setSettingVisible',
            'setDefaultFontSize',
            'setDefaultFontFamily',
            'setFontFamilyVisible',
            'setDefaultTheme',
            'setBookAvailable',
            'setProgress',
            'setSection',
            'setIsPaginating',
            'setCurrentBook',
            'setNavigation',
            'setCover',
            'setMetadata',
            'setPaginate',
            'setPagelist',
            'setOffsetY',
            'setIsBookmark',
            'setSpeakingIconBottom'
        ]),
        initGlobalStyle () {
            removeAllCss()
            switch (this.defaultTheme) {
                case 'default':
                   addCss(`${process.env.VUE_APP_RES_URL}/theme/theme_default.css`)
                   break
                case 'Eye':
                   addCss(`${process.env.VUE_APP_RES_URL}/theme/theme_eye.css`)
                   break
                case 'Gold':
                   addCss(`${process.env.VUE_APP_RES_URL}/theme/theme_gold.css`)
                   break 
                 case 'Night':
                   addCss(`${process.env.VUE_APP_RES_URL}/theme/theme_night.css`)
                   break 
                 default:
                    addCss(`${process.env.VUE_APP_RES_URL}/theme/theme_default.css`)
                    break
            }
        },
        refreshLocation () {
            const currentLocation = this.currentBook.rendition.currentLocation()
            if (currentLocation && currentLocation.start) {
                const startCfi = currentLocation.start.cfi
                const progress = this.currentBook.locations.percentageFromCfi(startCfi)
                this.setProgress(Math.floor(progress * 100))
                this.setSection(currentLocation.start.index)

                // const cfistart = currentLocation.start.cfi
                // 书签相关保存或者删除当前页书签
                const bookmark = getBookmark(this.fileName)
                if (bookmark) {
                    if (bookmark.some(item => item.cfi === startCfi)) {
                        this.setIsBookmark(true)
                    } else {
                        this.setIsBookmark(false)
                    }
                } else {
                    this.setIsBookmark(false)
                }
                // 书签end

                saveLocation(this.fileName, startCfi)
            }
        },
        display (target, callback) {
            if (target) {
                this.currentBook.rendition.display(target).then(() => {
                    this.refreshLocation()
                    if (callback) {
                        callback()
                    }
                })
            } else {
                this.currentBook.rendition.display().then(() => {
                    this.refreshLocation()
                    if (callback) {
                        callback()
                    }
                })
            }
        },
        hideTitleAndMenu () {
            //  this.$store.dispatch('setMenuVisible', false)
            this.setMenuVisible(false)
            this.setSettingVisible(-1)
            this.setFontFamilyVisible(false)
        },
        getReadTimeText () {
            return this.$t('book.haveRead').replace('$1', getReadTimByMinute(this.fileName))
        }
    }
}
