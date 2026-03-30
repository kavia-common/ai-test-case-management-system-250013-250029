#!/bin/bash
cd /home/kavia/workspace/code-generation/ai-test-case-management-system-250013-250029/testcase_frontend_dashboard
npm run build
EXIT_CODE=$?
if [ $EXIT_CODE -ne 0 ]; then
   exit 1
fi

