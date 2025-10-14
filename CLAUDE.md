# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is a TypeScript-based cron job that automatically creates monthly rent expenses on Splitwise via their API. It runs as a GitHub Actions workflow on the 26th of each month at UTC 00:00 (JST 09:00).

## Development Commands

- **Run the application**: `npm start`
- **Build TypeScript**: `npm run build` (outputs to `lib/` directory)
- **Development mode with auto-reload**: `npm run build:live`

## Architecture

### Single-File Application

The application is intentionally simple with a single entry point at [src/index.ts](src/index.ts) that:

1. Loads environment variables via dotenv
2. Initializes a Splitwise client with OAuth credentials
3. Creates a rent expense for the next month
4. Splits the expense between two users (one pays, one owes)

### Key Implementation Details

- **Date handling**: The expense is created for the next month (e.g., if run in December, creates expense for January)
- **Month overflow**: JavaScript's Date class automatically handles year transitions
- **Expense splitting**: Uses manual split with `split_equally: false`, specifying exact `paid_share` and `owed_share` for each user
- **Type safety**: Custom type definitions in [src/types/splitwise.d.ts](src/types/splitwise.d.ts) provide TypeScript support for the `splitwise` npm package

### Environment Variables

All configuration is managed through environment variables (see [.env.example](.env.example)):

- `PAID_USER_ID`: The Splitwise user ID who pays the rent
- `OWED_USER_ID`: The Splitwise user ID who owes their share
- `CONSUMER_KEY`: Splitwise API consumer key
- `CONSUMER_SECRET`: Splitwise API consumer secret
- `GROUP_ID`: The Splitwise group ID for the expense
- `HOUSE_RENT_TOTAL`: Total rent amount (for description)
- `HOUSE_RENT_OWN`: Individual share amount (used for both paid and owed amounts)

## GitHub Actions Deployment

The application runs automatically via GitHub Actions ([.github/workflows/cron.yaml](.github/workflows/cron.yaml)):

- **Schedule**: Cron schedule `'0 0 26 * *'` (26th of each month at UTC 00:00)
- **Manual trigger**: Can be triggered via `workflow_dispatch`
- **Environment**: All required environment variables must be configured as GitHub secrets
- **Node version**: Uses Node.js 21

## TypeScript Configuration

- **Target**: ES2016
- **Module**: CommonJS
- **Source**: [src/](src/) directory
- **Output**: [lib/](lib/) directory
- **Type roots**: Custom types in [src/types/](src/types/) plus standard node_modules/@types
- **Strict mode**: Enabled
