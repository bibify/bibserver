import http from 'http';
import express from 'express';
import cors from 'cors';
// import serverless from 'serverless-http';
import promMid from 'express-prometheus-middleware';
import morgan from 'morgan';
import bodyParser from 'body-parser';
import initializeDb from './db';
import middleware from './middleware';
import api from './api';
import config from './config.json';

require("babel-core/register");
require("babel-polyfill");

let app = express();
app.server = http.createServer(app);

// logger
app.use(morgan('dev'));

// 3rd party middleware
app.use(cors({
	exposedHeaders: config.corsHeaders
}));

app.use(bodyParser.json({
	limit : config.bodyLimit
}));

app.use(promMid({
  metricsPath: '/metrics',
  collectDefaultMetrics: true,
  requestDurationBuckets: [0.1, 0.5, 1, 1.5],
}));

// connect to db
// NOTE: There is no actual db right now, but keeping this part
// in case we want to use a db
initializeDb( db => {

	// internal middleware
	app.use(middleware({ config, db }));

	// api router
	app.use('/api', api({ config, db }));

	app.get('/', (req, res) => {
        res.status(200).send('Success (if you are looking for the api, it is located under /api)');
	});

	app.server.listen(process.env.PORT || config.port, () => {
		console.log(`Started on port ${app.server.address().port}`);
	});
});

//module.exports.handler = serverless(app);
