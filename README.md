i use my calendar to track every part of my day, so i made a little mini second brain project to store my calendar events & my todo list.

the website is ready-to-go and hosted at https://wizardingassistant.vercel.app/, but unfortunately google cloud api takes a bit to verify the app is trustworthy. currently, this means this only works out of the box with berkeley emails, but feel free to send me your email and i can add it as a test user.

![Screenshot 2025-01-05 at 11 09 06 PM](https://github.com/user-attachments/assets/9861b2de-d058-44cc-9da1-03dd5899f862)

### built with

next.js, typescript, tailwind
integrated with google calendar api, langchain, faiss, vercel ai sdk
used openai gpt-4o-mini and text-embedding-ada-002
demo'd with my calendar data (incl. summary, start/end datetimes, location, organizer, attendees)

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
