i use my google calendar to track every part of my day, from to do list items to time blocking to hanging out with friends.

to take advantage of this really good data, i made a little mini second brain project to store my (or anyone's) calendar events & todo lists, with an assistant ready to help you organize your life. the assistant has semantic & temporal retrieval knowledge of your events.

https://github.com/user-attachments/assets/ec53cd51-fa22-40b0-8fea-0a689e4d71c5

fun queries to test the system:
- "what have i been up to this week?"
- "for what events have i gone outside?"
- "what should i put on my todo list?"

### how can i use this?

the website is ready-to-go and hosted at https://wizardingassistant.vercel.app/, but unfortunately google cloud api takes a while to verify an app is trustworthy enough for total public consumption. currently, this means the api only works out of the box with in-org berkeley emails, but feel free to send me your email and i can add you as a test user.

### built with

- next.js, typescript, tailwind
- integrated with google calendar api, langchain, faiss, vercel ai sdk
- used openai gpt-4o-mini and text-embedding-ada-002
- demo'd with my calendar data (incl. summary, start/end datetimes, location, organizer, attendees)
- drew art & created ui from scratch

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

### how it works

![diagram](https://github.com/user-attachments/assets/140e9a4c-727c-4a73-835b-782c207b0d19)
