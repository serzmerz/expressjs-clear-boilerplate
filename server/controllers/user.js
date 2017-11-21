const express = require('express');
const db = require('../models');
const UserModel = db.User;

const userRouter = new express.Router();

const AuthenticationClient = require('auth0'). AuthenticationClient;
const auth0 = new AuthenticationClient({
    domain: 'hype-board.auth0.com',
    clientId: '6v6nL5yqrQFxlRotOz98TXKinnDX8Bb8'
});

const ManagementClient = require('auth0').ManagementClient;

const management = new ManagementClient({
    token: 'eyJ0eXAiOiJKV1QiLCJhbGciOiJSUzI1NiIsImtpZCI6IlJrWkNPVEkzT0VZeE5USTRRamMwTVRWRFJqRTRRVE5GUlVFME9EaERNa013T0RWRlFqaEZNdyJ9.eyJpc3MiOiJodHRwczovL2h5cGUtYm9hcmQuYXV0aDAuY29tLyIsInN1YiI6IjVEMzZ0MTlNVVk1TU9NZ0sweFY0alhTZmttRjFGWm10QGNsaWVudHMiLCJhdWQiOiJodHRwczovL2h5cGUtYm9hcmQuYXV0aDAuY29tL2FwaS92Mi8iLCJpYXQiOjE1MTA4MjY2NzQsImV4cCI6MTUxMDkxMzA3NCwic2NvcGUiOiJyZWFkOmNsaWVudF9ncmFudHMgY3JlYXRlOmNsaWVudF9ncmFudHMgZGVsZXRlOmNsaWVudF9ncmFudHMgdXBkYXRlOmNsaWVudF9ncmFudHMgcmVhZDp1c2VycyB1cGRhdGU6dXNlcnMgZGVsZXRlOnVzZXJzIGNyZWF0ZTp1c2VycyByZWFkOnVzZXJzX2FwcF9tZXRhZGF0YSB1cGRhdGU6dXNlcnNfYXBwX21ldGFkYXRhIGRlbGV0ZTp1c2Vyc19hcHBfbWV0YWRhdGEgY3JlYXRlOnVzZXJzX2FwcF9tZXRhZGF0YSBjcmVhdGU6dXNlcl90aWNrZXRzIHJlYWQ6Y2xpZW50cyB1cGRhdGU6Y2xpZW50cyBkZWxldGU6Y2xpZW50cyBjcmVhdGU6Y2xpZW50cyByZWFkOmNsaWVudF9rZXlzIHVwZGF0ZTpjbGllbnRfa2V5cyBkZWxldGU6Y2xpZW50X2tleXMgY3JlYXRlOmNsaWVudF9rZXlzIHJlYWQ6Y29ubmVjdGlvbnMgdXBkYXRlOmNvbm5lY3Rpb25zIGRlbGV0ZTpjb25uZWN0aW9ucyBjcmVhdGU6Y29ubmVjdGlvbnMgcmVhZDpyZXNvdXJjZV9zZXJ2ZXJzIHVwZGF0ZTpyZXNvdXJjZV9zZXJ2ZXJzIGRlbGV0ZTpyZXNvdXJjZV9zZXJ2ZXJzIGNyZWF0ZTpyZXNvdXJjZV9zZXJ2ZXJzIHJlYWQ6ZGV2aWNlX2NyZWRlbnRpYWxzIHVwZGF0ZTpkZXZpY2VfY3JlZGVudGlhbHMgZGVsZXRlOmRldmljZV9jcmVkZW50aWFscyBjcmVhdGU6ZGV2aWNlX2NyZWRlbnRpYWxzIHJlYWQ6cnVsZXMgdXBkYXRlOnJ1bGVzIGRlbGV0ZTpydWxlcyBjcmVhdGU6cnVsZXMgcmVhZDpydWxlc19jb25maWdzIHVwZGF0ZTpydWxlc19jb25maWdzIGRlbGV0ZTpydWxlc19jb25maWdzIHJlYWQ6ZW1haWxfcHJvdmlkZXIgdXBkYXRlOmVtYWlsX3Byb3ZpZGVyIGRlbGV0ZTplbWFpbF9wcm92aWRlciBjcmVhdGU6ZW1haWxfcHJvdmlkZXIgYmxhY2tsaXN0OnRva2VucyByZWFkOnN0YXRzIHJlYWQ6dGVuYW50X3NldHRpbmdzIHVwZGF0ZTp0ZW5hbnRfc2V0dGluZ3MgcmVhZDpsb2dzIHJlYWQ6c2hpZWxkcyBjcmVhdGU6c2hpZWxkcyBkZWxldGU6c2hpZWxkcyB1cGRhdGU6dHJpZ2dlcnMgcmVhZDp0cmlnZ2VycyByZWFkOmdyYW50cyBkZWxldGU6Z3JhbnRzIHJlYWQ6Z3VhcmRpYW5fZmFjdG9ycyB1cGRhdGU6Z3VhcmRpYW5fZmFjdG9ycyByZWFkOmd1YXJkaWFuX2Vucm9sbG1lbnRzIGRlbGV0ZTpndWFyZGlhbl9lbnJvbGxtZW50cyBjcmVhdGU6Z3VhcmRpYW5fZW5yb2xsbWVudF90aWNrZXRzIHJlYWQ6dXNlcl9pZHBfdG9rZW5zIGNyZWF0ZTpwYXNzd29yZHNfY2hlY2tpbmdfam9iIGRlbGV0ZTpwYXNzd29yZHNfY2hlY2tpbmdfam9iIHJlYWQ6Y3VzdG9tX2RvbWFpbnMgZGVsZXRlOmN1c3RvbV9kb21haW5zIGNyZWF0ZTpjdXN0b21fZG9tYWlucyIsImd0eSI6ImNsaWVudC1jcmVkZW50aWFscyJ9.EKiEGKi53SbaDf5GgaakzwUqg8drHqR0VHcBN69iy74jOUavNW94tRNp5DVeNwaT89Hm4K37NX9ZHUjBX0nZHbl0vFUTwJESZv0YDE6nhRxg1NwAijJcWn_Sfyn-VCwtFlrkXj4Wb4IY95csivXWuIKj1EbshAcagrAOOBnptiRgzT_hX6BS52NuWCwdeXbXVO-rD2GChn5VKk_WQUAeeOFpbWo8NhRPjOLG6IIIYD0i1olDNqy2_aY7PcDWOOMDOFBqjYS6ma4Xx4cEhnRM3BsAHSO5k_U_COSBHzV4nFQtqRMuOC74ZfLB3PH3KcKg1ZZQ-a_i-nVp3HXwezUSlg',
    domain: 'hype-board.auth0.com'
});

