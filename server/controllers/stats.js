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
        let success = true;

        HourlyStatsModel.findAll().then(hourlyStat => {
            hourlyStat.forEach(item => {
                DailyStatsModel.findOrCreate({ where: { userId: item.userId },
                    defaults: {
                        totalFollowers: item.totalFollowers,
                        totalLikes: item.totalLikes,
                        totalPosts: item.totalPosts
                    }
                }).then(dailyStat => {
                    if (! dailyStat[0].isNewRecord) {
                        dailyStat[0].update({
                            totalFollowers: item.totalFollowers,
                            totalLikes: item.totalLikes,
                            totalPosts: item.totalPosts,
                            lastTotalFollowers: dailyStat.totalFollowers,
                            lastTotalLikes: dailyStat.totalLikes,
                            lastTotalPosts: dailyStat.totalPosts
                        }).catch(() => { success = false; });
                    }
                }).catch(() => { success = false; });
            });
        }).catch(() => { success = false; });
        res.json({ success });
    });

module.exports = StatsRouter;
