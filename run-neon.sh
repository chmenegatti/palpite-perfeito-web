#!/bin/bash
unset DATABASE_URL
export DATABASE_URL="postgresql://neondb_owner:npg_9tjqNlzSLT7w@ep-spring-union-amtwn4ss.c-5.us-east-1.aws.neon.tech/neondb?sslmode=require"
exec npx next dev