userRouter
    .get('/', function(req, res) {
        UserModel.findAll({
            include: [ db.Category ]
        }).then(data => {
                res.json({ response: {
                    success: true,
                    data } });
            }).catch(err => {
                res.json({ response: {
                    success: false,
                    errors: err } });
            });
    })
    .get('/authorize', function(req, res) {
        const accessToken = req.get('accessToken');

        auth0.getProfile(accessToken).then(user => {
            UserModel.findOrCreate({ where: { instagramId: user.sub },
                defaults: {
                    instagramId: user.sub,
                    nickname: user.nickname,
                    picture: user.picture,
                    accessTokenAuth0: accessToken,
                    pending: true
                },
                attributes: [ 'id', 'instagramId', 'nickname', 'picture', 'pending', 'registerEnded' ]
            }).then(userProfile => res.json({ response: {
                success: true,
                data: userProfile } }));
        }).catch(error => {
            res.json({ response: error });
        });
    })
    .put('/:id', function(req, res) {
        const body = req.body;

        UserModel.findById(req.params.id).then(user => {
            if (user && user.accessTokenAuth0 === req.get('accessToken')) {
                management.getUser({ id: user.instagramId }).then(userProfile =>
                user.update({
                    picture: userProfile.picture,
                    nickname: userProfile.nickname,
                    instagramToken: userProfile.identities[0].access_token,
                    categoryId: body.category.id,
                    country: body.country,
                    registerEnded: true
                },
                { returning: true })
                    .then(data => res.json({ response: {
                        success: true,
                        data
                    } }))
                    .catch(error => res.json({ response: {
                        success: false,
                        error
                    } })
            ).catch(error => res.json({ response: {
                success: false,
                error
            } }))
        .catch(error => res.json(error)));
            } else res.json({ success: false, error: 'User Not found' });
        });
    });

module.exports = userRouter;
