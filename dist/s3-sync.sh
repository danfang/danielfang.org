#!/bin/bash

aws s3 sync . s3://danielfang.org/ --exclude '*' --include '*.css' --include 'img/*' --include '*.html' --exclude 'node_modules/*' --acl public-read-write
