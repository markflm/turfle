## running locally

# set up tailwind build process

npx tailwindcss -i ./src/index.css -o ./src/output.css --watch

# supabase local

you'll need Docker. Project was developed with Docker Desktop on Windows, but other Docker projects should work as well.

make sure Docker is running, then run `npx supabase init` and `npx supabase start`

after supabase is running, migrations/seeding data can be run with `npx supabase db reset`
more info: https://supabase.com/docs/guides/cli/local-development

generate types from db - npx supabase gen types typescript --local > ./src/database.types.ts
will need to re-run this to get full type support if db schema changes

# finally, run vite

`npm run dev`

## links that helped troubleshoot issues

supabase generated types don't seem to be able to be set 1:1 relationships. was pulling out individual objects that the auto generated types thought were arrays.
https://github.com/supabase/cli/issues/736#issuecomment-1434167982

postgres datediff
https://www.commandprompt.com/education/postgresql-datediff-datetime-difference-in-years-months-etc/

## vite boilerplate below

# React + TypeScript + Vite

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

Currently, two official plugins are available:

-   [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react/README.md) uses [Babel](https://babeljs.io/) for Fast Refresh
-   [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react-swc) uses [SWC](https://swc.rs/) for Fast Refresh

## Expanding the ESLint configuration

If you are developing a production application, we recommend updating the configuration to enable type aware lint rules:

-   Configure the top-level `parserOptions` property like this:

```js
export default {
    // other rules...
    parserOptions: {
        ecmaVersion: 'latest',
        sourceType: 'module',
        project: ['./tsconfig.json', './tsconfig.node.json'],
        tsconfigRootDir: __dirname,
    },
}
```

-   Replace `plugin:@typescript-eslint/recommended` to `plugin:@typescript-eslint/recommended-type-checked` or `plugin:@typescript-eslint/strict-type-checked`
-   Optionally add `plugin:@typescript-eslint/stylistic-type-checked`
-   Install [eslint-plugin-react](https://github.com/jsx-eslint/eslint-plugin-react) and add `plugin:react/recommended` & `plugin:react/jsx-runtime` to the `extends` list
