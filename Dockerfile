FROM public.ecr.aws/docker/library/node:24-slim AS build
ENV PNPM_HOME="/pnpm"
ENV PATH="$PNPM_HOME:$PATH"
RUN corepack enable

WORKDIR /usr/src/project
COPY pnpm-lock.yaml ./
RUN --mount=type=cache,id=pnpm,target=/pnpm/store pnpm fetch
COPY . ./
RUN --mount=type=cache,id=pnpm,target=/pnpm/store pnpm install --frozen-lockfile --offline --ignore-scripts
RUN pnpm run -r build
RUN pnpm deploy --filter=app --prod /prod/app

FROM gcr.io/distroless/nodejs24-debian13:latest AS app
COPY --from=public.ecr.aws/awsguru/aws-lambda-adapter:0.9.1 /lambda-adapter /opt/extensions/lambda-adapter
WORKDIR /prod/app
COPY --from=build --chown=nonroot:nonroot /prod/app ./
USER nonroot
EXPOSE 3000
CMD [ ".output/server/index.mjs" ]