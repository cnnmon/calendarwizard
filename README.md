mini second brain project but for calendar events (i use my calendar for _everything_). work in progress, want to add notion db support in the near future to be able to query through my todo lists as well.

the website is ready-to-go and hosted at https://wizardingassistant.vercel.app/, but unfortunately google cloud api takes a bit to verify the app is trustworthy. currently, this only works out of the box with berkeley emails, but if you want to use this send me your email and i'll add it as trusted.

![Arc4](https://github.com/user-attachments/assets/9cae51a1-955b-415c-9b43-f4944ab0d727)

### built with

next.js, typescript, tailwind
integrated with google calendar api, langchain, vercel ai sdk
used openai gpt-4o-mini
demo'd with my calendar data :)

### running it locally

`npm install`
`npm run dev`

fill out `/.env.local` with:
```
NEXT_PUBLIC_GOOGLE_CLIENT_ID=
GOOGLE_CLIENT_SECRET=
OPENAI_API_KEY=
LANGCHAIN_TRACING_V2=true
LANGCHAIN_ENDPOINT="https://api.smith.langchain.com"
LANGCHAIN_API_KEY=
LANGCHAIN_PROJECT="pr-spotless-creche-43"
```
