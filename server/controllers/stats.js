const express = require('express');
const db = require('../models');
const HourlyStatsModel = db.HourlyStats;
const DailyStatsModel = db.DailyStats;
const WeeklyStatsModel = db.WeeklyStats;
const MonthlyStatsModel = db.MonthlyStats;
const UserModel = db.Users;
const RatingSettingsModel = db.RatingSetting;

HourlyStatsModel.belongsTo(DailyStatsModel, { foreignKey: 'userId', targetKey: 'userId' });
HourlyStatsModel.belongsTo(UserModel, { foreignKey: 'userId' });
WeeklyStatsModel.belongsTo(UserModel, { foreignKey: 'userId' });
DailyStatsModel.belongsTo(UserModel, { foreignKey: 'userId' });

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
    .get('/calculateRating', function(req, res) {
        RatingSettingsModel.findAll()
            .then(ratingCoefficients => {
                return HourlyStatsModel.findAll({ include: [
                    { model: DailyStatsModel },
                    { model: db.Users }
                ] })
                    .then(hourlyStats => {
                        const usersScores = {};

                        hourlyStats.forEach(element => {
                            const item = {
                                categoryId: element.User.categoryId,
                                calculatedRatingPrev: element.calculatedRating,
                                userId: element.dataValues.userId,
                                totalFollowers: element.dataValues.totalFollowers,
                                totalPosts: element.dataValues.totalPosts,
                                avgComments: element.dataValues.avgComments,
                                avgLikes: element.dataValues.avgLikes,
                                rating: 0
                            };

                            item.changesFollowers = element.totalFollowers - element.lastTotalFollowers;
                            item.changesPosts = element.totalPosts - element.lastTotalPosts;
                            ratingCoefficients.forEach(ratingSetting => {
                                if (ratingSetting.dataValues.settingsKey !== 'dataField') {
                                    item.rating += item[ratingSetting.dataValues.settingsKey] * ratingSetting.dataValues.value;
                                }
                            });
                            usersScores[item.categoryId] ?
                                usersScores[item.categoryId].push({
                                    userId: item.userId,
                                    score: item.rating,
                                    calculatedRatingPrev: item.calculatedRatingPrev
                                }) :
                                usersScores[item.categoryId] = [ {
                                    userId: item.userId,
                                    score: item.rating,
                                    calculatedRatingPrev: item.calculatedRatingPrev
                                } ];
                        });
                        for (const key in usersScores) {
                            usersScores[key].sort((a, b) => {
                                if (a.score > b.score) {
                                    return -1;
                                }
                                if (a.score < b.score) {
                                    return 1;
                                }
                            });
                            usersScores[key].forEach((ratedUser, index) => {
                                HourlyStatsModel.update({ calculatedRating: index + 1,
                                    calculatedRatingPrev: ratedUser.calculatedRatingPrev },
                                    { where: { userId: ratedUser.userId } })
                                    .catch(() => {
                                        res.status(400).json({ success: false });
                                    });
                            });
                        }
                        res.json({ success: true, usersScores });
                    })
                    .catch(() => {
                        res.status(400).json({ success: false });
                    });
            })
            .catch(() => {
                res.status(400).json({ success: false });
            });
    })
    .get('/setDailyStats', function(req, res) {
        HourlyStatsModel.findAll({ include: [ { model: db.Users } ] }).then(hourlyStat => {
            hourlyStat.forEach(item => {
                return DailyStatsModel.findOrCreate({
                    where: { userId: item.userId },
                    defaults: {
                        totalFollowers: item.totalFollowers,
                        totalLikes: item.totalLikes,
                        totalPosts: item.totalPosts,
                        lastTotalFollowers: item.totalFollowers,
                        lastTotalLikes: item.totalLikes,
                        lastTotalPosts: item.totalPosts,
                        calculatedRating: item.calculatedRating,
                        calculatedRatingPrev: item.calculatedRating
                    }
                }).then(dailyStat => {
                    if (! dailyStat[1]) {
                        return dailyStat[0].update({
                            totalFollowers: item.totalFollowers,
                            totalLikes: item.totalLikes,
                            totalPosts: item.totalPosts,
                            calculatedRating: item.calculatedRating,
                            lastTotalFollowers: dailyStat[0].totalFollowers,
                            lastTotalLikes: dailyStat[0].totalLikes,
                            lastTotalPosts: dailyStat[0].totalPosts,
                            calculatedRatingPrev: dailyStat[0].calculatedRating
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
                return WeeklyStatsModel.findOrCreate({ where: { userId: currentStat.userId },
                    defaults: {
                        totalFollowers: currentStat.totalFollowers,
                        totalLikes: currentStat.totalLikes,
                        totalPosts: currentStat.totalPosts,
                        lastTotalFollowers: currentStat.totalFollowers,
                        lastTotalLikes: currentStat.totalLikes,
                        lastTotalPosts: currentStat.totalPosts,
                        calculatedRating: currentStat.calculatedRaiting,
                        calculatedRatingPrev: currentStat.calculatedRaiting
                    }
                }).then(weeklyStat => {
                    if (! weeklyStat[1]) {
                        return weeklyStat[0].update({
                            totalFollowers: currentStat.totalFollowers,
                            totalLikes: currentStat.totalLikes,
                            totalPosts: currentStat.totalPosts,
                            calculatedRating: currentStat.calculatedRating,
                            lastTotalFollowers: weeklyStat[0].totalFollowers,
                            lastTotalLikes: weeklyStat[0].totalLikes,
                            lastTotalPosts: weeklyStat[0].totalPosts,
                            calculatedRatingPrev: weeklyStat[0].calculatedRating
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
                return MonthlyStatsModel.findOrCreate({ where: { userId: currentStat.userId },
                    defaults: {
                        totalFollowers: currentStat.totalFollowers,
                        totalLikes: currentStat.totalLikes,
                        totalPosts: currentStat.totalPosts,
                        lastTotalFollowers: currentStat.totalFollowers,
                        lastTotalLikes: currentStat.totalLikes,
                        lastTotalPosts: currentStat.totalPosts,
                        calculatedRating: currentStat.calculatedRaiting,
                        calculatedRatingPrev: currentStat.calculatedRaiting
                    }
                }).then(monthlyStat => {
                    if (! monthlyStat[1]) {
                        return monthlyStat[0].update({
                            totalFollowers: currentStat.totalFollowers,
                            totalLikes: currentStat.totalLikes,
                            totalPosts: currentStat.totalPosts,
                            calculatedRating: currentStat.calculatedRating,
                            lastTotalFollowers: monthlyStat[0].totalFollowers,
                            lastTotalLikes: monthlyStat[0].totalLikes,
                            lastTotalPosts: monthlyStat[0].totalPosts,
                            calculatedRatingPrev: monthlyStat[0].calculatedRating
                        }).catch(() => { res.json({ success: false }); });
                    }
                }).catch(() => { res.json({ success: false }); });
            });
        }).catch(() => { res.json({ success: false }); });
        res.json({ success: true });
    });

module.exports = StatsRouter;
