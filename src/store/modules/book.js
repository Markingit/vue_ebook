const book = {
    state: {
        fileName: '',
        menuVisible: true
    },
    mutations: {
        // eslint-disable-next-line quote-props
        'SET_FILENAME': (state, fileName) => {
            state.fileName = fileName
        },
        // eslint-disable-next-line quote-props
        'SET_MENUVISIBLE': (state, menuVisible) => {
            state.menuVisible = menuVisible
        }
    },
    actions: {
       
    }
}

export default book
