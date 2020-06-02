<?php

$REQUEST_METHOD = isset($_SERVER['REQUEST_METHOD']) 
  ? $_SERVER['REQUEST_METHOD'] : 'GET';

$CONTENT_LENGTH = isset($_SERVER['CONTENT_LENGTH'])
  ? $_SERVER['CONTENT_LENGTH'] : 0;

//parse the command line into the $_GET variable
if (isset($_SERVER) && array_key_exists('QUERY_STRING', $_SERVER) ) {
    parse_str($_SERVER['QUERY_STRING'], $_GET);
}

//parse the standard input into the $_POST variable
if (($REQUEST_METHOD === 'POST')
    && ($CONTENT_LENGTH > 0)
) {
    parse_str(fread(STDIN, $CONTENT_LENGTH), $_POST);
}

chdir($argv[1]);
require_once $argv[2];
