// import { realPx } from '../../utils/utils'

const book = {
  state: {
    fileName: '',
    menuVisible: false,
    settingVisible: -1,
    defaultFontSize: 16,
    defaultFontFamily: 'Default',
    fontFamilyVisible: false,
    defaultTheme: 'Default',
    bookAvailable: false,
    progress: 0,
    section: 0,
    isPaginating: true,
    currentBook: null,
    navigation: null,
    cover: null,
    metadata: null,
    paginate: '',
    pagelist: null,
    offsetY: 0,
    isBookmark: null,
    // speakingIconBottom: realPx(58)
  },
  mutations: {
    // eslint-disable-next-line quote-props
    'SET_FILENAME': (state, fileName) => {
      state.fileName = fileName
    },
    // eslint-disable-next-line quote-props
    'SET_MENU_VISIBLE': (state, visible) => {
      state.menuVisible = visible
    },
    // eslint-disable-next-line quote-props
    'SET_SETTING_VISIBLE': (state, visible) => {
      state.settingVisible = visible
    },
    // eslint-disable-next-line quote-props
    'SET_DEFAULT_FONT_SIZE': (state, fontSize) => {
      state.defaultFontSize = fontSize
    },
    // eslint-disable-next-line quote-props
    'SET_DEFAULT_FONT_FAMILY': (state, font) => {
      state.defaultFontFamily = font
    },
    // eslint-disable-next-line quote-props
    'SET_FONT_FAMILY_VISIBLE': (state, visible) => {
      state.fontFamilyVisible = visible
    },
    // eslint-disable-next-line quote-props
    'SET_DEFAULT_THEME': (state, theme) => {
      state.defaultTheme = theme
    },
    // eslint-disable-next-line quote-props
    'SET_BOOK_AVAILABLE': (state, bookAvailable) => {
      state.bookAvailable = bookAvailable
    },
    // eslint-disable-next-line quote-props
    'SET_PROGRESS': (state, progress) => {
      state.progress = progress
    },
    // eslint-disable-next-line quote-props
    'SET_SECTION': (state, section) => {
      state.section = section
    },
    // eslint-disable-next-line quote-props
    'SET_IS_PAGINATING': (state, isPaginating) => {
      state.isPaginating = isPaginating
    },
    // eslint-disable-next-line quote-props
    'SET_CURRENT_BOOK': (state, currentBook) => {
      state.currentBook = currentBook
    },
    // eslint-disable-next-line quote-props
    'SET_NAVIGATION': (state, navigation) => {
      state.navigation = navigation
    },
    // eslint-disable-next-line quote-props
    'SET_COVER': (state, cover) => {
      state.cover = cover
    },
    // eslint-disable-next-line quote-props
    'SET_METADATA': (state, metadata) => {
      state.metadata = metadata
    },
    // eslint-disable-next-line quote-props
    'SET_PAGINATE': (state, paginate) => {
      state.paginate = paginate
    },
    // eslint-disable-next-line quote-props
    'SET_PAGELIST': (state, pagelist) => {
      state.pagelist = pagelist
    },
    // eslint-disable-next-line quote-props
    'SET_OFFSETY': (state, offsetY) => {
      state.offsetY = offsetY
    },
    // eslint-disable-next-line quote-props
    'SET_IS_BOOKMARK': (state, isBookmark) => {
      state.isBookmark = isBookmark
    },
    // eslint-disable-next-line quote-props
    // 'SET_SPEAKING_ICON_BOTTOM': (state, speakingIconBottom) => {
    //   state.speakingIconBottom = speakingIconBottom
    // }
  }
}

export default book
