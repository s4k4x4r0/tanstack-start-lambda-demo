FROM public.ecr.aws/docker/library/node:24-slim AS base

FROM base AS build
ENV PNPM_HOME="/pnpm"
ENV PATH="$PNPM_HOME:$PATH"
RUN corepack enable
COPY . /usr/src/project
WORKDIR /usr/src/project
RUN --mount=type=cache,id=pnpm,target=/pnpm/store pnpm install --frozen-lockfile
RUN pnpm run -r build
RUN pnpm deploy --filter=app --prod /prod/app

FROM base AS app
COPY --from=build /prod/app /prod/app
WORKDIR /prod/app
EXPOSE 3000
CMD [ "node", ".output/server/index.mjs" ]