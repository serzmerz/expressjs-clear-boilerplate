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
            userId: element.userId,
            totalFollowers: element.totalFollowers,
            totalPosts: element.totalPosts,
            avgComments: element.avgComments,
            avgLikes: element.avgLikes,
            rating: 0
        };

        if (element.DailyStat) {
            item.changesFollowers = element.DailyStat.totalFollowers - element.DailyStat.lastTotalFollowers;
            item.changesPosts = element.DailyStat.totalPosts - element.DailyStat.lastTotalPosts;
        } else {
            item.changesFollowers = 0;
            item.changesPosts = 0;
        }
        ratingCoefficients.forEach(ratingSetting => {
            if (ratingSetting.dataValues.settingsKey !== 'dataField') {
                item.rating += item[ratingSetting.settingsKey] * ratingSetting.value;
            }
        });
        return element.User.update({
            calculatedRating: item.rating,
            calculatedRatingPrev: element.User.calculatedRating
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
                    return hourlyStat.User.categoryId === category.id;
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

function updateCurrentStat(CurrentModel, item) {
    return CurrentModel.findOrCreate({
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
    }).then(currentStat => {
        if (! currentStat[1]) {
            return currentStat[0].update({
                totalFollowers: item.totalFollowers,
                totalLikes: item.totalLikes,
                totalPosts: item.totalPosts,
                calculatedRating: item.calculatedRating,
                lastTotalFollowers: currentStat[0].totalFollowers,
                lastTotalLikes: currentStat[0].totalLikes,
                lastTotalPosts: currentStat[0].totalPosts,
                calculatedRatingPrev: currentStat[0].calculatedRating
            });
        }
    });
}

StatsRouter
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
            hourlyStat.forEach(currentStat => {
                return updateCurrentStat(DailyStatsModel, currentStat);
            });
        }).catch(() => { res.json({ success: false }); });
        res.json({ success: true });
    })
    .get('/setWeeklyStats', function(req, res) {
        DailyStatsModel.findAll().then(dailyStat => {
            dailyStat.forEach(currentStat => {
                return updateCurrentStat(WeeklyStatsModel, currentStat);
            });
        }).catch(() => { res.json({ success: false }); });
        res.json({ success: true });
    })
    .get('/setMonthlyStats', function(req, res) {
        WeeklyStatsModel.findAll().then(weeklyStat => {
            weeklyStat.forEach(currentStat => {
                return updateCurrentStat(MonthlyStatsModel, currentStat);
            });
        }).catch(() => { res.json({ success: false }); });
        res.json({ success: true });
    });

module.exports = StatsRouter;
