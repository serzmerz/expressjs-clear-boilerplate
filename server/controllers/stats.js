const express = require('express');
const db = require('../models');
const HourlyStatsModel = db.HourlyStats;
const DailyStatsModel = db.DailyStats;

const StatsRouter = new express.Router();

StatsRouter
    .get('/', function(req, res) {
        HourlyStatsModel.findAll().then(data => {
            res.json({ response: {
                success: true,
                data } });
        }).catch(err => {
            res.json({
                success: false,
                errors: err });
        });
    })
    .get('/setDailyStats', function(req, res) {
        HourlyStatsModel.findAll().then(hourlyStat => {
            hourlyStat.forEach(item => {
                DailyStatsModel.findOrCreate({ where: { userId: item.userId }, defaults:
                {
                    totalFollowers: item.totalFollowers,
                    totalLikes: item.totalLikes,
                    totalPosts: item.totalPosts
                } }).then(dailyStat => {
                    if (! dailyStat.isNewRecord) {
                        dailyStat.update({
                            totalFollowers: item.totalFollowers,
                            totalLikes: item.totalLikes,
                            totalPosts: item.totalPosts,
                            lastTotalFollowers: dailyStat.totalFollowers,
                            lastTotalLikes: dailyStat.totalLikes,
                            lastTotalPosts: dailyStat.totalPosts
                        }).catch()
                    }
                }
                );
            });
        }).catch(err => {
            res.json({
                success: false,
                errors: err });
        });
        res.send(200);
    });

module.exports = StatsRouter;
