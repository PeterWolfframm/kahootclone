FROM node:22-alpine AS build
WORKDIR /app
COPY package.json package-lock.json* ./
RUN npm install
COPY index.html tsconfig.json vite.config.ts ./
COPY src ./src
ARG VITE_SUPABASE_URL
ARG VITE_SUPABASE_ANON_KEY
ARG VITE_SPACETIME_URI=wss://spacetime.happylittleventures.com
ARG VITE_SPACETIME_DB_NAME=kahoot
ENV VITE_SUPABASE_URL=$VITE_SUPABASE_URL
ENV VITE_SUPABASE_ANON_KEY=$VITE_SUPABASE_ANON_KEY
ENV VITE_SPACETIME_URI=$VITE_SPACETIME_URI
ENV VITE_SPACETIME_DB_NAME=$VITE_SPACETIME_DB_NAME
RUN npm run build

FROM nginx:alpine
COPY nginx.conf /etc/nginx/conf.d/default.conf
COPY --from=build /app/dist /usr/share/nginx/html
EXPOSE 80
