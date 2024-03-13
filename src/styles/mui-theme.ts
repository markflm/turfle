import { createTheme } from '@mui/material'

export const theme = createTheme({
    breakpoints: {
        values: {
            //@ts-expect-error -- mui lets you define your breakpoint names. must have an old version of the types that is causing 'mobile' key to get caught by linter
            mobile: 0,
            tablet: 900,
            laptop: 1024,
            desktop: 1280,
        },
    },
})
