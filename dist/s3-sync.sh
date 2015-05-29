#!/bin/bash

aws s3 sync . s3://danielfang.org/ --acl public-read-write
