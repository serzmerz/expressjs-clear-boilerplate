const express = require('express');
const db = require('../models');
const HourlyStatsModel = db.HourlyStats;
const DailyStatsModel = db.DailyStats;
const WeeklyStatsModel = db.WeeklyStats;
const MonthlyStatsModel = db.MonthlyStats;
const UserModel = db.Users;
const RatingSettingsModel = db.RatingSetting;
const CategoryModel = db.Categories;

HourlyStatsModel.belongsTo(DailyStatsModel, { foreignKey: 'userId', targetKey: 'userId' });
HourlyStatsModel.belongsTo(UserModel, { foreignKey: 'userId' });
HourlyStatsModel.belongsTo(UserModel, { foreignKey: 'userId' });
WeeklyStatsModel.belongsTo(UserModel, { foreignKey: 'userId' });
DailyStatsModel.belongsTo(UserModel, { foreignKey: 'userId' });

const StatsRouter = new express.Router();

function updateUsersScore(hourlyStats, ratingCoefficients) {
    const promises = hourlyStats.map(element => {
        const item = {
            userId: element.dataValues.userId,
            totalFollowers: element.dataValues.totalFollowers,
            totalPosts: element.dataValues.totalPosts,
            avgComments: element.dataValues.avgComments,
            avgLikes: element.dataValues.avgLikes,
            rating: 0
        };

        item.changesFollowers = element.DailyStat.totalFollowers - element.DailyStat.lastTotalFollowers;
        item.changesPosts = element.DailyStat.totalPosts - element.DailyStat.lastTotalPosts;
        ratingCoefficients.forEach(ratingSetting => {
            if (ratingSetting.dataValues.settingsKey !== 'dataField') {
                item.rating += item[ratingSetting.dataValues.settingsKey] * ratingSetting.dataValues.value;
            }
        });
        return element.User.update({
            calculatedRating: item.rating,
            calculatedRatingPrev: element.User.dataValues.calculatedRating
        });
    });

    return Promise.all(promises);
}

function compare(a, b) {
    if (a.User.calculatedRating < b.User.calculatedRating) { return 1; }
    if (a.User.calculatedRating > b.User.calculatedRating) { return -1; }
    return 0;
}

function updateUsersRanks(categories) {
    return HourlyStatsModel.findAll({ include: [
        { model: DailyStatsModel },
        { model: UserModel, attributes: [ 'categoryId', 'calculatedRating', 'calculatedRatingPrev' ], raw: true }
    ] })
        .then(hourlyStats => {
            const promises = categories.map(category => {
                const stats = hourlyStats.filter(hourlyStat => {
                    return hourlyStat.User.dataValues.categoryId === category.id;
                });

                if (stats.length) {
                    stats.sort(compare);
                    return stats.forEach((item, index) => {
                        item.calculatedRatingPrev = item.calculatedRating;
                        item.calculatedRating = index + 1;
                        return item.save();
                    });
                }
            });

            return Promise.all(promises);
        });
}

StatsRouter
    .get('/hourlyStats', function(req, res) {
        HourlyStatsModel.findAll().then(data => {
            res.json({
                success: true,
                data
            });
        }).catch(err => {
            res.json({
                success: false,
                errors: err
            });
        });
    })
    .get('/dailyStats', function(req, res) {
        DailyStatsModel.findAll().then(data => {
            res.json({
                success: true,
                data });
        }).catch(err => {
            res.json({
                success: false,
                errors: err });
        });
    })
    .get('/weeklyStats', function(req, res) {
        WeeklyStatsModel.findAll().then(data => {
            res.json({
                success: true,
                data });
        }).catch(err => {
            res.json({
                success: false,
                errors: err });
        });
    })
    .get('/monthlyStats', function(req, res) {
        MonthlyStatsModel.findAll().then(data => {
            res.json({
                success: true,
                data });
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
                    { model: UserModel, attributes: [ 'id', 'categoryId', 'calculatedRating', 'calculatedRatingPrev' ], raw: true }
                ] })
                    .then(hourlyStats => {
                        return updateUsersScore(hourlyStats, ratingCoefficients).then(() => {
                            return CategoryModel.findAll({
                                where: { pending: [ 'base', 'accepted' ] },
                                attributes: [ 'id' ],
                                raw: true
                            }).then(categories => {
                                return updateUsersRanks(categories).then(() => {
                                    res.json({ success: true });
                                });
                            });
                        });
                    });
            })
            .catch(error => {
                res.status(400).json({ success: false, error: error.toString() });
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
                        });
                    }
                });
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
                        calculatedRating: currentStat.calculatedRating,
                        calculatedRatingPrev: currentStat.calculatedRating
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
                        calculatedRating: currentStat.calculatedRating,
                        calculatedRatingPrev: currentStat.calculatedRating
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
                            calculatedRatingPrev: monthlyStat[0].calculatedRaiting
                        }).catch(() => { res.json({ success: false }); });
                    }
                }).catch(() => { res.json({ success: false }); });
            });
        }).catch(() => { res.json({ success: false }); });
        res.json({ success: true });
    });

module.exports = StatsRouter;
