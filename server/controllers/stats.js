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
                DailyStatsModel.findOrCreate({ where: { userId: item.userId },
                    defaults: {
                        totalFollowers: item.lastTotalFollowers,
                        totalLikes: item.lastTotalLikes,
                        totalPosts: item.lastTotalPosts
                    }
                }).then(dailyStat => {
                    if (! dailyStat[1]) {
                        return dailyStat[0].update({
                            totalFollowers: item.totalFollowers,
                            totalLikes: item.totalLikes,
                            totalPosts: item.totalPosts,
                            lastTotalFollowers: dailyStat[0].totalFollowers,
                            lastTotalLikes: dailyStat[0].totalLikes,
                            lastTotalPosts: dailyStat[0].totalPosts
                        }).catch(() => res.json({ success: false }));
                    }
                }).catch(() => res.json({ success: false }));
            });
        }).catch(() => res.json({ success: false }));
        res.json({ success: true });
    });

module.exports = StatsRouter;
