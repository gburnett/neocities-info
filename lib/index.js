#! /usr/bin/env node
/*jslint node: true */
/*jslint nomen: true */
'use strict';

var argv = require('minimist')(process.argv.slice(2)),
    NeoCities = require('neocities'),
    prompt = require('prompt'),
    async = require('async'),
    schema = {
        properties: {
            username: {
                message: 'Username please',
                required: true
            },
            password: {
                message: 'Password please',
                required: true,
                hidden: true
            }
        }
    },
    getInfo = function (credentials) {
        var api = new NeoCities(credentials.username, credentials.password),
            reduceResponses = function reduceResponses(responses, site, iterator) {
                var multipleResponses = function (response) {
                    responses.push(response);
                    iterator(null, responses);
                };

                api.info(site, multipleResponses);
            },
            handleResponse = function handleResponse(response) {
                console.log(JSON.stringify(response));
            },
            postReduce = function postReduce(err, response) {
                if (err) {
                    throw err;
                }
                handleResponse(response);
            };

        if (argv._.length) {
            async.reduce(argv._, [], reduceResponses, postReduce);
        } else {
            api.info(handleResponse);
        }
    };

try {
    prompt.start();

    prompt.get(schema, function (err, result) {
        if (err) {
            throw err;
        }
        getInfo(result);
    });
} catch (e) {
    console.log(e);
}
