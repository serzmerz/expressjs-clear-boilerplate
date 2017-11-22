const express = require('express');
const db = require('../models');
const HourlyStatsModel = db.HourlyStats;
const DailyStatsModel = db.DailyStats;
const WeeklyStatsModel = db.WeeklyStats;
const MonthlyStatsModel = db.MonthlyStats;

const StatsRouter = new express.Router();

StatsRouter
    .get('/hourlyStats', function(req, res) {
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
    .get('/dailyStats', function(req, res) {
        DailyStatsModel.findAll().then(data => {
            res.json({ response: {
                success: true,
                data } });
        }).catch(err => {
            res.json({
                success: false,
                errors: err });
        });
    })
    .get('/weeklyStats', function(req, res) {
        WeeklyStatsModel.findAll().then(data => {
            res.json({ response: {
                success: true,
                data } });
        }).catch(err => {
            res.json({
                success: false,
                errors: err });
        });
    })
    .get('/monthlyStats', function(req, res) {
        MonthlyStatsModel.findAll().then(data => {
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
                        totalFollowers: item.totalFollowers,
                        totalLikes: item.totalLikes,
                        totalPosts: item.totalPosts,
                        lastTotalFollowers: item.totalFollowers,
                        lastTotalLikes: item.totalLikes,
                        lastTotalPosts: item.totalPosts
                    }
                }).then(dailyStat => {
                    if (! dailyStat[1]) {
                        dailyStat[0].update({
                            totalFollowers: item.totalFollowers,
                            totalLikes: item.totalLikes,
                            totalPosts: item.totalPosts,
                            lastTotalFollowers: dailyStat[0].totalFollowers,
                            lastTotalLikes: dailyStat[0].totalLikes,
                            lastTotalPosts: dailyStat[0].totalPosts
                        }).catch(() => { res.json({ success: false }); });
                    }
                }).catch(() => { res.json({ success: false }); });
            });
        }).catch(() => { res.json({ success: false }); });
        res.json({ success: true });
    })
    .get('/setWeeklyStats', function(req, res) {
        DailyStatsModel.findAll().then(dailyStat => {
            dailyStat.forEach(currentStat => {
                WeeklyStatsModel.findOrCreate({ where: { userId: currentStat.userId },
                    defaults: {
                        totalFollowers: currentStat.totalFollowers,
                        totalLikes: currentStat.totalLikes,
                        totalPosts: currentStat.totalPosts,
                        lastTotalFollowers: currentStat.totalFollowers,
                        lastTotalLikes: currentStat.totalLikes,
                        lastTotalPosts: currentStat.totalPosts
                    }
                }).then(weeklyStat => {
                    if (! weeklyStat[1]) {
                        weeklyStat[0].update({
                            totalFollowers: currentStat.totalFollowers,
                            totalLikes: currentStat.totalLikes,
                            totalPosts: currentStat.totalPosts,
                            lastTotalFollowers: weeklyStat[0].totalFollowers,
                            lastTotalLikes: weeklyStat[0].totalLikes,
                            lastTotalPosts: weeklyStat[0].totalPosts
                        }).catch(() => { res.json({ success: false }); });
                    }
                }).catch(() => { res.json({ success: false }); });
            });
        }).catch(() => { res.json({ success: false }); });
        res.json({ success: true });
    })
    .get('/setMonthlyStats', function(req, res) {
        WeeklyStatsModel.findAll().then(weeklyStat => {
            weeklyStat.forEach(currentStat => {
                MonthlyStatsModel.findOrCreate({ where: { userId: currentStat.userId },
                    defaults: {
                        totalFollowers: currentStat.totalFollowers,
                        totalLikes: currentStat.totalLikes,
                        totalPosts: currentStat.totalPosts,
                        lastTotalFollowers: currentStat.totalFollowers,
                        lastTotalLikes: currentStat.totalLikes,
                        lastTotalPosts: currentStat.totalPosts
                    }
                }).then(monthlyStat => {
                    if (! monthlyStat[1]) {
                        monthlyStat[0].update({
                            totalFollowers: currentStat.totalFollowers,
                            totalLikes: currentStat.totalLikes,
                            totalPosts: currentStat.totalPosts,
                            lastTotalFollowers: monthlyStat[0].totalFollowers,
                            lastTotalLikes: monthlyStat[0].totalLikes,
                            lastTotalPosts: monthlyStat[0].totalPosts
                        }).catch(() => { res.json({ success: false }); });
                    }
                }).catch(() => { res.json({ success: false }); });
            });
        }).catch(() => { res.json({ success: false }); });
        res.json({ success: true });
    });

module.exports = StatsRouter;
